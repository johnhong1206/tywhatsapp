import { useRouter } from "next/router";
import React, { FC, useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebase";
import { useRecoilState, useRecoilValue } from "recoil";

import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { chatId } from "../atoms/chatAtoms";
import { sidebarModalState } from "../atoms/sidebarAtom";

type Props = {
  key: any;
  id: any;
  users: any;
};

const Chat: FC<Props> = ({ key, id, users }) => {
  const user = useContext(AuthContext);
  const [chatUser, setChatUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [getChatId, setChatId] = useRecoilState(chatId);

  const router = useRouter();
  const [recipientSnapShot, setRecipientSnapShot] = useState<DocumentData[]>(
    []
  );
  const [openSidebar, setOpenSidebar] = useRecoilState(sidebarModalState);

  useEffect(() => {
    const result = users?.filter(
      (userToFilter: string) => userToFilter !== user?.email
    )[0];
    setChatUser(result);
  }, [users]);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "users"), where("email", "==", chatUser)),
      (snapshot) => {
        setRecipientSnapShot(snapshot.docs);
      }
    );
  }, [db, chatUser]);
  console.log(recipientSnapShot);
  const recipient = recipientSnapShot[0]?.data();

  const enterChat = () => {
    setChatId(id);
    setOpenSidebar(false);
    router.push(`/chat/${id}`);
  };

  return (
    <div
      key={key}
      onClick={enterChat}
      className="flex items-center cursor-pointer p-4 hover:text-white hover:bg-[#d99ec9] hover:bg-gradient-to-l from-[#f6f0c4] hover:bg-opacity-50 space-x-2"
    >
      {recipient ? (
        <img
          src={recipient?.photoURL}
          className="w-12 h-12 rounded-full"
          alt={recipient?.username}
        />
      ) : (
        <img src={recipient?.photoURL} />
      )}
      <div className="flex flex-col ">
        <p className="font-bold">{recipient?.username}</p>
        <p className="font-light text-sm">{recipient?.email}</p>
      </div>
    </div>
  );
};

export default Chat;
