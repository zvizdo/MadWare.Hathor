let initialState = {
  id: null
}

const serverReducer = function(state=initialState, action){

  switch (action.type) {
    case "SERVER_SERVER_ID":
      return {
        ...state,
        id: action.payload
      };

      case "SERVER_CLEAR":
        return initialState;

    default:
      return state;

  }

}

export default serverReducer;
