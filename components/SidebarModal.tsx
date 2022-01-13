import React, { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSpring, animated } from "react-spring";

import { db, auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
//icons
//icons
import {
  IoSettingsOutline,
  IoChatboxOutline,
  IoMenuOutline,
} from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import Chat from "./Chat";
import { createChatModalState } from "../atoms/createChatModalAtoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { sidebarModalState } from "../atoms/sidebarAtom";

const SidebarModal: FC = () => {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [chat, setChat] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createChat, setCreateChat] = useRecoilState(createChatModalState);
  const [openSidebar, setOpenSidebar] = useRecoilState(sidebarModalState);
  const [userData, setUserData] = useState<DocumentSnapshot<DocumentData>>();

  const img = user
    ? userData?.data()?.photoURL
    : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg";

  const email = user ? user?.email : "admin@gmail.com";

  const fetchUserData = async () => {
    const docRef = doc(db, "users", user?.uid as string);
    const docSnap = await getDoc(docRef);
    setUserData(docSnap);
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const signout = () => {
    signOut(auth)
      .then(() => {
        router.replace("/");
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats"), where("users", "array-contains", email)),
      (snapshot) => {
        setLoading(false);
        setChat(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, email]);

  const creteChat = () => {
    setCreateChat(true);
  };

  const toggleSidebar = () => {
    setOpenSidebar(false);
  };

  return (
    <animated.div className="w-full md:w-9/12 lg:w-6/12 xl:w-4/12 h-full max-h-screen fixed z-40 top-0 right-0 bg-[#fafafa] shadow-2xl">
      <div className="flex items-center justify-between shadow-2xl px-8 py-2 sticky z-50 top-0">
        <img
          onClick={signout}
          src={img as string}
          className="w-20 h-20 object-contain rounded-full inputIcon"
        />
        <div className="flex flex-row items-center space-x-4">
          <div className=" cursor-pointer">
            <IoChatboxOutline
              onClick={creteChat}
              className="w-8 h-8 inputIcon"
            />
          </div>
          <div className=" cursor-pointer">
            <IoSettingsOutline className="w-8 h-8 inputIcon" />
          </div>
          <div className=" cursor-pointer">
            <IoIosMore className="w-8 h-8 inputIcon" />
          </div>
          <div className=" cursor-pointer" onClick={toggleSidebar}>
            <IoMenuOutline className="w-8 h-8 inputIcon" />
          </div>
        </div>
      </div>
      <div className="bg-[#f5e3e6] bg-gradient-to-b from-[#d9e4f5] shadow-2xl -mt-4">
        <div className="w-full h-full flex items-center justify-center mt-4 py-8 inputIcon">
          <button onClick={creteChat} className="font-bold">
            Start A New Chat
          </button>
        </div>
        <div className="h-screen max-h-screen  overflow-y-scroll scrollbar-hide  ">
          {chat?.map((chat) => (
            <Chat key={chat.id} id={chat.id} users={chat?.data().users} />
          ))}
          <div className="pb-10" />
        </div>
      </div>
    </animated.div>
  );
};

export default SidebarModal;
