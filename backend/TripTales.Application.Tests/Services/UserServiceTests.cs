using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Triptales.Application.Dtos;
using Triptales.Application.Model;
using Triptales.Webapi.Infrastructure;
using Triptales.Webapi.Services;
using Xunit;

namespace Triptales.Application.Tests.Services
{
    public sealed class UserServiceTests : IDisposable
    {
        private readonly TripTalesContext _db;
        private readonly UserService _sut;

        public UserServiceTests()
        {
            var options = new DbContextOptionsBuilder<TripTalesContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _db = new TripTalesContext(options);
            _db.Database.EnsureCreated();
            _sut = new UserService(_db);
        }

        [Fact]
        public void IsUserValid_WithValidUser_ReturnsTrueAndNoValidationErrors()
        {
            var command = new UserRegisterCmd("validuser", "P@ssword1", "valid@example.com", "Valid User");

            var actual = _sut.IsUserValid(command, out var createdUser, out var results);

            Assert.True(actual);
            Assert.NotNull(createdUser);
            Assert.Empty(results);
            Assert.Equal(command.Username, createdUser.Username);
            Assert.Equal(command.Email, createdUser.Email);
        }

        [Fact]
        public void IsUserValid_WithInvalidPassword_ReturnsFalseAndValidationError()
        {
            var command = new UserRegisterCmd("validuser", "short", "valid@example.com", "Valid User");

            var actual = _sut.IsUserValid(command, out var createdUser, out var results);

            Assert.False(actual);
            Assert.NotNull(createdUser);
            Assert.Single(results);
            Assert.Equal(nameof(command.Password), results[0].MemberNames.First());
        }

        [Fact]
        public void GetFollowers_WhenUsersFollow_ReturnsFollowingUsers()
        {
            var target = new User("target", "target@example.com", "P@ssword1", "Target");
            var follower = new User("follower", "follower@example.com", "P@ssword2", "Follower");
            follower.Following.Add(target);

            _db.Users.AddRange(target, follower);
            _db.SaveChanges();

            var actual = _sut.GetFollowers(target.Guid);

            Assert.Single(actual);
            Assert.Equal(follower.Username, actual[0].Username);
        }

        [Fact]
        public async Task GetUserByUsername_WhenUserExists_ReturnsUserWithRelationships()
        {
            var user = new User("testuser", "user@example.com", "P@ssword1", "Test User");
            var follower = new User("follower", "follower@example.com", "P@ssword2", "Follower");
            var post = new Post("Title", "Description", user, DateOnly.FromDateTime(DateTime.UtcNow), DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1));
            user.Posts.Add(post);
            follower.Following.Add(user);

            _db.Users.AddRange(user, follower);
            _db.Posts.Add(post);
            _db.SaveChanges();

            var actual = await _sut.GetUserByUsername(user.Username);

            Assert.NotNull(actual);
            Assert.Equal(user.Username, actual!.Username);
            Assert.Empty(actual.Following);
            Assert.Contains(actual.Posts, p => p.Title == "Title");
        }

        public void Dispose()
        {
            _db.Database.EnsureDeleted();
            _db.Dispose();
        }
    }
}
