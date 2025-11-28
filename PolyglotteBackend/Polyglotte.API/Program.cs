using FluentValidation;
using FluentValidation.AspNetCore;
using Polyglotte.Application.Interfaces;
using Polyglotte.Application.Services;
using Polyglotte.Application.Validators.User;
using Polyglotte.Application.Validators.Word;
using Polyglotte.Domain.Interfaces;
using Polyglotte.Infrastructure.MongoDbContext;
using Polyglotte.Infrastructure.Repositories;

namespace Polyglotte.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // CORS configuration
             var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:5173", "http://localhost:3000", "http://localhost", "https://localhost:8080" };

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("DefaultCors", policy =>
            {
                policy
                    .WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                // .AllowCredentials(); // seulement si cookies/authorization avec credentials
            });
        });

            // Health checks
            //builder.Services.AddHealthChecks()
            //    .AddMongoDb(
            //        mongoSettings => mongoSettings.ConnectionString,
            //        name: "MongoDB"
            //    );

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddFluentValidationAutoValidation();

            // Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Bind MongoSettings from configuration and register related services
            var mongoSettings = new MongoSettings();
            builder.Configuration.GetSection("MongoSettings").Bind(mongoSettings);
            builder.Services.AddSingleton(mongoSettings);

            // Mongo DB context and repository/service registrations
            builder.Services.AddSingleton<MongoDbContext>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IWordRepository, WordRepository>();
            builder.Services.AddScoped<IWordService, WordService>();

            // FluentValidation validators
            builder.Services.AddValidatorsFromAssemblyContaining<CreateUserDtoValidator>();
            builder.Services.AddValidatorsFromAssemblyContaining<CreateWordDtoValidator>();

            var app = builder.Build();

            if (app.Environment.IsProduction())
                {
  
                  app.UseHttpsRedirection();
                }
            
            app.UseRouting();

            // Apply CORS policy
            app.UseCors("DefaultCors");

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseAuthorization();

            // Map health check endpoint
            //app.MapHealthChecks("/health");

            app.MapControllers();

            app.Run();
        }
    }
}
