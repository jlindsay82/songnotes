import { createContext, useReducer } from "react";

export const EditorContext = createContext();

//reducer keeps local state in sync using defined action types
export const editorReducer = (state, action) => {
  console.log(action.payload);
  switch (action.type) {
    case "SET_EDITOR":
      return {
        document: action.payload,
      };
    default:
      return state;
  }
};

//passes context state to children, in this case currently wrapped in editorContextProvider in Home.jsx
//reducer function

export const EditorContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, {
    document: null,
  });

  return (
    <EditorContext.Provider value={{ ...state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};
