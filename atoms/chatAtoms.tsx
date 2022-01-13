import { atom } from "recoil";

export const chatId = atom<any>({
  key: "chatId",
  default: null,
});
