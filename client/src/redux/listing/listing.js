import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  listing: {},
  error: null,
};

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    createListingStart: (state, action) => {
      state.loading = true;
    },
    createListingSuccess: (state, action) => {
      state.loading = false;
      state.listing = action.payload;
      state.error = null;
    },
    createListingFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { createListingStart, createListingSuccess, createListingFailure } =
  listingSlice.actions;
export default listingSlice.reducer;