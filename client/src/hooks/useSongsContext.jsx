import { SongsContext } from "../context/SongsContext";
import { useContext } from "react";

export const useSongsContext = () => {
  const context = useContext(SongsContext);

  if (!context) {
    throw Error("usesongsContext must be used inside a songsContextProvider");
  }

  return context;
};
