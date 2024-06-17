import { useState, useEffect, useContext } from "react";
import { useDocumentsContext } from "../hooks/useDocumentsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { OpenSongContext } from "../context/OpenSongContext";
import { config } from "../constants";
import Message from "./Message";

const DocumentForm = () => {
  //ste state
  const [display, setDisplay] = useState(false);
  const [song_id, setSongId] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  //set contexts
  const { dispatch } = useDocumentsContext();
  const { user } = useAuthContext();
  const { openSong } = useContext(OpenSongContext);

  //set variables
  const URL = config.url;

  useEffect(() => {
    //console.log(openSong);
    if (openSong) {
      setSongId(openSong._id);
      setError(null);
      setMessage(null);
      //console.log(song_id);
    }
  }, [openSong]);

  const content = "";

  const toggleModal = () => {
    setMessage(null);
    setDisplay(!display); // changes previous state to oppposite state
    if (!song_id) {
      setError("You must select a Song project before creating a new document");
      if (song_id) {
        setError(null);

      }

      return;
    }
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
      setMessage("Document created successfully!")
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
          <h5>
            Create a New Document
            <span className="action-button closebtn" onClick={toggleModal}>
              <p>X</p>
            </span>
          </h5>

          <p>Document Title: </p>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <button disabled={!song_id}>Create Document</button>
          <Message message={message} />
          {error && <div className="error">{error}</div>}
        </form>
      )}
    </>
  );
};

export default DocumentForm;
