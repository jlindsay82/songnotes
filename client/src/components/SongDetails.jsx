import { useState, useContext, useEffect } from "react";
import { useSongsContext } from "../hooks/useSongsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocumentsContext } from "../hooks/useDocumentsContext";
import { useRecordingsContext } from "../hooks/useRecordingsContext";
import { OpenSongContext } from "../context/OpenSongContext";
import SongUpdateForm from "../components/SongUpdateForm";

import { config } from "../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileOpenIcon from "@mui/icons-material/FileOpen";

const SongDetails = ({ song, selected }) => {
  //set state variables
  const [displaySongUpdate, setDisplaySongUpdate] = useState(false);

  // set contexts
  const { dispatch: songsDispatch } = useSongsContext();
  const { dispatch: documentsDispatch } = useDocumentsContext();
  const { user } = useAuthContext();
  const { dispatch: recordingsDispatch } = useRecordingsContext();
  const { openSong, dispatch: openSongDispatch } = useContext(OpenSongContext);

  //set variables
  const URL = config.url;
  //console.log("SongDetails selected status of songId " + song._id + " is " + selected);

  //handler functions
  const handleSelect = async () => {
    if (!user) {
      return;
    }
  
    const response = await fetch(URL + "/api/songs/" + song._id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      //console.log("song selected:", json);
      sessionStorage.setItem("openSong", JSON.stringify(json)); //set selected song as current open song

      openSongDispatch({ type: "SET_OPEN_SONG", payload: json });
      if(openSong){
        //console.log("openSong: " + openSong.title);
      }

      const fetchDocuments = async () => {
        const response = await fetch(URL + "/api/documents/user/" + song._id, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const documentsJson = await response.json();

        if (response.ok) {
          //console.log(documentsJson);
          documentsDispatch({ type: "SET_DOCUMENTS", payload: documentsJson }); //dispatch will trigger songsReducer passing in the action type. This updates the state with the payload of json data from the fetch
        }
      };
      const fetchRecordings = async () => {
        const response = await fetch(URL + "/api/recordings/user/" + song._id, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const recordingsJson = await response.json();

        if (response.ok) {
          //console.log(recordingsJson);
          recordingsDispatch({
            type: "SET_RECORDINGS",
            payload: recordingsJson,
          }); //dispatch will trigger songsReducer passing in the action type. This updates the state with the payload of json data from the fetch
        }
      };
      if (user) {
        fetchDocuments();
        fetchRecordings();
      }
    }
  };

  const handleUpdate = async () => {
    if (!user) {
      return;
    }
    setDisplaySongUpdate(!displaySongUpdate);
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(URL + "/api/songs/" + song._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      songsDispatch({ type: "DELETE_SONG", payload: json });
      console.log("song deleted:", json);
    }
  };

  return (
    <>
    {displaySongUpdate && <SongUpdateForm song={song}/>}
    <div className={`explorer-item ${selected && "selected"}`}>
      <h4>{song.title}</h4>
      <p>
        <strong>Genre: </strong>
        {song.genre}
      </p>
      <p>
        <strong>Key: </strong>
        {song.key}
      </p>
      <p>
        <strong>Tempo (BPM): </strong>
        {song.tempo}
      </p>
      <span className={`action tooltip`} onClick={handleSelect}>
        <FileOpenIcon />
        <span className="tooltiptext">View Song</span>
      </span>
      <span className={`action tooltip`} onClick={handleUpdate}>
        <EditIcon />
        <span className="tooltiptext">Update Song</span>
      </span>
      <span className={`action tooltip`} onClick={handleDelete}>
        <DeleteIcon />
        <span className="tooltiptext">Delete Song</span>
      </span>
    </div>
    </>
  );
};

export default SongDetails;
