import { Component } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppDispatch, RootState, store } from "../../../../redux/redux";
import {
  Post as PostType,
  postsApi,
} from "@src/redux/api/slices/posts/postsApi";
import { Root } from "react-dom/client";

interface StateProps {
  id: string;
}

interface DispatchProps {
  getPost: typeof postsApi.endpoints.getPostById.initiate;
  dispatch: AppDispatch;
}

interface PostState {
  post: PostType | null;
}

interface StateProps {
  id: string;
}

const mapStateToProps = (
  _: RootState,
  ownProps: { id: string }
): StateProps => ({
  id: ownProps.id,
});

const mapDispatchToProps = {
  getPost: postsApi.endpoints.getPostById.initiate,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PostConnectedProps = ConnectedProps<typeof connector>;

class PostComponent extends Component<PostConnectedProps, PostState> {
  private unsubscribe?: () => void;
  private storeListiner?: () => void;
  constructor(props: PostConnectedProps) {
    super(props);
    this.state = {
      post: null,
    };
  }

  async componentDidMount(): Promise<void> {
    this.unsubscribe = this.props.getPost(this.props.id).unsubscribe;
    this.storeListiner = store.subscribe(() => {
      const state = store.getState();
      const data = postsApi.endpoints.getPostById.select(this.props.id)(state);
      this.setState({
        post: data.data ?? null,
      });
    });
  }

  async componentWillUnmount(): Promise<void> {
    this.storeListiner?.();
    this.unsubscribe?.();
  }

  render() {
    if (!this.state.post) {
      return null;
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
        <div>{this.state.post?.id}</div>
        <div>{this.state.post?.title}</div>
        <div>{this.state.post?.content}</div>
        <div>{this.state.post?.value}</div>
      </div>
    );
  }
}

export const Post = connect(mapStateToProps, mapDispatchToProps)(PostComponent);
