import { Card, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

const PostCard = ({
  post: { id, body, createdAt, username, likes, comments },
}) => {
  const likeCount = Array.isArray(likes) ? likes.length : 0;
  const commentCount = Array.isArray(comments) ? comments.length : 0;

  return (
    <Card fluid>
      <Card.Content as={Link} to={`/posts/${id}`}>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Label style={{ cursor: "pointer" }}>
          <Icon name="like" />
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </Label>
        <Label style={{ cursor: "pointer" }}>
          <Icon name="comment" />
          {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
        </Label>
      </Card.Content>
    </Card>
  );
};

export default PostCard;
