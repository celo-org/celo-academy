import fs from "fs";
import { sync } from "glob";
import matter from "gray-matter";
import path from "path";
import readingTime from "reading-time";

const pathwaysPath = path.join(process.cwd(), "pathways");

export async function getSlug(pathwaySlug: string) {
  const paths = sync(`${pathwaysPath}/${pathwaySlug}/*.mdx`);

  return paths.map((path) => {
    // holds the paths to the directory of the pathway
    const pathContent = path.split("/");
    const fileName = pathContent[pathContent.length - 1];
    const [slug, _extension] = fileName.split(".");

    return slug;
  });
}
export async function getPathwayFromSlug(pathwaySlug: string, slug: string) {
  const pathwayDir = path.join(pathwaysPath, pathwaySlug, `${slug}.mdx`);
  const source = fs.readFileSync(pathwayDir);
  const { content, data } = matter(source);

  return {
    content,
    frontmatter: {
      slug,
      title: data.title,
      lesson: data.lession,
      description: data.description,
      publishedAt: data.publishedAt,
      restriction: data.restriction,
      readingTime: readingTime(source.toString()).text,
      ...data,
    },
  };
}

export async function getAllPathways(pathwaySlug: string) {
  const lessons = fs.readdirSync(
    path.join(process.cwd(), "pathways", pathwaySlug)
  );

  return lessons.reduce<any[]>((allLessons: string[], lessonSlug: string) => {
    // get parsed data from mdx files in the "articles" dir
    const source = fs.readFileSync(
      path.join(process.cwd(), "pathways", pathwaySlug, lessonSlug),
      "utf-8"
    );
    const { data } = matter(source);

    return [
      {
        ...data,
        slug: lessonSlug.replace(".mdx", ""),
        title: data.title,
        lesson: data.lesson,
        description: data.description,
        restriction: data.restriction,
        readingTime: readingTime(source).text,
      },
      ...allLessons,
    ];
  }, []);
}

// Learn Section

const learnPath = path.join(process.cwd(), "learn");

export async function getLearnSlug(pathwaySlug: string) {
  const paths = sync(`${learnPath}/${pathwaySlug}/*.mdx`);

  return paths.map((path) => {
    // holds the paths to the directory of the pathway
    const pathContent = path.split("/");
    const fileName = pathContent[pathContent.length - 1];
    const [slug, _extension] = fileName.split(".");

    return slug;
  });
}
export async function getLearnFromSlug(pathwaySlug: string, slug: string) {
  const pathwayDir = path.join(learnPath, pathwaySlug, `${slug}.mdx`);
  const source = fs.readFileSync(pathwayDir);
  const { content, data } = matter(source);

  return {
    content,
    frontmatter: {
      slug,
      title: data.title,
      lesson: data.lession,
      description: data.description,
      publishedAt: data.publishedAt,
      image: data.image,
      readingTime: readingTime(source.toString()).text,
      ...data,
    },
  };
}

export async function getAllLearns(pathwaySlug: string) {
  const lessons = fs.readdirSync(
    path.join(process.cwd(), "learn", pathwaySlug)
  );

  return lessons.reduce<any[]>((allLessons: string[], lessonSlug: string) => {
    // get parsed data from mdx files in the "articles" dir
    const source = fs.readFileSync(
      path.join(process.cwd(), "learn", pathwaySlug, lessonSlug),
      "utf-8"
    );
    const { data } = matter(source);

    return [
      {
        ...data,
        slug: lessonSlug.replace(".mdx", ""),
        title: data.title,
        lesson: data.lesson,
        description: data.description,
        image: data.image,
        readingTime: readingTime(source).text,
      },
      ...allLessons,
    ];
  }, []);
}

export const components = {
  h2: (props: JSX.IntrinsicAttributes) => <h2 className="" {...props} />,
  pre: (props: JSX.IntrinsicAttributes) => <pre data-line {...props} />,
  code: (props: JSX.IntrinsicAttributes) => <code data-line {...props} />,
};
