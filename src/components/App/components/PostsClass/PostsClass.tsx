import { Component } from "react";
import { postsApi } from "../../../../redux/api/slices/posts/postsApi";
import { withRTKQuery } from "@src/redux/utils/withRTKQuery";

interface StateProps {
  id: string;
  posts?: {
    data?: {
      id: string;
      title: string;
      content: string;
      value: string;
    }[];
  };
}

interface PostState {
  posts: StateProps["posts"] | null;
}

@withRTKQuery<StateProps, PostState, "posts">({
  endpoint: postsApi.endpoints.getPosts,
  propertyName: "posts",
})
class PostsClassComponent extends Component<StateProps, PostState> {
  constructor(props: StateProps) {
    super(props);
    this.state = {
      posts: null,
    };
  }
  render(): React.ReactNode {
    if (!this.state.posts) return <div>Loading...</div>;

    return (
      <div>
        {this.state.posts.data?.map((post) => (
          <div key={post.id}>{post.id} | </div>
        ))}
      </div>
    );
  }
}

export const PostsClass = PostsClassComponent;
