import { database } from "@/utils/firebase";
import {
  arrayUnion,
  doc,
  getDoc,
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
  var pathwayDoc = await getDoc(doc(database, "pathways", req.body.pathway));
  if (!pathwayDoc.data()) {
    await updateDoc(doc(database, "pathways", req.body.pathway), {
      totalPathWayscompleted:
        (pathwayDoc.data()!.totalPathWayscompleted ?? 0) + 1,
      pathwaysCompletedByUser: arrayUnion(req.body.address),
    });
  }

  res.status(200).json({ success: true });
};

export default handler;
