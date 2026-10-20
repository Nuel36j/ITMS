import type { Metadata } from "next";
import LoginPage from "./login";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
}

export default function Login() {
  return <LoginPage />;
}