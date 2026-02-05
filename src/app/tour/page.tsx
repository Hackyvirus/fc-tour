
import { getSession } from "../lib/auth";
import { redirect } from "next/navigation";
import TourClient from "./TourClient";


export default async function TourPage() {
  const session = await getSession();
  if (!session) redirect("/user/login");

  return <TourClient session={session.email} />;
}

