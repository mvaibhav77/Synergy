import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  // prepareHeaders: (headers) => {
  //   headers.set('Content-Type', 'application/json');
  //   return headers;
  // },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Post"],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (_builder) => ({}),
});
