using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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
        private readonly IConfiguration _configuration;

        public UserController(TripTalesContext db, UserService userService, UserRepository repo, ModelConversions modelConversions, IConfiguration configuration)
        {
            _db = db;
            _service = userService;
            _repo = repo;
            _modelConversions = modelConversions;
            _configuration = configuration;
        }

        private async Task<User?> GetAuthenticatedOrDefault()
        {
            var authenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            if (!authenticated) return null;
            var username = HttpContext.User.Identity?.Name;
            if (username is null) return null;

            return await _service.GetUserByUsername(username);
        }

        private string GenerateJwtToken(User user)
        {
            var jwt = _configuration.GetSection("Jwt");
            var key = jwt["Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim(JwtRegisteredClaimNames.Sub, user.Guid.ToString()),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        //new Claim(ClaimTypes.Role, "admin")
                    };

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.TryParse(jwt["ExpiresInHours"], out var hours) ? hours : 3),
                signingCredentials: signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginCmd credentials)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == credentials.Username);
            if (user is null || !user.CheckPassword(credentials.Password)) return BadRequest("The given password and username combination does not exist.");
            return Ok(new
            {
                token = GenerateJwtToken(user),
                user = _modelConversions.ToUserPrivateDto(user)
            });
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
            var user = await _service.GetUserByUsername(username, includePostDetails: true);
            var authenticated = await GetAuthenticatedOrDefault(); //to know when to enable follow button
            return user is not null ? Ok(
                _modelConversions.ToUserDetailedDto(
                    user, 
                    authenticated is not null && 
                    authenticated.Following.Any(
                        f => f.Guid == user.Guid),
                    authenticated?.Guid)
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
