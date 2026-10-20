import { useContext } from "react";
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
import { useParams } from "react-router-dom";
import LikeButton from "../components/Buttons/LikeButton";
import CommentButton from "../components/Buttons/CommentButton";
import { AuthContext } from "../context/auth";
import availableAvatars from "../utils/avatars";
import "./PostPage.css";

const PostPage = () => {
  const { user } = useContext(AuthContext);
  const { id: postId } = useParams();

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

  const { body, createdAt, username, avatar } = post;
  const created = moment(createdAt);

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

        <p className="post-page__body">{body}</p>

        <Divider className="post-page__divider" />

        <footer className="post-page__actions">
          <LikeButton user={user} post={post} />
          <CommentButton user={user} post={post} />
        </footer>
      </Segment>
    </Container>
  );
};

export default PostPage;
