import { useEffect } from "react";
import { useGlobalState } from "@components/ui/hooks/useGlobalState";

export default function Home() {
  const state = useGlobalState()
  useEffect(()=>{
  },[state])

  return (
    <div>
    </div>
  );
}
