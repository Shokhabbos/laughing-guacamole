/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User, authUser } from "../../types/ElementTypes";
import { AxiosResponse } from "axios";
import instance from "../../api/axios";
import { toast } from "react-toastify";

interface SignUpResponse {
  token: string;
  user: User;
}

interface AuthState {
  token: string;
  user: User | null;
}

const signup = createAsyncThunk<SignUpResponse, authUser>(
  "/auth/signup",
  async (data:authUser) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const response: AxiosResponse = await instance.post("/user/signup", data, {headers});
      if (response.status === 201) {
        toast.success("Successfully registered :)");
        setTimeout(() => {
          window.location.href = `${window.location.origin}/signIn`;
        }, 2500);
      }

      return response.data as SignUpResponse;
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        toast.error("Email or Name is already in use!");
      } else {
        console.log(error)
        toast.error("Something went wrong!");
      }
      throw error;
    }
  }
);

const signin = createAsyncThunk<SignUpResponse, User>(
  "/auth/login",
  async (data:User) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const response: AxiosResponse = await instance.post("/user/login", data, {headers});
      console.log(response)
      if (response.status === 200) {
        toast.success("Welcome :)");
      }
      return response.data as SignUpResponse;
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error("Something went wrong!");
      }
      throw error;
    }
  }
);

const initialState: AuthState = {
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") ?? "null") as User | null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = `${window.location.origin}/`;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signin.fulfilled, (state, action) => {
      if (action.payload?.user) {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        state.user = action.payload.user;
        window.location.href = `${window.location.origin}/`;
      }
    });
  },
});

export const { logOut } = authSlice.actions;
export { signup, signin };
export default authSlice.reducer;