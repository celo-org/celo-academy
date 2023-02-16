import { database } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const querySnapshot = await getDoc(
    doc(collection(database, "users"), req.body.address)
  );
  if (!querySnapshot.data()) {
    await setDoc(doc(collection(database, "users"), req.body.address), {
      address: req.body.address,
    });
    await setDoc(
      doc(database, "users", req.body.address, "pathways", req.body.pathway),
      {
        name: req.body.pathway,
        timestamp: serverTimestamp(),
        lastCompletedLesson: null,
      }
    );
  } else {
    var pathwaySnapshot = await getDoc(
      doc(database, "users", req.body.address, "pathways", req.body.pathway)
    );
    if (!pathwaySnapshot.data()) {
      await setDoc(
        doc(database, "users", req.body.address, "pathways", req.body.pathway),
        {
          name: req.body.pathway,
          timestamp: serverTimestamp(),
          lastCompletedLesson: null,
        }
      );
    }
  }
  var responseData = await getDoc(
    doc(database, "users", req.body.address, "pathways", req.body.pathway)
  );
  res.status(200).json(responseData.data());
};

export default handler;
