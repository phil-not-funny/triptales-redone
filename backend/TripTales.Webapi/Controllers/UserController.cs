using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using proxreal_backend.Repository;
using Triptales.Application.Cmd;
using Triptales.Application.Dtos;
using Triptales.Application.Services;
using Triptales.Webapi.Infrastructure;
using Triptales.Application.Model;

namespace Triptales.Webapi.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly TripTalesContext _db;
        private readonly UserService _service;
        private readonly UserRepository _repo;

        public UserController(TripTalesContext db)
        {
            _db = db;
            _repo = new UserRepository(db);
            _service = new UserService(db);
        }

        private async Task<User?> getAuthenticatedOrDefault()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) return null;
            var username = HttpContext.User.Identity?.Name;
            if (username is null) return null;

            return await _service.GetUserByUsername(username);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto user)
        {
            if (await _db.Users.AnyAsync(u => u.Username == user.Username))
                return BadRequest("Username already exists");
            if (await _db.Users.AnyAsync(u => u.Email == user.Email))
                return BadRequest("Email already exists");

            if (!_service.IsUserValid(user, out var userCreated, out var results))
                return BadRequest(results);

            _repo.Insert(userCreated);
            return Ok();
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto credentials)
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
            return Ok(_service.ConvertToPrivate(user));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserPrivateCmd>> Me()
        {
            var user = await getAuthenticatedOrDefault();
            if (user is null)
                return Unauthorized();
            else
                return Ok(_service.ConvertToPrivate(user));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok((await _repo.GetAll()).Select(u => _service.ConvertToPublic(u)).ToList());


        [HttpGet("{username}")]
        public async Task<IActionResult> GetByUsername(string username)
        {
            var user = await _service.GetUserByUsername(username);
            if (user is null)
                return NotFound();
            return Ok(_service.ConvertToPublic(user));
        }

        [HttpPost("follow/{guid}")]
        public async Task<IActionResult> Follow(Guid guid)
        {
            var authenticated = await getAuthenticatedOrDefault();
            if (authenticated is null)
                return Unauthorized();

            var requested = await _repo.GetFromGuid(guid);
            if (requested is null)
                return NotFound();

            authenticated.Following.Add(requested);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}
