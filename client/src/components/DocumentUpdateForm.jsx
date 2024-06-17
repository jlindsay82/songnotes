import { useState } from "react";
import { useDocumentsContext } from "../hooks/useDocumentsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Message from "./Message";

import { config } from "../constants";

const DocumentUpdateForm = ({document}) => {
  //set state variables
  const [display, setDisplay] = useState(true);
  const [message, setMessage] = useState(null);
  const [title, setTitle] = useState(document.title);

  //set contexts
  const { dispatch:documentsDispatch } = useDocumentsContext();
  const { user } = useAuthContext();

  //set variables
  const URL = config.url;

  const toggleModal = () => {
    setDisplay(!display); // changes previous state to oppposite state
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("You must be logged in!");
      return;
    }

    const documentPayload = { title };

    const response = await fetch(URL + "/api/documents/document/" + document._id, {
      method: "PATCH",
      body: JSON.stringify(documentPayload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      documentsDispatch({ type: "UPDATE_DOCUMENT", payload: json });
      setMessage("Updated successfully!");
      console.log("document updated:", json);
    }

  };

  return (
    <>
    {display &&
        (<form className="modal" onSubmit={handleSubmit}>
          <h4>
            Update Document
            <span className="action-button closebtn" onClick={toggleModal}>
              <p>X</p>
            </span>
          </h4>

          <p>Document Title: </p>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <button>Update Document</button>
          <Message message={message} />
        </form>)}
    </>
  );
};

export default DocumentUpdateForm;
