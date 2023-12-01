export default function News({ article }) {
  return (
    <a rel="noreferrer" href={article.url} target="_blank">
      <div className="flex flex-col items-start justify-between py-2 px-6 space-x-1 hover:bg-gray-300 transition duration-500 ease-out">
        <div className="space-y-0.5 mb-2">
          <h6 className="text-sm font-semibold">{article.title}</h6>
          <p className="text-xs font-medium text-gray-500">
            {article.source.name}
          </p>
        </div>
        <picture>
          <img
            className="hover:scale-105 transition duration-500"
            src={article.urlToImage}
            width={330}
            alt="imagen news"
          />
        </picture>
      </div>
    </a>
  );
}
