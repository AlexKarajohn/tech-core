import { postsApi } from "@src/redux/api/slices/posts/postsApi";
import {
  getObjectHash,
  withRTKQuery,
  GeneratedState,
} from "@src/redux/utils/withRTKQueryDecorator";
import { Component } from "react";

interface ExtraPostsProps {}

type ExtraPostsState = GeneratedState<typeof fetchers>;

const fetchers = [
  {
    endpoint: postsApi.endpoints.getPosts,
    fetchOnMount: true,
    returnDataIdentifier: "posts",
  },
  {
    endpoint: postsApi.endpoints.getPostById,
    fetchOnMount: false,
    returnDataIdentifier: "post",
  },
] as const;

@withRTKQuery<ExtraPostsProps, ExtraPostsState>({
  fetchers,
})
class ExtraPostsComponent extends Component<ExtraPostsProps, ExtraPostsState> {
  constructor(props: ExtraPostsProps) {
    super(props);
  }

  render(): React.ReactNode {
    console.log(this.state);
    return (
      <>
        ------
        <div>{JSON.stringify(this.state?.posts)}</div>
        ======================================
        <button onClick={() => this.fetchPost("1")}>Fetch post1</button>
        <div>{JSON.stringify(this.state?.post?.[getObjectHash("1")])}</div>
        ======================================
        <button onClick={() => this.fetchPost("2")}>Fetch post2</button>
        <div>{JSON.stringify(this.state?.post?.[getObjectHash("2")])}</div>
      </>
    );
  }
}

export const ExtraPosts = ExtraPostsComponent;
