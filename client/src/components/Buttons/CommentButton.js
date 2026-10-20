import { Label, Icon } from "semantic-ui-react";
import "./CommentButton.css";

const CommentButton = ({ post: { comments }, as, to }) => {
  const commentCount = Array.isArray(comments) ? comments.length : 0;

  return (
    <Label as={as} to={to} className="comment-button">
      <Icon name="comments" />
      {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
    </Label>
  );
};

export default CommentButton;
