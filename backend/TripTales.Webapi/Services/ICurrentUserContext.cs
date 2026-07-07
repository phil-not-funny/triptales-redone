using System;
using System.Threading.Tasks;
using Triptales.Application.Model;

namespace Triptales.Webapi.Services
{
    /// <summary>
    /// Abstracts access to the currently authenticated user.
    /// Centralizes user context retrieval so controllers don't directly read HttpContext.
    /// </summary>
    public interface ICurrentUserContext
    {
        /// <summary>
        /// Returns the currently authenticated user, or null if not authenticated.
        /// </summary>
        Task<User?> GetCurrentUserAsync();

        /// <summary>
        /// Returns true if a user is currently authenticated.
        /// </summary>
        Task<bool> IsAuthenticatedAsync();
    }
}
