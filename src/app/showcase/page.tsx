import { notFound } from "next/navigation";
import { ComponentShowcase } from "@/showcase/ComponentShowcase";

export default function ShowcasePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ComponentShowcase />;
}
