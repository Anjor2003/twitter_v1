import { db, storage } from "@/firebase";
import { useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { HiEmojiHappy, HiPhotograph, HiX } from "react-icons/hi";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function Input() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePIckerRef = useRef(null);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      text: input,
      userImg: session.user.image,
      timestamps: serverTimestamp(),
      name: session.user.name,
      username: session.user.username,
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }
    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <>
      {session && (
        <div className="flex border-b border-gray-200 p-3 space-x-3">
          <Image
            onClick={signOut}
            src={session.user.image}
            alt="user-icon"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
          />
          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-[16px] placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                rows="2"
                placeholder="What's happening?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            {selectedFile && (
              <div className="relative shadow-md cursor-pointer">
                <HiX
                  onClick={() => setSelectedFile(null)}
                  className="h-7 w-7 border border-black-200 absolute shadow-md shadow-white hover:bg-red-500 hover:text-white hover:shadow-none"
                />
                <picture>
                  <img
                    src={selectedFile}
                    alt="imagen seleccionada"
                    className={`${loading && "animate-pulse"}`}
                  />
                </picture>
              </div>
            )}
            {!loading && (
              <div className="flex items-center justify-between pt-2.5">
                <div className="flex">
                  <div
                    className=""
                    onClick={() => filePIckerRef.current.click()}
                  >
                    <HiPhotograph className="h-10 w-10 hoverEfecct p-2 text-sky-500 hover:bg-sky-100" />
                    <input
                      type="file"
                      hidden
                      ref={filePIckerRef}
                      onChange={addImageToPost}
                    />
                  </div>
                  <HiEmojiHappy className="h-10 w-10 hoverEfecct p-2 text-sky-500 hover:bg-sky-100" />
                </div>
                <button
                  className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold  shadow-md hover:brightness-95 disabled:opacity-50"
                  disabled={!input.trim()}
                  onClick={sendPost}
                >
                  Tweet
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
