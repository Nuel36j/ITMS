import type { Metadata } from "next";
import LogsPage from "./logs";

export const metadata: Metadata = {
  title: "Logs",
  description: "View application logs",
}

export default function Logs() {
  return <LogsPage />;
}