using System;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace Infrastructure.Services
{
    public class ResponseCacheService : IResponseCacheService
    {
        private readonly IDatabase _database;
        private readonly ILogger<ResponseCacheService> _iLogger;
        public ResponseCacheService(IConnectionMultiplexer redis, ILogger<ResponseCacheService> iLogger)
        {
            _iLogger = iLogger;
            this._database = redis.GetDatabase();
        }

        public async Task CacheReponseAsync(string cacheKey, object response, TimeSpan timeToLive)
        {
            if (response == null)
            {
                return;
            }

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var serializedResponse = JsonSerializer.Serialize(response,options);

            await _database.StringSetAsync(cacheKey, serializedResponse, timeToLive);


        }

        public async Task<string> GetCachedResponseAsync(string cacheKey)
        {
            var cacheResponse = await _database.StringGetAsync(cacheKey);

            _iLogger.LogInformation("Log for cache" + cacheResponse);

            if (cacheResponse.IsNullOrEmpty)
            {
                return null;
            }

            return cacheResponse;
        }
    }
}