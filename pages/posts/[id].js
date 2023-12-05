import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";
import Comment from "@/components/Comment";
import CommentModal from "@/components/CommentModal";
import Widgets from "@/components/Widgets";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PostPage({ newsResults, randomUsersResults }) {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  // Get de Post data
  useEffect(() =>
    onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot), [db, id])
  );

  // get Comments of Posts
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [id]);

  return (
    <main className="flex min-h-screen mx-auto">
      {/*Sidebar  */}
      <Sidebar />

      {/* Post  */}
      <div className="sm:ml-[65px] lg:ml-[250px] border-l border-r border-gray-200 lg:min-w-[576px] flex-grow max-w-xl">
        <div className="flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="hoverEfecct" onClick={() => router.push("/")}>
            <HiOutlineArrowLeft className="h-5 w-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Tweet</h2>
        </div>
        <Post id={id} post={post} />
        {comments.length > 0 && (
          <div className="">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Comment
                    key={comment.id}
                    commentId={comment.id}
                    originalPostId={id}
                    comment={comment.data()}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Widgets */}
      <Widgets
        newsResults={newsResults.articles}
        randomUsersResults={randomUsersResults.results}
      />

      {/* modal */}
      <CommentModal />
    </main>
  );
}

// API Noticias

export async function getServerSideProps() {
  const newsResults = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
  ).then((res) => res.json());

  // Who to follow section
  const randomUsersResults = await fetch(
    "https://randomuser.me/api/?results=50&nat=ES&inc=name,login,picture"
  ).then((res) => res.json());
  return {
    props: {
      newsResults,
      randomUsersResults,
    },
  };
}
