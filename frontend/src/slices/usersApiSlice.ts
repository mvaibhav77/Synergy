import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getUser: builder.query({
      query: (username) => ({
        url: `${USERS_URL}/${username}`,
      }),
    }),
    getAllUsers: builder.mutation({
      query: (keyword) => ({
        url: `${USERS_URL}?search=${keyword}`,
        method: "GET",
      }),
    }),
    getUserById: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
      }),
    }),
    getCurrentUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    sendRequest: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/connect`,
        method: "POST",
        body: JSON.stringify({}),
      }),
    }),
    approveRequest: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/approve`,
        method: "POST",
        body: JSON.stringify({}),
      }),
    }),
    rejectRequest: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/reject`,
        method: "POST",
        body: JSON.stringify({}),
      }),
    }),
    disconnectUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/disconnect`,
        method: "POST",
        body: JSON.stringify({}),
      }),
    }),
    confluenceConnections: builder.mutation({
      query: (username) => ({
        url: `${USERS_URL}/confluence/${username}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUserQuery,
  useGetAllUsersMutation,
  useGetUserByIdMutation,
  useGetCurrentUserMutation,
  useUpdateUserMutation,
  useSendRequestMutation,
  useApproveRequestMutation,
  useRejectRequestMutation,
  useDisconnectUserMutation,
  useConfluenceConnectionsMutation,
} = userApiSlice;
