import { getHttpInstance } from './../httpConfig';
import { createSignature } from './../utils/utils';
import { storageMngr,  STORE_PLAYLIST_KEY } from './../utils/storageManager';


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

  storePlaylistLocal: function(playlist) {
    storageMngr.set(STORE_PLAYLIST_KEY, playlist);
  },

  restorePlaylistLocal: function() {
    let playlist = storageMngr.get(STORE_PLAYLIST_KEY);
    if (!playlist)
      return {
        type: "PLAYLIST_CHANGE_VIDEOS",
        payload: []
      };

    return {
      type: "SERVER_PLAYLIST_RESTORE",
      payload: playlist
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

        case "PLAYLIST_UPVOTE_VIDEO":
          dispatch( this.upVoteVideo(action.payload, serverProps) );
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

      video = {...video, upVotes: [], wasPlayed: false}
      let videos = [...tempPlaylist.videos, video];
      tempPlaylist.videos = videos;

      this.storePlaylistLocal(tempPlaylist);
      dispatch( { type: "PLAYLIST_CHANGE_VIDEOS", payload: videos } );
      dispatch( this.refreshPlaylist(serverProps.server.id, tempPlaylist) );
    };

  },

  removeVideo(videoRemovePayload, serverProps) {
    return (dispatch) => {
      let tempPlaylist = { ...serverProps.playlist }
      const sig = createSignature( videoRemovePayload.serverId+videoRemovePayload.clientId, videoRemovePayload.videoId );

      let videos = tempPlaylist.videos.filter( v => v.secretId !== sig );
      tempPlaylist.videos = videos;

      this.storePlaylistLocal(tempPlaylist);
      dispatch( { type: "PLAYLIST_CHANGE_VIDEOS", payload: videos } );
      dispatch( this.refreshPlaylist(serverProps.server.id, tempPlaylist) );
    };
  },

  removeVideoServer(videoId, serverProps) {
    return (dispatch) => {
      let tempPlaylist = { ...serverProps.playlist }
      let videos = tempPlaylist.videos.filter( v => v.id !== videoId );
      tempPlaylist.videos = videos;

      this.storePlaylistLocal(tempPlaylist);
      dispatch( { type: "PLAYLIST_CHANGE_VIDEOS", payload: videos } );
      dispatch( this.refreshPlaylist(serverProps.server.id, tempPlaylist) );
    };
  },

  upVoteVideo(videoUpVotePayload, serverProps) {
    return (dispatch) => {
      let tempPlaylist = {...serverProps.playlist}
      let video = tempPlaylist.videos.find( v => v.id === videoUpVotePayload.videoId )
      if (!video)
        return;

      const sig = createSignature( videoUpVotePayload.serverId+videoUpVotePayload.clientId, videoUpVotePayload.videoId );
      if (video.upVotes.find( up => up === sig ))
        return;

      video = {...video, upVotes: [...video.upVotes, sig]};
      tempPlaylist.videos = tempPlaylist.videos.map( (v, i) => {
        if (v.id === videoUpVotePayload.videoId)
            return video;
        else
          return v;
      } );

      this.storePlaylistLocal(tempPlaylist);
      dispatch( { type: "PLAYLIST_CHANGE_VIDEO", payload: video } );
      dispatch( this.refreshPlaylist(serverProps.server.id, tempPlaylist) );
    };
  }

}

export default serverActions;
