# CLAUDE.md — Development Guidelines

These rules are **non-negotiable**. Violating them is grounds for rejection.

---

## 1. Function Length: Hard Limit of 15 Lines

Every function — component, hook, handler, utility — must fit in **15 lines or fewer**. No exceptions without explicit,
written justification in a comment above the function.

**How to comply:**

- Extract named sub-components from JSX-heavy functions
- Move `useState`/`useEffect` logic into a dedicated `useXxx` hook in the same file
- Name intermediate values rather than nesting expressions

**Bad:**

```tsx
// 22 lines — REJECTED
export default function LoginForm({onTwoFactor}: Props) {
  const [ email, setEmail ]       = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ]       = useState("");
  const router                    = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {data, error: err} = await authClient.signIn.email({email, password});
    if (err) {
      setError(err.message ?? "Login failed");
      return;
    }
    data?.twoFactorRedirect ? onTwoFactor() : router.push("/inbox");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <InputField label="Email" type="email" value={email} onChange={setEmail} />
      <InputField label="Password" type="password" value={password} onChange={setPassword} error={error} />
      <Button type="submit">Sign In</Button>
    </form>
  );
}
```

**Good:**

```tsx
// Hook: 15 lines
function useLoginForm(onTwoFactor: () => void) {
  const [ email, setEmail ]       = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ]       = useState("");
  const router                    = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {data, error: err} = await authClient.signIn.email({email, password});
    if (err) {
      setError(err.message ?? "Login failed");
      return;
    }
    data?.twoFactorRedirect ? onTwoFactor() : router.push("/inbox");
  };

  return {email, setEmail, password, setPassword, error, submit};
}

// Component: 9 lines ✓
export default function LoginForm({onTwoFactor}: Props) {
  const {email, setEmail, password, setPassword, error, submit} = useLoginForm(onTwoFactor);
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <InputField label="Email" type="email" value={email} onChange={setEmail} />
      <InputField label="Password" type="password" value={password} onChange={setPassword} error={error} />
      <Button type="submit">Sign In</Button>
    </form>
  );
}
```

---

## 2. Component Files and Default Exports

Any component **used in more than one place** must live in its own file with a **default export**.

`src/components/ui/` - Generic, project-agnostic primitives, automatically generated from shadcn
`src/components/` - Recycled non-primitive components
`src/app/<page>/components/` - Page-specific components

Private sub-components only referenced by a single parent may be co-located, but must be placed **above** the default
export.

---

## 3. UI: Base UI + Tailwind Only

Interactive elements (inputs, dialogs, menus) must use **`@base-ui/react`** components, not raw HTML. Styling is done
exclusively with **Tailwind utility classes**.

- No `style={{}}` props anywhere
- No CSS modules, no styled-components, no custom CSS outside `globals.css`
- No hardcoded hex colors in component files — use theme tokens only

---

## 4. Theme Tokens

Defined in `globals.css` via Tailwind's `@theme`. **Always use these — never hardcode values.**

| CSS Variable           | Class                         | Purpose                            |
|------------------------|-------------------------------|------------------------------------|
| `--background`         | `bg-background`               | Page background (warm off-white)   |
| `--foreground`         | `text-foreground`             | Primary text                       |
| `--card`               | `bg-card`                     | Card / panel background            |
| `--card-foreground`    | `text-card-foreground`        | Text on card surfaces              |
| `--muted`              | `bg-muted`                    | Subtle background (bubbles, chips) |
| `--muted-foreground`   | `text-muted-foreground`       | Secondary / placeholder text       |
| `--border`             | `border-border`               | All borders                        |
| `--primary`            | `bg-primary` / `text-primary` | Primary action color (dark)        |
| `--primary-foreground` | `text-primary-foreground`     | Text on primary background         |
| `--accent`             | `bg-accent`                   | Subtle hover background            |
| `--accent-foreground`  | `text-accent-foreground`      | Text on accent background          |
| `--ring`               | `ring-ring`                   | Focus ring color                   |

---

## 5. Authentication

- Server auth config lives **only** in `src/lib/auth.ts` (imports `"server-only"`)
- Client auth interactions go through `src/lib/auth-client.ts` only
- Never inline auth configuration in components, pages, or API routes
- 2FA is SMS-based via better-auth's `twoFactor` plugin — the `sendOTP` function in `auth.ts` must be wired to a real
  SMS provider before production

---

## 6. Forbidden Patterns

The following will cause an automatic rejection:

1. **Function body > 15 lines** without documented justification
2. **Hardcoded hex colors** outside `globals.css`
3. **Reusable component without its own file and default export**
4. **Auth logic outside** `src/lib/auth.ts` or `src/lib/auth-client.ts`
5. **`style={{}}` prop** anywhere
6. **Raw `<input>` or `<button>`** where a Base UI equivalent exists
7. **`any` type** — use `unknown` and narrow, or type properly
8. **Premature abstraction** — no helpers, no utils for one-off operations
9. **Unrequested features** — if it wasn't asked for, don't add it

---

## 7. File Naming

ALL files must be named consistently, and must make use of `markdown-case`.

---

## 8. Comments

Only add comments where the logic is **genuinely non-obvious**. Do not:

- Summarize what the code does (the code speaks for itself)
- Add JSDoc for every function
- Leave TODO comments without a tracked issue

## 9. Additional information

- This project makes use of shadcn with base-ui and uses pnpm as package manager.
- When deciding to use unions of strings, prefer using enums, and const enums if possible.
- Prefer using `cn` or `twMerge` instead of inlining classes when appending
