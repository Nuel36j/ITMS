import type { Metadata } from "next";
import SummariesHistoryPage from "./summaries";

export const metadata: Metadata = {
  title: "Summaries History",
  description: "See the history of your summaries",
}

export default function SummariesHistory() {
  return <SummariesHistoryPage />;
}