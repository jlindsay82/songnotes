import RecordingDetails from "./RecordingDetails";
import { useEffect } from "react";
import { useRecordingsContext } from "../hooks/useRecordingsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { config } from "../constants";

const RecordingExplorer = () => {
  const { recordings, dispatch } = useRecordingsContext(); // destructure to get array and dispatch function from context
  const { user } = useAuthContext(); // get current authorised user
  const URL = config.url; //dynamic URL path for dev and prod environment
  let song_id = null;
  if (JSON.parse(sessionStorage.getItem("openSong"))) {
    song_id = JSON.parse(sessionStorage.getItem("openSong"))._id; //get current open song
  }
  let fetchRecordings = null;
  //fetch all recordings for current user's open song via useEffect
  useEffect(() => {
    fetchRecordings = async () => {
      const response = await fetch(URL + "/api/recordings/user/" + song_id, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        //setDocuments(json);
        console.log(json);
        dispatch({ type: "SET_RECORDINGS", payload: json }); //dispatch will trigger recordingsReducer passing in the action type. This updates the state with the payload of json data from the fetch
      }
    };

    if (user && song_id) {
      fetchRecordings();
    }
  }, [dispatch, user]); // useEffect dependency array of dispatch function and user data

  return (
    <div className="explorer-container">
      <h4 className="flex-container explorer-heading">Recordings</h4>
      <div className="explorer-list">
        {recordings &&
          recordings.map((recording) => (
            <RecordingDetails key={recording._id} recording={recording} />
          ))}
      </div>
    </div>
  );
};

export default RecordingExplorer;
