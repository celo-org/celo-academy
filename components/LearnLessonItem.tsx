import Link from "next/link";

type Props = {
  lesson: {
    slug: string;
    title: string;
    lesson: string;
    readingTime: string;
    image: string;
    description: string;
  };
  lessonNumber: string;
  slug: string;
};

function LearnLessonItem({ lesson, slug, lessonNumber }: Props) {
  return (
    <div
      key={lesson.slug}
      className={`py-6 px-8 hover:bg-gypsum hover:cursor-pointer rounded-xl mb-1 bg-light`}
    >
      <Link
        href={`/learn/${slug}/${lesson.slug}`}
        className="text-decoration-none"
      >
        <div className="font-noto text-black">
          <div className="flex flex-row flex-nowrap items-center">
            <div className="w-1/12">
              <StartIcon />
            </div>
            <div className="w-3/12  mr-5">
              <img src={lesson.image} className="w-72 rounded-2xl" />
            </div>
            <div className="w-8/12">
              <div className="flex flex-col">
                <p className="font-bold text-lg pb-0 mb-0">{lesson.title}</p>
                <p>{lesson.description}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
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
      className="w-12 h-12 mr-5"
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

export default LearnLessonItem;
