import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "../../../docs/PlaceholderPage";
import { findPage, pages } from "../../../docs/nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return pages.filter((page) => page.slug !== "overview").map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shadow-docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug);
  return { title: page ? `${page.title} | Shadow Docs` : "Shadow Docs" };
}

export default async function Page({ params }: PageProps<"/shadow-docs/[slug]">) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page || slug === "overview") notFound();
  return <PlaceholderPage page={page} />;
}
