import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-[radial-gradient(circle_at_20%_15%,rgba(6,144,97,0.10),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(0,130,208,0.10),transparent_24%),linear-gradient(180deg,#ffffff,#f6f6f4)] p-4">
      <section className="scalar-panel w-full max-w-md rounded-lg p-6 sm:p-8">
        <div className="mb-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-scalar-ink text-sm font-bold text-white shadow-[0_12px_24px_rgba(27,27,27,0.18)]">S</span>
          <h1 className="mt-4 text-2xl font-bold text-scalar-ink">SwipChat</h1>
          <p className="mt-2 text-sm text-scalar-slate">Private-feeling messaging with mocked assignment security.</p>
        </div>
        <LoginForm />
        <p className="mt-5 text-sm text-scalar-slate">New here? <Link className="font-semibold text-scalar-green" href="/register">Create an account</Link></p>
      </section>
    </main>
  );
}
