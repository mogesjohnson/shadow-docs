import type { Metadata } from "next";
import { OverviewPage } from "../../docs/OverviewPage";

export const metadata: Metadata = {
  title: "Overview | Shadow Docs",
};

export default function Page() {
  return <OverviewPage />;
}
