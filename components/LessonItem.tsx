import Link from "next/link";

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
};

function LessonItem({
  lesson,
  slug,
  lastCompletedLesson,
  lessonNumber,
}: Props) {
  const isLocked =
    lessonNumber != "0" &&
    Number(lessonNumber) > Number(lastCompletedLesson) + 1;
  return (
    <div
      key={lesson.slug}
      className={`py-6 px-8 hover:bg-gypsum hover:cursor-pointer rounded-xl mb-1 bg-light`}
    >
      <Link
        href={isLocked ? "#" : `/pathway/${slug}/lesson-${lesson.lesson}`}
        className="text-decoration-none"
      >
        <div className="font-noto text-black">
          <div className="flex flex-row flex-nowrap items-center">
            {isLocked ? <LockIcon /> : <StartIcon />}
            <div className="flex flex-col">
              <p className="font-bold text-lg pb-0 mb-0">
                Lesson {lesson.lesson} - {lesson.title}
              </p>
              <p>{lesson.description}</p>
            </div>
          </div>
        </div>
      </Link>
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
