import React, { FC, useContext, useEffect, useState } from "react";

import moment from "moment";
import { useRecoilState } from "recoil";
import { RiCheckDoubleLine } from "react-icons/ri";

//firebase.create
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { chatId } from "../atoms/chatAtoms";

type Props = {
  key: any;
  id: any;
  message: any;
  scrollToBottom: any;
};

const Message: FC<Props> = ({ key, message, id, scrollToBottom }) => {
  const [mychatId] = useRecoilState<string>(chatId);
  const username = message.username;
  const email = message.email;
  const messages = message.message;
  const uid = message.uid;
  const readed = message.read;
  const timestamp = message.timeStamp?.toDate();
  const user = useContext(AuthContext);

  // console.log(messageid);

  useEffect(() => {
    const readMessage = () => {
      if (!id) {
        return false;
      } else {
        setDoc(
          doc(db, "users", user?.uid as string),
          {
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );
        if (readed === false) {
          setDoc(
            doc(db, "chats", mychatId!, "messages", id),
            {
              read: Boolean(true),
            },
            { merge: true }
          );
        }
      }
    };
    if (user?.email !== email) {
      readMessage();
      scrollToBottom();
    } else {
      scrollToBottom();
    }
  }, [user, email, mychatId, id, db, readed]);

  return (
    <div
      // onClick={readMessage}
      className="px-6 py-9  mt-0 lg:mt-4 cursor-pointer"
    >
      <div className="relative">
        <div
          className={`absolute w-auto min-w-[30px]  ${
            email === user?.email ? "right-0 " : "left-0"
          }`}
        >
          <p
            className={`relative px-4 py-2  text-base rounded-3xl font-mono shadow-md  ${
              email === user?.email
                ? "bg-[#3eadcf] bg-gradient-to-t from-[#abe9cd] text-left"
                : "bg-[#e61d8c] bg-gradient-to-b from-[#c7e9fb] text-right"
            }`}
          >
            {messages}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <h3 className="text-[12px] font-medium text-gray-800">
              {username}
            </h3>
            <p className="text-gray-400 text-[10px]">
              {timestamp ? moment(timestamp).format("LT") : "..."}
            </p>
            {email !== user?.email && readed === true && (
              <span>
                <RiCheckDoubleLine className="w-4 h-4 text-blue-600" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
