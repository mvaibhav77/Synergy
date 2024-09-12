import { apiSlice } from "./apiSlice";
const RECOMMEND_URL = "/api/chat";

export const recommenApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.mutation({
      query: () => ({
        url: `${RECOMMEND_URL}/conversations`,
        method: "GET",
      }),
    }),
    createConversation: builder.mutation({
      query: (data) => ({
        url: `${RECOMMEND_URL}/conversations`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetConversationsMutation, useCreateConversationMutation } =
  recommenApiSlice;
