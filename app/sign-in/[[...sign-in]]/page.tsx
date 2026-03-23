import { SignIn } from "@clerk/nextjs";
import { hasClerk } from "@/lib/env";

export default function SignInPage() {
  if (!hasClerk()) {
    return (
      <section className="panel">
        <h1>Sign in</h1>
        <p>Clerk is not configured. The app currently runs in demo mode.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <SignIn />
    </section>
  );
}
