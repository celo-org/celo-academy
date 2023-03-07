import AddressDialog from "@/components/addressDialog";
import Loading from "@/components/common/Loading";
import CompletionDialog from "@/components/CompletionDialog";
import ImageDialog from "@/components/imageDialog";
import LessonSidebarItem from "@/components/LessonSidebarItem";
import QuizDialog from "@/components/quizDialog";
import YesDialog from "@/components/yesDialog";
import { pathways } from "@/constants/pathways";
import { useUser } from "@/context/userContext";
import { siteConfig } from "@/site.config";
import { getAllPathways, getPathwayFromSlug } from "@/utils/mdx";
import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import Prism from "prismjs";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-solidity";
import { useEffect, useState } from "react";
import ReactCustomizableProgressbar from "react-customizable-progressbar";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeSlug from "rehype-slug";

import { useAccount } from "wagmi";

const Lesson = ({ pathway, allLessons, mdxSource, frontmatter }: Props) => {
  const { address } = useAccount();
  const router = useRouter();
  const currentLesson = (router.query.lesson as string).split("-")[1];
  const slug = router.query.slug as string;
  const [pathwayFBData, setPathwayFBData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { user, userLoading } = useUser();

  const { isConnected } = useAccount();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!userLoading) {
      if (user == null || !user.name) {
        console.log("HERE");
        router.push("/signup");
      }
    }
  }, [router, user, userLoading]);

  useEffect(() => {
    if (hasMounted) highlight(); // <--- call the async function
  }, [hasMounted, mdxSource]);

  const highlight = async () => {
    Prism.highlightAll(); // <--- prepare Prism
  };

  const onSuccessfulCompletion = async () => {
    setLoading(true);
    try {
      var res = await fetch("/api/lesson-completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
          pathway: slug,
          lessonCompleted: currentLesson,
        }),
      });
      var decodedRes = await res.json();
      if (decodedRes["success"] == true) {
        router.push(`/pathway/${slug}/lesson-${Number(currentLesson) + 1}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onPathwayCompletetion = async () => {
    setLoading(true);
    try {
      var res = await fetch("/api/pathway-completed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
          pathway: slug,
          lessonCompleted: currentLesson,
        }),
      });
      var decodedRes = await res.json();
      if (decodedRes["success"] == true) {
        router.push(`/pathways`);
      }
    } finally {
      setLoading(false);
    }
  };

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
          lesson: currentLesson,
        }),
      });
      res = await res.json();
      getCompletedLessonPercentage(res);
      setPathwayFBData(res);
      setFetching(false);
    };
    pathwayApiCall();
  }, [address, currentLesson, slug]);

  const getCompletedLessonPercentage = (data: any) => {
    const totalLessons = allLessons.length;
    const lastCompletedLesson = Number(data.lastCompletedLesson) + 1;
    const percentage = (lastCompletedLesson / totalLessons) * 100;
    setCompletedPercentage(Math.round(percentage));
  };

  if (fetching) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>
          {siteConfig.siteTitle} | {pathway?.name} | Lesson {currentLesson}
        </title>
      </Head>
      <section>
        <div className="flex flex-row justify-between items-center space-x-5 border-[3px] border-black p-5 rounded-2xl">
          <div className="flex flex-col items-start">
            <h1 className="text-black text-4xl font-semibold font-noto">
              {pathway.name}
            </h1>
            <h3 className="text-black text-xl mt-3 font-noto">
              Lessons {currentLesson} of {allLessons.length}
            </h3>
            <h5 className="text-black text-base mt-0 font-noto">
              {frontmatter.description}
            </h5>
          </div>
          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="font-noto font-semibold">
                {completedPercentage}% Completed
              </div>
              <ReactCustomizableProgressbar
                radius={50}
                progress={completedPercentage}
                strokeWidth={4}
                trackStrokeWidth={4}
                pointerRadius={8}
                pointerStrokeWidth={8}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="mt-4">
        <div className="flex flex-row flex-wrap md:flex-nowrap">
          <div className="w-1/4">
            {}
            <div className="mt-3">
              {allLessons.map((lesson) => {
                return (
                  <LessonSidebarItem
                    key={lesson.slug}
                    lesson={lesson}
                    currentLesson={currentLesson}
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
            </div>
          </div>
          <div className="w-3/4 px-8 markdown-content">
            {hasMounted && mdxSource && <MDXRemote {...mdxSource} />}
            {frontmatter.restriction == "YesDialog" && (
              <YesDialog
                loading={loading}
                onSuccess={() => {
                  onSuccessfulCompletion();
                }}
                hasCompleted={
                  pathwayFBData &&
                  currentLesson <= pathwayFBData.lastCompletedLesson
                }
              />
            )}
            {frontmatter.restriction == "AddressDialog" && (
              <AddressDialog
                onSuccess={() => {
                  onSuccessfulCompletion();
                }}
                hasCompleted={
                  pathwayFBData &&
                  currentLesson <= pathwayFBData.lastCompletedLesson
                }
                loading={loading}
              />
            )}
            {frontmatter.restriction == "ImageDialog" && (
              <ImageDialog
                loading={loading}
                onSuccess={() => {
                  onSuccessfulCompletion();
                }}
                hasCompleted={
                  pathwayFBData &&
                  currentLesson <= pathwayFBData.lastCompletedLesson
                }
              />
            )}
            {frontmatter.restriction == "QuizDialog" &&
              frontmatter.question &&
              frontmatter.answer && (
                <QuizDialog
                  onSuccess={() => {
                    onSuccessfulCompletion();
                  }}
                  loading={loading}
                  question={frontmatter.question}
                  answer={frontmatter.answer}
                  options={[
                    frontmatter.option1,
                    frontmatter.option2,
                    frontmatter.option3,
                    frontmatter.option4,
                  ]}
                  hasCompleted={
                    pathwayFBData &&
                    currentLesson <= pathwayFBData.lastCompletedLesson
                  }
                />
              )}
            {frontmatter.restriction == "CompletionDialog" && (
              <CompletionDialog
                onSuccess={() => {
                  onPathwayCompletetion();
                }}
                hasCompleted={
                  pathwayFBData &&
                  currentLesson <= pathwayFBData.lastCompletedLesson
                }
                loading={loading}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  var paths: { params: { slug: string; lesson: string } }[] = [];
  await Promise.all(
    pathways.map(async (pathway) => {
      const articles = await getAllPathways(pathway.key);
      articles.sort((a, b) => {
        return Number(a.lesson) - Number(b.lesson);
      });
      var lessonPaths = articles.map((article) => ({
        params: { slug: pathway.key, lesson: `lesson-${article.lesson}` },
      }));
      paths = [...paths, ...lessonPaths];
    })
  );
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const lesson = params?.lesson as string;
    const allLessons = await getAllPathways(slug);
    let { content, frontmatter } = await getPathwayFromSlug(slug, lesson);
    const mdxSource = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              properties: { className: ["anchor"] },
            },
            { behaviour: "wrap" },
          ],
          rehypeCodeTitles,
        ],
      },
    });
    // sort the articles by lesson, convert the lesson to number first
    allLessons.sort((a, b) => {
      return Number(a.lesson) - Number(b.lesson);
    });
    const item = pathways.find((data) => data.key === slug);
    // frontmatter = { ...frontmatter, options: frontmatter.options.toString() };
    return { props: { pathway: item, frontmatter, mdxSource, allLessons } };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
};

export default Lesson;

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
  mdxSource: MDXRemoteSerializeResult;
  frontmatter: {
    restriction: string;
    slug: string;
    title: any;
    lesson: any;
    description: any;
    publishedAt: any;
    readingTime: string;
    question: string;
    answer: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  };
  errors?: string;
};
