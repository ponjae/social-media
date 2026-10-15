import { useContext } from "react";
import { Card, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";

const PostCard = ({
  post: { id, body, createdAt, username, likes, comments },
}) => {
  const { user } = useContext(AuthContext);

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
      <Card.Content
        extra
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5em",
        }}
      >
        <div>
          <LikeButton user={user} post={{ id, likes }} />
          <Label style={{ cursor: "pointer" }} as={Link} to={`/posts/${id}`}>
            <Icon name="comment" />
            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </Label>
        </div>

        {user && user.username === username && (
          <div style={{ marginLeft: "auto" }}>
            <Label as={Link} to={`/posts/${id}`}>
              <Icon name="edit" />
              Edit
            </Label>
            <Label style={{ cursor: "pointer" }} title="Delete post">
              <Icon name="trash" style={{ margin: 0 }} />
            </Label>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
