using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using MadWare.Hathor.RestApi.Hubs;
using MadWare.Hathor.RestApi.Services.HubManager;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace MadWare.Hathor.RestApi.Controllers
{
    [Route("api/[controller]")]
    public class ServerController : Controller
    {
        private readonly IHubManager hubManager;

        public ServerController(IHubManager hubManager)
        {
            this.hubManager = hubManager;
        }

        [Route("[action]/{serverId}/{clientId?}")]
        [HttpPost]
        public async Task<object> RefreshPlaylist([FromBody]JObject payload, string serverId, string clientId)
        {
            if (clientId == null)
            {
                //notify all connected to the server
                this.hubManager.PushToGroup(serverId, payload);
            }
            else
            {
                //notify only the one client who requested update
                this.hubManager.PushToClient(clientId, payload);
            }

            return await Task.FromResult(new { success = true });
        }
    }
}
