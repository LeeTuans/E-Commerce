import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";
import { setProductData } from "../features/productSlide";

const productsAdapter = createEntityAdapter({});

const initialState = productsAdapter.getInitialState();

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "/products/categories",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
    getProducts: builder.query({
      query: (data = {}) => ({
        url: "/products",
        params: data,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedProducts = responseData.products.map((product) => {
          product.id = product._id;
          delete product._id;
          return product;
        });
        return {
          products: productsAdapter.setAll(initialState, loadedProducts),
          count: responseData.count,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.products) {
          return [
            { type: "Product", id: "LIST" },
            ...result.products.ids.map((id) => ({ type: "Product", id })),
          ];
        } else return [{ type: "Product", id: "LIST" }];
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProductData(data));
        } catch (e) {}
      },
    }),
    addNewProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Product", id: arg.id },
      ],
    }),
    deleteproduct: builder.mutation({
      query: (id) => ({
        url: `/products`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Product", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useAddNewProductMutation,
  useUpdateProductMutation,
  useDeleteproductMutation,
} = productApiSlice;

export const { selectAll: selectAllProducts, selectById: selectProductById } =
  productsAdapter.getSelectors((state) => {
    return state.product.products ?? initialState;
  });
