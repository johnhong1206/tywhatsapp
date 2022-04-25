import React, { FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

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
import {
  IoSettingsOutline,
  IoChatboxOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import Chat from "./Chat";
import UserList from "./UserList";
import { createChatModalState } from "../atoms/createChatModalAtoms";
import { useRecoilState, useRecoilValue } from "recoil";

const Sidebar: FC = () => {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [chat, setChat] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createChat, setCreateChat] = useRecoilState(createChatModalState);
  const [toggleUser, setToggleUser] = useState<boolean>(false);
  const [userList, setUserList] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [readNotifications, setReadNotifications] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  const [userData, setUserData] = useState<DocumentSnapshot<DocumentData>>();
  const uid = user?.uid as string;

  const img = user
    ? userData?.data()?.photoURL
    : "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg";
  const email = user ? user?.email : "admin@gmail.com";

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", uid!);
      const docSnap = await getDoc(docRef);
      setUserData(docSnap);
    };
    if (user) {
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chats"), where("users", "array-contains", email!)),
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

  const findUser = () => {
    if (!toggleUser) {
      setToggleUser(true);
    } else {
      setToggleUser(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users"), where("email", "!=", email!)),
      (snapshot) => {
        setUserList(snapshot.docs);
      }
    );
    return unsubscribe;
  }, [db, email]);

  const signout = () => {
    if (!user) {
      router.push("/login");
    } else {
      signOut(auth)
        .then(() => {
          router.replace("/");
        })
        .catch((error) => {});
    }
  };

  return (
    <div className="hidden lg:flex flex-col h-full max-h-screen w-screen md:w-3/12 bg-white overflow-hidden sticky top-0 left-0">
      <div className="flex items-center justify-between shadow-2xl px-2 h-[6rem] sticky z-50 top-0">
        <div
          className="flex items-center justify-center rounded-full w-12 h-12 cursor-pointer hover:animate-pulse"
          onClick={signout}
        >
          <img src={img! as string} className="object-contain rounded-full" />
        </div>

        <div className="flex flex-row items-center space-x-4">
          <div className=" cursor-pointer">
            <IoChatboxOutline
              onClick={creteChat}
              className="w-8 h-8 inputIcon"
            />
          </div>
          <div onClick={findUser} className=" cursor-pointer">
            <IoPeopleOutline className="w-8 h-8 inputIcon" />
          </div>
          <div>
            <IoSettingsOutline className="w-8 h-8 inputIcon" />
          </div>
          <div>
            <IoIosMore className="w-8 h-8 inputIcon" />
          </div>
        </div>
      </div>
      <div className="w-full h-full flex-[1] flex items-center justify-center mt-4 py-8 inputIcon">
        {!toggleUser && (
          <button onClick={creteChat} className="font-bold">
            Start A New Chat
          </button>
        )}
      </div>
      <div className="h-screen max-h-screen bg-white overflow-y-scroll scrollbar-hide  bg-gradient-to-t from-[#06202A] ">
        {!toggleUser ? (
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {chat?.map((chat) => (
                  <Chat key={chat.id} id={chat.id} users={chat?.data().users} />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {userList?.map((userlist) => (
              <UserList
                key={userlist.id}
                id={userlist.id}
                users={userlist?.data()}
                userList={userList}
                setToggleUser={setToggleUser}
              />
            ))}
          </>
        )}

        <div className="pb-10" />
      </div>
    </div>
  );
};

export default Sidebar;
