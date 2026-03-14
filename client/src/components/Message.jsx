import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles/message.css";

const Message = ({ message }) => {
  const [classNames, setClassNames] = useState("message");
  const [customMessage, setCustomMessage] = useState(null);

  useEffect(() => {
    setCustomMessage(message);
    setClassNames("message show");

    setTimeout(() => {
      setClassNames("message");
    }, 3000);
  }, [message]);

  return (
    <div className={classNames}>
      <p>{customMessage}</p>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.string,
};

export default Message;
