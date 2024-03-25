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
  const { _id: song_id } = JSON.parse(localStorage.getItem("openSong")); //get current open song

  //fetch all songs for current user's open song via useEffect
  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch(URL + "/api/documents/user/" + song_id, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        //setDocuments(json);
        console.log(json);
        dispatch({ type: "SET_DOCUMENTS", payload: json }); //dispatch will trigger songsReducer passing in the action type. This updates the state with the payload of json data from the fetch
      }
    };
    if (user) {
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
