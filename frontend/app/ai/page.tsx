import type { Metadata } from "next";
import AiAssistantPage from "./ai";

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "AI Assistant Contents",
}

export default function AiAssistant() {
  return <AiAssistantPage />;
}