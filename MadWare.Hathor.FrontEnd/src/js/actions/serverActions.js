import { getHttpInstance } from './../httpConfig';

const serverActions = {

  refreshPlaylist: function(serverId, playlist, clientId = null){
    return (dispatch) => {
      let http = getHttpInstance();

      http.post('api/server/refreshPlaylist/' + serverId + (clientId === null ? '' : '/'+clientId),
        {type: "CLIENT_PLAYLIST_REFRESH", payload: playlist}
      )
      .then( function(resp){
        dispatch({type: "SERVER_PLAYLIST_REFRESHED"})
      } )
      .catch( function(error){
        console.error(error);
      } );
    };
  }

}

export default serverActions;
