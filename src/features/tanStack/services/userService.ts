
import type {
  User,
  UserInput,
  UserFilters,
  UserListResponse,
} from "../types";

const MOCK_DELAY = 700;

const wait = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_DELAY);
  });

const simulateFailure = (shouldFail: boolean) => {
  if (shouldFail) {
    throw new Error(
      "Simulated API failure. Turn off failure mode and try again."
    );
  }
};

// Mock Dataset
let users: User[] = [
  {
    id: "user-1",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    role: "Admin",
    status: "Active",
    company: "Tech Solutions",
    createdAt: "2026-10-01",
  },
  {
    id: "user-2",
    name: "Priya Verma",
    email: "priya@example.com",
    role: "Editor",
    status: "Active",
    company: "Digital Works",
    createdAt: "2026-10-03",
  },
  {
    id: "user-3",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    role: "Viewer",
    status: "Inactive",
    company: "Cloud Systems",
    createdAt: "2026-10-05",
  },
  {
    id: "user-4",
    name: "Ananya Singh",
    email: "ananya@example.com",
    role: "Admin",
    status: "Active",
    company: "Web Innovations",
    createdAt: "2026-10-07",
  },
  {
    id: "user-5",
    name: "Vikram Patel",
    email: "vikram@example.com",
    role: "Editor",
    status: "Inactive",
    company: "Tech Solutions",
    createdAt: "2026-10-09",
  },
  {
    id: "user-6",
    name: "Sneha Gupta",
    email: "sneha@example.com",
    role: "Viewer",
    status: "Active",
    company: "Digital Works",
    createdAt: "2026-10-11",
  },
  {
    id: "user-7",
    name: "Aditya Mishra",
    email: "aditya@example.com",
    role: "Editor",
    status: "Active",
    company: "Cloud Systems",
    createdAt: "2026-10-13",
  },
  {
    id: "user-8",
    name: "Neha Yadav",
    email: "neha@example.com",
    role: "Viewer",
    status: "Inactive",
    company: "Web Innovations",
    createdAt: "2026-10-15",
  },
  {
    id: "user-9",
    name: "Karan Malhotra",
    email: "karan@example.com",
    role: "Admin",
    status: "Active",
    company: "Tech Solutions",
    createdAt: "2026-10-17",
  },
  {
    id: "user-10",
    name: "Isha Kapoor",
    email: "isha@example.com",
    role: "Editor",
    status: "Active",
    company: "Digital Works",
    createdAt: "2026-10-19",
  },
  {
    id: "user-11",
    name: "Rohan Das",
    email: "rohan@example.com",
    role: "Viewer",
    status: "Active",
    company: "Cloud Systems",
    createdAt: "2026-10-21",
  },
  {
    id: "user-12",
    name: "Meera Joshi",
    email: "meera@example.com",
    role: "Admin",
    status: "Inactive",
    company: "Web Innovations",
    createdAt: "2026-10-23",
  },
  {
    id: "user-13",
    name: "Arjun Reddy",
    email: "arjun@example.com",
    role: "Editor",
    status: "Active",
    company: "Tech Solutions",
    createdAt: "2026-10-25",
  },
  {
    id: "user-14",
    name: "Kavya Nair",
    email: "kavya@example.com",
    role: "Viewer",
    status: "Inactive",
    company: "Digital Works",
    createdAt: "2026-10-27",
  },
  {
    id: "user-15",
    name: "Dev Mehta",
    email: "dev@example.com",
    role: "Admin",
    status: "Active",
    company: "Cloud Systems",
    createdAt: "2026-10-29",
  },
];

// GET USERS
export const getUsers = async (
  filters: UserFilters,
  shouldFail = false
): Promise<UserListResponse> => {
  await wait();
  simulateFailure(shouldFail);

  let result = [...users];

  // Search
  if (filters.search.trim()) {
    const search = filters.search.toLowerCase().trim();

    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.company.toLowerCase().includes(search)
    );
  }

  // Role Filter
  if (filters.role !== "All") {
    result = result.filter((user) => user.role === filters.role);
  }

  // Status Filter
  if (filters.status !== "All") {
    result = result.filter((user) => user.status === filters.status);
  }

  // Sorting
  result.sort((a, b) => {
    const first = a[filters.sortBy].toLowerCase();
    const second = b[filters.sortBy].toLowerCase();

    const comparison = first.localeCompare(second);

    return filters.sortOrder === "asc"
      ? comparison
      : -comparison;
  });

  // Pagination
  const total = result.length;
  const totalPages = Math.ceil(total / filters.pageSize);

  const startIndex = (filters.page - 1) * filters.pageSize;

  const data = result.slice(
    startIndex,
    startIndex + filters.pageSize
  );

  return {
    data,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages,
  };
};

// GET USER DETAIL
export const getUserById = async (
  id: string,
  shouldFail = false
): Promise<User> => {
  await wait();
  simulateFailure(shouldFail);

  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new Error("User not found.");
  }

  return { ...user };
};

// CREATE USER
export const createUser = async (
  data: UserInput,
  shouldFail = false
): Promise<User> => {
  await wait();
  simulateFailure(shouldFail);

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === data.email.toLowerCase()
  );

  if (emailExists) {
    throw new Error("A user with this email already exists.");
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString().split("T")[0],
  };

  users = [newUser, ...users];

  return { ...newUser };
};

// UPDATE USER
export const updateUser = async (
  id: string,
  data: UserInput,
  shouldFail = false
): Promise<User> => {
  await wait();
  simulateFailure(shouldFail);

  const existingUser = users.find((user) => user.id === id);

  if (!existingUser) {
    throw new Error("User not found.");
  }

  const emailExists = users.some(
    (user) =>
      user.id !== id &&
      user.email.toLowerCase() === data.email.toLowerCase()
  );

  if (emailExists) {
    throw new Error("Another user already uses this email.");
  }

  const updatedUser: User = {
    ...existingUser,
    ...data,
  };

  users = users.map((user) =>
    user.id === id ? updatedUser : user
  );

  return { ...updatedUser };
};

// DELETE USER
export const deleteUser = async (
  id: string,
  shouldFail = false
): Promise<string> => {
  await wait();
  simulateFailure(shouldFail);

  const exists = users.some((user) => user.id === id);

  if (!exists) {
    throw new Error("User not found.");
  }

  users = users.filter((user) => user.id !== id);

  return id;
};
