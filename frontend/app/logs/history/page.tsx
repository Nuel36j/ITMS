import type { Metadata } from "next";
import LogsHistoryPage from "./history";

export const metadata: Metadata = {
  title: "Logs History",
  description: "See the history of your logs",
}

export default function LogsHistory() {
  return <LogsHistoryPage />;
}
