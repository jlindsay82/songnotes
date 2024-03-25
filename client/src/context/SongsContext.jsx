import { createContext, useReducer } from "react";

export const SongsContext = createContext();

//reducer keeps local state in sync using defined action types
export const songsReducer = (state, action) => {
  switch (action.type) {
    case "SET_SONGS":
      return {
        songs: action.payload,
      };
    case "CREATE_SONG":
      return {
        songs: [action.payload, ...state.songs],
      };
    case "DELETE_SONG":
      return {
        songs: state.songs.filter((song) => song._id !== action.payload._id),
      };
    case "UPDATE_SONG":
      return {
        songs: [
          action.payload,
          state.songs.filter((song) => song._id !== action.payload._id),
        ],
      };
    default:
      return state;
  }
};

//passes context state to children, in this case currently the <App /> component wrapped in songsContextProvider in Home.jsx
//reducer function

export const SongsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(songsReducer, {
    songs: null,
  });

  return (
    <SongsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SongsContext.Provider>
  );
};
