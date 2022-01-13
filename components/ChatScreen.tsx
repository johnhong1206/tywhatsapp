import React, { FC, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

//firebase.create
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp,
  DocumentData,
  onSnapshot,
  QueryDocumentSnapshot,
  orderBy,
} from "firebase/firestore";

//icons
import {
  IoSearchOutline,
  IoAttachOutline,
  IoSendOutline,
  IoMenuOutline,
} from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import { useRecoilState } from "recoil";
import { chatId } from "../atoms/chatAtoms";
import Message from "./Message";
import { sidebarModalState } from "../atoms/sidebarAtom";

type Props = {
  chat: any;
};

const ChatScreen: FC<Props> = ({ chat }) => {
  const user = useContext(AuthContext);
  const [id] = useRecoilState<string>(chatId);

  const router = useRouter();
  const [chatUser, setChatUser] = useState<string>("");

  const [recipientSnapShot, setRecipientSnapShot] = useState<DocumentData[]>(
    []
  );
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const endofMessageRef = useRef<any>(null);
  const [openSidebar, setOpenSidebar] = useRecoilState(sidebarModalState);

  useEffect(() => {
    const result = chat?.users?.filter(
      (userToFilter: string) => userToFilter !== user?.email
    )[0];
    setChatUser(result);
  }, [chat, user]);

  useEffect(() => {
    if (chatUser) {
      onSnapshot(
        query(collection(db, "users"), where("email", "==", chatUser)),
        (snapshot) => {
          setRecipientSnapShot(snapshot.docs);
        }
      );
    } else {
      setRecipientSnapShot([]);
    }
  }, [db, chatUser]);

  const recipient = recipientSnapShot[0]?.data();

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "chats", id as string, "messages"),
        orderBy("timeStamp", "asc")
      ),
      (snapshot) => {
        setMessages(snapshot.docs);
        messages.map((i) => {
          console.log(i.data());
        });
      }
    );
  }, [id]);

  const scrollToBottom = () => {
    endofMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const send = (e: any) => {
    e.preventDefault();
    if (!input || input.length === 0) {
      false;
    } else {
      setDoc(
        doc(db, "users", user?.uid as string),
        {
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );

      addDoc(collection(db, "chats", id, "messages"), {
        username: user?.displayName,
        message: input,
        timeStamp: serverTimestamp(),
        uid: user?.uid,
        email: user?.email,
      }).then(() => {
        setInput("");
        scrollToBottom();
      });
    }
  };

  const toggleSidebar = () => {
    setOpenSidebar(true);
  };
  return (
    <div className="w-screen lg:w-9/12 h-screen">
      <div className=" sticky z-40 top-0  bg-white flex flex-col xl:flex-row items-center justify-between  px-8 py-2">
        <div className="flex items-center space-x-2 w-full">
          <img
            src={recipient?.photoURL as string}
            className="w-20 h-20 object-contain rounded-full"
          />
          <div>
            <h3 className="font-bold">{recipient?.username}</h3>
            {recipientSnapShot ? (
              <p className="text-sm text-gray-400">
                <span>Last active : </span>
                <span>
                  {recipient?.lastSeen ? (
                    <>{moment(recipient?.lastSeen?.toDate()).format("LLLL")}</>
                  ) : (
                    "Unavailable"
                  )}
                </span>
              </p>
            ) : (
              <p>Loading Last Active...</p>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center space-x-4">
          <div>
            <IoSearchOutline className="w-8 h-8 inputIcon" />
          </div>
          <div>
            <IoAttachOutline className="w-8 h-8 inputIcon" />
          </div>
          <div>
            <IoIosMore className="w-8 h-8 inputIcon" />
          </div>
          <div onClick={toggleSidebar} className="inline-flex xl:hidden">
            <IoMenuOutline className="w-8 h-8 inputIcon" />
          </div>
        </div>
      </div>
      <div className="bg-[#f5e3e6]  flex-1 bg-gradient-to-b from-[#d9e4f5] h-[90vh] overflow-y-scroll scrollbar-hide">
        {messages.length > 0 && <div className="pt-12" />}

        {messages?.map((message) => (
          <Message key={message.id} id={message.id} message={message.data()} />
        ))}
        <div ref={endofMessageRef} className="pb-40" />
      </div>
      <form
        onSubmit={send}
        className="flex flex-row items-center sticky z-30 bottom-0 bg-white px-2  focus:shadow-2xl"
      >
        <MdOutlineEmojiEmotions className="w-8 h-8" />
        <input
          placeholder={`${user?.displayName} type something`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full flex-grow outline-none bg-white p-5 "
        />
        <IoSendOutline onClick={send} className="w-8 h-8" />
      </form>
    </div>
  );
};

export default ChatScreen;
