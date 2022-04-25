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
  QueryDocumentSnapshot,
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
  const [recipient, setRecipient] = useState<any>([]);

  const router = useRouter();
  const [recipientSnapShot, setRecipientSnapShot] = useState<DocumentData[]>(
    []
  );
  const [readNotifications, setReadNotifications] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
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

  useEffect(() => {
    if (recipientSnapShot.length > 0) {
      setLoading(false);
      setRecipient(recipientSnapShot[0]?.data());
    }
  }, [recipientSnapShot]);

  const enterChat = () => {
    setChatId(id);
    setOpenSidebar(false);
    router.push(`/chat/${id}`);
  };

  useEffect(() => {
    if (!loading) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "chats", id! as string, "messages"),
          where("read", "==", false),
          where("email", "==", recipient?.email! as string)
        ),
        (snapshot) => {
          setReadNotifications(snapshot.docs);
        }
      );
      return unsubscribe;
    }
  }, [db, id!, loading, recipient?.email]);

  return (
    <>
      {!loading ? (
        <div
          key={key}
          onClick={enterChat}
          className="relative flex items-center justify-between cursor-pointer p-4 hover:text-white hover:bg-[#d99ec9] hover:bg-gradient-to-l from-[#f6f0c4] hover:bg-opacity-50 space-x-2"
        >
          <div className="flex flex-row items-center">
            <img
              loading="lazy"
              src={recipient?.photoURL!}
              className="w-12 h-12 rounded-full"
              alt={recipient?.username!}
            />
            <div className="flex flex-col ml-2 ">
              <p className="font-bold">{recipient?.username}</p>
              <p className="font-light text-sm">{recipient?.email}</p>
            </div>
          </div>
          {readNotifications?.length >= 1 && (
            <div className="w-6 h-6 rounded-full leading-6 bg-gray-800/75 text-red-500 text-xs">
              <p className="text-center items-end">
                {readNotifications?.length}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Chat;
