/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import InputField from "@/components/common/input";
import Loading from "@/components/common/Loading";
import { useUser } from "@/context/userContext";
import { siteConfig } from "@/site.config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [discord, setDiscord] = useState("");
  const [loading, setLoading] = useState(false);

  const [hasMounted, setHasMounted] = useState(false);

  const { address, isDisconnected } = useAccount();

  const { user, setUser } = useUser();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (user != null && user.name) {
      router.push("/pathways");
    }
  }, [router, user]);

  const signup = async () => {
    setLoading(true);
    try {
      if (email === "" || name === "" || country === "") {
        alert("Please fill all the fields");
        return;
      }
      await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          country,
          discord,
          address,
        }),
      });
      await setUser();
      router.push("/pathways");
    } finally {
      setLoading(false);
    }
  };

  if (isDisconnected) {
    return (
      <section>
        <div className="w-full flex mt-16 flex-row items-center ">
          <div className="w-1/2 bg-gypsum border-2 border-black px-8 rounded-xl py-16 mx-8">
            <div className="text-2xl font-noto font-semibold text-center">
              Please connect your wallet to continue
            </div>
          </div>
          <div className="w-1/2">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>{siteConfig.siteTitle} | Signup</title>
        <meta
          name="description"
          content={siteConfig.siteTitle + " | Signup Page"}
          key="desc"
        />
      </Head>
      <section>
        <div className="w-full flex mt-16 flex-row items-center ">
          <div className="w-1/2 bg-gypsum border-2 border-black px-8 rounded-xl py-16 mx-8">
            <div className="text-2xl font-noto font-semibold text-center">
              Complete your profile
            </div>
            {/* <h5 className="mt-8 font-noto"></h5> */}
            <div className="mt-3">
              <InputField
                value={email}
                placeholder={"Email address"}
                onChange={(e) => setEmail(e)}
              />
            </div>
            <div className="mt-4">
              <InputField
                value={name}
                placeholder={"Full name"}
                onChange={(e) => setName(e)}
              />
            </div>
            <div className="mt-4">
              <InputField
                value={country}
                placeholder={"Country"}
                onChange={(e) => setCountry(e)}
              />
            </div>
            <div className="mt-4">
              <InputField
                value={discord}
                placeholder={"Discord username (Optional)"}
                onChange={(e) => setDiscord(e)}
              />
            </div>
            <div className="mt-8 h-16">
              {loading ? (
                <Loading />
              ) : (
                <button
                  onClick={() => {
                    signup();
                  }}
                  className="w-full button-full hover:cursor-pointer"
                >
                  Sign up
                </button>
              )}
            </div>
          </div>
          <div className="w-1/2">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg" />
          </div>
        </div>
      </section>
    </>
  );
}
