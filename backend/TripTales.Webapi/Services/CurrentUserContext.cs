using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;

namespace Triptales.Webapi.Services
{
    /// <summary>
    /// Default implementation of ICurrentUserContext that extracts user from the
    /// authenticated claims and loads the full user entity from the database.
    /// </summary>
    public class CurrentUserContext : ICurrentUserContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserService _userService;

        public CurrentUserContext(IHttpContextAccessor httpContextAccessor, UserService userService)
        {
            _httpContextAccessor = httpContextAccessor;
            _userService = userService;
        }

        public async Task<User?> GetCurrentUserAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext?.User.Identity?.IsAuthenticated != true)
                return null;

            var username = httpContext.User.Identity.Name;
            if (string.IsNullOrEmpty(username))
                return null;

            return await _userService.GetUserByUsername(username);
        }

        public async Task<bool> IsAuthenticatedAsync()
        {
            return await GetCurrentUserAsync() != null;
        }
    }
}
