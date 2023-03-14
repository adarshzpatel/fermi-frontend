import Hero from "@components/homepage/Hero";
import Button from "@components/ui/Button";
import { doc, setDoc } from "@firebase/firestore";
import { useConnection } from "@solana/wallet-adapter-react";
import { saveEventToDb } from "@utils/events";
import { useEffect } from "react";
import firebase_app, { db } from "src/db/firebase";
import { useGlobalState } from "src/hooks/useGlobalState";

export default function Home() {
  const {getOpenOrders} = useGlobalState()
  const {connection} = useConnection();

  const fn = async () => {
    // await getOpenOrders()
         await saveEventToDb("4otWbJT3gqsy1VECCDinf2JCoQWogFzkCXCr1TXjuELzdyCtBi3RDo4vhi7gSUWax4m9XndfqyE2bmmvMrv5ceWj",connection) 
  }

  return (<>
    <Button onClick={fn}>CLick me to add to firestore</Button>
        <Hero/>
  </>
  );
}
