import { configureStore } from "@reduxjs/toolkit";

import chatSlice from "./chatSlice.js";
import infoSlice from "./infoSlice.js";
import userSlice from "./userSlice.js";
import friendSlice from "./friendSlice.js";
import addFriendModeSlice from "./addFriendModeSlice.js";
import notiTabSlice from "./notiTabSlice.js";
import friendsOnlineSlice from "./friendsOnlineSlice.js";
import notificationsSlice from "./notificationsSlice.js";
import userInfoSlice from "./userInfoSlice.js";
import videoAudioSlice from "./videoAudioSlice.js";
import isScrollingSlice from "./isScrollingSlice.js";
import fileOpenSlice from "./fileOpenSlice.js";
import messageSelectSlice from "./messageSelectSlice.js";
import modalSlice from "./modalSlice.js";

import { getFriendListApi } from "./queries/getFriendList.js";
import { getMessagesApi } from "./queries/getMessages.js";
import { friendRequestApi } from "./queries/friendRequestApi.js";

export const store = configureStore({
  reducer: {
    userState: userSlice,
    chatState: chatSlice,
    infoState: infoSlice,
    friendState: friendSlice,
    addFriendModeState: addFriendModeSlice,
    notiTabState: notiTabSlice,
    friendsOnlineState: friendsOnlineSlice,
    notificationsState: notificationsSlice,
    userInfoState: userInfoSlice,
    videoAudioState: videoAudioSlice,
    isScrollingState: isScrollingSlice,
    fileOpenState: fileOpenSlice,
    messageSelectState: messageSelectSlice,
    modalState: modalSlice,
    [getFriendListApi.reducerPath]: getFriendListApi.reducer,
    [getMessagesApi.reducerPath]: getMessagesApi.reducer,
    [friendRequestApi.reducerPath]: friendRequestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(getFriendListApi.middleware)
      .concat(getMessagesApi.middleware)
      .concat(friendRequestApi.middleware),
});
