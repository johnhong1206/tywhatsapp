import React, { useEffect, FC, useContext, useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";

import { AiFillInstagram } from "react-icons/ai";
import { MdCancel } from "react-icons/md";

import { useRouter } from "next/router";
import Head from "next/head";

//firebase.create
import { db, storage, auth } from "../config/firebase";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { updateProfile } from "firebase/auth";

import {
  collection,
  addDoc,
  doc,
  query,
  serverTimestamp,
  where,
  getDocs,
  updateDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const UpdateModal: FC = () => {
  const user = useContext(AuthContext);

  const imgPickerRef = useRef<any>(null);
  const [imgToPost, setImgtoPost] = useState<any>("");
  const [haveImg, setHaveImg] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [profilemage, setProfileImage] = useState<any>("");

  const addImgtoPost = (e: any) => {
    const reader = new FileReader();
    setHaveImg(true);
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }

    reader.onload = (readerEvent: any) => {
      setImgtoPost(readerEvent.target.result);
    };
  };

  const removeImg = () => {
    setHaveImg(false);
    setImgtoPost(null);
  };

  const uploadProfile = async () => {
    alert("uploading");
    const imageRef = ref(storage, `profileImage/${profilemage?.name}/image`);
    uploadString(imageRef, imgToPost, "data_url")
      .then(() => {
        const downloadURL = getDownloadURL(imageRef);

        const userRef = doc(db, "users", user?.uid as string);
        updateDoc(doc(db, "users", user?.uid as string), {
          photoURL: downloadURL,
        });
      })
      .then(() => {
        setLoading(false);
        setImgtoPost(null);
      });
  };

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);

    // Create a post & add to firestore 'posts' collection
    // Get the post ID for newly created post
    // Upload the image to firebase storage with the post ID
    // Get a download URL from firebase storage and update the original post with image

    const imageRef = ref(storage, `posts/${user?.uid}/image`);
    await uploadString(imageRef, imgToPost, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        const Updateuser = user ? auth?.currentUser : null;

        await updateDoc(doc(db, "users", user?.uid as string), {
          photoURL: downloadURL,
        });
      }
    );
    setLoading(false);
    setImgtoPost(null);
    router.reload();
  };

  return (
    <div className="fixed z-50 inset-1 overflow-y-auto">
      <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 pb-20 text-center sm:block sm:p-0 bg-gray-500 bg-opacity-50 transition-opacity">
        <span
          className="hiddem sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>
        <div
          className=" inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all
        sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
        >
          <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
            {imgToPost && (
              <div
                onClick={removeImg}
                className="flex flex-col items-center justify-center filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
              >
                <img
                  className={`h-60 w-60 object-contain ${
                    loading && "opacity-50"
                  }`}
                  src={imgToPost}
                  alt=""
                />
                <p className="text-xs text-red-500 text-center">Remove</p>
              </div>
            )}

            <div className="flex space-x-4 items-center p-4">
              <img
                className="rounded-full h-12 w-12 "
                src={user?.photoURL as string}
                alt={user?.displayName as string}
              />
              <form className="flex flex-1">
                <button hidden onClick={uploadPost}>
                  Submit
                </button>
              </form>
            </div>
            <div className="flex items-center justify-between">
              {haveImg && (
                <div className="inputIcon" onClick={uploadPost}>
                  <AiFillInstagram
                    className={`h-8 w-8 text-pink-500 cursor-pointer opacity-50 inputIcon ${
                      !imgPickerRef && "opacity-100"
                    }`}
                  />
                  <p className="text-xs sm:text-sm lg:text-base">Upload</p>
                </div>
              )}

              <div
                className="inputIcon"
                onClick={() => imgPickerRef.current.click()}
              >
                <BsFillImageFill className="h-8 w-8 text-green-500 cursor-pointer" />
                <p className="text-xs sm:text-sm lg:text-base">Photo</p>
                <input
                  ref={imgPickerRef}
                  type="file"
                  hidden
                  onChange={addImgtoPost}
                />
              </div>
              <div className="inputIcon">
                <MdCancel
                  className={`h-8 w-8 text-red-500 cursor-pointer opacity-50 ${
                    !imgPickerRef && "opacity-100"
                  }`}
                />
                <p className="text-xs sm:text-sm lg:text-base">Cancel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
