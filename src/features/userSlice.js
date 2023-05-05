import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  firstName: "",
  lastName: "",
  profilePic: "",
  id: "",
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.token = payload.token;
    },
    // eslint-disable-next-line no-unused-vars
    logout: (state, { payload }) => {
      state.token = "";
    },

    linkedinAuth: (state, { payload }) => {
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.profilePic = payload.profilePic;
      state.id = payload.id;
      state.accessToken = payload.accessToken;
    },
  },
});
export default userSlice.reducer;
export const { signup, login, logout, linkedinAuth } = userSlice.actions;
