using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using MadWare.Hathor.RestApi.Hubs;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace MadWare.Hathor.RestApi.Controllers
{
    [Route("api/[controller]")]
    public class ServerController : Controller
    {
        private IConnectionManager connectionManager;

        public ServerController(IConnectionManager connManager)
        {
            this.connectionManager = connManager;
        }

        [Route("[action]/{serverId}/{clientId?}")]
        [HttpPost]
        public async Task<object> RefreshPlaylist([FromBody]JObject payload, string serverId, string clientId)
        {
            var hub = this.connectionManager.GetHubContext<HathorHub>();
            if (clientId == null)
            {
                //notify all connected to the server
                hub.Clients.Group(serverId).receiveMessage(payload);
            }
            else
            {
                //notify only the one client who requested update
                string cId = null;
                if( HathorHub.ClientsMap.TryGetValue(clientId, out cId))
                {
                    hub.Clients.Client(cId).receiveMessage(payload);
                }
            }

            return await Task.FromResult(new { success = true });
        }
    }
}
