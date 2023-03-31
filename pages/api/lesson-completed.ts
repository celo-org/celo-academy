import { database } from "@/utils/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
  var getPathwayMetadata = await getDoc(
    doc(database, "pathways", req.body.pathway)
  );
  if (!getPathwayMetadata.data()) {
    await setDoc(doc(database, "pathways", req.body.pathway), {
      name: req.body.pathway,
      totalLessonsCompleted: 1,
    });
    await setDoc(
      doc(
        database,
        "pathways",
        req.body.pathway,
        "lessons",
        req.body.lessonCompleted
      ),
      {
        lesson: req.body.lessonCompleted,
        timestamp: serverTimestamp(),
        address: arrayUnion(req.body.address),
        totalCompleted: 1,
      }
    );
  } else {
    await updateDoc(doc(database, "pathways", req.body.pathway), {
      name: req.body.pathway,
      totalLessonsCompleted:
        getPathwayMetadata.data()!.totalLessonsCompleted + 1,
    });
    var lessonMetadata = await getDoc(
      doc(
        database,
        "pathways",
        req.body.pathway,
        "lessons",
        req.body.lessonCompleted
      )
    );
    if (!lessonMetadata.data()) {
      await setDoc(
        doc(
          database,
          "pathways",
          req.body.pathway,
          "lessons",
          req.body.lessonCompleted
        ),
        {
          lesson: req.body.lessonCompleted,
          timestamp: serverTimestamp(),
          address: arrayUnion(req.body.address),
          totalCompleted: 1,
        }
      );
    } else {
      await updateDoc(
        doc(
          database,
          "pathways",
          req.body.pathway,
          "lessons",
          req.body.lessonCompleted
        ),
        {
          address: arrayUnion(req.body.address),
          timestamp: serverTimestamp(),
          lesson: req.body.lessonCompleted,
          totalCompleted: lessonMetadata.data()!.totalCompleted + 1,
        }
      );
    }
    if (req.body.lessonCompleted !== "0") {
      await updateDoc(
        doc(
          database,
          "pathways",
          req.body.pathway,
          "lessons",
          (parseInt(req.body.lessonCompleted) - 1).toString()
        ),
        {
          address: arrayRemove(req.body.address),
          timestamp: serverTimestamp(),
        }
      );
    }
  }

  res.status(200).json({ success: true });
};

export default handler;
