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

  addVideo: function(serverId, videoId){
    return (dispatch) => {
      let http = getHttpInstance();

      http.get('api/client/addVideo/' + serverId + '/' + videoId)
      .then( function(resp){
        if(resp.data.success){
          dispatch( { type: "CLIENT_VIDEO_ADDED" } );
        }else {
          alert("Video with this id does not exist!");
        }
      } )
      .catch( function(error){
        console.error(error);
      } );
    };
  }

}

export default clientActions;
