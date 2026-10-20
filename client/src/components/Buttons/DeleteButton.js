import { Label, Icon } from "semantic-ui-react";
import { DELETE_POST } from "../../utils/mutations";
import { FETCH_POSTS_QUERY } from "../../utils/queries";
import { useMutation } from "@apollo/client/react";
import "./DeleteButton.css";

const DeleteButton = ({ postId, onDeleted, onError }) => {
  const [deletePost, { loading }] = useMutation(DELETE_POST, {
    variables: { postId },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted() {
      if (onDeleted) {
        onDeleted(postId);
      }
    },
    onError(err) {
      console.error(err);
      if (onError) onError(err);
    },
  });

  const handleDelete = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (loading) return;
    deletePost().catch(() => {
      // Already handled by onError above.
    });
  };

  return (
    <Label
      as="button"
      type="button"
      className="delete-button"
      aria-label="Delete post"
      title="Delete post"
      aria-busy={loading || undefined}
      disabled={loading}
      onClick={handleDelete}
    >
      <Icon
        name={loading ? "spinner" : "trash"}
        loading={loading}
        className="delete-button__icon"
      />
    </Label>
  );
};

export default DeleteButton;
