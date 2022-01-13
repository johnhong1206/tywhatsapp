import { atom } from "recoil";

export const UpdateProfileImageState = atom<boolean>({
  key: "UpdateProfileImageState",
  default: false,
});
