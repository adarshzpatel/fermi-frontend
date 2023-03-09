import { useEffect } from "react";
import { useGlobalState } from "src/hooks/useGlobalState";

export default function Home() {
  const state = useGlobalState()
  useEffect(()=>{
  },[state])

  return (
    <div>
      
    </div>
  );
}
