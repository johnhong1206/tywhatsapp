import { atom } from "recoil";

export const sidebarModalState = atom<boolean>({
  key: "sidebarModalState",
  default: false,
});
