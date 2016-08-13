import { getHttpInstance } from './../httpConfig';

const clientActions = {

  refreshPlaylist: function(serverId, clientId){
    return (dispatch) => {
      let http = getHttpInstance();

      http.get('api/client/refreshPlaylist/' + serverId + '/' + clientId)
      .then( function(resp){
        dispatch({type: "CLIENT_PLAYLIST_REFRESH_REQUESTED"})
      } )
      .catch( function(error){
        console.error(error);
      } );
    };
  },

  addVideo: function(serverId, videoId, secretId){
    return (dispatch) => {
      let http = getHttpInstance();

      http.get('api/client/addVideo/' + serverId + '/' + videoId + (secretId ? ("/"+secretId) : "" ) )
      .then( function(resp){
        if(resp.data.success) {
          dispatch( { type: "PLAYLIST_ADD_VIDEO_SUCCESSFUL_REQUEST" } );
        } else {
          dispatch( {
            type: "PLAYLIST_ADD_VIDEO_UNSUCCESSFULL_REQUEST",
            payload: "Video with this id does not exist!"
          } );
          alert("Video with this id does not exist!");
        }
      } )
      .catch( function(error){
        console.error(error);
      } );
    };
  },

  pushToServer: function(serverId, clientId, payload){
    return (dispatch) => {
      let http = getHttpInstance();

      http.post('api/client/pushToServer/' + serverId + '/' + clientId, payload)
      .then( function(resp){
        dispatch({type: "CLIENT_PUSH_TO_SERVER_SUCCESSFUL"})
      } )
      .catch( function(error){
        console.error(error);
      } );
    };
  }

}

export default clientActions;
