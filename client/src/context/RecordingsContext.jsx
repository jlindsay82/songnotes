import { createContext, useReducer } from "react";

export const RecordingsContext = createContext();

//reducer keeps local state in sync using defined action types
export const recordingsReducer = (state, action) => {
  switch (action.type) {
    case "SET_RECORDINGS":
      return {
        recordings: action.payload,
      };
    case "CREATE_RECORDING":
      return {
        recordings: [action.payload, ...state.recordings],
      };
    case "DELETE_RECORDING":
      return {
        recordings: state.recordings.filter(
          (recording) => recording._id !== action.payload._id
        ),
      };
    case "UPDATE_DOCUMENT":
      return {
        recordings: state.recordings.filter(
          (recording) => recording._id === action.payload._id
        ),
      };
    default:
      return state;
  }
};

//passes context state to children, in this case currently the <App /> component wrapped in recordingsContextProvider in Home.jsx
//reducer function

export const RecordingsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recordingsReducer, {
    recordings: null,
  });

  return (
    <RecordingsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RecordingsContext.Provider>
  );
};
