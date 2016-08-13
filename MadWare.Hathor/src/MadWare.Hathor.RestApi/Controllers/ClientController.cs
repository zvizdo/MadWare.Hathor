using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using MadWare.Hathor.RestApi.Services.Youtube;
using MadWare.Hathor.RestApi.Hubs;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using MadWare.Hathor.RestApi.Services.HubManager;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace MadWare.Hathor.RestApi.Controllers
{
    [Route("api/[controller]")]
    public class ClientController : Controller
    {
        private IYoutubeService ytService;
        private readonly IHubManager hubManager;

        public ClientController(IYoutubeService ytSrv, IHubManager hubManager)
        {
            this.ytService = ytSrv;
            this.hubManager = hubManager;
        }

        [Route("[action]/{serverId}/{clientId}")]
        [HttpGet]
        public async Task<object> RefreshPlaylist(string serverId, string clientId)
        {
            var action = new JObject();
            action["type"] = "SERVER_CLIENT_REFRESH_REQUESTED";
            action["payload"] = clientId;
            this.hubManager.PushToServer(serverId, action);

            return await Task.FromResult(new { success = true });
        }

        [Route("[action]/{serverId}/{clientId}")]
        [HttpPost]
        public async Task<object> PushToServer([FromBody]JObject payload, string serverId, string clientId)
        {
            this.hubManager.PushToServer(serverId, payload);

            return await Task.FromResult(new { success = true });
        }

        [Route("[action]/{serverId}/{videoId}/{secretId}")]
        [HttpGet]
        public async Task<object> AddVideo(string serverId, string videoId, string secretId)
        {
            var ytInfo = await this.ytService.GetInfo(videoId);
            if (ytInfo == null)
                return new { success = false, error = "VIDEO_DOES_NOT_EXIST" };

            ytInfo.SecretId = secretId;

            var action = new JObject();
            action["type"] = "PLAYLIST_ADD_VIDEO";
            action["payload"] = JObject.FromObject(ytInfo);
            this.hubManager.PushToServer(serverId, action);

            return new { success = true };
        }
    }
}
