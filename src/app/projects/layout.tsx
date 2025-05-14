import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Overview",
  description: "Details about the algorithmic trading system architecture and components",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}