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

export default function Post({ post, id }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const router = useRouter();

  useEffect(() => {
    const unSubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    const unSubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  async function likePost() {
    if (session) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", session?.user.uid), {
          username: session.user.username,
        });
      }
    } else {
      signIn();
    }
  }

  async function deletePost() {
    if (window.confirm("Estas seguro de borrar este post?")) {
      deleteDoc(doc(db, "posts", id));
      if (post.data().image) {
        deleteObject(ref(storage, `posts/${id}/image`));
      }
      router.push("/");
    }
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      {/* User Imagen */}
      <picture>
        <img
          src={post?.data()?.userImg}
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
              {post?.data()?.name}
            </h4>
            <span className="text-sm sm:text-[13px]">
              @{post?.data()?.username} -{" "}
            </span>
            <span className="text-sm sm:text-[13px] hover:underline">
              <Moment fromNow>{post?.data()?.timestamps?.toDate()}</Moment>
            </span>
          </div>
          {/* icon post */}
          <HiDotsHorizontal className="h-10 w-10 hoverEfecct hover:bg-sky-100 hover:text-sky-500" />
        </div>

        {/* post  text */}
        <p
          onClick={() => router.push(`/posts/${id}`)}
          className="text-gray-800 text-[15px] sm:text-[16px] mb-2 px-8"
        >
          {post?.data()?.text}
        </p>

        {/* post image */}
        <picture>
          <img
            onClick={() => router.push(`/posts/${id}`)}
            src={post?.data()?.image}
            alt=""
            className="w-full rounded-2xl mr-2 object-contain p-2"
          />
        </picture>

        {/* icons  */}
        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center justify-center select-none ">
            <HiOutlineChatAlt
              onClick={() => {
                if (!session) {
                  signIn();
                } else {
                  setPostId(id);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEfecct p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {comments.length > 0 && (
              <span className="text-sm sm:text-[14px]">{comments.length}</span>
            )}
          </div>
          {session?.user.uid === post?.data()?.id && (
            <HiOutlineTrash
              onClick={deletePost}
              className="h-9 w-9 hoverEfecct p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HiHeart
                onClick={likePost}
                className="h-9 w-9 hoverEfecct p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HiOutlineHeart
                onClick={likePost}
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
