import { database } from "@/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setDoc(doc(database, "users", req.body.address), {
    address: req.body.address,
    name: req.body.name,
    email: req.body.email,
    country: req.body.country,
    discord: req.body.discord,
  });
  res.status(200).json({ success: true });
};

export default handler;
