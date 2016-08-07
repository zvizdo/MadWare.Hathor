using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using MadWare.Hathor.RestApi.Services.Youtube;
using MadWare.Hathor.RestApi.Hubs;
using Microsoft.AspNetCore.SignalR.Infrastructure;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace MadWare.Hathor.RestApi.Controllers
{
    [Route("api/[controller]")]
    public class ClientController : Controller
    {
        private IYoutubeService ytService;
        private IConnectionManager connectionManager;

        public ClientController(IYoutubeService ytSrv, IConnectionManager connManager)
        {
            this.ytService = ytSrv;
            this.connectionManager = connManager;
        }

        [Route("[action]/{serverId}/{clientId}")]
        [HttpGet]
        public async Task<object> RefreshPlaylist(string serverId, string clientId)
        {
            var hub = this.connectionManager.GetHubContext<HathorHub>();
            string cId = null;
            if (HathorHub.ServersMap.TryGetValue(serverId, out cId))
            {
                var action = new JObject();
                action["type"] = "SERVER_CLIENT_REFRESH_REQUESTED";
                action["payload"] = clientId;
                hub.Clients.Client(cId).receiveMessage(action);
            }

            return await Task.FromResult(new { success = true });
        }

        [Route("[action]/{serverId}/{videoId}")]
        [HttpGet]
        public async Task<object> AddVideo(string serverId, string videoId)
        {
            var ytInfo = await this.ytService.GetInfo(videoId);
            if (ytInfo == null)
                return new { success = false, error = "VIDEO_DOES_NOT_EXIST" };

            var hub = this.connectionManager.GetHubContext<HathorHub>();
            string cId = null;
            if (HathorHub.ServersMap.TryGetValue(serverId, out cId))
            {
                var action = new JObject();
                action["type"] = "PLAYLIST_ADD_VIDEO";
                action["payload"] = JObject.FromObject(ytInfo);
                hub.Clients.Client(cId).receiveMessage(action);
            }

            return new { success = true };
        }
    }
}
