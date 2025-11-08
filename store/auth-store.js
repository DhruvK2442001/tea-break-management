import { create } from "zustand";

export const useAuthStore = create((set) => ({
  userName: "",
  password: "",
  role: "",

  setUserName: (userName) => set({ userName }),
  setPassword: (password) => set({ password }),
  setRole: (role) => set({ role }),
  clearCredentials: () => set({ userName: "", password: "" }),
}));
