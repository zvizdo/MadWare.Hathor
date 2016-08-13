using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MadWare.Hathor.RestApi.Services.HubManager
{
    public interface IHubManager
    {

        bool PushToClient(string clientId, object payload);

        bool PushToServer(string serverId, object payload);

        void PushToGroup(string serverId, object payload);

    }
}
