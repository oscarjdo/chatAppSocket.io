import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const friendRequestApi = createApi({
  reducerPath: "friendRequestApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    getFriendRequest: builder.query({
      query: (id) => `/getFriendRequest/${id}`,
      providesTags: ["getFriendRequests"],
    }),
    deleteFriendRequest: builder.mutation({
      query: (body) => ({
        url: `/cancelFriendRequest`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getFriendRequests"],
    }),
    acceptFrienRequest: builder.mutation({
      query: (body) => ({
        url: `/acceptFriendRequest`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getFriendRequests"],
    }),
  }),
});

export const {
  useGetFriendRequestQuery,
  useDeleteFriendRequestMutation,
  useAcceptFrienRequestMutation,
} = friendRequestApi;
