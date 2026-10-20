import { useId, useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Button, Form, Message } from "semantic-ui-react";
import { UPDATE_POST } from "../utils/mutations";
import "./PostEditForm.css";

const getErrorMessage = (err) => {
  const first = err?.errors?.[0];
  return (
    first?.extensions?.errors?.body ||
    first?.message ||
    err?.message ||
    "Couldn't save your changes."
  );
};

/**
 * Inline editor for a post body. Mount it with `key={post.id}` so a draft
 * can never carry over from one post to another.
 */
const PostEditForm = ({ postId, body, onCancel, onSaved }) => {
  const [draft, setDraft] = useState(body);
  const [error, setError] = useState(null);
  const savingRef = useRef(false);
  const fieldId = useId();
  const hintId = useId();

  // The normalized Post (id + body) is merged into the Apollo cache, so the
  // detail page and any cached feed entry update without a refetch.
  const [updatePost, { loading }] = useMutation(UPDATE_POST);

  const trimmed = draft.trim();
  const isBlank = trimmed === "";
  const isUnchanged = trimmed === body.trim();
  const canSave = !isBlank && !isUnchanged && !loading;

  const save = async () => {
    if (!canSave || savingRef.current) return;
    savingRef.current = true;
    setError(null);
    try {
      await updatePost({ variables: { postId, body: trimmed } });
      onSaved?.();
    } catch (err) {
      console.error(err);
      // Keep the draft and stay in edit mode so nothing is lost.
      setError(getErrorMessage(err));
    } finally {
      savingRef.current = false;
    }
  };

  const cancel = () => {
    if (loading) return;
    onCancel?.();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      save();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  let hint = "Ctrl/⌘ + Enter to save, Esc to cancel.";
  if (isBlank) hint = "Your post can't be empty.";
  else if (isUnchanged) hint = "Make a change to save.";

  return (
    <Form
      onSubmit={save}
      error={Boolean(error)}
      className="post-edit-form"
      aria-busy={loading || undefined}
    >
      <Form.TextArea
        id={fieldId}
        name="body"
        label="Edit your post"
        rows={5}
        value={draft}
        autoFocus
        readOnly={loading}
        aria-describedby={hintId}
        onChange={(_, { value }) => {
          setDraft(value);
          if (error) setError(null);
        }}
        onKeyDown={handleKeyDown}
      />

      {error && (
        <Message
          error
          size="small"
          role="alert"
          header="Changes not saved"
          content={`${error} Your edits are still here so you can try again.`}
        />
      )}

      <div className="post-edit-form__footer">
        <span
          id={hintId}
          className={`post-edit-form__hint${
            isBlank ? " post-edit-form__hint--warn" : ""
          }`}
          aria-live="polite"
        >
          {hint}
        </span>
        <div className="post-edit-form__buttons">
          <Button
            type="button"
            basic
            size="small"
            content="Cancel"
            disabled={loading}
            onClick={cancel}
          />
          <Button
            type="submit"
            color="teal"
            size="small"
            icon="check"
            labelPosition="left"
            content="Save changes"
            loading={loading}
            disabled={!canSave}
          />
        </div>
      </div>
    </Form>
  );
};

export default PostEditForm;
