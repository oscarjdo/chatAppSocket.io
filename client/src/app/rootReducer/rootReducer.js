import { combineReducers } from "@reduxjs/toolkit";

import { optionsReducer } from "../optionsSlice";
import chatSlice from "../chatSlice.js";
import infoSlice from "../infoSlice.js";
import userSlice from "../userSlice.js";
import friendSlice from "../friendSlice.js";
import addFriendModeSlice from "../addFriendModeSlice.js";
import notiTabSlice from "../notiTabSlice.js";
import friendsOnlineSlice from "../friendsOnlineSlice.js";
import notificationsSlice from "../notificationsSlice.js";
import filePreviewSlice from "../filePreviewSlice.js";
import isScrollingSlice from "../isScrollingSlice.js";
import fileOpenSlice from "../fileOpenSlice.js";
import messageSelectSlice from "../messageSelectSlice.js";
import modalSlice from "../modalSlice.js";
import groupMemberMenuSlice from "../groupMemberMenuSlice.js";
import editGroupDataSlice from "../editGroupDataSlice.js";
import replyMessageSlice from "../replyMessageSlice.js";
import sideMenusSlice from "../sideMenusSlice.js";
import friendListSlice from "../friendListSlice.js";
import forwardMssgMenuSlice from "../forwardMssgMenuSlice.js";
import chatSearchBarSlice from "../chatSearchBarSlice.js";
import scrollToSlice from "../scrollToSlice.js";
import filesMenuSlice from "../filesMenuSlice.js";
import cameraSlice from "../cameraSlice.js";
import notiSlice from "../notiSlice.js";
import imageSelectorSlice from "../imageSelectorSlice.js";
import avatarMenuSlice from "../avatarMenuSlice.js";
import allLoadsSlice from "../allLoadsSlice.js";

import { getFriendListApi } from "../queries/getFriendList.js";
import { getMessagesApi } from "../queries/getMessages.js";
import { friendRequestApi } from "../queries/friendRequestApi.js";

const appReducer = combineReducers({
  options: optionsReducer,
  userState: userSlice,
  chatState: chatSlice,
  infoState: infoSlice,
  friendState: friendSlice,
  addFriendModeState: addFriendModeSlice,
  notiTabState: notiTabSlice,
  friendsOnlineState: friendsOnlineSlice,
  notificationsState: notificationsSlice,
  optionsState: optionsReducer,
  filePreviewState: filePreviewSlice,
  isScrollingState: isScrollingSlice,
  fileOpenState: fileOpenSlice,
  messageSelectState: messageSelectSlice,
  modalState: modalSlice,
  groupMemberMenuState: groupMemberMenuSlice,
  editGroupDataState: editGroupDataSlice,
  replyMessageState: replyMessageSlice,
  sideMenusState: sideMenusSlice,
  friendListState: friendListSlice,
  forwardMssgMenuState: forwardMssgMenuSlice,
  chatSearchBarState: chatSearchBarSlice,
  scrollToState: scrollToSlice,
  filesMenuState: filesMenuSlice,
  cameraState: cameraSlice,
  notiState: notiSlice,
  imageSelectorState: imageSelectorSlice,
  avatarMenuState: avatarMenuSlice,
  allLoadsState: allLoadsSlice,
  [getFriendListApi.reducerPath]: getFriendListApi.reducer,
  [getMessagesApi.reducerPath]: getMessagesApi.reducer,
  [friendRequestApi.reducerPath]: friendRequestApi.reducer,
});

const rootReducer = (state, action) =>
  action.type === "LOGOUT"
    ? appReducer(undefined, {})
    : appReducer(state, action);

export default rootReducer;
