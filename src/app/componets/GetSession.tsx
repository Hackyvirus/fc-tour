
import { getSession } from "../lib/auth";
import { redirect } from "next/navigation";
import TourControls from "./TourControls";



export default async function GetSession() {
  const session = await getSession();

  return (
    <TourControls
      session={session}
      currentScene='scene'
      showMap={false}
      showInfo={false}
      isFullscreen={false}
      onToggleMap={() => {}}
      onToggleInfo={() => {}}
      onToggleFullscreen={() => {}}
    />
  );
}

