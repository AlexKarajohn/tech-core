import { Component, ReactNode } from "react";
import { postsApi } from "@src/redux/api/slices/posts/postsApi";
import { withRTKQuery } from "@src/redux/utils/withRTKQuery";

interface StateProps {
  id: string;
  post?: {
    data?: {
      id: string;
      title: string;
      content: string;
      value: string;
    };
  };
}

interface PostState {
  id: string;
  post: StateProps["post"] | null;
}

@withRTKQuery<StateProps, PostState, "post">({
  endpoint: postsApi.endpoints.getPostById,
  getQueryParams: (props) => props.id,
  mountOnFetch: false,
  propertyName: "post",
})
class PostComponent extends Component<StateProps, PostState> {
  constructor(props: StateProps) {
    super(props);
    this.state = {
      id: props.id,
      post: null,
    };
  }

  render(): ReactNode {
    if (!this.state.post?.data) {
      return <div onClick={() => this.onRequestFetch?.("1")}>FETCH</div>;
    }
    return (
      <div
        style={{
          border: "1px solid black",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <div>{this.state.post?.data?.id}</div>
        <div>{this.state.post?.data?.title}</div>
        <div>{this.state.post?.data?.content}</div>
        <div>{this.state.post?.data?.value}</div>
      </div>
    );
  }
}

export const PostWithDecorator = PostComponent;
