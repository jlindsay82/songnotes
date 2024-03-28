import { useState } from "react";
import { useDocumentsContext } from "../hooks/useDocumentsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { config } from "../constants";

const DocumentForm = () => {
  const [display, setDisplay] = useState(false);
  const { dispatch } = useDocumentsContext();
  const { user } = useAuthContext();
  const URL = config.url;
  let song_id = null;
  if (JSON.parse(sessionStorage.getItem("openSong"))) {
    song_id = JSON.parse(sessionStorage.getItem("openSong"))._id;
  }

  const content = "";

  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  const toggleModal = () => {
    setDisplay(!display); // changes previous state to oppposite state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const document = { title, content, song_id };

    const response = await fetch(URL + "/api/documents/user/", {
      method: "POST",
      body: JSON.stringify(document),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setTitle("");
      setError(null);
      console.log("new document added:", json);
      dispatch({ type: "CREATE_DOCUMENT", payload: json }); //update context to see new document in DocumentDetails component
    }
  };

  return (
    <>
      {!display && (
        <button onClick={toggleModal}>
          New Document <strong>+</strong>
        </button>
      )}

      {display && (
        <form className="create modal" onSubmit={handleSubmit}>
          <h4>
            Create a New Document
            <span className="exit-button" onClick={toggleModal}>
              <sup>&nbsp; X</sup>
            </span>
          </h4>

          <p>Document Title: </p>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <button>Create Document</button>
          {error && <div className="error">{error}</div>}
        </form>
      )}
    </>
  );
};

export default DocumentForm;
