import { createSlice } from "@reduxjs/toolkit";

const initialState = { token: null, refreshToken: null, account: null };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setAuthTokens(
        state,
        action
      ) {
        state.refreshToken = action.payload.refreshToken;
        state.token = action.payload.token;
      },
      setAccount(state, action) {
        state.account = action.payload;
      },
      logout(state) {
        state.account = null;
        state.refreshToken = null;
        state.token = null;
      },
    },
  });
  
  export default authSlice;