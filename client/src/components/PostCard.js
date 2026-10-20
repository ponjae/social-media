import { useContext } from "react";
import { Card, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/auth";
import CommentButton from "./Buttons/CommentButton";
import LikeButton from "./Buttons/LikeButton";
import DeleteButton from "./Buttons/DeleteButton";
import EditButton from "./Buttons/EditButton";
import "./PostCard.css";

const PostCard = ({
  post: { id, body, createdAt, username, avatar, likes, comments },
}) => {
  const { user } = useContext(AuthContext);

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
          <CommentButton
            user={user}
            post={{ comments, id }}
            as={Link}
            to={`/posts/${id}`}
          />
        </div>

        {user && user.username === username && (
          <div className="post-card__owner-actions">
            <EditButton to={`/posts/${id}`} />
            <DeleteButton postId={id} />
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
