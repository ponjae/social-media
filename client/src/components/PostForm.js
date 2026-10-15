import { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useForm } from "../utils/hooks";
import { useMutation } from "@apollo/client/react";
import { CREATE_POST } from "../utils/mutations";
import { FETCH_POSTS_QUERY } from "../utils/queries";

const PostForm = () => {
  const [errors, setErrors] = useState();
  const {
    formData,
    onChange: onFormChange,
    onSubmit,
    resetForm,
  } = useForm(createPostCallback, { body: "" });

  const onChange = (e) => {
    setErrors(undefined);
    onFormChange(e);
  };

  const [createPost] = useMutation(CREATE_POST, {
    variables: formData,
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted() {
      setErrors(undefined);
      resetForm();
    },
    onError(err) {
      setErrors(err.errors[0]?.extensions?.errors || {});
    },
  });

  // Hoisted function to be used with useForm hook
  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            type="text"
            placeholder="What's on your mind?"
            name="body"
            onChange={onChange}
            value={formData.body}
          />
        </Form.Field>
        <Button type="submit" color="teal">
          Post
        </Button>
      </Form>
      {errors && Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {errors &&
              Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default PostForm;
