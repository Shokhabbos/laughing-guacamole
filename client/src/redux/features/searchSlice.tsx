/* eslint-disable react-refresh/only-export-components */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import instance from "../../api/axios";
import { Item, KeySearchResult } from "../../types/ElementTypes";

interface ResultState {
  keyResult: KeySearchResult | null;
  tagResult: Item[] | null; 
}

const initialState: ResultState = {
  tagResult: null,
  keyResult: null
};

const searchByKey = createAsyncThunk<KeySearchResult, string>(
  "searchByKey",
  async (key: string) => {
    try {
      const response: AxiosResponse = await instance.get(`item/search/?key=${key}`);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching collections:", error);
      throw error;
    }
  }
);

const searchByTag = createAsyncThunk<any[], string>(
  "searchByTag",
  async (tag: string) => {
    try {
      const response: AxiosResponse = await instance.get(`item/search/?tag=${tag}`);
      return response.data.result.items;
    } catch (error) {
      console.error("Error fetching collections:", error);
      throw error;
    }
  }
);

const searchSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(searchByKey.fulfilled, (state, action: PayloadAction<KeySearchResult>) => {
      state.keyResult = action.payload;
    });
    builder.addCase(searchByTag.fulfilled, (state, action: PayloadAction<any[]>) => { // Adjusted PayloadAction type
      state.tagResult = action.payload;
    });
  },
});

export { searchByKey, searchByTag };
export default searchSlice.reducer;
