import { generateRandomString } from './../utils/utils'

const setupActions = {

  generateServerId: function(){
    let id = generateRandomString(4);

    return {
      type: "SERVER_SERVER_ID",
      payload: id
    };
  },

  generateClientId: function(){
    let id = generateRandomString(5);

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
