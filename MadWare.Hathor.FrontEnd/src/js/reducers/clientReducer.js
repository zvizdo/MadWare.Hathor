let initialState = {
  id: null,
  serverId: null,
  serverExists: false
}

const clientReducer = function(state=initialState, action){

  switch (action.type) {
    case "CLIENT_CLIENT_ID":
      return {
        ...state,
        id: action.payload
      };

    case "CLIENT_SERVER_ID":
      return {
        ...state,
        serverId: action.payload
      };

    case "CLIENT_SERVER_ID":
      return {
        ...state,
        serverId: action.payload
      };

    case "CLIENT_REGISTER_WITH_SERVER":
      return {
        ...state,
        serverExists: action.payload
      };

    case "CLIENT_CLEAR":
      return initialState;

    default:
      return state;

  }

}

export default clientReducer;
