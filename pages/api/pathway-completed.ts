import { database } from "@/utils/firebase";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await updateDoc(
    doc(database, "users", req.body.address, "pathways", req.body.pathway),
    {
      name: req.body.pathway,
      timestamp: serverTimestamp(),
      lastCompletedLesson: req.body.lessonCompleted,
      pathwayCompleted: true,
    }
  );
  await updateDoc(doc(database, "users", req.body.address), {
    completedPathways: arrayUnion(req.body.pathway),
  });

  res.status(200).json({ success: true });
};

export default handler;
