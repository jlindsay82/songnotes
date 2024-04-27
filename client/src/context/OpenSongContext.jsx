import { createContext, useReducer } from "react";

export const OpenSongContext = createContext();

//reducer keeps local state in sync using defined action types
export const openSongReducer = (state, action) => {
  console.log(action.payload);
  switch (action.type) {
    case "SET_OPEN_SONG":
      return {
        openSong: action.payload,
      };
    default:
      return state;
  }
};

//passes context state to children, in this case currently wrapped in SongSpaceContextProvider in Home.jsx
//reducer function

export const OpenSongContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(openSongReducer, {
    openSong: null,
  });

  return (
    <OpenSongContext.Provider value={{ ...state, dispatch }}>
      {children}
    </OpenSongContext.Provider>
  );
};
