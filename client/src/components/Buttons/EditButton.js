import { Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./EditButton.css";

const EditButton = ({ to, onClick }) => {
  const handleClick = (event) => {
    event.stopPropagation();
    if (onClick) onClick(event);
  };

  const linkProps = to ? { as: Link, to } : { as: "button", type: "button" };

  return (
    <Label {...linkProps} className="edit-button" onClick={handleClick}>
      <Icon name="edit" />
      Edit
    </Label>
  );
};

export default EditButton;
