"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Page } from "@/components/ui/Section";

/** /film always means "the most recent celebration". */
export default function FilmIndex() {
  const router = useRouter();
  const { festivals } = useStore();
  const year = festivals[0]?.year;

  useEffect(() => {
    if (year) router.replace(`/film/${year}`);
  }, [year, router]);

  return (
    <Page className="py-24 text-center">
      <p className="font-display text-[1.375rem] text-bone-50">Setting up the film…</p>
    </Page>
  );
}
