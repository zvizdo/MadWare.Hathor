import { generateRandomString } from './../utils/utils';
import storageMngr from './../utils/storageManager';

const STORE_SERVER_ID_KEY = 'store_serverId';
const STORE_CLIENT_ID_KEY = 'store_clientId';

const setupActions = {

  generateServerId: function(){
    let strKey = STORE_SERVER_ID_KEY;

    let id = storageMngr.get(strKey);
    if (id)
      id = id.serverId;
    else {
      id = generateRandomString(5);
      storageMngr.set(strKey, { serverId: id });
    }

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
