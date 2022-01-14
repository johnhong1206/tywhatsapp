import React, { FC, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import { sidebarModalState } from "../atoms/sidebarAtom";

type Props = {
  key: any;
  id: any;
  users: any;
  userList: any;
  setToggleUser: any;
};

const UserList: FC<Props> = ({ key, id, users, userList, setToggleUser }) => {
  const user = useContext(AuthContext);

  const email = user ? user?.email : "admin@gmail.com";
  const [openSidebar, setOpenSidebar] = useRecoilState(sidebarModalState);

  const [chat, setChat] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats"), where("users", "array-contains", email)),
      (snapshot) => {
        setChat(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, email]);

  console.log(users);

  const filteruser = userList.filter(
    (user: any) => user?.data().email === users?.email
  );

  //console.log(`${users?.email}filteruser`, !!filteruser);

  const chatExist = !!chat?.find(
    (chat) =>
      chat.data().users.find((user: string) => user === users?.email)?.length >
      0
  );

  console.log(`${users?.email} chat`, !!chatExist);

  const createChat = () => {
    if (!chatExist) {
      addDoc(collection(db, "chats"), {
        users: [user?.email, users?.email],
      });
      setToggleUser(false);
    } else {
      alert("chat exist");
    }
  };
  return (
    <div
      onClick={createChat}
      key={key}
      className="flex items-center cursor-pointer p-4 hover:text-white hover:bg-[#d99ec9] hover:bg-gradient-to-l from-[#f6f0c4] hover:bg-opacity-50 space-x-2"
    >
      <img src={users?.photoURL} className="w-12 h-12 rounded-full" />

      <div className="flex flex-col ">
        <p className="font-bold">{users?.username}</p>
        <p className="font-light text-sm">{users?.email}</p>
      </div>
    </div>
  );
};

export default UserList;
