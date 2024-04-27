import DocumentDetails from "./DocumentDetails";
import { useEffect } from "react";
import { useDocumentsContext } from "../hooks/useDocumentsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { config } from "../constants";
import DocumentForm from "./DocumentForm";

const DocumentExplorer = () => {
  const { documents, dispatch } = useDocumentsContext(); // destructure to get array and dispatch function from context
  const { user } = useAuthContext(); // get current authorised user
  const URL = config.url; //dynamic URL path for dev and prod environment
  let song_id = null;
  if (JSON.parse(sessionStorage.getItem("openSong"))) {
    song_id = JSON.parse(sessionStorage.getItem("openSong"))._id; //get current open song
  }
  let fetchDocuments = null;
  //fetch all documents for current user's open song via useEffect
  useEffect(() => {
    if (user && song_id) {
      fetchDocuments = async () => {
        const response = await fetch(URL + "/api/documents/user/" + song_id, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          console.log(json);
          dispatch({ type: "SET_DOCUMENTS", payload: json }); //dispatch will trigger songsReducer passing in the action type. 
          //This dispatch updates the state with the payload of json data from the fetch
        }
      };
    }
    if (user && song_id) {
      fetchDocuments();
    }
  }, [dispatch, user]); // useEffect dependency array of dispatch function and user data

  return (
    <div className="explorer-container">
      <h4 className="flex-container explorer-heading">
        Documents
        <span className="right-align">
          <DocumentForm />
        </span>
      </h4>
      <div className="explorer-list">
        {documents &&
          documents.map((document) => (
            <DocumentDetails key={document._id} document={document} />
          ))}
      </div>
    </div>
  );
};

export default DocumentExplorer;
