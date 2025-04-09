using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Triptales.Repository;
using Triptales.Application.Dtos;
using Triptales.Application.Services;
using Triptales.Webapi.Infrastructure;
using proxreal_backend.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddDbContext<TripTalesContext>(opt => opt.UseSqlite("DataSource=Triptales.db"));
builder.Services.AddTransient<UserService>();
builder.Services.AddTransient<UserRepository>();
builder.Services.AddTransient<PostRepository>();
builder.Services.AddTransient<PostService>();
builder.Services.AddScoped<ModelConversions>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowDevServer",
        builder =>
            builder
                .SetIsOriginAllowed(origin => new System.Uri(origin).IsLoopback)
                .AllowAnyMethod()
                .AllowCredentials()
                .AllowAnyHeader()
    );
});

builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.OnAppendCookie = cookieContext =>
    {
        cookieContext.CookieOptions.Secure = builder.Environment.IsDevelopment() ? true : false;
        cookieContext.CookieOptions.SameSite = builder.Environment.IsDevelopment()
            ? SameSiteMode.None
            : SameSiteMode.Strict;
    };
});
builder
    .Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o =>
    {
        o.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return System.Threading.Tasks.Task.CompletedTask;
        };
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    using (var db = scope.ServiceProvider.GetRequiredService<TripTalesContext>())
    {
        if (app.Environment.IsDevelopment())
            db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
        db.SeedDatabase();
    }
}

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowDevServer");
}

app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
