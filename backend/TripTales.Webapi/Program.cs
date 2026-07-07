using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Triptales.Repository;
using Triptales.Application.Dtos;
using Triptales.Webapi.Infrastructure;
using Triptales.Webapi.Services;
using Microsoft.Extensions.FileProviders;
using System.IO;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

//var cultureInfo = new CultureInfo("de-AT");
//cultureInfo.DateTimeFormat.ShortDatePattern = "yyyy.MM.dd";
//cultureInfo.DateTimeFormat.DateSeparator = ".";

//CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
//CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddDbContext<TripTalesContext>(opt => opt.UseSqlite("DataSource=Triptales.db"));

// Register the current user context accessor
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserContext, CurrentUserContext>();

// Register repositories
builder.Services.AddTransient<UserRepository>();
builder.Services.AddTransient<PostRepository>();
builder.Services.AddTransient<CommentRepository>();

// Register services
builder.Services.AddTransient<UserService>();
builder.Services.AddTransient<PostService>();
builder.Services.AddTransient<CommentService>();
builder.Services.AddTransient<ModelConversions>();
builder.Services.AddTransient<IFileService, LocalFileService>();
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

// Register the database initializer to run on startup
builder.Services.AddHostedService<DatabaseInitializerService>();

var app = builder.Build();

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowDevServer");

    if (!Directory.Exists(Path.Combine(builder.Environment.ContentRootPath, "Images")))
    {
        Directory.CreateDirectory(Path.Combine(builder.Environment.ContentRootPath, "Images"));
    }
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
               Path.Combine(builder.Environment.ContentRootPath, "Images")),
        RequestPath = "/Images"
    });
}

app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
