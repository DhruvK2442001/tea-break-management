import { create } from "zustand";

export const useAuthStore = create((set) => ({
  userName: "",
  password: "",
  role: "",

  setUserName: (userName) => set({ userName }),
  setPassword: (password) => set({ password }),
  setRole: (role) => set({ role }),
  clearCredentials: () => set({ userName: "", password: "" }),

  dialog: { open: false, isFor: "Add Folder", data: {} },
  setDialog: (details) => set({ dialog: details }),
  data: [
    {
      id: 1,
      isParent: true,
      title: "Folder 1",
      type: "folder",
      isExpanded: true,
      createdAt: "2025-02-01",
      children: [
        {
          id: 2,
          isParent: false,
          title: "page 2",
          type: "file",
          createdAt: "2025-02-01",
        },
        {
          id: 3,
          isParent: false,
          title: "page 3",
          type: "file",
          createdAt: "2025-02-01",
        },
        {
          id: 4,
          isParent: true,
          title: "Folder 2",
          type: "folder",
          isExpanded: false,
          createdAt: "2025-02-01",
          children: [
            {
              id: 5,
              isParent: false,
              title: "page 5",
              createdAt: "2025-02-01",
            },
            {
              id: 6,
              isParent: false,
              title: "page 6",
              createdAt: "2025-02-01",
            },
          ],
        },
      ],
    },
  ],
  setData: (data) => set({ data }),
}));
