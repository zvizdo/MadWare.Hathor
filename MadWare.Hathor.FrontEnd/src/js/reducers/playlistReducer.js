import { generateRandomString } from './../utils/utils';

let initialState = {
  ver: null,
  repeat: false,
  shuffle: false,
  currentVideoId: null,
  videos: []
}

const playlistReducer = function(state=initialState, action){

  switch (action.type) {
    case "PLAYLIST_SHUFFLE_ON_OFF":
      return {
        ...state,
        ver: generateRandomString(5),
        shuffle: action.payload
      };

      case "PLAYLIST_REPEAT_ON_OFF":
        return {
          ...state,
          ver: generateRandomString(5),
          repeat: action.payload
        };

      case "PLAYLIST_CHANGE_CURRENT_VIDEO":
        return {
          ...state,
          ver: generateRandomString(5),
          currentVideoId: action.payload
        };

      case "PLAYLIST_CHANGE_VIDEOS":
        return {
          ...state,
          ver: generateRandomString(5),
          videos: [...action.payload]
        };

      case "PLAYLIST_CHANGE_VIDEO":
        return {
          ...state,
          ver: generateRandomString(5),
          videos: state.videos.map( (v, i) => {
            if (v.id === action.payload.id)
              return action.payload
            else
              return v;
          } )
        };

      case "PLAYLIST_CHANGE_VIDEO_PLAYED":
        return {
          ...state,
          ver: generateRandomString(5),
          videos: state.videos.map( (v, i) => {
            if (v.id === action.payload.videoId)
              return {...v, wasPlayed: action.payload.wasPlayed}
            else
              return v;
          } )
        };

      case "PLAYLIST_RESET_VIDEOS_PLAYED":
        return {
          ...state,
          ver: generateRandomString(5),
          videos: state.videos.map( (v, i) => {
              return {...v, wasPlayed: false}
          } )
        };

      case "SERVER_PLAYLIST_RESTORE":
        return action.payload;

      case "CLIENT_PLAYLIST_REFRESH":
        return action.payload;

    default:
      return state;

  }

}

export default playlistReducer;
