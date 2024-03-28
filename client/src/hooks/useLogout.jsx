import { useAuthContext } from "./useAuthContext";
import { useSongsContext } from "./useSongsContext";
import { useDocumentsContext } from "./useDocumentsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: songsDispatch } = useSongsContext();
  const { dispatch: documentsDispatch } = useDocumentsContext();

  const logout = () => {
    // remove user from storage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("openSong");
    sessionStorage.removeItem("openDocument");

    // dispatch logout action

    dispatch({ type: "LOGOUT" });
    songsDispatch({ type: "SET_SONGS", payload: null });
    documentsDispatch({ type: "SET_DOCUMENTS", payload: null });
  };
  return { logout };
};
