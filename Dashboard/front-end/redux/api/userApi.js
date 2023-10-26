import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";
import { setMe, setUserData } from "../features/userSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/auth/user-infor",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMe(data));
        } catch (e) {
          if (e?.error?.status !== 403) {
            dispatch(setMe(null));
          }
        }
      },
    }),
    getUsers: builder.query({
      query: (data = {}) => ({
        url: "/users",
        params: data,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedUsers = responseData.users.map((user) => {
          user.id = user._id;
          delete user._id;
          return user;
        });

        return {
          users: usersAdapter.setAll(initialState, loadedUsers),
          count: responseData.count,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.users) {
          return [
            { type: "User", id: "LIST" },
            ...result.users.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUserData(data));
        } catch (e) {}
      },
    }),
    addNewUser: builder.mutation({
      query: (formData) => ({
        url: "/users",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/users",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => {
    return state.user.users ?? initialState;
  });
