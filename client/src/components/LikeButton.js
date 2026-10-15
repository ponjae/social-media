import { Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { TOGGLE_LIKE } from "../utils/mutations";
import "./LikeButton.css";

const LikeButton = ({ user, post: { likes, id } }) => {
  const [toggleLike] = useMutation(TOGGLE_LIKE, {
    variables: { postId: id },
  });

  const postLikes = Array.isArray(likes) ? likes : [];
  const liked = Boolean(
    user && postLikes.some(({ username }) => username === user.username),
  );
  const likeCount = postLikes.length;

  return user ? (
    <Label className="like-button" onClick={() => toggleLike()}>
      <Icon name="like" color={liked ? "red" : "grey"} />
      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
    </Label>
  ) : (
    <Label className="like-button" as={Link} to={`/login`}>
      <Icon name="like" color="grey" />
      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
    </Label>
  );
};

export default LikeButton;
