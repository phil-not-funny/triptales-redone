using System;
using System.Linq;
using Bogus;
using Microsoft.EntityFrameworkCore;
using Triptales.Webapi.Model;

namespace Triptales.Webapi.Infrastructure
{
    public class TripTalesContext : DbContext
    {
        public TripTalesContext(DbContextOptions<TripTalesContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Post> Posts => Set<Post>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>().HasMany(p => p.Likes)
                .WithMany(u => u.LikedPosts)
                .UsingEntity(j => j.ToTable("PostLikes"));
            modelBuilder.Entity<Post>().HasOne(p => p.Author)
                .WithMany(u => u.Posts);

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // ON DELETE RESTRICT instead of ON DELETE CASCADE
                foreach (var key in entityType.GetForeignKeys())
                    key.DeleteBehavior = DeleteBehavior.Restrict;

                foreach (var prop in entityType.GetDeclaredProperties())
                {
                    // Define Guid as alternate key. The database can create a guid fou you.
                    if (prop.Name == "Guid")
                    {
                        modelBuilder.Entity(entityType.ClrType).HasAlternateKey("Guid");
                        prop.ValueGenerated = Microsoft
                            .EntityFrameworkCore
                            .Metadata
                            .ValueGenerated
                            .OnAdd;
                    }
                    // Default MaxLength of string Properties is 255.
                    if (prop.ClrType == typeof(string) && prop.GetMaxLength() is null)
                        prop.SetMaxLength(255);
                    // Seconds with 3 fractional digits.
                    if (prop.ClrType == typeof(DateTime))
                        prop.SetPrecision(3);
                    if (prop.ClrType == typeof(DateTime?))
                        prop.SetPrecision(3);
                }
            }
        }

        public void SeedDatabase()
        {
            Randomizer.Seed = new Random(11111111);
            var faker = new Faker("de");
            var users = new Faker<User>(locale: "de").CustomInstantiator(f =>
            {
                var username = f.Internet.UserName();
                return new User(username.ToLower(),
                                f.Internet.Email(),
                                f.Internet.Password(),
                                username);
            }).Generate(5).ToList();

            var admin = new User("admin", "admin@triptales.at", "admin", "Administrator");
            admin.Verified = true;
            Users.Add(admin);
            Users.AddRange(users);
            SaveChanges();

            var posts = new Faker<Post>(locale: "de").CustomInstantiator(f =>
            {
                f.Lorem.Locale = "de";
                var date = f.Date.Between(DateTime.UtcNow.AddDays(-20), DateTime.UtcNow.AddDays(-1));
                var date2 = f.Date.Between(date, DateTime.UtcNow);
                var post = new Post(f.Lorem.Sentence(5), f.Lorem.Sentence(15), f.PickRandom(users), date, date);
                return post;
            }).Generate(10).ToList();
            Posts.AddRange(posts);
            SaveChanges();
        }
    }
}
