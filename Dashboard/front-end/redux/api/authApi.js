import { apiSlice } from "../apiSlice";
import { logOut, setToken } from "../features/authSlice";
import { setMe } from "../features/userSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => {
        return {
          url: "auth/login",
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken({ accessToken: data?.accessToken }));
          dispatch(setMe({ role: "admin" }));
        } catch (error) {}
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(logOut());

          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {}
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          dispatch(setToken({ accessToken }));
        } catch (err) {}
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLogoutUserMutation,
  useRefreshMutation,
} = authApiSlice;
