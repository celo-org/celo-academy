/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import LearnCard from "@/components/common/LearnCard";
import { learn } from "@/constants/learn";
import Head from "next/head";

export default function Pathways() {
  return (
    <>
      <Head>
        <title>Celo Academy | Pathways</title>
        <meta
          name="description"
          content="Celo Academy pathways are a series of lessons that will teach you how to build dApps on Celo."
          key="desc"
        />
      </Head>
      <section>
        <div className="w-full">
          <section>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-0 lg:gap-5 px-5 lg:px-0">
              {learn.map((data) => (
                <LearnCard key={data.key} data={data} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
