import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
//import { useDocumentsContext } from "../hooks/useDocumentsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { EditorContext } from "../context/EditorContext";
import { useContext } from "react";
import { config } from "../constants";

const DocumentEditor = () => {
  const [editorValue, setEditorValue] = useState("");
  //const { dispatch } = useDocumentsContext();
  const { user } = useAuthContext();
  const { documentContent } = useContext(EditorContext);

  //set content initially via useEffect
  useEffect(() => {
    if (user && JSON.parse(sessionStorage.getItem("openDocument"))) {
      setEditorValue(
        JSON.parse(sessionStorage.getItem("openDocument")).content
      );
    }
  }, [documentContent]);

  const URL = config.url;

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
        //dispatch({ type: "UPDATE_DOCUMENT", payload: json }); //update context to see updated documents in DocumentDetails component
      }
    }
  };

  return (
    <>
      <h4>SongSpace</h4>
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
      <p></p>
      <button onClick={handleSave}>Save Document</button>
    </>
  );
};

export default DocumentEditor;
