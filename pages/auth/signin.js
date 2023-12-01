import { getProviders, signIn } from "next-auth/react";

export default function signin({ providers }) {
  return (
    <div className="flex justify-center mt-20 space-x-4">
      <picture>
        <img
          src="https://cdn.cms-twdigitalassets.com/content/dam/blog-twitter/archive/direct_message_syncmobilesearchimprovementsandmore95.thumb.1280.1280.png"
          alt="twitter image inside a phone"
          className="object-cover md:w-44 md:h-80 rotate-6 hidden md:inline-flex"
        />
      </picture>
      <div className="">
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="flex flex-col items-center">
            <picture>
              <img
                className="w-36 object-cover"
                src="https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png"
                alt="logo Twiiter"
              />
            </picture>
            <p className="text-sm italic my-10">
              This App is created for lerning purposes
            </p>
            <button
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="bg-red-400 rounded-lg p-3 text-gray-200 hover:bg-red-500"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
