using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MadWare.Hathor.RestApi.Models;
using Google.Apis.YouTube.v3;

namespace MadWare.Hathor.RestApi.Services.Youtube
{
    public class YoutubeService : IYoutubeService
    {
        private YouTubeService service;

        public YoutubeService(string apiKey, string appName)
        {
            this.service = new YouTubeService(new Google.Apis.Services.BaseClientService.Initializer()
            {
                ApiKey = apiKey,
                ApplicationName = appName
            });
        }

        public async Task<YoutubeInfoModel> GetInfo(string videoId)
        {
            var ytInfoRequest = this.service.Videos.List("snippet");
            ytInfoRequest.Id = videoId;

            var ytInfoResponse = await ytInfoRequest.ExecuteAsync();

            if (ytInfoResponse.Items.Count == 0)
                return null;

            return new YoutubeInfoModel
            {
                Id = videoId,
                Title = ytInfoResponse.Items.First().Snippet.Title,
                Thumbnail = ytInfoResponse.Items.First().Snippet.Thumbnails.Default__.Url
            };
        }
    }
}
