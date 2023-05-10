/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Avatars from "./avatars";

type Props = {
  lesson: {
    slug: string;
    title: string;
    lesson: string;
    readingTime: string;
    description: string;
  };
  lessonNumber: string;
  slug: string;
  lastCompletedLesson: string;
  totalCompletes: number;
};

function LessonItem({
  lesson,
  slug,
  lastCompletedLesson,
  lessonNumber,
  totalCompletes,
}: Props) {
  const isLocked =
    lessonNumber != "0" &&
    Number(lessonNumber) > Number(lastCompletedLesson) + 1;

  return (
    <div
      key={lesson.slug}
      className={`md:py-6 py-3 px-5 md:px-8 hover:bg-gypsum md:rounded-xl rounded-none mb-1 bg-light flex md:flex-row flex-col flex-nowrap justify-between md:items-center items-end`}
    >
      <Link
        href={isLocked ? "#" : `/pathway/${slug}/lesson-${lesson.lesson}`}
        className="text-decoration-none hover:cursor-pointer w-full"
      >
        <div className="flex flex-row flex-nowrap items-center font-noto text-black w-full">
          <div className="w-1/6 md:w-1/12">
            {isLocked ? <LockIcon /> : <StartIcon />}
          </div>
          <div className="flex flex-col w-5/6 md:w-11/12 pr-5">
            <p className="font-bold text-lg pb-0 mb-0">
              Lesson {lesson.lesson} - {lesson.title}
            </p>
            <p>{lesson.description}</p>
          </div>
        </div>
      </Link>
      <div className="flex flex-row items-center justify-center">
        {totalCompletes > 0 && <Avatars totalCompletes={totalCompletes} />}
        <span className="text-black font-noto">
          {totalCompletes ?? 0} {totalCompletes <= 1 ? "person" : "people"}{" "}
          completed
        </span>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="red"
      className="w-7 h-7 mr-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function StartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="green"
      className="w-7 h-7 mr-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
      />
    </svg>
  );
}

export default LessonItem;
