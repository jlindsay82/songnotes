import { useContext } from "react";
import { useRecordingsContext } from "../hooks/useRecordingsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { config } from "../constants";
import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
import FileOpenIcon from "@mui/icons-material/FileOpen";

const RecordingDetails = ({ recording }) => {
  //set contexts
  const { dispatch } = useRecordingsContext();
  const { user } = useAuthContext();

  //set variables
  const URL = config.url;

  //set handlers
  const handleSelect = async () => {
    if (!user) {
      return;
    }
    //console.log(`recording ${recording.title} was selected`);
    const response = await fetch(
      URL + "/api/recordings/recording/" + recording._id,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      console.log("recording selected:", json);
      sessionStorage.setItem("openRecording", JSON.stringify(json)); //set selected recording as current open recording
    }
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      URL + "/api/recordings/recording/" + recording._id,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_RECORDING", payload: json });
      console.log("recording deleted:", json);
      //if deleted recording is the open recording, then this should be cleared from local storage
      if (
        JSON.parse(sessionStorage.getItem("openRecording")) &&
        JSON.parse(sessionStorage.getItem("openRecording"))._id === json._id
      ) {
        //console.log("deleted recording is same id as openRecording");
        sessionStorage.removeItem("openRecording");
      }
    }
  };

  // const handleUpdate = async () => {
  //   if (!user) {
  //     return;
  //   }

  //   const response = await fetch(
  //     URL + "/api/recordings/recording/" + recording._id,
  //     {
  //       method: "PATCH",
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     }
  //   );
  //   const json = await response.json();

  //   if (response.ok) {
  //     dispatch({ type: "UPDATE_DOCUMENT", payload: json });
  //     console.log("recording updated:", json);
  //   }
  // };

  return (
    <div className="explorer-item">
      <h4>{recording.title}</h4>
      <span className={`action tooltip`} onClick={handleSelect}>
        <FileOpenIcon />
        <span className="tooltiptext">View recording</span>
      </span>
      <span className={`action tooltip`} onClick={handleDelete}>
        <DeleteIcon />
        <span className="tooltiptext">Delete recording</span>
      </span>
    </div>
  );
};

export default RecordingDetails;
