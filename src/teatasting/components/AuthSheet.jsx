"use client";
// Email/password sign-in against Supabase. The session persists in this
// browser (supabase-js refresh tokens), so signing in is a rare event —
// no friction mid-gongfu. Reads never require auth; writes do.
import { useState } from "react";
import { Sheet, Field, TextInput, Button } from "./ui";
import { signIn } from "../lib/storage";
import { supabaseConfigured } from "../lib/supabaseClient";

export default function AuthSheet({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      onClose();
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Sign in to save">
      {!supabaseConfigured ? (
        <p className="text-sm text-muted">
          Cloud sync isn’t configured yet (no Supabase keys). Sessions still save on this
          device. See the README in <code className="font-mono text-xs">src/teatasting/</code> for
          the 5-minute setup.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <p className="text-sm text-muted">
            Anyone can browse the log; saving changes needs your account. You’ll stay signed
            in on this device.
          </p>
          <Field label="Email">
            <TextInput type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password">
            <TextInput type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      )}
    </Sheet>
  );
}
