import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_15%,rgba(6,144,97,0.10),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(82,3,209,0.08),transparent_24%),linear-gradient(180deg,#ffffff,#f6f6f4)] p-4">
      <section className="scalar-panel w-full max-w-md rounded-lg p-8">
        <div className="mb-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-scalar-ink text-sm font-bold text-white shadow-[0_12px_24px_rgba(27,27,27,0.18)]">S</span>
          <h1 className="mt-4 text-2xl font-bold text-scalar-ink">Create SwipChat Account</h1>
          <p className="mt-2 text-sm text-scalar-slate">OTP verification is mocked with code 123456.</p>
        </div>
        <RegisterForm />
        <p className="mt-5 text-sm text-scalar-slate">Already registered? <Link className="font-semibold text-scalar-green" href="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
