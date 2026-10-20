import { Label, Icon } from "semantic-ui-react";
import "./CommentButton.css";

const CommentButton = ({ user, post: { comments, id } }) => {
  const commentCount = Array.isArray(comments) ? comments.length : 0;

  return (
    <Label className="comment-button">
      <Icon name="comment" />
      {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
    </Label>
  );
};

export default CommentButton;
