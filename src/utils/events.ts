import { doc, setDoc } from "@firebase/firestore";
import { Connection, PublicKey } from "@solana/web3.js";
import { db } from "src/db/firebase";

export const saveEventToDb = async (
  signature: string,
  connection: Connection
) => {
  try {
    let txDetails = await connection.getParsedTransaction(signature);
    let txLog: any = txDetails?.meta?.logMessages;
    const timestamp = (new Date()).getTime()
    const logString: string = txLog.join("\n");
    const regex = new RegExp(/(event\.[a-zA-Z_]+):\s*(\S+)/g);
    let matched = logString.match(regex);
    let events: Record<string, string>[] = [];
    let temp: Record<string, string> = {};

    matched?.forEach((it, i) => {
      // get the key
      let key = it.split(" ")[0].split(".")[1];
      // remoev : from right
      key = key.substring(0, key.length - 1);
      const value = it.split(" ")[1];
      temp[key] = value;
      // check if valid event 
      // const hasNativeQtyPaid = "native_qty_paid" in temp;

      // if (!hasNativeQtyPaid) return;

      if (key === "finalised") {
        events.push({ ...temp, timestamp: timestamp.toString() });
        temp = {};
      }
    });
    console.log({events})
    events.forEach(async (item)=>{
      await setDoc(doc(db,"events",item?.idx),item).then(()=>console.log(`event with id ${item?.idx} saved!`)).catch((err)=>console.log(err))
    })
  } catch (err) {
    console.log(err);
  }
};

