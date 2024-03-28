import { useState } from "react";
import { config } from "../constants";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const URL = config.url;

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(URL + "/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to session storage
      sessionStorage.setItem("user", JSON.stringify(json));
      console.log("Loggin the login response: " + JSON.stringify(json));
      //update the AuthContext
      dispatch({ type: "LOGIN", payload: json });

      //reset loading status
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
