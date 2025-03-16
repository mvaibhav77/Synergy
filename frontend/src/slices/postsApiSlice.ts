// import { apiSlice } from "./apiSlice";

// export const postApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     createPost: builder.mutation({
//       query: (data) => ({
//         url: "/api/posts/create",
//         method: "POST",
//         body: data,
//       }),
//     }),
//   }),
// });

// export const {  useCreatePostMutation } = postApiSlice;

import { apiSlice } from "./apiSlice"

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Existing mutation for creating a post
    createPost: builder.mutation({
      query: (data) => ({
        url: "/api/posts/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"], // Invalidate the "Post" tag after creating a post
    }),

    // New query for fetching all posts
    getAllPosts: builder.query({
      query: () => "/api/posts/all", // Endpoint to fetch all posts
      providesTags: ["Post"], // Cache tag for invalidation
    }),
  }),
})

// Export the auto-generated hooks
export const { useCreatePostMutation, useGetAllPostsQuery } = postApiSlice