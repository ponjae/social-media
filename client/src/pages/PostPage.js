import { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import moment from "moment";
import { FETCH_POST_QUERY } from "../utils/queries";
import {
  Container,
  Dimmer,
  Divider,
  Header,
  Image,
  Loader,
  Message,
  Segment,
} from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";
import LikeButton from "../components/Buttons/LikeButton";
import EditButton from "../components/Buttons/EditButton";
import DeleteButton from "../components/Buttons/DeleteButton";
import CommentsSection from "../components/CommentsSection";
import PostEditForm from "../components/PostEditForm";
import { AuthContext } from "../context/auth";
import availableAvatars from "../utils/avatars";
import "./PostPage.css";

const PostPage = () => {
  const { user } = useContext(AuthContext);
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState(null);

  const [editingPostId, setEditingPostId] = useState(null);
  const ownerActionsRef = useRef(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (editingPostId === null && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      ownerActionsRef.current?.querySelector(".edit-button")?.focus();
    }
  }, [editingPostId]);

  const {
    data: { getPost: post } = {},
    loading,
    error,
  } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  if (error) {
    return (
      <Container text className="post-page">
        <Message negative>
          <Message.Header>Unable to load post</Message.Header>
          <p>{error.message}</p>
        </Message>
      </Container>
    );
  }

  if (loading || !post) {
    return (
      <Container text className="post-page">
        <Segment className="post-page__loading">
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        </Segment>
      </Container>
    );
  }

  const { body, createdAt, username, avatar, comments } = post;
  const created = moment(createdAt);
  const isOwner = Boolean(user && user.username === username);
  const isEditing = isOwner && editingPostId === post.id;

  if (editingPostId && !isEditing) {
    setEditingPostId(null);
  }

  const startEditing = () => {
    setDeleteError(null);
    setEditingPostId(post.id);
  };

  const stopEditing = () => {
    restoreFocusRef.current = true;
    setEditingPostId(null);
  };

  const handleDeleted = () => {
    navigate("/", { replace: true });
  };

  return (
    <Container text className="post-page">
      <Segment raised className="post-page__card">
        <header className="post-page__author">
          <Image
            src={avatar || availableAvatars[0]}
            alt={`${username}'s avatar`}
            avatar
            className="post-page__avatar"
          />
          <Header as="h2" className="post-page__author-text">
            {username}
            <Header.Subheader>
              <time
                dateTime={created.toISOString()}
                title={created.format("LLLL")}
              >
                {created.fromNow()}
              </time>
            </Header.Subheader>
          </Header>
        </header>

        {isEditing ? (
          <PostEditForm
            key={post.id}
            postId={post.id}
            body={body}
            onCancel={stopEditing}
            onSaved={stopEditing}
          />
        ) : (
          <p className="post-page__body">{body}</p>
        )}

        <Divider className="post-page__divider" />

        {deleteError && (
          <Message
            negative
            size="small"
            className="post-page__delete-error"
            onDismiss={() => setDeleteError(null)}
          >
            Couldn't delete this post. Please try again.
          </Message>
        )}

        <footer className="post-page__actions">
          <div className="post-page__reactions">
            <LikeButton user={user} post={post} />
          </div>

          {isOwner && !isEditing && (
            <div className="post-page__owner-actions" ref={ownerActionsRef}>
              <EditButton onClick={startEditing} />
              <DeleteButton
                postId={post.id}
                onDeleted={handleDeleted}
                onError={setDeleteError}
              />
            </div>
          )}
        </footer>
      </Segment>
      <CommentsSection postId={post.id} comments={comments} user={user} />
    </Container>
  );
};

export default PostPage;
