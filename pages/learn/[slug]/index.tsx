/* eslint-disable react-hooks/exhaustive-deps */
import LearnLessonItem from "@/components/LearnLessonItem";
import { learn } from "@/constants/learn";
import { siteConfig } from "@/site.config";
import { getAllLearns } from "@/utils/mdx";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Img, { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

function Learn({ allLessons, learn }: Props) {
  const router = useRouter();
  const { address } = useAccount();
  const slug = router.query.slug as string;

  return (
    <>
      <Head>
        <title>
          {siteConfig.siteTitle} | {learn.name ?? "Learn"}
        </title>
        <meta name="description" content={learn.desc} key="desc" />
      </Head>
      <section>
        <div className="w-full">
          <section>
            <div className="rounded-3xl p-10 font-noto bg-gypsum flex flex-row flex-nowrap items-center">
              <div className="flex flex-col w-2/3 pr-8">
                <h1 className="text-3xl font-bold">{learn.name}</h1>
                <h4 className="text-base mt-2">{learn.desc}</h4>
                <div className="h-16 mt-5">
                  <button
                    className="button"
                    onClick={() => {
                      router.push(`/learn/${slug}/lesson-0`);
                    }}
                  >
                    Start Learn
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-1/3">
                <Img
                  src={learn.image}
                  className="rounded-2xl"
                  alt={learn.name}
                />
              </div>
            </div>
          </section>
          <section className="mt-10">
            <h1 className="text-3xl font-noto mb-8">Learn Structure</h1>
            {allLessons.map((lesson) => {
              return (
                <LearnLessonItem
                  key={lesson.slug}
                  lesson={lesson}
                  lessonNumber={lesson.lesson}
                  slug={slug}
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
    learn.map(async (learn) => {
      const articles = await getAllLearns(learn.key);
      // sort the articles by lesson, convert the lesson to number first
      articles.sort((a, b) => {
        return Number(a.lesson) - Number(b.lesson);
      });
      var lessonPaths = articles.map((article) => ({
        params: { slug: learn.key },
      }));
      paths = [...paths, ...lessonPaths];
    })
  );
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const allLessons = await getAllLearns(slug);

    // sort the articles by lesson, convert the lesson to number first
    allLessons.sort((a, b) => {
      return Number(a.lesson) - Number(b.lesson);
    });
    const item = learn.find((data) => data.key === slug);
    return { props: { learn: item, allLessons } };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
};

export default Learn;

type Props = {
  learn: {
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
    image: string;
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
