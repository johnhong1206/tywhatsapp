import React, { FC, useContext, useEffect, useState } from "react";
import { AiOutlineUserAdd, AiOutlineCloseCircle } from "react-icons/ai";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import * as EmailValidator from "email-validator";
import { useRouter } from "next/router";
import { createChatModalState } from "../atoms/createChatModalAtoms";
import { useRecoilState, useRecoilValue } from "recoil";

const CreateChat: FC = () => {
  const router = useRouter();

  const user = useContext(AuthContext);
  const email = user ? user?.email : "admin@gmail.com";

  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [userList, setUserList] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [createChat, setCreateChat] = useRecoilState(createChatModalState);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats"), where("users", "array-contains", email)),
      (snapshot) => {
        setChat(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, email]);

  console.log(input);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users")),
      (snapshot) => {
        setUserList(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, input]);

  const creteChat = (): void => {
    const filteruser = userList.filter(
      (user: any) => user?.data().email === input
    );

    const chatExist = !!chat?.find(
      (chat) =>
        chat.data().users.find((user: string) => user === input)?.length > 0
    );

    if (EmailValidator.validate(input) && !chatExist && filteruser !== []) {
      addDoc(collection(db, "chats"), {
        users: [user?.email, input],
      });
      alert("chat create");
      setInput("");
      setCreateChat(false);
    } else {
      setInput("");
      alert("chat exist");
      setCreateChat(false);
    }
  };
  const closeChat = () => {
    setCreateChat(false);
  };

  return (
    <div className="fixed z-50 inset-1 overflow-y-auto">
      <div className="flex items-center justify-center min-h-[800px] sm:min-h-screen pt-4 pb-20 text-center sm:block sm:p-0 bg-gray-500 bg-opacity-50 transition-opacity">
        <span
          className="hiddem sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>
        <div
          className=" inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all
          sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
        >
          <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
            <input
              placeholder="Email you wish to chat"
              className="w-full outline-none"
              onChange={(event) => setInput(event.target.value)}
            />
          </div>
          <div className="flex items-center  justify-between w-full px-10 space-x-4 mt-4">
            <div onClick={creteChat}>
              <AiOutlineUserAdd
                className={`h-8 w-8 text-green-500 cursor-pointer opacity-50 inputIcon ${
                  !input && "opacity-100"
                }`}
              />
              <p className="text-xs sm:text-sm lg:text-base">ADD</p>
            </div>
            <div onClick={closeChat}>
              <AiOutlineCloseCircle
                className={`h-8 w-8 text-pink-500 cursor-pointer opacity-50 inputIcon ${
                  !input && "opacity-100"
                }`}
              />
              <p className="text-xs sm:text-sm lg:text-base">Close</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;
