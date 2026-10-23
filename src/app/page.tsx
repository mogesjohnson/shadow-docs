import { redirect } from "next/navigation";
import { BASE } from "../docs/nav";

/** The docs live under /shadow-docs, the same path the portfolio uses. */
export default function Home() {
  redirect(BASE);
}
