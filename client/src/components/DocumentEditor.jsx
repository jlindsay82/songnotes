import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { useAuthContext } from "../hooks/useAuthContext";
import { EditorContext } from "../context/EditorContext";
import { useContext } from "react";
import { config } from "../constants";

const DocumentEditor = () => {
  //set state variables
  const [editorValue, setEditorValue] = useState("");

  //set variables
  const { user } = useAuthContext();
  const { documentContent } = useContext(EditorContext);
  let document_title = null;
  const URL = config.url;

  if (user && JSON.parse(sessionStorage.getItem("openDocument"))) {
    document_title = JSON.parse(sessionStorage.getItem("openDocument")).title;
  }

  //set content from EditorContext via useEffect
  useEffect(() => {
    if (user && JSON.parse(sessionStorage.getItem("openDocument"))) {
      setEditorValue(
        JSON.parse(sessionStorage.getItem("openDocument")).content
      );
    }
  }, [documentContent]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (JSON.parse(sessionStorage.getItem("openDocument"))) {
      const { title } = JSON.parse(sessionStorage.getItem("openDocument"));
      const content = editorValue;
      const { _id: song_id } = JSON.parse(sessionStorage.getItem("openSong"));
      const { _id: document_id } = JSON.parse(
        sessionStorage.getItem("openDocument")
      );
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
        console.log("document updated:", json);
      }
    }
  };

  return (
    <div className="editor-container">
      <h4>
        Document Title:{" "}
        <span className="smaller"> {document_title}&nbsp; </span>
        <span className="right-align">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </span>
      </h4>
      <div className="quill-container">
        <ReactQuill
          id="quill-editor"
          value={editorValue}
          onChange={(value) => setEditorValue(value)}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              ["image"],
            ],
          }}
          theme="snow"
        />
      </div>
      <p></p>
    </div>
  );
};

export default DocumentEditor;
