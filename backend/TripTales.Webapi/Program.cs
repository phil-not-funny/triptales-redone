using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Triptales.Repository;
using Triptales.Application.Dtos;
using Triptales.Webapi.Infrastructure;
using Triptales.Webapi.Services;
using Microsoft.Extensions.FileProviders;
using System;
using System.Collections.Generic;
using System.IO;
using System.Globalization;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var cultureInfo = new CultureInfo("de-AT");
cultureInfo.DateTimeFormat.ShortDatePattern = "yyyy.MM.dd";
cultureInfo.DateTimeFormat.DateSeparator = ".";

CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Paste the JWT returned by /api/User/login."
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new List<string>()
        }
    });
});
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddDbContext<TripTalesContext>(opt => opt.UseSqlite("DataSource=Triptales.db"));
builder.Services.AddTransient<UserService>();
builder.Services.AddTransient<UserRepository>();
builder.Services.AddTransient<PostRepository>();
builder.Services.AddTransient<CommentRepository>();
builder.Services.AddTransient<PostService>();
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
                .AllowAnyHeader()
    );
});

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
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

    // The database is recreated on every start in development, so previously uploaded pictures would be orphaned.
    var imagesPath = Path.Combine(builder.Environment.ContentRootPath, "Images");
    Directory.CreateDirectory(imagesPath);
    foreach (var file in Directory.EnumerateFiles(imagesPath))
        File.Delete(file);

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(imagesPath),
        RequestPath = "/Images"
    });
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
