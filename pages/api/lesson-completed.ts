import { database } from "@/utils/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setDoc(
    doc(database, "users", req.body.address, "pathways", req.body.pathway),
    {
      name: req.body.pathway,
      timestamp: serverTimestamp(),
      lastCompletedLesson: req.body.lessonCompleted,
    }
  );

  res.status(200).json({ success: true });
};

export default handler;
