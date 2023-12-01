import CommentModal from "@/components/CommentModal";
import Feed from "@/components/Feed";
import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";

export default function Home({ newsResults, randomUsersResults }) {
  return (
    <main className="flex min-h-screen mx-auto">
      {/*Sidebar  */}
      <Sidebar />

      {/* Feed  */}
      <Feed />

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
