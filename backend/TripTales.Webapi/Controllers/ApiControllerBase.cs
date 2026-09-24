using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Triptales.Application.Model;
using Triptales.Webapi.Services;

namespace Triptales.Webapi.Controllers
{
    /// <summary>
    /// Base class for API controllers that need to know the user behind the current request.
    /// </summary>
    [ApiController]
    public abstract class ApiControllerBase : ControllerBase
    {
        private readonly UserService _userService;

        protected ApiControllerBase(UserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Resolves the user of the current request from the JWT identity.
        /// </summary>
        /// <returns>The authenticated user, or <c>null</c> for anonymous requests.</returns>
        protected async Task<User?> GetAuthenticatedOrDefault()
        {
            var identity = HttpContext.User.Identity;
            if (identity is not { IsAuthenticated: true, Name: { } username }) return null;

            return await _userService.GetUserByUsername(username);
        }
    }
}
