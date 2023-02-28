import { GlobalContext } from "@components/contexts/global"
import { useContext } from "react"

export const useGlobalState = () => {
  return useContext(GlobalContext)
}