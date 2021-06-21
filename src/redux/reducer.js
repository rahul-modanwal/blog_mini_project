function reducer(state = {}, action) {
  switch (action.type) {
    case "AUTH_SUCCESS": {
      const { access } = action.payload;

      const authState = {
        tokenId: access,
      };

      localStorage.setItem("tokenId", authState.tokenId);
      return { ...state, authentication: authState };
    }

    case "AUTH_INITIATE": {
      const authState = { tokenId: localStorage.getItem("tokenId") };

      return { ...state, authentication: authState };
    }

    case "ADD_USER": {
      
      const userId = action.payload[0];
      const userName = action.payload[1];

      return { ...state, userData: {userId:userId, userName:userName }};
    }

    case "LOG_OUT": {
      localStorage.clear();
     
      return { ...state, authentication: { tokenId: null } };
    }

    default: {
      return state;
    }
  }
}

export default reducer;