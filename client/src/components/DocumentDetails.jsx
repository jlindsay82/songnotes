import { useContext, useState } from "react";
import { useDocumentsContext } from "../hooks/useDocumentsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { EditorContext } from "../context/EditorContext";
import DocumentUpdateForm from "../components/DocumentUpdateForm";

import { config } from "../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileOpenIcon from "@mui/icons-material/FileOpen";

const DocumentDetails = ({ document }) => {
//set state variables
const [displayDocumentUpdate, setDisplayDocumentUpdate] = useState(false);

// set contexts
  const { dispatch } = useDocumentsContext();
  const { user } = useAuthContext();
  const { dispatch: editorDispatch } = useContext(EditorContext);

  //set variables
  const URL = config.url;

  //set handlers
  const handleSelect = async () => {
    if (!user) {
      return;
    }
    //console.log(`document ${document.title} was selected`);
    const response = await fetch(
      URL + "/api/documents/document/" + document._id,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      console.log("document selected:", json);
      sessionStorage.setItem("openDocument", JSON.stringify(json)); //set selected document as current open document
      editorDispatch({ type: "SET_EDITOR", payload: json });
    }
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      URL + "/api/documents/document/" + document._id,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_DOCUMENT", payload: json });
      console.log("document deleted:", json);
      //if deleted document is the open document, then this should be cleared from local storage
      if (
        JSON.parse(sessionStorage.getItem("openDocument")) &&
        JSON.parse(sessionStorage.getItem("openDocument"))._id === json._id
      ) {
        console.log("deleted doc is same id as openDocument");
        sessionStorage.removeItem("openDocument");
      }
    }
  };

  const handleUpdate = async () => {

      if (!user) {
        return;
      }
      console.log("clicked on update")
      setDisplayDocumentUpdate(!displayDocumentUpdate);

  };

  return (
    <>
    {displayDocumentUpdate && (<DocumentUpdateForm document={document}/>)}
    <div className="explorer-item">
      <h4>{document.title}</h4>
      <span className={`action tooltip`} onClick={handleSelect}>
        <FileOpenIcon />
        <span className="tooltiptext">View document</span>
      </span>
      <span className={`action tooltip`} onClick={handleUpdate}>
        <EditIcon />
        <span className="tooltiptext">Update document</span>
      </span>
      <span className={`action tooltip`} onClick={handleDelete}>
        <DeleteIcon />
        <span className="tooltiptext">Delete document</span>
      </span>
    </div>
    </>
  );
};

export default DocumentDetails;
