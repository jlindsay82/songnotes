import { useState, useEffect } from "react";
import SongDetails from "../components/SongDetails";
import { useSongsContext } from "../hooks/useSongsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { config } from "../constants";
import SongForm from "./SongForm";

const SongExplorer = () => {
  const { songs, dispatch } = useSongsContext();
  const { user } = useAuthContext();
  const URL = config.url;

  //fetch all songs via useEffect
  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch(URL + "/api/songs", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_SONGS", payload: json });
        //dispatch will trigger songsReducer passing in the action type. This updates the state with the payload of json data from the fetch
      }
    };
    if (user) {
      fetchSongs();
    }
  }, [dispatch, user]);

  return (
    <div className="explorer-container">
      <h4 className="flex-container explorer-heading">
        Song Explorer
        <span className="right-align">
          <SongForm />
        </span>
      </h4>
      <div className="explorer-list">
        {songs &&
          songs.map((song) => <SongDetails key={song._id} song={song} />)}
      </div>
    </div>
  );
};

export default SongExplorer;
