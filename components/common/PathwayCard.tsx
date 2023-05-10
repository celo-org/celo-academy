import Img, { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  data: {
    key: string;
    name: string;
    url: string;
    image: StaticImageData;
    desc: string;
    tags: string[];
    skills: string[];
    preRequisites: string;
    skillLevel: string;
    timeToComplete: string;
    tagLine: string;
  };
};

function PathwayCard({ data }: Props) {
  const router = useRouter();
  return (
    <Link href={data.url}>
      <div
        key={data.key}
        className="border-2 border-black rounded-2xl w-full mt-5   pushable select-none bg-black border-none p-0 cursor-pointer outline-offset-4"
      >
        <div className="front w-full rounded-2xl border-2 border-black flex md:flex-row flex-col-reverse md:justify-between py-2 px-2 md:px-6 bg-gypsum">
          <div className="md:w-3/5 w-full">
            <div className="md:py-5 py-4 md:px-6 px-3">
              <p className="font-code font-bold mt-2 mb-4">
                [ {data.tagLine} ]
              </p>
              <h3 className="text-black font-noto text-3xl md:text-4xl">
                {data.name}
              </h3>
              <p className="text-black font-noto text-sm md:text-base mt-5">
                {data.desc}
              </p>
              <p className="font-noto font-semibold mt-8 mb-2">
                SKILLS YOU&apos;LL LEARN
              </p>
              <div className="inline-flex flex-row flex-wrap">
                {data.skills.map((skill) => (
                  <div
                    key={skill}
                    className="px-2 py-1 border-2 border-black rounded-lg font-noto text-sm font-semibold whitespace-nowrap mt-2 mr-2"
                  >
                    {skill}
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-row font-semibold mt-8 mb-2 font-noto ">
                <div className="w-1/3 flex flex-col justify-start">
                  <span>{data.preRequisites}</span>
                  <span className="font-code text-sm mt-1">pre-requisites</span>
                </div>
                <div className="w-1/3 flex flex-col justify-start">
                  <span>{data.skillLevel}</span>
                  <span className="font-code text-sm mt-1">kills</span>
                </div>
                <div className="w-1/3 flex flex-col justify-start">
                  <span>{data.timeToComplete}</span>
                  <span className="font-code text-sm mt-1">
                    time to complete
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/5 flex justify-end items-start">
            <Img
              src={data.image}
              className="rounded-2xl m-0 md:m-3"
              alt={data.name}
              width={400}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PathwayCard;
