/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import PathwayCard from "@/components/common/PathwayCard";
import { pathways } from "@/constants/pathways";

export default function Pathways() {
  return (
    <>
      <section>
        <div className="w-full">
          <section>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-0 lg:gap-5 px-5 lg:px-0">
              {pathways.map((data) => (
                <PathwayCard key={data.key} data={data} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
