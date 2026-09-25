using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Triptales.Application.Model;

namespace Triptales.Webapi.Services
{
    /// <summary>
    /// Issues signed JWTs for authenticated users, configured through the <c>Jwt</c> section.
    /// </summary>
    public class JwtTokenService
    {
        private const double DefaultExpiresInHours = 3;

        private readonly IConfigurationSection _jwt;

        public JwtTokenService(IConfiguration configuration)
        {
            _jwt = configuration.GetSection("Jwt");
        }

        /// <summary>
        /// Creates a signed token for <paramref name="user"/>.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown when <c>Jwt:Key</c> is not configured.</exception>
        public string Generate(User user)
        {
            var key = _jwt["Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Username),
                new(JwtRegisteredClaimNames.Sub, user.Guid.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var expiresInHours = double.TryParse(_jwt["ExpiresInHours"], out var hours) ? hours : DefaultExpiresInHours;
            var token = new JwtSecurityToken(
                issuer: _jwt["Issuer"],
                audience: _jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiresInHours),
                signingCredentials: signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
