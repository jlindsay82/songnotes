import { useState, useContext, useEffect } from "react";
import { useSongsContext } from "../hooks/useSongsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import { config } from "../constants";

const SongUpdateForm = ({song}) => {
  //set state variables
  const [display, setDisplay] = useState(true);

  //set contexts
  const { dispatch:songsDispatch } = useSongsContext();
  const { user } = useAuthContext();

  //set variables
  const URL = config.url;

  const [title, setTitle] = useState(song.title);
  const [genre, setGenre] = useState(song.genre);
  const [key, setKey] = useState(song.key);
  const [tempo, setTempo] = useState(song.tempo);
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

    const songPayload = { title, genre, key, tempo };

    const response = await fetch(URL + "/api/songs/" + song._id, {
      method: "PATCH",
      body: JSON.stringify(songPayload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      songsDispatch({ type: "UPDATE_SONG", payload: json });
      console.log("song updated:", json);
    }
  };

  return (
    <>
    {display &&
        (<form className="modal" onSubmit={handleSubmit}>
          <h4>
            Update song
            <span className="action-button closebtn" onClick={toggleModal}>
              <p>X</p>
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

          <button>Update Song</button>
          {error && <div className="error">{error}</div>}
        </form>)}
    </>
  );
};

export default SongUpdateForm;
