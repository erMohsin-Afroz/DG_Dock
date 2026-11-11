
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

import type {
  UserFilters,
  UserInput,
  MutationVariables,
  UpdateUserVariables,
  DeleteUserVariables,
} from "../types";

// Query Keys
export const userKeys = {
  all: ["users"] as const,

  lists: () => [...userKeys.all, "list"] as const,

  list: (filters: UserFilters, shouldFail: boolean) =>
    [...userKeys.lists(), filters, shouldFail] as const,

  details: () => [...userKeys.all, "detail"] as const,

  detail: (id: string, shouldFail: boolean) =>
    [...userKeys.details(), id, shouldFail] as const,
};

// USERS LIST QUERY
export function useUsers(
  filters: UserFilters,
  shouldFail: boolean
) {
  return useQuery({
    queryKey: userKeys.list(filters, shouldFail),
    queryFn: () => getUsers(filters, shouldFail),
  });
}

// USER DETAIL QUERY
export function useUser(
  id: string | null,
  shouldFail: boolean
) {
  return useQuery({
    queryKey: userKeys.detail(id ?? "", shouldFail),
    queryFn: () => getUserById(id!, shouldFail),
    enabled: Boolean(id),
  });
}

// CREATE USER MUTATION
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      shouldFail,
    }: MutationVariables<UserInput>) =>
      createUser(data, shouldFail),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      toast.success("User created successfully.");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create user."
      );
    },
  });
}

// UPDATE USER MUTATION
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      shouldFail,
    }: UpdateUserVariables) =>
      updateUser(id, data, shouldFail),

    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(
        userKeys.detail(updatedUser.id, false),
        updatedUser
      );

      queryClient.setQueryData(
        userKeys.detail(updatedUser.id, true),
        updatedUser
      );

      await queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });

      toast.success("User updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update user."
      );
    },
  });
}

// DELETE USER MUTATION
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      shouldFail,
    }: DeleteUserVariables) =>
      deleteUser(id, shouldFail),

    onSuccess: async (deletedId) => {
      queryClient.removeQueries({
        queryKey: userKeys.detail(deletedId, false),
        exact: true,
      });

      queryClient.removeQueries({
        queryKey: userKeys.detail(deletedId, true),
        exact: true,
      });

      await queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });

      toast.success("User deleted successfully.");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete user."
      );
    },
  });
}
