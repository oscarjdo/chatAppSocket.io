import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  messageId: undefined,
  messageContent: undefined,
  messageSenderUsername: undefined,
  fileUrl: undefined,
  color: undefined,
  mimetype: undefined,
  duration: undefined,
};

const replyMessageSlice = createSlice({
  name: "replyMessageState",
  initialState,
  reducers: {
    setReplyMessageState: (state, action) => {
      const {
        open,
        id,
        content,
        senderUsername,
        fileUrl,
        color,
        mimetype,
        senderId,
      } = action.payload;

      state.open = open;
      state.messageId = id;
      state.messageContent = content;
      state.messageSenderUsername = senderUsername;
      state.messageSenderId = senderId;
      state.fileUrl = fileUrl;
      state.color = color;
      state.mimetype = mimetype;
    },
    setReplyMssgDuration: (state, action) => {
      state.duration = action.payload.duration;
    },
  },
});

export const { setReplyMessageState, setReplyMssgDuration } =
  replyMessageSlice.actions;

export default replyMessageSlice.reducer;
