import { generateRandomString } from './../utils/utils';
import { storageMngr, STORE_SERVER_ID_KEY, STORE_CLIENT_ID_KEY, STORE_PLAYLIST_KEY } from './../utils/storageManager';

const setupActions = {

  generateServerId: function(hub, newServer = false){
    let id = newServer ? null : storageMngr.get(STORE_SERVER_ID_KEY);
    if (id)
      id = id.serverId;
    else {
      id = generateRandomString(5);
      storageMngr.set(STORE_SERVER_ID_KEY, { serverId: id });
      storageMngr.remove(STORE_PLAYLIST_KEY);
    }

    hub.disconnect();
    hub.connect(function() {
        hub.registerServer(id);
    }.bind(this) );

    return {
      type: "SERVER_SERVER_ID",
      payload: id
    };
  },

  generateClientId: function(){
    let strKey = STORE_CLIENT_ID_KEY;

    let id = storageMngr.get(strKey);
    if (id)
      id = id.clientId;
    else {
      id = generateRandomString(7);
      storageMngr.set(strKey, { clientId: id });
    }

    return {
      type: "CLIENT_CLIENT_ID",
      payload: id
    };
  },

  setServerIdOnClient: function(serverId){
    return {
      type: "CLIENT_SERVER_ID",
      payload: serverId
    };
  },

  clearServer: function(){
    return {
      type: "SERVER_CLEAR"
    };
  },

  clearClient: function(){
    return {
      type: "CLIENT_CLEAR"
    };
  },

}

export default setupActions;
