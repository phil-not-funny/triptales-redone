using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Triptales.Application.Cmd;
using Triptales.Application.Dtos;
using Triptales.Repository;
using Triptales.Webapi.Services;

namespace Triptales.Webapi.Controllers
{
    [Route("api/[controller]")]
    public class UserController : ApiControllerBase
    {
        private readonly UserService _service;
        private readonly ModelConversions _modelConversions;
        private readonly UserRepository _repo;
        private readonly JwtTokenService _tokenService;

        public UserController(UserService userService, UserRepository repo, ModelConversions modelConversions, JwtTokenService tokenService)
            : base(userService)
        {
            _service = userService;
            _repo = repo;
            _modelConversions = modelConversions;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterCmd user)
        {
            if (await _repo.UsernameExists(user.Username))
                return BadRequest("Username already exists");
            if (await _repo.EmailExists(user.Email))
                return BadRequest("Email already exists");

            if (!_service.IsUserValid(user, out var userCreated, out var results))
                return BadRequest(results);

            return await _repo.Insert(userCreated) ? Ok() : BadRequest("Register failed! Check for invaild credentials");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginCmd credentials)
        {
            var user = await _repo.FindByUsername(credentials.Username);
            if (user is null || !user.CheckPassword(credentials.Password)) return BadRequest("The given password and username combination does not exist.");
            return Ok(new
            {
                token = _tokenService.Generate(user),
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

            await _repo.ToggleFollow(authenticated, requested);
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

            if (cmd.ProfilePicture is null && cmd.BannerImage is null) return BadRequest("No image provided");

            return await _repo.UploadImage(authenticated, cmd) ? Ok() : BadRequest("Upload failed! Please check if you uploaded the right pictures");
        }

        [Authorize]
        [HttpPut("{guid:Guid}/verified")]
        public async Task<IActionResult> SetVerified(Guid guid, [FromBody] UserVerifyCmd cmd)
        {
            // Role is read from the database rather than the token, so a demoted admin loses access immediately.
            var authenticated = await GetAuthenticatedOrDefault();
            if (authenticated is null) return Unauthorized();
            if (!authenticated.IsAdmin) return Forbid();

            return await _repo.SetVerified(guid, cmd.Verified) ? NoContent() : NotFound();
        }
    }
}
