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

      case "PLAYLIST_CHANGE_VIDEOS":
        return {
          ...state,
          videos: [...action.payload]
        };

      case "CLIENT_PLAYLIST_REFRESH":
        return action.payload;

    default:
      return state;

  }

}

export default playlistReducer;
