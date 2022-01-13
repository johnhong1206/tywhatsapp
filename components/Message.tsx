import React, { FC, useContext, useEffect, useState } from "react";

import moment from "moment";

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
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

type Props = {
  key: any;
  id: any;
  message: any;
};

const Message: FC<Props> = ({ key, message }) => {
  const username = message.username;
  const email = message.email;
  const messages = message.message;
  const uid = message.uid;
  const timestamp = message.timeStamp?.toDate();
  const user = useContext(AuthContext);

  return (
    <div className="px-6 py-9  mt-0 lg:mt-4">
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
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-[12px] font-medium text-gray-800">
              {username}
            </h3>
            <p className="text-gray-400 text-[10px]">
              {timestamp ? moment(timestamp).format("LT") : "..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
