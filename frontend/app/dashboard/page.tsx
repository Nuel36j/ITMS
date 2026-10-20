import type { Metadata } from "next";
import DashboardPage from "./dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your dashboard",
}

export default function Dashboard() {
  return <DashboardPage />;
}