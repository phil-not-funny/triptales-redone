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
        private readonly UserService _userService;
        private readonly ModelConversions _modelConversions;
        private readonly ICurrentUserContext _currentUserContext;
        private readonly UserRepository _userRepository;

        public UserController(
            UserService userService,
            ModelConversions modelConversions,
            ICurrentUserContext currentUserContext,
            UserRepository userRepository)
        {
            _userService = userService;
            _modelConversions = modelConversions;
            _currentUserContext = currentUserContext;
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterCmd cmd)
        {
            var (success, errorMessage) = await _userService.RegisterAsync(cmd);
            return success ? Ok() : BadRequest(errorMessage);
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
            var user = await _userService.AuthenticateAsync(credentials.Username, credentials.Password);
            if (user is null)
                return BadRequest("The given password and username combination does not exist.");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, credentials.Username),
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
            var user = await _currentUserContext.GetCurrentUserAsync();
            return user is not null ? Ok(_modelConversions.ToUserPrivateDto(user)) : Unauthorized();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userRepository.GetAll();
            return Ok(users.Select(u => _modelConversions.ToUserPublicDto(u)).ToList());
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetByUsername(string username)
        {
            var user = await _userService.GetUserByUsername(username);
            if (user is null)
                return NotFound();

            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            var isFollowing = currentUser is not null && currentUser.Following.Any(f => f.Guid == user.Guid);

            return Ok(_modelConversions.ToUserDetailedDto(user, isFollowing));
        }

        [Authorize]
        [HttpPost("follow/{guid:Guid}")]
        public async Task<IActionResult> Follow(Guid guid)
        {
            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            if (currentUser is null)
                return Unauthorized();

            var requested = await _userRepository.GetFromGuid(guid);
            if (requested is null)
                return NotFound();

            await _userService.ToggleFollowAsync(currentUser, requested);
            return Ok();
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> PutFlavor([FromBody] UserFlavorCmd flavor)
        {
            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            if (currentUser is null)
                return Unauthorized();

            var success = await _userService.UpdateFlavorAsync(currentUser, flavor);
            return success ? Ok() : BadRequest("Failed to update profile");
        }

        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadPictures([FromForm] UploadPicturesCmd cmd)
        {
            var currentUser = await _currentUserContext.GetCurrentUserAsync();
            if (currentUser is null)
                return Unauthorized();

            if (cmd.ProfilePicture is null && cmd.BannerImage is null)
                return BadRequest("No image provided");

            var success = await _userService.UploadImagesAsync(currentUser, cmd);
            return success ? Ok() : BadRequest("Upload failed! Please check if you uploaded the right pictures");
        }
    }
}
