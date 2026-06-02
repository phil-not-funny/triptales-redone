using System;
using Xunit;
using Triptales.Application.Model;

namespace Triptales.Application.Tests
{
    public sealed class UserTests
    {
        [Fact]
        public void Constructor_WhenCalled_ShouldInitializeSecurityFields()
        {
            var sut = new User("tester", "tester@example.com", "S3cureP@ss!", "Tester");

            Assert.False(string.IsNullOrWhiteSpace(sut.Salt));
            Assert.False(string.IsNullOrWhiteSpace(sut.PasswordHash));
            Assert.NotEqual(sut.Salt, sut.PasswordHash);
        }

        [Theory]
        [InlineData("S3cureP@ss!", true)]
        [InlineData("WrongPassword", false)]
        public void CheckPassword_WithPasswordVerification_ReturnsExpectedResult(string passwordToCheck, bool expected)
        {
            var sut = new User("tester", "tester@example.com", "S3cureP@ss!", "Tester");

            var actual = sut.CheckPassword(passwordToCheck);

            Assert.Equal(expected, actual);
        }

        [Fact]
        public void SetPassword_WhenCalledWithSamePassword_ShouldReplaceSaltAndHashAndKeepVerificationValid()
        {
            var sut = new User("tester", "tester@example.com", "S3cureP@ss!", "Tester");
            var originalSalt = sut.Salt;
            var originalHash = sut.PasswordHash;

            sut.SetPassword("S3cureP@ss!");

            Assert.False(string.IsNullOrWhiteSpace(sut.Salt));
            Assert.False(string.IsNullOrWhiteSpace(sut.PasswordHash));
            Assert.NotEqual(originalSalt, sut.Salt);
            Assert.NotEqual(originalHash, sut.PasswordHash);
            Assert.True(sut.CheckPassword("S3cureP@ss!"));
        }
    }
}
