import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { db, storage } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import Image from "next/image";
import {
  HiDotsHorizontal,
  HiOutlineChartBar,
  HiOutlineChatAlt,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineTrash,
  HiHeart,
} from "react-icons/hi";
import Moment from "react-moment";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/atom/modalAtom";
import { useRouter } from "next/router";

export default function Comment({ comment, commentId, originalPostId }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useRouter();

  useEffect(() => {
    const unSubscribe = onSnapshot(
      collection(db, "posts", originalPostId, "comments", commentId, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, originalPostId, commentId]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  async function likeComment() {
    if (session) {
      if (hasLiked) {
        await deleteDoc(
          doc(
            db,
            "posts",
            originalPostId,
            "comments",
            commentId,
            "likes",
            session?.user.uid
          )
        );
      } else {
        await setDoc(
          doc(
            db,
            "posts",
            originalPostId,
            "comments",
            commentId,
            "likes",
            session?.user.uid
          ),
          {
            username: session.user.username,
          }
        );
      }
    } else {
      signIn();
    }
  }

  async function deleteComment() {
    if (window.confirm("Estas seguro de borrar este comment?")) {
      deleteDoc(doc(db, "posts", originalPostId, "comments", commentId));
    }
  }
  return (
    <div className="flex p-3 border-b border-gray-200 pl-20">
      {/* User Imagen */}
      <picture>
        <img
          src={comment?.userImg}
          alt="user icono"
          className="h-11 w-11 rounded-full mr-4"
        />
      </picture>

      {/* Zona Derecha */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          {/* post user info */}
          <div className="flex items-center justify-between space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[14px] sm:text-[15px] hover:underline">
              {comment?.name}
            </h4>
            <span className="text-sm sm:text-[13px]">
              @{comment?.username} -{" "}
            </span>
            <span className="text-sm sm:text-[13px] hover:underline">
              <Moment fromNow>{comment?.timestamps?.toDate()}</Moment>
            </span>
          </div>
          {/* icon post */}
          <HiDotsHorizontal className="h-10 w-10 hoverEfecct hover:bg-sky-100 hover:text-sky-500" />
        </div>

        {/* post  text */}
        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2 px-8">
          {comment?.comment}
        </p>

        {/* icons  */}
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center justify-center select-none ">
            <HiOutlineChatAlt
              onClick={() => {
                if (!session) {
                  signIn();
                } else {
                  setPostId(originalPostId);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEfecct p-2 hover:text-sky-500 hover:bg-sky-100"
            />
          </div>
          {session?.user.uid === comment?.userId && (
            <HiOutlineTrash
              onClick={deleteComment}
              className="h-9 w-9 hoverEfecct p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HiHeart
                onClick={likeComment}
                className="h-9 w-9 hoverEfecct p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HiOutlineHeart
                onClick={likeComment}
                className="h-9 w-9 hoverEfecct p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes.length > 0 && (
              <span
                className={`${hasLiked && "text-red-500"} text-sm select-none`}
              >
                {likes.length}
              </span>
            )}
          </div>
          <HiOutlineShare className="h-9 w-9 hoverEfecct p-2 hover:text-sky-500 hover:bg-sky-100" />
          <HiOutlineChartBar className="h-9 w-9 hoverEfecct p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
}
