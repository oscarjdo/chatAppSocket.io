import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getMessagesApi = createApi({
  reducerPath: "GetMessagesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ userId, friendId }) => `/getFriendData/${userId}&${friendId}`,
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
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = getMessagesApi;
