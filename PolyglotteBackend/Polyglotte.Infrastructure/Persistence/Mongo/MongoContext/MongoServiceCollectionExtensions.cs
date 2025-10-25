using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using Polyglotte.Infrastructure.Persistence.Mongo.MongoDbOptions;

namespace Polyglotte.Infrastructure.Persistence.Mongo.MongoContext
{
    public static class MongoServiceCollectionExtensions
    {
        public static IServiceCollection AddMongo(this IServiceCollection services, IConfiguration configuration)
        {
            var section = configuration.GetSection("MongoDb");
            services.Configure<MongoDbOptions>(section);
            var options = section.Get<MongoDbOptions>();

            var client = new MongoClient(options.ConnectionString);
            services.AddSingleton<IMongoClient>(client);
            services.AddSingleton(sp => client.GetDatabase(options.Database));

            return services;
        }
    }
}
