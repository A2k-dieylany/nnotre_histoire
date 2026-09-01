import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-black px-6 text-center">
      <p className="max-w-sm font-serif text-lg italic text-white/80">
        Ce site a été créé pour une seule personne.
        <br />
        Es-tu cette personne&nbsp;?
      </p>
      <LoginForm />
    </main>
  );
}
