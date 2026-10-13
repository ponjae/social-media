import { useQuery } from "@apollo/client/react";
import { FETCH_POSTS_QUERY } from "../utils/queries";
import { GridRow, GridColumn, Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

const Home = () => {
  const { loading, error, data } = useQuery(FETCH_POSTS_QUERY);
  const posts = data?.getPosts;

  return (
    <Grid columns={3}>
      <GridRow className="home-page-title">
        <h1>Recent Posts</h1>
      </GridRow>
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>Unable to load posts: {error.message}</p>
      ) : (
        posts &&
        posts.map((post) => (
          <GridColumn key={post.id} style={{ marginBottom: "20px" }}>
            <PostCard post={post} />
          </GridColumn>
        ))
      )}
    </Grid>
  );
};

export default Home;
