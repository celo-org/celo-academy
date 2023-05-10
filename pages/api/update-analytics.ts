import { database } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.ENV === "local") {
    res.status(200).json({ success: true });
    return;
  }
  var userDoc = await getDoc(
    doc(database, "users", req.body.address, "pathways", req.body.pathway)
  );
  const lessonSlug = "lesson-" + req.body.lesson + "-timespent";
  if (userDoc.data()) {
    await updateDoc(
      doc(database, "users", req.body.address, "pathways", req.body.pathway),
      {
        [lessonSlug]: (userDoc.data()![lessonSlug] ?? 0) + req.body.timeSpent,
      }
    );
  } else {
    await setDoc(
      doc(database, "users", req.body.address, "pathways", req.body.pathway),
      {
        [lessonSlug]: req.body.timeSpent,
      }
    );
  }
  const lesson = req.body.lesson.split("-")[1];
  var pathwayDoc = await getDoc(
    doc(database, "pathways", req.body.pathway, "lessons", lesson)
  );
  if (pathwayDoc.data()) {
    await updateDoc(
      doc(database, "pathways", req.body.pathway, "lessons", lesson),
      {
        totalTimeSpent:
          (pathwayDoc.data()?.totalTimeSpent ?? 0) + req.body.timeSpent,
        totalLessonViews: (pathwayDoc.data()?.totalLessonViews ?? 0) + 1,
      }
    );
  } else {
    await setDoc(
      doc(database, "pathways", req.body.pathway, "lessons", lesson),
      {
        totalTimeSpent: req.body.timeSpent,
        totalLessonViews: 1,
      }
    );
  }

  res.status(200).json({ success: true });
};

export default handler;
