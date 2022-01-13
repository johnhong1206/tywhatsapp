import React, { useEffect, useState } from "react";
import Head from "next/head";

import { useRouter } from "next/router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).then((auth) => {
      //create user and logged in, redirect to homepage
      router.push("/");
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        const uid = user.uid;
        const userRef = doc(db, "users", uid);
        setDoc(
          userRef,
          {
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );

        router.replace("/");

        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, [db, auth]);

  return (
    <div className="bg-gray-100 h-screen grid place-items-center ">
      <Head>
        <title>Whatsapp -Sign In</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" bg-white w-11/12 md:w-1/3 p-4 h-2/3 flex flex-col items-center justify-center shadow-2xl">
        <img
          src={"/images/WhatsappLogo.png"}
          width={100}
          height={100}
          alt="logo"
          className="object-contain w-[200px] h-[200px] ml-2"
        />
        <form className="flex flex-col w-full space-y-2">
          <input
            placeholder="email"
            className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
            ${emailError !== null && "border-2 border-red-500"}`}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            placeholder="password"
            className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
            ${passwordError !== null && "border-2 border-red-500"}`}
            onChange={(event) => setPassword(event.target.value)}
          />
        </form>
        <button
          onClick={signIn}
          type="submit"
          className="p-4 outline-none bg-[#0a8d48] text-white font-medium w-full shadow-md mt-2 hover:bg-white hover:text-[#0a8d48]"
        >
          Login
        </button>
        <div className="mt-4">
          <p className="">
            Have Account? Please
            <span
              onClick={() => router.push("/register")}
              className="hover:underline cursor-pointer ml-1"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default login;
