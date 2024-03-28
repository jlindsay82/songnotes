import { useSongsContext } from "../hooks/useSongsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocumentsContext } from "../hooks/useDocumentsContext";
import { config } from "../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileOpenIcon from "@mui/icons-material/FileOpen";

const SongDetails = ({ song }) => {
  const { dispatch: songsDispatch } = useSongsContext();
  const { dispatch: documentsDispatch } = useDocumentsContext();
  const { user } = useAuthContext();

  const URL = config.url;

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
      console.log("song selected:", json);
      sessionStorage.setItem("openSong", JSON.stringify(json)); //set selected song as current open song

      const fetchDocument = async () => {
        const response = await fetch(URL + "/api/documents/user/" + song._id, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const documentsJson = await response.json();

        if (response.ok) {
          console.log(documentsJson);
          documentsDispatch({ type: "SET_DOCUMENTS", payload: documentsJson }); //dispatch will trigger songsReducer passing in the action type. This updates the state with the payload of json data from the fetch
        }
      };
      if (user) {
        fetchDocument();
      }
    }
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

  const handleUpdate = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(URL + "/api/songs/" + song._id, {
      method: "PATCH",
      body: JSON.stringify(song),
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
    <div className="explorer-item">
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
      <span className={`action tooltip`} onClick={handleDelete}>
        <DeleteIcon />
        <span className="tooltiptext">Delete Song</span>
      </span>
      <span className={`action tooltip`} onClick={handleUpdate}>
        <EditIcon />
        <span className="tooltiptext">Update Song</span>
      </span>
    </div>
  );
};

export default SongDetails;
