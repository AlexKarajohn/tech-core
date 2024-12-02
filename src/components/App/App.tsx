import { FC, useState } from "react";
import { PostsClass } from "./components/PostsClass/PostsClass";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@src/redux/redux";
import { Post } from "./components/Post/Post";
import { PostWithDecorator } from "./components/PostWithDecorator/PostWithDecorator";
import { ExtraPosts } from "./components/ExtraPosts/ExtraPosts";

export const App: FC = () => {
  const [showPosts, setShowPosts] = useState(false);
  return (
    <Provider store={store}>
      <div>
        <button onClick={() => setShowPosts((prev) => !prev)}>
          Show Posts
        </button>

        {showPosts ? <ExtraPosts /> : null}
      </div>

      {/* <Cache /> */}
    </Provider>
  );
};

const Cache = () => {
  const queriesCache = useSelector((state: RootState) => state.api.queries);
  return <div>{JSON.stringify(queriesCache)}</div>;
};
