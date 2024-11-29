import { combineReducers } from "@reduxjs/toolkit";
import { api } from "../api/api";

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
});
