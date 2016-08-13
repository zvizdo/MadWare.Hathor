using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MadWare.Hathor.RestApi.Models;
using Google.Apis.YouTube.v3;
using Microsoft.Extensions.Caching.Memory;

namespace MadWare.Hathor.RestApi.Services.Youtube
{
    public class YoutubeService : IYoutubeService
    {
        private readonly IMemoryCache memoryCache;
        private YouTubeService service;

        private MemoryCacheEntryOptions memoryCacheOptions;

        public YoutubeService(string apiKey, string appName, IMemoryCache memCache)
        {
            this.memoryCache = memCache;
            this.service = new YouTubeService(new Google.Apis.Services.BaseClientService.Initializer()
            {
                ApiKey = apiKey,
                ApplicationName = appName
            });

            this.memoryCacheOptions = new MemoryCacheEntryOptions()
            {
                SlidingExpiration = TimeSpan.FromHours(2)
            };
        }

        private string MemoryCacheKey(string videoId)
        {
            return "YouTubeAPI_" + videoId;
        }

        public async Task<YoutubeInfoModel> GetInfo(string videoId)
        {
            string cKey = this.MemoryCacheKey(videoId);

            YoutubeInfoModel ytInfo = null;
            if (!this.memoryCache.TryGetValue<YoutubeInfoModel>(cKey, out ytInfo))
            {
                var ytInfoRequest = this.service.Videos.List("snippet");
                ytInfoRequest.Id = videoId;

                var ytInfoResponse = await ytInfoRequest.ExecuteAsync();

                if (ytInfoResponse.Items.Count != 0)
                {
                    ytInfo = new YoutubeInfoModel
                    {
                        Id = videoId,
                        Title = ytInfoResponse.Items.First().Snippet.Title,
                        Thumbnail = ytInfoResponse.Items.First().Snippet.Thumbnails.Default__.Url
                    };
                }

                this.memoryCache.Set<YoutubeInfoModel>(cKey, ytInfo, 
                    ytInfo != null ? default(MemoryCacheEntryOptions) : this.memoryCacheOptions );
            }

            return ytInfo;
        }
    }
}
