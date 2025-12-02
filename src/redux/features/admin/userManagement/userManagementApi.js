import { baseApi } from "@/redux/api/baseApi";

const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getallUserManagement: builder.query({
      query: (params) => ({
        url: "/trainee/dashboard",
        method: "GET",
        params,
      }),
      providesTags: ["user-management"],
    }),

    updateUser: builder.mutation({
      query: (id) => ({
        url: `/users/block-unblock/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ['user-management']
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/trainee/delete-trainee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['user-management']
    }),
  }),
});

export const { useGetallUserManagementQuery, useUpdateUserMutation,useDeleteUserMutation } = userManagementApi;

export default userManagementApi;
