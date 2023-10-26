import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setToken } from "./features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
  formData: true,
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setToken({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
      window.location.href = "/login";
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Order"],
  endpoints: (builder) => ({}),
});
