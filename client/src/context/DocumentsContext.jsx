import { createContext, useReducer } from "react";

export const DocumentsContext = createContext();

//reducer keeps local state in sync using defined action types
export const documentsReducer = (state, action) => {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return {
        documents: action.payload,
      };
    case "CREATE_DOCUMENT":
      return {
        documents: [action.payload, ...(state.documents || [])],
      };
    case "DELETE_DOCUMENT":
      return {
        documents: state.documents.filter(
          (document) => document._id !== action.payload._id
        ),
      };
    case "UPDATE_DOCUMENT":
      return {
        documents: [
          action.payload,
          ...state.documents.filter(
            (document) => document._id !== action.payload._id
          ),
        ],
      };
    default:
      return state;
  }
};

//passes context state to children, in this case currently the <App /> component wrapped in documentsContextProvider in Home.jsx
//reducer function

export const DocumentsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentsReducer, {
    documents: null,
  });

  return (
    <DocumentsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </DocumentsContext.Provider>
  );
};
