import type { Metadata } from "next";
import { DesignDashboard } from "@/components/design/dashboard";
export const metadata: Metadata = { robots:{index:false,follow:false}, title: "Files · Figart" };
export default function Dashboard() {
  return <DesignDashboard />;
}
