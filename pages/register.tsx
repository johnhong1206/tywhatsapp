import React, { useEffect, useState } from "react";
import type { NextPage } from "next";

import Head from "next/head";
import { useRouter } from "next/router";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";

import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

const register: NextPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const isInvalid = password === "" || email === "";
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [checkEmail, setCheckEmain] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  null;

  useEffect(() => {
    if (email) {
      onSnapshot(
        query(collection(db, "users"), where("email", "==", email)),
        (snapshot) => {
          setCheckEmain(snapshot.docs);
        }
      );
    } else {
      setCheckEmain([]);
    }

    [db, email];
  });

  const register = (e: any): void => {
    e.preventDefault();

    //reset errors
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);

    //validation
    if (username.length == 0) {
      setUsernameError("Too short");
      return setUsername("");
    }
    if (email.length == 0) {
      setEmailError("invalid Email");
      return setEmail("");
    }
    if (
      !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        email
      )
    ) {
      setEmailError("invalid email");
      return setEmail("");
    }
    if (password.length == 0) {
      setPasswordError("Too short");
      return setPassword("");
    }

    if (checkEmail.length > 0) {
      setError("User Exist");
      setEmail("");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((response) => {
          const uid = response.user.uid;
          const userRef = doc(db, "users", uid);
          setDoc(
            userRef,
            {
              email: email,
              username: username,
              uid: response.user.uid,
              password: password,
              photoURL:
                "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg",
            },
            { merge: true }
          );
        })
        .then(() => {
          const Updateuser: any = auth.currentUser;

          updateProfile(Updateuser, {
            displayName: username,
            photoURL:
              "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg",
          }).then(() => {
            console.log("profile update");
          });
        })
        .then((auth) => {
          //create user and logged in, redirect to homepage
          router.push("/");
        });
    }
  };

  return (
    <div className="bg-gray-100 h-screen grid place-items-center ">
      <Head>
        <title>Whatsapp - Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" bg-white w-11/12 md:w-2/3 h-2/3 p-4  flex flex-col items-center justify-center shadow-2xl">
        <img src={"/images/WhatsappLogo.png"} width={100} height={100} />
        {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

        <form className="flex flex-col w-full space-y-2">
          <input
            placeholder="username"
            className={`text-sm text-gray-500 w-full pr-3 py-5 px-4 border border-gray-primary rounded mb-2 focus-within:shadow-lg outline-none
            ${usernameError !== null && "border-2 border-red-500"}`}
            onChange={(event) => setUsername(event.target.value)}
          />
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
          onClick={register}
          type="submit"
          className="p-4 outline-none bg-[#0a8d48] text-white font-medium w-full shadow-md mt-2 hover:bg-white hover:text-[#0a8d48]"
        >
          Register
        </button>
        <div className="mt-4">
          <p className="">
            Have Account? Please
            <span
              onClick={() => router.push("/signin")}
              className="hover:underline cursor-pointer ml-1"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default register;
