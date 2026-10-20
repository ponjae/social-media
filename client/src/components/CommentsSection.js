import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import {
  Button,
  Comment,
  Confirm,
  Form,
  Header,
  Icon,
  Label,
  Message,
} from "semantic-ui-react";
import moment from "moment";
import { CREATE_COMMENT, DELETE_COMMENT } from "../utils/mutations";
import "./Buttons/DeleteButton.css";
import "./CommentsSection.css";

const getErrorMessage = (err, fallback) => {
  const first = err?.errors?.[0];
  return first?.extensions?.errors?.body || first?.message || fallback;
};

const CommentForm = ({ postId }) => {
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const submittingRef = useRef(false);
  const fieldId = useId();

  const [createComment, { loading }] = useMutation(CREATE_COMMENT);

  const isBlank = body.trim() === "";

  const submit = async () => {
    if (isBlank || submittingRef.current) return;
    submittingRef.current = true;
    setError(null);
    try {
      await createComment({ variables: { postId, body: body.trim() } });
      // Only clear the draft once the comment is actually saved.
      setBody("");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Couldn't post your comment."));
    } finally {
      submittingRef.current = false;
    }
  };

  const handleKeyDown = (event) => {
    // Cmd/Ctrl + Enter submits, plain Enter adds a new line.
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <Form reply onSubmit={submit} className="comments-section__form">
      <Form.TextArea
        id={fieldId}
        name="body"
        label="Add a comment"
        rows={3}
        placeholder="Write a comment… (Ctrl/⌘ + Enter to send)"
        value={body}
        onChange={(_, { value }) => {
          setBody(value);
          if (error) setError(null);
        }}
        onKeyDown={handleKeyDown}
        readOnly={loading}
        error={
          error
            ? {
                content: `${error} Your comment has been kept so you can try again.`,
                pointing: "above",
              }
            : undefined
        }
      />
      <Button
        type="submit"
        color="teal"
        size="small"
        icon="send"
        labelPosition="left"
        content="Comment"
        loading={loading}
        disabled={isBlank || loading}
      />
    </Form>
  );
};

const DeleteCommentAction = ({ postId, commentId, onError }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deletingRef = useRef(false);

  const [deleteComment, { loading }] = useMutation(DELETE_COMMENT, {
    variables: { postId, commentId },
  });

  const handleConfirm = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    onError(null);
    try {
      await deleteComment();
    } catch (err) {
      console.error(err);
      setConfirmOpen(false);
      onError(getErrorMessage(err, "Couldn't delete this comment."));
      deletingRef.current = false;
    }
  };

  return (
    <>
      {/* Same look as the post's DeleteButton (shared .delete-button styles),
          but wired to DELETE_COMMENT. */}
      <Label
        as="button"
        type="button"
        className="delete-button comments-section__delete"
        aria-label="Delete comment"
        title="Delete comment"
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
        size="tiny"
        onCancel={() => {
          if (!loading) setConfirmOpen(false);
        }}
        onConfirm={handleConfirm}
        content="Are you sure you want to delete this comment?"
        confirmButton={{
          content: "Delete",
          negative: true,
          loading,
          disabled: loading,
        }}
        cancelButton={{ content: "Cancel", disabled: loading }}
      />
    </>
  );
};

const CommentItem = ({ postId, comment, user }) => {
  const { id, username, body, createdAt } = comment;
  const [error, setError] = useState(null);
  const created = moment(createdAt);
  const isAuthor = Boolean(user && user.username === username);

  return (
    <Comment aria-label={`Comment by ${username}`}>
      <Comment.Content>
        <Comment.Author as="span">{username}</Comment.Author>
        <Comment.Metadata>
          <time dateTime={created.toISOString()} title={created.format("LLLL")}>
            {created.fromNow()}
          </time>
        </Comment.Metadata>
        <Comment.Text className="comments-section__text">{body}</Comment.Text>
        {error && (
          <Message
            negative
            size="mini"
            onDismiss={() => setError(null)}
            content={error}
          />
        )}
      </Comment.Content>
      {isAuthor && (
        <DeleteCommentAction
          postId={postId}
          commentId={id}
          onError={setError}
        />
      )}
    </Comment>
  );
};

const CommentsSection = ({ postId, comments, user }) => {
  const list = Array.isArray(comments) ? comments.filter(Boolean) : [];
  const headingId = useId();

  return (
    <Comment.Group
      as="section"
      id="comments"
      className="comments-section"
      aria-labelledby={headingId}
    >
      <Header as="h3" dividing id={headingId}>
        Comments
        <Label circular color="teal" size="small">
          {list.length}
        </Label>
      </Header>

      {user ? (
        <CommentForm postId={postId} />
      ) : (
        <Message info icon className="comments-section__signed-out">
          <Icon name="comments outline" />
          <Message.Content>
            <Message.Header>Join the conversation</Message.Header>
            <p>Log in or sign up to leave a comment.</p>
            <Button as={Link} to="/login" size="small" color="teal">
              Log in
            </Button>
            <Button as={Link} to="/register" size="small" basic>
              Sign up
            </Button>
          </Message.Content>
        </Message>
      )}

      {list.length === 0 ? (
        <Message
          size="small"
          content={`No comments yet.${
            user ? " Be the first to share your thoughts." : ""
          }`}
        />
      ) : (
        list.map((comment) => (
          <CommentItem
            key={comment.id}
            postId={postId}
            comment={comment}
            user={user}
          />
        ))
      )}
    </Comment.Group>
  );
};

export default CommentsSection;
