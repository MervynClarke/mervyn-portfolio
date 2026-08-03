"use client";
// Sign-in. Single-user by design: the Supabase project has signups disabled,
// so this is a login form, not a registration flow. Everything already logged
// stays in the local cache and flushes the moment the session is valid.
import { useState } from "react";
import { Button, Field, Sheet, TextInput } from "./ui";
import { signIn } from "../lib/storage";

export default function AuthSheet({ open, onClose, reason }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
      setPassword("");
      onClose();
    } catch (err) {
      setError(err?.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Sign in">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-muted">
          {reason ||
            "Practices are saved on this device either way. Signing in syncs them across devices."}
        </p>
        <Field label="Email">
          <TextInput
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <TextInput
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        {error && <p className="text-sm text-red-700 dark:text-red-400">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Sheet>
  );
}
