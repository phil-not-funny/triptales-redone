using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace Triptales.Webapi.Model
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(Username), IsUnique = true)]
    public class User : BaseEntity
    {
        public User(string username, string email, string password, string displayName)
        {
            Username = username;
            Email = email;
            SetPassword(password);
            DisplayName = displayName;
        }

#pragma warning disable CS8618
        protected User() { }
#pragma warning restore CS8618

        [DataType(DataType.Text)]
        [MinLength(4, ErrorMessage = "Username does not meet Requirements. Min Length = 4")]
        [MaxLength(25, ErrorMessage = "Username does not meet Requirements. Max Length = 25")]
        [RegularExpression(@"^[a-z0-9._]+$", ErrorMessage = "Username may only contain lower case letters, numbers, dots and underscores.")]
        public string Username { get; set; }

        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Email is not a valid Address.")]
        public string Email { get; set; }

        [DataType(DataType.Text)]
        [MinLength(1, ErrorMessage = "Display Name does not meet Requirements. Min Length = 1")]
        [MaxLength(30, ErrorMessage = "Display Name does not meet Requirements. Max Length = 30")]
        public string DisplayName { get; set; }

        public bool Verified { get; set; } = false;

        public string? Salt { get; set; }
        public string? PasswordHash { get; set; }

        public string? ProfilePicture { get; set; }
        public string? BannerImage { get; set; }

        public List<User> Following { get; } = new();
        public List<Post> LikedPosts { get; } = new();
        public List<Post> Posts { get; } = new();

        public bool CheckPassword(string password) => PasswordHash == CalculateHash(password, Salt!);

        [MemberNotNull(nameof(Salt), nameof(PasswordHash))]
        public void SetPassword(string password)
        {
            Salt = GenerateRandomSalt();
            PasswordHash = CalculateHash(password, Salt);
        }

        private string GenerateRandomSalt(int length = 128)
        {
            byte[] salt = new byte[length / 8];
            using (System.Security.Cryptography.RandomNumberGenerator rnd =
                System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rnd.GetBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }

        private string CalculateHash(string password, string salt)
        {
            byte[] saltBytes = Convert.FromBase64String(salt);
            byte[] passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);

            System.Security.Cryptography.HMACSHA256 myHash =
                new System.Security.Cryptography.HMACSHA256(saltBytes);

            byte[] hashedData = myHash.ComputeHash(passwordBytes);

            // Das Bytearray wird als Hexstring zurückgegeben.
            return Convert.ToBase64String(hashedData);
        }

    }
}
