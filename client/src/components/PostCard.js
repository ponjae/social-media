import { useContext } from "react";
import { Card, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import "./PostCard.css";

const PostCard = ({
  post: { id, body, createdAt, username, avatar, likes, comments },
}) => {
  const { user } = useContext(AuthContext);

  const commentCount = Array.isArray(comments) ? comments.length : 0;

  return (
    <Card fluid>
      <Card.Content as={Link} to={`/posts/${id}`}>
        <Image floated="right" size="mini" src={avatar} />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra className="post-card__footer">
        <div>
          <LikeButton user={user} post={{ id, likes }} />
          <Label className="post-card__clickable" as={Link} to={`/posts/${id}`}>
            <Icon name="comment" />
            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </Label>
        </div>

        {user && user.username === username && (
          <div className="post-card__owner-actions">
            <Label as={Link} to={`/posts/${id}`}>
              <Icon name="edit" />
              Edit
            </Label>
            <Label className="post-card__clickable" title="Delete post">
              <Icon name="trash" className="post-card__trash-icon" />
            </Label>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
