using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Triptales.Webapi.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Triptales.Webapi.Services
{
    /// <summary>
    /// Initializes the database on application startup.
    /// Ensures the database is created and seeded if needed.
    /// </summary>
    public class DatabaseInitializerService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IHostEnvironment _environment;

        public DatabaseInitializerService(IServiceProvider serviceProvider, IHostEnvironment environment)
        {
            _serviceProvider = serviceProvider;
            _environment = environment;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<TripTalesContext>();

                // In development, delete and recreate the database for a fresh start
                if (_environment.IsDevelopment())
                {
                    await db.Database.EnsureDeletedAsync(cancellationToken);
                }

                // Create the database if it doesn't exist
                await db.Database.EnsureCreatedAsync(cancellationToken);

                // Seed the database with test data if it's empty
                if (!db.Users.Any())
                {
                    db.SeedDatabase();
                    await db.SaveChangesAsync(cancellationToken);
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
