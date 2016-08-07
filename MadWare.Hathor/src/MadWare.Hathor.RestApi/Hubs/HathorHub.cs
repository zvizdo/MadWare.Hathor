using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MadWare.Hathor.RestApi.Hubs
{
    [HubName("hathorHub")]
    public class HathorHub : Hub
    {

        public static ConcurrentDictionary<string, string> ServersMap = new ConcurrentDictionary<string, string>();
        public static ConcurrentDictionary<string, string> ClientsMap = new ConcurrentDictionary<string, string>();

        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public bool RegisterServer(string id)
        {
            ServersMap.TryAdd(id, Context.ConnectionId);

            return true;
        }

        public bool RegisterClient(string id, string serverId)
        {
            var action = new JObject();
            action["type"] = "CLIENT_REGISTER_WITH_SERVER";

            string srvId = null;
            if (!ServersMap.TryGetValue(serverId, out srvId))
            {
                action["payload"] = false;

                SendToClient(action);
                return false;
            }
                
            ClientsMap.TryAdd(id, Context.ConnectionId);

            this.Groups.Add(Context.ConnectionId, serverId);

            action["payload"] = true;
            SendToClient(action);
            return true;
        }

        public void SendToClient(JObject obj)
        {
            Clients.Caller.receiveMessage(obj);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var kv = ClientsMap.Where(keyVal => keyVal.Value == Context.ConnectionId).FirstOrDefault();
            if( !kv.Equals(default(KeyValuePair<string, string>)) )
            {
                string cId = null;
                ClientsMap.TryRemove(kv.Key, out cId);
            }
            kv = ServersMap.Where(keyVal => keyVal.Value == Context.ConnectionId).FirstOrDefault();
            if (!kv.Equals(default(KeyValuePair<string, string>)))
            {
                string cId = null;
                ServersMap.TryRemove(kv.Key, out cId);
            }
            return base.OnDisconnected(stopCalled);
        }

    }
}
