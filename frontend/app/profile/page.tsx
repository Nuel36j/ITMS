import type { Metadata } from "next";
import ProfilePage from "./profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile information",
}

export default function Profile() {
  return <ProfilePage />;
}