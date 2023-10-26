import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: null,
  count: null,
};

export const productSlice = createSlice({
  initialState,
  name: "product",
  reducers: {
    setProductData: (state, action) => {
      state.products = action.payload.products;
      state.count = action.payload.count;
    },
  },
});

export default productSlice.reducer;

export const { setProductData } = productSlice.actions;
