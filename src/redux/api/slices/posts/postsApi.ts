import { api } from "../../api";

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  value: number;
}

export const postsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          return {
            data: [
              {
                id: "1",
                title: "title",
                content: "content",
                createdAt: "1",
                updatedAt: "1",
                value: 0,
              },
              {
                id: "2",
                title: "title",
                content: "content",
                createdAt: "1",
                updatedAt: "1",
                value: 0,
              },
            ],
          };
        } catch (error) {
          return { error: error as { message: string } };
        }
      },
    }),
    getPostById: builder.query<Post, string>({
      queryFn: async (id: string) => {
        try {
          return {
            data: {
              id,
              title: "title",
              content: "content",
              createdAt: "1",
              updatedAt: "1",
              value: 0,
            } as Post,
          };
        } catch (error) {
          return { error: error as { message: string } };
        }
      },
      keepUnusedDataFor: 5,
      onCacheEntryAdded: async (
        _,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData }
      ) => {
        await cacheDataLoaded;

        const interval = setInterval(() => {
          updateCachedData((draft) => {
            if (draft) {
              draft.value += 1;
            }
          });
        }, 1000);

        await cacheEntryRemoved;
        clearInterval(interval);
      },
    }),
  }),
});

export const { useGetPostsQuery, useGetPostByIdQuery } = postsApi;
