import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { HiEmojiHappy, HiPhotograph, HiX } from "react-icons/hi";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";
import Moment from "react-moment";
import { useSession } from "next-auth/react";

export default function CommentModal() {
  const [open, setOpen] = useRecoilState(modalState);
  const [postId] = useRecoilState(postIdState);
  const [post, setPost] = useState({});
  const [input, setInput] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    onSnapshot(doc(db, "posts", postId), (snapshot) => {
      setPost(snapshot);
    });
  }, [postId, db]);

  async function sendComment() {
    await addDoc(collection(db, "posts", postId, "comments"), {
      comment: input,
      name: session.user.name,
      username: session.user.username,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
      userId: session.user.uid,
    });
    setOpen(false);
    setInput("");
    router.push(`/posts/${postId}`);
  }

  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md"
        >
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <div
                onClick={() => setOpen(false)}
                className="hoverEfecct w-9 h-9 flex items-center justify-center"
              >
                <HiX className="w-[22px] h-[22px] text-gray-700" />
              </div>
            </div>
            <div className="p-2 flex items-center space-x-2 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-11 top-11 bg-gray-300" />
              <Image
                src={post?.data()?.userImg}
                alt="user icono"
                width={44}
                height={44}
                className="h-14 w-14 rounded-full mr-1 mt-2 p-2"
              />
              <h4 className="font-bold text-[14px] sm:text-[15px] hover:underline">
                {post?.data()?.name}
              </h4>
              <span className="text-sm sm:text-[13px]">
                @{post?.data()?.username} -{" "}
              </span>
              <span className="text-sm sm:text-[13px] hover:underline">
                <Moment fromNow>{post?.data()?.timestamps?.toDate()}</Moment>
              </span>
            </div>
            <p className="text-gray-500 text-[15px] sm:text-[16px] ml-20 mb-2">
              {post?.data()?.text}
            </p>
            <div className="flex px-5 py-2 space-x-2">
              <Image
                src={session.user.image}
                alt="user-icon"
                width={30}
                height={30}
                className="h-10 w-10 rounded-full cursor-pointer hover:brightness-95 ml-1"
              />
              <div className="w-full divide-y divide-gray-200">
                <div className="">
                  <textarea
                    className="w-full border-none focus:ring-0 text-[16px] placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                    rows="4"
                    placeholder="Tweet your reply"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex items-center justify-between pt-2.5">
                  <div className="flex">
                    <div
                      className=""
                      // onClick={() => filePIckerRef.current.click()}
                    >
                      <HiPhotograph className="h-10 w-10 hoverEfecct p-2 text-sky-500 hover:bg-sky-100" />
                      {/* <input
                        type="file"
                        hidden
                        ref={filePIckerRef}
                        onChange={addImageToPost}
                      /> */}
                    </div>
                    <HiEmojiHappy className="h-10 w-10 hoverEfecct p-2 text-sky-500 hover:bg-sky-100" />
                  </div>
                  <button
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold  shadow-md hover:brightness-95 disabled:opacity-50"
                    disabled={!input.trim()}
                    onClick={sendComment}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
