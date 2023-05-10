import { database } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  var resData = {};
  if (process.env.ENV === "local") {
    res.status(200).json({ success: true, resData: { "0": 0 } });
    return;
  }
  for (var i = 0; i < req.body.totalLessons; i++) {
    var lessonData = await getDoc(
      doc(database, "pathways", req.body.pathway, "lessons", i.toString())
    );
    if (lessonData.data()) {
      resData = {
        ...resData,
        [i.toString()]: lessonData.data()!.totalCompleted,
      };
    } else {
      resData = { ...resData, [i.toString()]: 0 };
    }
  }
  res.status(200).json({ success: true, resData });
};

export default handler;
