using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Triptales.Webapi.Model
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(Username), IsUnique = true)]
    [Index(nameof(AuthKey), IsUnique = true)]
    public class User : BaseEntity
    {
        public User(
            string username,
            string email,
            string password,
            string displayName,
            string? authKey = null
        )
        {
            Username = username;
            Email = email;
            Password = password;
            AuthKey = authKey;
            DisplayName = displayName;
        }

#pragma warning disable CS8618
        protected User() { }
#pragma warning restore CS8618

        [DataType(DataType.Text)]
        [MinLength(4, ErrorMessage = "Username does not meet Requirements. Min Length = 4")]
        [MaxLength(25, ErrorMessage = "Username does not meet Requirements. Max Length = 25")]
        [RegularExpression(@"^[a-z0-9._]+$", ErrorMessage = "Username may only conatin lower case letters, numbers, dots and underscores.")]
        public string Username { get; set; }
        
        [DataType(DataType.Password)]
        [MinLength(6, ErrorMessage = "Password does not meet Requirements. Min Length = 6")]
        public string Password { get; set; }

        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Email is not a valid Address.")]
        public string Email { get; set; }
        
        public string? AuthKey { get; set; }

        [DataType(DataType.Text)]
        [MinLength(1, ErrorMessage = "Display Name does not meet Requirements. Min Length = 1")]
        [MaxLength(30, ErrorMessage = "Display Name does not meet Requirements. Max Length = 30")]
        public string DisplayName { get; set; }

        public bool Verified { get; set; } = false;
        public List<User> Following { get; } = new();
    }
}
