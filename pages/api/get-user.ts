import { database } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  var userDoc = await getDoc(doc(database, "users", req.body.address));
  var user = userDoc.data();
  res.status(200).json({ user, success: true });
};

export default handler;
