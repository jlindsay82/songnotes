import { useState } from "react";
import { useSongsContext } from "../hooks/useSongsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { config } from "../constants";

const SongForm = () => {
  const [display, setDisplay] = useState(false);
  const { dispatch } = useSongsContext();
  const { user } = useAuthContext();

  const URL = config.url;

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [key, setKey] = useState("");
  const [tempo, setTempo] = useState("");
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

    const song = { title, genre, key, tempo };

    const response = await fetch(URL + "/api/songs", {
      method: "POST",
      body: JSON.stringify(song),
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
      setGenre("");
      setKey("");
      setTempo("");
      setError(null);
      console.log("new song added:", json);
      dispatch({ type: "CREATE_SONG", payload: json }); //update context to see new song in songDetails component
      sessionStorage.setItem("openSong", JSON.stringify(json)); //set new song song to current open song
    }
  };

  return (
    <>
      {!display && (
        <button onClick={toggleModal}>
          New Song <strong>+</strong>
        </button>
      )}
      {display && (
        <form className="modal" onSubmit={handleSubmit}>
          <h4>
            Create a New song
            <span className="action-button" onClick={toggleModal}>
              <sup>&nbsp; X</sup>
            </span>
          </h4>

          <p>Song Title: </p>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <p>Genre:</p>
          <input
            type="text"
            onChange={(e) => setGenre(e.target.value)}
            value={genre}
          />

          <p>Key:</p>
          <input
            type="text"
            onChange={(e) => setKey(e.target.value)}
            value={key}
          />
          <p>Tempo (BPM):</p>
          <input
            type="number"
            onChange={(e) => setTempo(e.target.value)}
            value={tempo}
          />

          <button>Create Song</button>
          {error && <div className="error">{error}</div>}
        </form>
      )}
    </>
  );
};

export default SongForm;
