/* eslint-disable react-refresh/only-export-components */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import instance from "../../api/axios";
import { Collection, Item } from "../../types/ElementTypes";
import { toast } from "react-toastify";

interface CollectionsState {
  collections: object | null;
  collection: object | null
}

const initialState: CollectionsState = {
  collections: JSON.parse(localStorage.getItem("collections") ?? "null"),
  collection: JSON.parse(localStorage.getItem("collection") ?? "null"),
};

const getCollections = createAsyncThunk<object>("/collection", async () => {
  try {
    const response: AxiosResponse = await instance('/collection');
    return response.data.collections;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
});

const getSingleCollection = createAsyncThunk<Collection, string>("/collection/:id", async(id:string) => {
  try {
    const response: AxiosResponse = await instance(`/collection/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
})

const deleteCollections = createAsyncThunk<string[], [string[], string]>(
  '/collection/deletemany',
  async ([collectionIds, id]) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      const response: AxiosResponse = await instance.delete("/collection/delete", {
        headers,
        data: { collectionIds, id }
      });
      if(response.status === 200){
        toast.success('Collections deleted :)')
        return response.data.collections;
      }
    } catch (error) {
      console.error("Error deleting collections:", error);
      throw error;
    }
  }
);
const createCollection = createAsyncThunk<Collection,FormData>("/collection/create", async(data:FormData) => {
  try{
    const response: AxiosResponse = await instance.post("/collection/add-col", data);
    console.log(response)
    if (response.status === 200) {
      toast.success("Collection created :)");
    }
    return response.data.collections;
  }catch(error){
    console.log(error)
  }
})
const updateCollection = createAsyncThunk<Collection,[FormData, string]>("/collection/update", async([data,id]) => {
  try{
    const response: AxiosResponse = await instance.patch(`/collection/${id}`, data);
    console.log(response)
    if (response.status === 200) {
      toast.success("Collection updated :)");
    }
    return response.data.collections;
  }catch(error){
    console.log(error)
  }
})
const addItem = createAsyncThunk<Item,FormData>("/collection/add-item", async(data:FormData) => {
  try{
    const response: AxiosResponse = await instance.post("/item/add-item", data);
    if (response.status === 200) {
      toast.success("Item added :)");
    }
    return response.data.item;
  }catch(error){
    console.log(error)
  }
})
const deleteItems = createAsyncThunk<string[], [string[], string]>(
  '/item/deletemany',
  async ([itemIds, collection_id]) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      const response: AxiosResponse = await instance.delete("/item/delete", {
        headers,
        data: { itemIds, collection_id }
      });
      console.log(response)
      if(response.status === 200){
        toast.success('Items deleted :)')
        return response.data.result;
      }
    } catch (error) {
      console.error("Error deleting collections:", error);
      throw error;
    }
  }
);
const editItem = createAsyncThunk<Item,[FormData, string]>('/collection/edit-item',async([data, id]) => {
  try{
    const response: AxiosResponse = await instance.patch(`/item/${id}`, data);
    if (response.status === 200) {
      toast.success("Item edited :)");
    }
    return response.data.item;
  }catch(error){
    console.log(error)
  }
})

const CollectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCollections.fulfilled, (state, action: PayloadAction<object>) => {
      state.collections = action.payload;
      localStorage.setItem("collections", JSON.stringify(action.payload));
    });
    builder.addCase(getSingleCollection.fulfilled, (state, action: PayloadAction<Collection>) => {
      state.collection = action.payload;
      localStorage.setItem("collection", JSON.stringify(action.payload))
    });
    builder.addCase(createCollection.fulfilled, (state, action: PayloadAction<Collection>) => {
      state.collections = action.payload;
      localStorage.setItem("collections", JSON.stringify(action.payload))
    });
    builder.addCase(addItem.fulfilled, (state, action: PayloadAction<Item>) => {
      state.collection = action.payload;
      localStorage.setItem("collection", JSON.stringify(action.payload))
    });
    builder.addCase(editItem.fulfilled, (state, action: PayloadAction<Item>) => {
      state.collection = action.payload;
      localStorage.setItem("collection", JSON.stringify(action.payload))
    });
    builder.addCase(updateCollection.fulfilled, (state, action: PayloadAction<Collection>) => {
      state.collections = action.payload;
      localStorage.setItem("collections", JSON.stringify(action.payload))
    });
    builder.addCase(deleteCollections.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.collections = action.payload;
      localStorage.setItem("collections", JSON.stringify(action.payload));
    });
    builder.addCase(deleteItems.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.collection = action.payload;
      localStorage.setItem("collection", JSON.stringify(action.payload))
    });
    
  },
});

export { getCollections, getSingleCollection, createCollection, deleteCollections, updateCollection, addItem, deleteItems,editItem };
export default CollectionSlice.reducer;
