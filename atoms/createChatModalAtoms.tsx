import { atom } from "recoil";

export const createChatModalState = atom<boolean>({
  key: "createChatModalState",
  default: false,
});
