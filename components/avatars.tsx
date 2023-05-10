/* eslint-disable @next/next/no-img-element */
import { randomStr } from "@/utils/helper";
import { personas } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import React, { useEffect, useState } from "react";

type Props = {
  totalCompletes: number;
  showToolTip?: boolean;
};

const Avatars: React.FC<Props> = ({
  totalCompletes,
  showToolTip = true,
}: Props) => {
  const [dataUri1, setDataUri1] = useState("");
  const [dataUri2, setDataUri2] = useState("");

  useEffect(() => {
    const generateImages = async () => {
      const avatar1 = createAvatar(personas, {
        seed: randomStr(5),
      });
      const avatar2 = createAvatar(personas, {
        seed: randomStr(5),
      });
      const dataUri1 = await avatar1.toDataUri();
      const dataUri2 = await avatar2.toDataUri();
      setDataUri1(dataUri1);
      setDataUri2(dataUri2);
    };
    generateImages();
  }, []);

  if (showToolTip === false) {
    return (
      <div className="flex flex-row items-center justify-end">
        <div className="flex -space-x-4">
          <img className="w-7 h-7 rounded-full " src={dataUri1} alt="avatar" />
          <img className="w-7 h-7 rounded-full" src={dataUri2} alt="avatar" />
        </div>
        <span className="text-black font-noto">
          {totalCompletes} {totalCompletes <= 1 ? "person" : "people"} completed
        </span>
      </div>
    );
  }

  return (
    <div className="flex md:mb-5 mb-0 -space-x-4 group relative">
      <img className="w-7 h-7 rounded-full " src={dataUri1} alt="avatar" />
      <img className="w-7 h-7 rounded-full" src={dataUri2} alt="avatar" />

      {showToolTip && (
        <span
          className="group-hover:opacity-100 transition-opacity bg-gray-200 px-1 text-xs text-black rounded-md absolute left-1/2 
      -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto text-center"
        >
          {totalCompletes} {totalCompletes <= 1 ? "person" : "people"} completed
        </span>
      )}
    </div>
  );
};

export default Avatars;
