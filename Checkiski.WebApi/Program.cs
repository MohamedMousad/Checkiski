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

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
}

if (!string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = connectionString.Trim();
    int index = connectionString.IndexOf("?sslmode", StringComparison.OrdinalIgnoreCase);
    if (index >= 0)
    {
        bool hasEquals = connectionString.Length > index + 8 && connectionString[index + 8] == '=';
        if (!hasEquals)
        {
            connectionString = connectionString.Insert(index + 8, "=Require");
        }
    }
    
    // Mutate the configuration so any auto-provisioning tools see the fixed string
    builder.Configuration["ConnectionStrings:DefaultConnection"] = connectionString;
    
    // Also mutate environment variables just in case
    if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("DATABASE_URL")))
    {
        Environment.SetEnvironmentVariable("DATABASE_URL", connectionString);
    }
    if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")))
    {
        Environment.SetEnvironmentVariable("ConnectionStrings__DefaultConnection", connectionString);
    }
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());
builder.Services.AddScoped<IGameNotifier, Checkiski.WebApi.Services.GameNotifier>();
builder.Services.AddScoped<IJwtService, Checkiski.WebApi.Services.JwtService>();

var redisConnectionString = builder.Configuration.GetConnectionString("Redis");
if (!string.IsNullOrWhiteSpace(redisConnectionString))
{
    try
    {
        var redis = StackExchange.Redis.ConnectionMultiplexer.Connect(redisConnectionString);
        builder.Services.AddSingleton<StackExchange.Redis.IConnectionMultiplexer>(redis);
        Console.WriteLine("Redis connected successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Redis connection failed, running without Redis: {ex.Message}");
    }
}
else
{
    Console.WriteLine("No Redis connection string configured, running without Redis.");
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

using (var scope = app.Services.CreateScope())
{
    try 
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
        Console.WriteLine("Database migration completed successfully.");
    } 
    catch (Exception ex) 
    {
        Console.WriteLine($"Database migration failed: {ex.Message}");
    }
}

app.UseDeveloperExceptionPage();

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

app.MapGet("/", () => "Checkiski API is running! v2");

app.Run();
