/* eslint-disable react-hooks/exhaustive-deps */
import LessonItem from "@/components/LessonItem";
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
  const slug = router.query.slug as string;
  const [pathwayFBData, setPathwayFBData] = useState<any>(null);
  const [completedPercentage, setCompletedPercentage] = useState(0);

  useEffect(() => {
    const pathwayApiCall = async () => {
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
      getCompletedLessonPercentage(res);
      setPathwayFBData(res);
    };
    pathwayApiCall();
  }, [address, slug]);

  const getCompletedLessonPercentage = (data: any) => {
    const totalLessons = allLessons.length;
    const lastCompletedLesson = Number(data.lastCompletedLesson) + 1;
    const percentage = (lastCompletedLesson / totalLessons) * 100;
    setCompletedPercentage(Math.round(percentage));
  };

  return (
    <>
      <Head>
        <title>
          {siteConfig.siteTitle} | {pathway.name}
        </title>
        <meta name="description" content={pathway.desc} key="desc" />
      </Head>
      <section>
        <div className="w-full">
          <section>
            <div className="rounded-3xl p-10 font-noto bg-gypsum flex flex-row flex-nowrap items-center">
              <div className="flex flex-col w-2/3 pr-8">
                <h1 className="text-3xl font-bold">{pathway.name}</h1>
                <h4 className="text-base mt-2">{pathway.desc}</h4>
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
            <h1 className="text-3xl font-noto mb-8">Pathway Structure</h1>
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
    return { props: { pathway: item, allLessons } };
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
};
