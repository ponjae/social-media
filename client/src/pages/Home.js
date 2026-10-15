import { useContext } from "react";
import { useQuery } from "@apollo/client/react";
import { FETCH_POSTS_QUERY } from "../utils/queries";
import { GridRow, GridColumn, Grid, Transition } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import "./Home.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);
  const posts = data?.getPosts;

  return (
    <Grid columns={3}>
      <GridRow className="home-page-title">
        <h1>Recent Posts</h1>
      </GridRow>
      {user && (
        <GridColumn>
          <PostForm />
        </GridColumn>
      )}
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>Unable to load posts: {error.message}</p>
      ) : (
        posts && (
          <Transition.Group>
            {posts.map((post) => (
              <GridColumn key={post.id} className="home__post-column">
                <PostCard post={post} />
              </GridColumn>
            ))}
          </Transition.Group>
        )
      )}
    </Grid>
  );
};

export default Home;
