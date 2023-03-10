import Hero from "@components/homepage/Hero";
import { useEffect } from "react";
import { useGlobalState } from "src/hooks/useGlobalState";

export default function Home() {
  const state = useGlobalState()
  useEffect(()=>{
  },[state])

  return (<>
        <Hero/>
  </>
  );
}
