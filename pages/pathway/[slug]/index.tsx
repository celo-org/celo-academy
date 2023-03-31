/* eslint-disable react-hooks/exhaustive-deps */
import LessonItem from "@/components/LessonItem";
import Loading from "@/components/common/Loading";
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
      <section>
        <div className="w-full">
          <section>
            <div className="rounded-3xl p-10 font-noto bg-gypsum flex flex-row flex-nowrap items-center">
              <div className="flex flex-col w-2/3 pr-8">
                <h1 className="text-3xl font-bold">{pathway?.name ?? ""}</h1>
                <h4 className="text-base mt-2">{pathway?.desc ?? ""}</h4>
                <div className="h-16 mt-5">
                  <button
                    className="button"
                    onClick={() => {
                      router.push(`/pathway/${slug}/lesson-0`);
                    }}
                  >
                    Start Pathway
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-1/3">
                <Img
                  src={pathway.image}
                  className="rounded-2xl"
                  alt={pathway.name}
                />
              </div>
            </div>
          </section>
          <section className="mt-10">
            {loading && <Loading />}
            {pathwayFBData && (
              <h1 className="text-3xl font-noto mb-8">Pathway Structure</h1>
            )}
            {!userAddress && (
              <div className="font-noto">
                Connect your wallet to see the lessons
              </div>
            )}
            {pathwayFBData &&
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
      </section>
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
    key: string;
    name: string;
    url: string;
    image: StaticImageData;
    desc: string;
    tags: string[];
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
