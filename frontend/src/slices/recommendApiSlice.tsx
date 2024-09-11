import { apiSlice } from "./apiSlice";
const RECOMMEND_URL = "/api/recommendations";

export const recommenApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendations: builder.mutation({
      query: () => ({
        url: `${RECOMMEND_URL}/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetRecommendationsMutation } = recommenApiSlice;
