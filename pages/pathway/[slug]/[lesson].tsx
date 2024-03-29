import LessonSidebarItem from "@/components/LessonSidebarItem";
import Avatars from "@/components/avatars";
import Loading from "@/components/common/Loading";
import CompletionDialog from "@/components/dialog/CompletionDialog";
import AddressDialog from "@/components/dialog/addressDialog";
import ImageDialog from "@/components/dialog/imageDialog";
import QuizDialog from "@/components/dialog/quizDialog";
import YesDialog from "@/components/dialog/yesDialog";
import { pathways } from "@/constants/pathways";
import { useUser } from "@/context/userContext";
import useIsMobile from "@/hooks/useIsMobile";
import { siteConfig } from "@/site.config";
import { getAllPathways, getPathwayFromSlug } from "@/utils/mdx";
import { XCircleIcon } from "@heroicons/react/24/solid";
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
  const lesson = router.query.lesson as string;
  const [pathwayFBData, setPathwayFBData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [fetching, setFetching] = useState(true);
  const { user, userLoading } = useUser();
  const [stats, setStats] = useState<any>(null);

  const lessonNumber = (router.query.lesson as string).split("-")[1];
  const [lessonsMenuOpen, setLessonsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleLessonsMenu = () => {
    setLessonsMenuOpen(!lessonsMenuOpen);
  };

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!userLoading) {
      if (user == null || !user.name) {
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
    if (
      pathwayFBData &&
      currentLesson <= (pathwayFBData.lastCompletedLesson ?? 0)
    ) {
      router.push(`/pathway/${slug}/lesson-${Number(currentLesson) + 1}`);
    } else {
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
    }
  };

  const onPathwayCompletetion = async () => {
    setLoading(true);
    if (
      pathwayFBData &&
      currentLesson <= (pathwayFBData.lastCompletedLesson ?? 0)
    ) {
      router.push(`/pathways`);
    } else {
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

      getCompletedLessonPercentage(res);
      setPathwayFBData(res);
      setFetching(false);
    };
    pathwayApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, allLessons.length, currentLesson, slug]);

  const getCompletedLessonPercentage = (data: any) => {
    if (data == null || data.lastCompletedLesson == null) {
      setCompletedPercentage(0);
      return;
    }
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
      {isMobile && (
        <div
          id="menu"
          className={`fixed z-50 flex flex-col justify-start items-start bg-white duration-100 py-5 mx-5 border-2 border-black rounded-xl ${
            lessonsMenuOpen
              ? "w-[350px] h-[500px] opacity-100"
              : "w-0 h-0 opacity-0"
          }`}
        >
          <XCircleIcon
            className="w-8 h-8 ml-4"
            stroke="white"
            onClick={() => {
              toggleLessonsMenu();
            }}
          />
          <div className="flex flex-col text-black text-center text-xl font-light space-y-3 mt-4 w-full h-[450px] overflow-auto">
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
      )}
      <Head>
        <title>
          {siteConfig.siteTitle} | {pathway?.name} | Lesson {currentLesson}
        </title>
      </Head>
      <section>
        <div className="flex flex-row justify-between items-center space-x-5 border-[3px] border-black md:p-5 p-3 rounded-2xl mx-3 md:mx-0">
          <div className="flex flex-col items-start">
            <h1 className="text-black md:text-4xl text-2xl font-semibold font-noto">
              {pathway.name}
            </h1>
            <h3 className="text-black md:text-xl text-lg mt-3 font-noto">
              Lessons {currentLesson} of {allLessons.length}
            </h3>
            <h5 className="text-black md:text-base text-sm mt-0 font-noto">
              {frontmatter.description}
            </h5>
          </div>
          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="font-noto font-semibold md:text-base text-sm">
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
          <div className="hidden md:block w-1/4">
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
          <div className="md:w-3/4 w-full md:px-8 px-6 markdown-content">
            <button
              onClick={() => {
                toggleLessonsMenu();
              }}
              className="button-full w-full block md:hidden"
            >
              All Lesson
            </button>
            <div className="mt-3 md:mt-0">
              {stats && (
                <Avatars
                  totalCompletes={stats[lessonNumber] ?? 0}
                  showToolTip={false}
                />
              )}
            </div>
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
