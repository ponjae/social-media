import { useState } from "react";
import { Label, Icon, Confirm } from "semantic-ui-react";
import { DELETE_POST } from "../../utils/mutations";
import { FETCH_POSTS_QUERY } from "../../utils/queries";
import { useMutation } from "@apollo/client/react";
import "./DeleteButton.css";

const DeleteButton = ({ postId, onDeleted, onError }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deletePost, { loading }] = useMutation(DELETE_POST, {
    variables: { postId },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted() {
      setConfirmOpen(false);
      onDeleted?.();
    },
    onError(err) {
      console.error(err);
      if (onError) {
        onError(err);
      }
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
    <>
      <Label
        as="button"
        type="button"
        className="delete-button"
        aria-label="Delete post"
        title="Delete post"
        aria-busy={loading || undefined}
        disabled={loading}
        onClick={() => setConfirmOpen(true)}
      >
        <Icon
          name={loading ? "spinner" : "trash"}
          loading={loading}
          className="delete-button__icon"
        />
      </Label>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        content="Are you sure you want to delete this post?"
        confirmButton="Delete"
        cancelButton="Cancel"
      />
    </>
  );
};

export default DeleteButton;
