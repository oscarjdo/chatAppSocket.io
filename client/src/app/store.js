import { configureStore } from "@reduxjs/toolkit";

import { getFriendListApi } from "./queries/getFriendList.js";
import { getMessagesApi } from "./queries/getMessages.js";
import { friendRequestApi } from "./queries/friendRequestApi.js";

import rootReducer from "./rootReducer/rootReducer.js";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(getFriendListApi.middleware)
      .concat(getMessagesApi.middleware)
      .concat(friendRequestApi.middleware),
});
