import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-28 text-center sm:px-8">
      <p className="micro">Not in the book</p>
      <h1 className="mt-4 font-display text-[2.25rem] leading-tight text-bone-50 sm:text-[3rem]">
        This page isn&rsquo;t a memory
      </h1>
      <p className="mt-3 text-[1.0625rem] text-bone-400">
        Try the years, or start from home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary btn-md">
          Home
        </Link>
        <Link href="/years" className="btn btn-ghost btn-md">
          Years
        </Link>
      </div>
    </div>
  );
}
