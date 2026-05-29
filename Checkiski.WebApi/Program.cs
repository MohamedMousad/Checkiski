using Checkiski.Application.Common.Interfaces;
using Checkiski.Infrastructure.Data;
using Checkiski.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(IAppDbContext).Assembly));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
builder.Services.AddScoped<IGameNotifier, Checkiski.WebApi.Services.GameNotifier>();
builder.Services.AddScoped<IJwtService, Checkiski.WebApi.Services.JwtService>();

var redisConnectionString = builder.Configuration.GetConnectionString("Redis") ?? "localhost";
try
{
    builder.Services.AddSingleton<StackExchange.Redis.IConnectionMultiplexer>(StackExchange.Redis.ConnectionMultiplexer.Connect(redisConnectionString));
}
catch (Exception ex)
{
    Console.WriteLine($"Redis connection failed: {ex.Message}");
}
builder.Services.AddScoped<Checkiski.Application.Common.Interfaces.IMatchmakingService, Checkiski.Infrastructure.Services.InMemoryMatchmakingService>();

builder.Services.AddAuthentication(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "CheckiskiAPI",
            ValidAudience = builder.Configuration["JwtSettings:Audience"] ?? "CheckiskiClient",
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"] ?? "SuperSecretKeyForCheckiskiApp123!"))
        };
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/gamehub"))
                {
                    context.Token = accessToken;
                }
                return System.Threading.Tasks.Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed(_ => true);
    });
});

var app = builder.Build();

app.UseExceptionHandler("/error");
app.Map("/error", (Microsoft.AspNetCore.Http.HttpContext context) =>
{
    return Microsoft.AspNetCore.Http.Results.Problem("An unexpected error occurred.");
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<GameHub>("/gamehub");

app.MapGet("/", () => "Checkiski API is running!");

app.Run();
