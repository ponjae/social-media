import { Label, Icon } from "semantic-ui-react";
import { DELETE_POST } from "../../utils/mutations";
import { FETCH_POSTS_QUERY } from "../../utils/queries";
import { useMutation } from "@apollo/client/react";
import "./DeleteButton.css";

const DeleteButton = ({ postId }) => {
  const [deletePost] = useMutation(DELETE_POST, {
    variables: { postId },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted() {
      console.log(`Post with ID: ${postId} deleted`);
    },
    onError(err) {
      console.error(err);
    },
  });

  const handleDelete = () => {
    deletePost();
  };

  return (
    <Label
      className="delete-button post-card__clickable"
      onClick={handleDelete}
    >
      <Icon name="trash" className="post-card__trash-icon" />
    </Label>
  );
};

export default DeleteButton;
