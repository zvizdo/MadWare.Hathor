import { getHttpInstance } from './../httpConfig';
import { createSignature } from './../utils/utils';

const serverActions = {

  refreshPlaylist: function(serverId, playlist, clientId = null){
    return (dispatch) => {
      let http = getHttpInstance();

      http.post('api/server/refreshPlaylist/' + serverId + (clientId === null ? '' : '/'+clientId),
        {type: "CLIENT_PLAYLIST_REFRESH", payload: playlist}
      )
      .then( function(resp){
        dispatch({type: "SERVER_PLAYLIST_REFRESH_PUSHED"})
      } )
      .catch( function(error){
        console.error(error);
      } );
    };
  },

  handleReceiveMessage: function(action, serverProps){
    return (dispatch) => {

      switch (action.type) {
        case "PLAYLIST_ADD_VIDEO":
          dispatch( this.addVideo(action.payload, serverProps) );
          break;

        case "PLAYLIST_REMOVE_VIDEO":
          dispatch( this.removeVideo(action.payload, serverProps) );
          break;

        case "SERVER_CLIENT_REFRESH_REQUESTED":
          dispatch( serverActions.refreshPlaylist(serverProps.server.id, serverProps.playlist, action.payload) );
          break;
      }

    };
  },

  addVideo: function(video, serverProps) {
    return (dispatch) => {
      let tempPlaylist = { ...serverProps.playlist }
      let exists = tempPlaylist.videos.find( v => v.id === video.id );
      if(exists)
        return;

      let videos = [...tempPlaylist.videos, video];
      tempPlaylist.videos = videos;

      dispatch( { type: "PLAYLIST_CHANGE_VIDEOS", payload: videos } )
      dispatch( this.refreshPlaylist(serverProps.server.id, tempPlaylist) );
    };

  },

  removeVideo(videoRemovePayload, serverProps) {
    return (dispatch) => {
      let tempPlaylist = { ...serverProps.playlist }
      const sig = createSignature( videoRemovePayload.serverId+videoRemovePayload.clientId, videoRemovePayload.videoId );

      let videos = tempPlaylist.videos.filter( v => v.secretId !== sig );
      tempPlaylist.videos = videos;

      dispatch( { type: "PLAYLIST_CHANGE_VIDEOS", payload: videos } )
      dispatch( this.refreshPlaylist(serverProps.server.id, tempPlaylist) );
    };
  },

  removeVideoServer(videoId, serverProps) {
    return (dispatch) => {
      let tempPlaylist = { ...serverProps.playlist }
      let videos = tempPlaylist.videos.filter( v => v.id !== videoId );
      tempPlaylist.videos = videos;

      dispatch( { type: "PLAYLIST_CHANGE_VIDEOS", payload: videos } )
      dispatch( this.refreshPlaylist(serverProps.server.id, tempPlaylist) );
    };
  }

}

export default serverActions;
