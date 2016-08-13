using MadWare.Hathor.RestApi.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MadWare.Hathor.RestApi.Services.HubManager
{
    public class HubManager : IHubManager
    {
        private readonly IConnectionManager connectionManager;

        private IHubContext hubContext;

        public HubManager(IConnectionManager connManager)
        {
            this.connectionManager = connManager;
            this.hubContext = this.connectionManager.GetHubContext<HathorHub>();
        }

        public bool PushToClient(string clientId, object payload)
        {
            string cId = null;
            if (HathorHub.ClientsMap.TryGetValue(clientId, out cId))
            {
                this.hubContext.Clients.Client(cId).receiveMessage(payload);
                return true;
            }

            return false;
        }

        public bool PushToServer(string serverId, object payload)
        {
            string cId = null;
            if (HathorHub.ServersMap.TryGetValue(serverId, out cId))
            {
                this.hubContext.Clients.Client(cId).receiveMessage(payload);
                return true;
            }

            return false;
        }

        public void PushToGroup(string serverId, object payload)
        {
            this.hubContext.Clients.Group(serverId).receiveMessage(payload);
        }

    }
}
