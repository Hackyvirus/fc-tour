import Header from "@/app/componets/Header";
import Dashboard from "@/app/componets/Dashboard";
import { getSession } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Admin() {
  const session = await getSession();
  console.log('session.email',session.email)

  if (!session) redirect("/admin/login");

  return (
    <>
      <Header />
      <Dashboard email={session.email}/>
        {/* <h1>Welcome Admin</h1>
        <p>Logged in as: {}</p> */}

        {/* <form action="/api/auth/logout" method="POST">
          <button type="submit">Logout</button>
        </form> */}
      {/* </Dashboard> */}
    </>
  );
}
