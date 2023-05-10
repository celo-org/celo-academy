import { database } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.ENV === "local") {
    res.status(200).json({
      user: {
        address: "0xE1061b397cC3C381E95a411967e3F053A7c50E70",
        name: "Jon Doe",
        email: "jon@doe.com",
        country: "World",
        discord: "",
      },
      success: true,
    });
    return;
  }
  var userDoc = await getDoc(doc(database, "users", req.body.address));
  var user = userDoc.data();
  res.status(200).json({ user, success: true });
};

export default handler;
