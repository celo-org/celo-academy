/* eslint-disable react-hooks/exhaustive-deps */
import LessonItem from "@/components/LessonItem";
import PathwayStructureShimmer from "@/components/shimmers/PathwayStructureShimmer";
import { pathways } from "@/constants/pathways";
import { siteConfig } from "@/site.config";
import { getAllPathways } from "@/utils/mdx";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Img, { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

function Pathway({ allLessons, pathway }: Props) {
  const router = useRouter();
  const { address } = useAccount();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const slug = router.query.slug as string;
  const [pathwayFBData, setPathwayFBData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const pathwayApiCall = async () => {
      setLoading(true);
      var res = await fetch("/api/pathway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
          pathway: slug,
        }),
      });
      res = await res.json();

      // getting stats
      var statsRes = await fetch("/api/get-lesson-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalLessons: allLessons.length,
          pathway: slug,
        }),
      });
      var statsData = await statsRes.json();

      setStats(statsData["resData"]);
      setPathwayFBData(res);
      setLoading(false);
    };
    if (address) {
      pathwayApiCall();
      setUserAddress(address);
    } else {
      setUserAddress(null);
    }
  }, [address, slug]);

  if (!pathway) {
    return <div>Pathway not found</div>;
  }

  return (
    <>
      <Head>
        <title>
          {siteConfig.siteTitle} | {pathway?.name ?? ""}
        </title>
        <meta name="description" content={pathway?.desc ?? ""} key="desc" />
      </Head>
      <div>
        <section>
          <div className="rounded-2xl border-2 border-black flex flex-col-reverse md:flex-row justify-between py-3 md:px-6 px-3 bg-gypsum mx-3 md:mx-0">
            <div className="md:w-3/5 w-full md:py-5 py-4 md:px-6 px-3">
              <p className="font-code font-bold mt-2 mb-4">
                [ {pathway.tagLine} ]
              </p>
              <h3 className="text-black font-noto text-3xl md:text-4xl">
                {pathway.name}
              </h3>
              <p className="text-black font-noto text-sm md:text-base mt-5">
                {pathway.desc}
              </p>
              <p className="font-noto font-semibold mt-8 mb-2">
                SKILLS YOU&apos;LL LEARN
              </p>
              <div className="inline-flex flex-row flex-wrap">
                {pathway.skills.map((skill) => (
                  <div
                    key={skill}
                    className="px-2 py-1 border-2 border-black rounded-lg font-noto text-sm font-semibold whitespace-nowrap mt-2 mr-2"
                  >
                    {skill}
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-row font-semibold mt-8 mb-2 font-noto ">
                <div className="w-1/3 flex flex-col justify-start">
                  <span>{pathway.preRequisites}</span>
                  <span className="font-code text-sm mt-1">pre-requisites</span>
                </div>
                <div className="w-1/3 flex flex-col justify-start">
                  <span>{pathway.skillLevel}</span>
                  <span className="font-code text-sm mt-1">kills</span>
                </div>
                <div className="w-1/3 flex flex-col justify-start">
                  <span>{pathway.timeToComplete}</span>
                  <span className="font-code text-sm mt-1">
                    time to complete
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/5 flex justify-end items-start">
              <Img
                src={pathway.image}
                className="rounded-2xl m-0 md:m-3"
                alt={pathway.name}
                width={400}
              />
            </div>
          </div>
        </section>
        <section className="mt-10">
          {loading && <PathwayStructureShimmer />}
          {!loading && pathwayFBData && (
            <h1 className="text-3xl font-noto md:mb-8 mb-4 ml-4 md:ml-0">
              Pathway Structure
            </h1>
          )}
          {!userAddress && (
            <div className="font-noto text-center">
              Connect your wallet to see the lessons
            </div>
          )}
          {!loading &&
            pathwayFBData &&
            allLessons.map((lesson) => {
              return (
                <LessonItem
                  key={lesson.slug}
                  lesson={lesson}
                  lessonNumber={lesson.lesson}
                  slug={slug}
                  lastCompletedLesson={
                    pathwayFBData && pathwayFBData.lastCompletedLesson
                      ? pathwayFBData.lastCompletedLesson
                      : "0"
                  }
                  totalCompletes={stats[lesson.lesson]}
                />
              );
            })}
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  var paths: { params: { slug: string } }[] = [];
  // Get the paths we want to pre-render based on users
  await Promise.all(
    pathways.map(async (pathway) => {
      const articles = await getAllPathways(pathway.key);
      // sort the articles by lesson, convert the lesson to number first
      articles.sort((a, b) => {
        return Number(a.lesson) - Number(b.lesson);
      });
      var lessonPaths = articles.map((article) => ({
        params: { slug: pathway.key },
      }));
      paths = [...paths, ...lessonPaths];
    })
  );
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const allLessons = await getAllPathways(slug);

    // sort the articles by lesson, convert the lesson to number first
    allLessons.sort((a, b) => {
      return Number(a.lesson) - Number(b.lesson);
    });
    const item = pathways.find((data) => data.key === slug);
    return { props: { pathway: item, allLessons, stats: {} } };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
};

export default Pathway;

type Props = {
  pathway: {
    name: string;
    url: string;
    image: StaticImageData;
    desc: string;
    tags: string[];
    skills: string[];
    preRequisites: string;
    skillLevel: string;
    timeToComplete: string;
    tagLine: string;
  };
  allLessons: {
    slug: string;
    title: string;
    lesson: string;
    readingTime: string;
    description: string;
    restriction: string;
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  }[];
  stats: any;
};
