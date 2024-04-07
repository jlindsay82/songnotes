import { RecordingsContext } from "../context/RecordingsContext";
import { useContext } from "react";

export const useRecordingsContext = () => {
  const context = useContext(RecordingsContext);

  if (!context) {
    throw Error(
      "useRecordingsContext must be used inside a recordingsContextProvider"
    );
  }

  return context;
};
