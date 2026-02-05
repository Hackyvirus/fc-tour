
import { getSession } from "../lib/auth";
import { redirect } from "next/navigation";
import TourControls from "./TourControls";



export default async function GetSession.tsx() {
  const session = await getSession();

  return <TourControls session={session} />;
}

