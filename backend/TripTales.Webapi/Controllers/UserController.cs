using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Triptales.Repository;
using Triptales.Application.Dtos;
using Triptales.Webapi.Infrastructure;
using Triptales.Application.Model;
using Triptales.Webapi.Services;
using Triptales.Application.Cmd;

namespace Triptales.Webapi.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly TripTalesContext _db;
        private readonly UserService _service;
        private readonly ModelConversions _modelConversions;
        private readonly UserRepository _repo;

        public UserController(TripTalesContext db, UserService userService, UserRepository repo, ModelConversions modelConversions)
        {
            _db = db;
            _service = userService;
            _repo = repo;
            _modelConversions = modelConversions;
        }

        private async Task<User?> GetAuthenticatedOrDefault()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) return null;
            var username = HttpContext.User.Identity?.Name;
            if (username is null) return null;

            return await _service.GetUserByUsername(username);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterCmd user)
        {
            if (await _db.Users.AnyAsync(u => u.Username == user.Username))
                return BadRequest("Username already exists");
            if (await _db.Users.AnyAsync(u => u.Email == user.Email))
                return BadRequest("Email already exists");

            if (!_service.IsUserValid(user, out var userCreated, out var results))
                return BadRequest(results);

            return await _repo.Insert(userCreated) ? Ok() : BadRequest("Register failed! Check for invaild credentials");
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginCmd credentials)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == credentials.Username);
            if (user is null || !user.CheckPassword(credentials.Password)) return BadRequest("The given password and username combination does not exist.");
            var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, credentials.Username),
                        //new Claim(ClaimTypes.Role, "admin")
                    };
            var claimsIdentity = new ClaimsIdentity(
                claims,
                Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(3),
            };

            await HttpContext.SignInAsync(
                Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);
            return Ok(_modelConversions.ToUserPrivateDto(user));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserPrivateDto>> Me()
        {
            var user = await GetAuthenticatedOrDefault();
            return user is not null ? Ok(_modelConversions.ToUserPrivateDto(user)) : Unauthorized();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok((await _repo.GetAll()).Select(u => _modelConversions.ToUserPublicDto(u)).ToList());


        [HttpGet("{username}")]
        public async Task<IActionResult> GetByUsername(string username)
        {
            var user = await _service.GetUserByUsername(username);
            var authenticated = await GetAuthenticatedOrDefault(); //to know when to enable follow button
            return user is not null ? Ok(
                _modelConversions.ToUserDetailedDto(
                    user, 
                    authenticated is not null && 
                    authenticated.Following.Any(
                        f => f.Guid == user.Guid))
                ) : NotFound();
        }

        [HttpPost("follow/{guid}")]
        public async Task<IActionResult> Follow(Guid guid)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null)
                return Unauthorized();

            var requested = await _repo.GetFromGuid(guid);
            if (requested is null)
                return NotFound();

            if (authenticated.Following.Any(r => r.Guid == guid))
                authenticated.Following.Remove(requested);
            else
                authenticated.Following.Add(requested);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> PutFlavor([FromBody] UserFlavorCmd flavor)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null)
                return Unauthorized();
            authenticated.Username = flavor.Username;
            authenticated.DisplayName = flavor.DisplayName;
            authenticated.Biography = flavor.Biography;
            authenticated.PlaceOfResidence = flavor.PlaceOfResidence;
            authenticated.FavoriteDestination = flavor.FavoriteDestination;
            await _repo.Update(authenticated);
            return Ok();
        }

        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadPictures([FromForm] UploadPicturesCmd cmd)
        {
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null) return Unauthorized();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Guid == authenticated.Guid);
            if (user is null) return NotFound();

            if (cmd.ProfilePicture is null && cmd.BannerImage is null) return BadRequest("No image provided");

            return await _repo.UploadImage(user, cmd) ? Ok() : BadRequest("Upload failed! Please check if you uploaded the right pictures");
        }
    }
}
