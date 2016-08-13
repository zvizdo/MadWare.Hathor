import { createSignature } from './../utils/utils';

let initialState = {
  repeat: false,
  shuffle: false,
  currentVideoIndex: 0,
  videos: []
}

const playlistReducer = function(state=initialState, action){

  switch (action.type) {
    case "PLAYLIST_SHUFFLE_ON_OFF":
      return {
        ...state,
        shuffle: action.payload
      };

      case "PLAYLIST_REPEAT_ON_OFF":
        return {
          ...state,
          repeat: action.payload
        };

      case "PLAYLIST_CHANGE_CURRENT_VIDEO":
        return {
          ...state,
          currentVideoIndex: action.payload
        };

      case "PLAYLIST_ADD_VIDEO":
        let exists = state.videos.find( v => v.id === action.payload.id );
        if(exists)
          return state;

        return {
          ...state,
          videos: [...state.videos, action.payload]
        };

      case "PLAYLIST_REMOVE_VIDEO_SERVER":
        let vids = state.videos.filter( v => v.id !== action.payload );
        return {
          ...state,
          videos: [...vids]
        };

      case "PLAYLIST_REMOVE_VIDEO":
        let payload = action.payload;
        let sig = createSignature( payload.serverId+payload.clientId, payload.videoId );

        let videos = state.videos.filter( v => v.secretId !== sig );
        return {
          ...state,
          videos: [...videos]
        };

      case "CLIENT_PLAYLIST_REFRESH":
        return action.payload;

    default:
      return state;

  }

}

export default playlistReducer;
