/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import PathwayCard from "@/components/common/PathwayCard";
import { pathways } from "@/constants/pathways";
import { useUser } from "@/context/userContext";
import { siteConfig } from "@/site.config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>{siteConfig.siteTitle}</title>
        <meta
          name="description"
          content={siteConfig.siteDescription}
          key="desc"
        />
      </Head>
      <section>
        <div className="w-full">
          {/* <!-- Hero section --> */}
          <div id="hero" className="w-full">
            <section className="flex flex-row items-center">
              <div className="lg:w-1/2 w-full mt-12 xl:mt-10 space-y-4 sm:space-y-6 px-6 text-center sm:text-left">
                <span className="text-base text-gradient font-semibold uppercase text-black font-noto">
                  {siteConfig.homepage.titleHeader}
                </span>
                <h1 className="text-[2.5rem] sm:text-4xl xl:text-6xl font-bold leading-tight capitalize sm:pr-8 xl:pr-10 text-black font-noto">
                  {siteConfig.homepage.title}
                </h1>
                <p className="text-xl hidden sm:block text-black font-noto mt-0">
                  {siteConfig.homepage.subTitle}
                </p>
                <div className="h-10">
                  <button
                    className="button"
                    onClick={() => {
                      if (user && user.name) {
                        router.push("/pathways");
                      } else {
                        router.push("/signup");
                      }
                    }}
                  >
                    {siteConfig.homepage.actionButton}
                  </button>
                </div>
              </div>
              <div className="hidden sm:block lg:w-1/2 w-full">
                <div className="w-full">
                  <img
                    src={siteConfig.homepage.heroImage}
                    className="-mt-4"
                    alt=""
                  />
                </div>
              </div>
              <img
                src="https://raw.githubusercontent.com/RSurya99/nefa/main/assets/img/pattern/ellipse-1.png"
                className="hidden sm:block absolute bottom-12 xl:bottom-16 left-4 xl:left-0 w-6"
              />
              <img
                src="https://raw.githubusercontent.com/RSurya99/nefa/main/assets/img/pattern/ellipse-2.png"
                className="hidden sm:block absolute top-40 sm:top-20 right-52 sm:right-96 xl:right-[32rem] w-6"
              />
              <img
                src="https://raw.githubusercontent.com/RSurya99/nefa/main/assets/img/pattern/ellipse-3.png"
                className="hidden sm:block absolute bottom-56 right-24 w-6"
              />
              <img
                src="https://raw.githubusercontent.com/RSurya99/nefa/main/assets/img/pattern/ellipse-3.png"
                className="hidden sm:block absolute top-20 sm:top-28 right-16 lg:right-0 lg:left-[30rem] w-8"
              />
            </section>
          </div>

          {/* <section className="brelative max-w-full sm:mx-4 my-20 py-16 shadow-xl rounded-2xl overflow-hidden">
            <div className="relative max-w-screen-xl px-4 sm:px-2 mx-auto grid grid-cols-12 gap-x-6">
              <div className="col-span-12 lg:col-span-6">
                <div className="w-full sm:mt-20 xl:mt-0">
                  <img
                    src="/website-images/announcing-celo-academy.png"
                    className="w-full"
                    alt=""
                  />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 space-y-8 sm:space-y-6 px-4 sm:px-6 mt-8">
                <h2 className="text-4xl font-semibold text-black font-noto">
                  Announcing Celo Academy
                  <span className="text-header-gradient text-black font-noto ml-3">
                    Tools
                  </span>
                </h2>
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-black font-noto">
                    A Place to learn Web3 hands-on
                  </h4>
                  <p className="paragraph text-sm xl:text-base text-black font-noto">
                    Welcome to Celo Academy, the premier platform for web3
                    developers to learn about the exciting world of
                    decentralized applications (dApps).
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-black font-noto">
                    Mission
                  </h4>
                  <p className="paragraph text-sm xl:text-base text-black font-noto">
                    Our mission is to empower developers like you with the
                    knowledge and skills necessary to build dApps on multiple
                    frameworks, including Celo, Ethereum, and more. Whether
                    you&apos;re a beginner or an experienced developer, we have
                    the resources you need to succeed.
                  </p>
                </div>
              </div>
            </div>
          </section> */}

          <section>
            {/* Show two cards in one line using grid */}
            <div className="lg:mt-0 mt-10 w-full grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-0 lg:gap-5 px-5 lg:px-0">
              {pathways.map((data) => (
                <PathwayCard key={data.key} data={data} />
              ))}
            </div>
          </section>

          {/* <!-- Industry-leading security section --> */}
          <section className="w-full my-24">
            <div className="relative max-w-screen-xl px-8 mx-auto flex flex-wrap flex-row-reverse items-center">
              <div className="lg:w-1/2 w-full lg:col-span-6">
                <div className="w-full">
                  <img
                    src={siteConfig.homepage.featureSection.image}
                    className="w-full"
                    alt=""
                  />
                </div>
              </div>
              <div className="lg:w-1/2 w-full lg:col-span-5 space-y-8 sm:space-y-6 mt-8 xl:px-8">
                <h2 className="text-4xl font-semibold text-black font-noto">
                  {siteConfig.homepage.featureSection.title}
                </h2>
                <ul className="space-y-8 sm:space-y-4 text-lg">
                  <p className="leading-relaxed text-black font-noto">
                    {siteConfig.homepage.featureSection.subTitle}
                  </p>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
