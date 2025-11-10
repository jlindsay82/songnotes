import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { useAuthContext } from "../hooks/useAuthContext";
import { EditorContext } from "../context/EditorContext";
import { useContext } from "react";
import { config } from "../constants";
import Message from "./Message";

const DocumentEditor = () => {
  //set state variables
  const [editorValue, setEditorValue] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [unsaved, setUnsaved] = useState(false);

  //context
  const { dispatch: editorDispatch } = useContext(EditorContext);
  const { user } = useAuthContext();
  const { document } = useContext(EditorContext);
  const URL = config.url;

  // Get document data from EditorContext
  const document_title = document?.title || null;
  const document_id = document?._id || null;
  const song_id = document?.song_id || null;

  //establish when a document has been loaded for the first time
  const isInitialLoad = useRef(false);

  //set content from EditorContext via useEffect
  useEffect(() => {
    if (user && document) {
      setEditorValue(document.content);
      isInitialLoad.current = true;
      setUnsaved(false);
    } else {
      setEditorValue("");
    }
  }, [document]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!document_title || !document_id || !song_id) {
      setError("You must select a document before you save the content!");
      return;
    }

    setError(null);
    setMessage(null);
    const title = document_title;
    const content = editorValue;
    const document = { title, content, song_id };

    const response = await fetch(
      URL + "/api/documents/document/" + document_id,
      {
        method: "PATCH",
        body: JSON.stringify(document),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      //console.log("document updated:", json);
      editorDispatch({ type: "SET_EDITOR", payload: json }); // json is the saved document from backend
      setUnsaved(false);
      setMessage("Document saved successfully!");
    }
  };

  const handleChange = (value) => {
    setEditorValue(value);
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    setUnsaved(true);
  };

  return (
    <div className="editor-container">
      <h4>
        {document_title}&nbsp;
        <p></p>
        <button
          disabled={!unsaved}
          className={unsaved ? "save-button" : "disabled-button"}
          onClick={handleSave}
        >
          Save
        </button>
        <span className="smaller">
          <Message message={message} />
        </span>
      </h4>

      {error && <div className="error">{error}</div>}
      {/* <div className="quill-container"> */}
      <ReactQuill
        id="quill-editor"
        value={editorValue}
        onChange={handleChange}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image"],
          ],
        }}
        theme="snow"
      />
      {/* </div> */}
      <p></p>
    </div>
  );
};

export default DocumentEditor;
