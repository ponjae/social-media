import { Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { TOGGLE_LIKE } from "../utils/mutations";

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
    <Label style={{ cursor: "pointer" }} onClick={() => toggleLike()}>
      <Icon name="like" color={liked ? "red" : "grey"} />
      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
    </Label>
  ) : (
    <Label style={{ cursor: "pointer" }} as={Link} to={`/login`}>
      <Icon name="like" color="grey" />
      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
    </Label>
  );
};

export default LikeButton;
