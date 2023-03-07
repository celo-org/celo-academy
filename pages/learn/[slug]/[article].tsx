import { learn } from "@/constants/learn";
import { useUser } from "@/context/userContext";
import { siteConfig } from "@/site.config";
import { getAllLearns, getLearnFromSlug } from "@/utils/mdx";
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
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeSlug from "rehype-slug";

import { useAccount } from "wagmi";

const Articles = ({ learn, allArticles, mdxSource, frontmatter }: Props) => {
  const { address } = useAccount();
  const router = useRouter();
  const currentArticles = (router.query.article as string).split("-")[1];
  const slug = router.query.slug as string;
  const { user } = useUser();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (user == null || !user.name) {
      router.push("/signup");
    }
  }, [router, user]);

  useEffect(() => {
    if (hasMounted) highlight(); // <--- call the async function
  }, [hasMounted, mdxSource]);

  const highlight = async () => {
    Prism.highlightAll(); // <--- prepare Prism
  };

  const onPathwayCompletetion = async () => {
    try {
    } finally {
    }
  };

  return (
    <>
      <Head>
        <title>
          {siteConfig.siteTitle} | {learn.name} | Articles {currentArticles}
        </title>
      </Head>
      <section>
        <div className="flex flex-row justify-between items-center space-x-5 border-[3px] border-black p-5 rounded-2xl">
          <div className="flex flex-col items-start">
            <h1 className="text-black text-4xl font-semibold font-noto">
              {frontmatter.title}
            </h1>
            <h5 className="text-black text-base mt-0 font-noto mt-5">
              {frontmatter.description}
            </h5>
          </div>
        </div>
      </section>
      <section className="mt-4">
        <div className="w-full px-8 markdown-content">
          {hasMounted && mdxSource && <MDXRemote {...mdxSource} />}
        </div>
      </section>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  var paths: { params: { slug: string; article: string } }[] = [];
  // Get the paths we want to pre-render based on users
  await Promise.all(
    learn.map(async (learn) => {
      const articles = await getAllLearns(learn.key);
      // sort the articles by article, convert the article to number first
      articles.sort((a, b) => {
        return Number(a.article) - Number(b.article);
      });
      var articlePaths = articles.map((article) => ({
        params: { slug: learn.key, article: `${article.slug}` },
      }));
      paths = [...paths, ...articlePaths];
    })
  );
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const article = params?.article as string;
    const allArticles = await getAllLearns(slug);

    let { content, frontmatter } = await getLearnFromSlug(slug, article);
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
    // sort the articles by article, convert the article to number first
    allArticles.sort((a, b) => {
      return Number(a.article) - Number(b.article);
    });
    const item = learn.find((data) => data.key === slug);
    // frontmatter = { ...frontmatter, options: frontmatter.options.toString() };
    return { props: { learn: item, frontmatter, mdxSource, allArticles } };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
};

export default Articles;

type Props = {
  learn: {
    key: string;
    name: string;
    url: string;
    image: StaticImageData;
    desc: string;
    tags: string[];
  };
  allArticles: {
    slug: string;
    title: string;
    article: string;
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
    article: any;
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
