import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getMessagesApi = createApi({
  reducerPath: "GetMessagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ userId, conversationId }) =>
        `/getFriendData/${userId}&${conversationId}`,
      providesTags: ["getMessages"],
    }),
    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/sendMessage",
        method: "POST",
        body,
        headers: { set: "Content-Type: multipart/form-data" },
      }),
      invalidatesTags: ["getMessages"],
    }),
    addFeaturedMessage: builder.mutation({
      query: (body) => ({
        url: "/addFeaturedMessage",
        method: "POST",
        body,
      }),
      invalidatesTags: ["getMessages"],
    }),
    removeFeaturedMessage: builder.mutation({
      query: (body) => ({
        url: "/removeFeaturedMessage",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getMessages"],
    }),
    deleteMessagesForAll: builder.mutation({
      query: (body) => ({
        url: "/deleteMessagesForAll",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getMessages"],
    }),
    deleteMessagesForMe: builder.mutation({
      query: (body) => ({
        url: "/deleteMessagesForMe",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getMessages"],
    }),
    leaveGroup: builder.mutation({
      query: (body) => ({
        url: "/leaveGroup",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["getMessages"],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useAddFeaturedMessageMutation,
  useRemoveFeaturedMessageMutation,
  useDeleteMessagesForAllMutation,
  useDeleteMessagesForMeMutation,
  useLeaveGroupMutation,
} = getMessagesApi;
