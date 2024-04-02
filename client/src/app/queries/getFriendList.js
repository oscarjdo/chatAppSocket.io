import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getFriendListApi = createApi({
  reducerPath: "ChatApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    getFriendList: builder.query({
      query: (url) => url,
      providesTags: ["getFriends"],
    }),
    sendFriendRequest: builder.mutation({
      query: (body) => ({
        url: "/sendFriendRequest",
        method: "POST",
        body,
      }),
      invalidatesTags: ["getFriends"],
    }),
    cancelFriendRequest: builder.mutation({
      query: (body) => ({
        url: "/cancelFriendRequest",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getFriends"],
    }),
    deleteOfFriendList: builder.mutation({
      query: (body) => ({
        url: "/deleteOfFriendList",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getFriends"],
    }),

    getOutOfChat: builder.mutation({
      query: (body) => ({
        url: "/getOutOfChat",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getFriends"],
    }),
  }),
});

export const {
  useGetFriendListQuery,
  useSendFriendRequestMutation,
  useCancelFriendRequestMutation,
  useDeleteOfFriendListMutation,
  useGetOutOfChatMutation,
} = getFriendListApi;
