# HubSpot Contact Form Integration

**Portal ID:** 246421633
**Form GUID:** 18a612b4-dc22-4a0b-a757-41bd49ee8329
**API endpoint:** `https://api.hsforms.com/submissions/v3/integration/submit/246421633/18a612b4-dc22-4a0b-a757-41bd49ee8329`

---

## Overview

All contact form surfaces on the site are wired to HubSpot's Forms Submission API (v3 integration endpoint). Each submission creates or updates a contact record in the CRM. The submission is handled server-side via a Next.js API route so that credentials never reach the browser.

---

## Architecture

```
Browser form submit
        │
        ▼
POST /api/contact          ← Next.js route (app/api/contact/route.ts)
        │
        │  reads HUBSPOT_PORTAL_ID + HUBSPOT_FORM_GUID from env
        │  checks honeypot field
        │  maps form fields → HubSpot contact properties
        │
        ▼
HubSpot Forms API (v3)
        │
        ▼
Contact created/updated in CRM
```

No HubSpot credentials are exposed to the client. The browser only ever talks to `/api/contact`.

---

## API Route

**File:** `app/api/contact/route.ts`

| Concern | Behaviour |
|---|---|
| Honeypot filled | Returns `200 { ok: true }` immediately — bot is silently blocked, no CRM record created |
| Missing env vars | Returns `500` and logs an error server-side |
| Missing email | Returns `400` |
| HubSpot 4xx | Proxied as `400` to the client; full HubSpot error body logged server-side |
| HubSpot 5xx / network error | Proxied as `502` |
| Success | Returns `200 { ok: true }` |

---

## Form Surfaces

### 1. Main Contact Page — `app/contact/page.tsx`

Five tabs, all wired to the same `handleSend` handler:

| Tab | Key fields collected |
|---|---|
| General inquiry | Name, Email, Message, How did you hear |
| Columbus Pro | Email, Name / Employee count, Industry, Message, How did you hear |
| Elio | Name, Email, Message, How did you hear, Product updates opt-in |
| Investors | Name, Email, Organization, Message, How did you hear, Product updates opt-in |
| Careers | Name, Email, Role, Message, How did you hear, Resume (file, not submitted to HubSpot) |

On success the existing bottle animation plays unchanged. On failure a red error message appears above the submit button. The button shows "Sending…" and is disabled while the request is in flight.

### 2. Technology / Careers Form — `components/technology/redesign/CareersContactForm.tsx`

Same four tabs (Columbus Pro, Elio, Investors, Careers) embedded on the technology page. Identical wiring and error handling to the main contact page.

### 3. Business Helper Chat — `components/business/BusinessHelper.tsx`

The inline contact form that appears in the AI chat widget when:
- The AI + keyword matcher both fail to answer a question
- A user gives negative (👎) feedback on an AI response

Submission is **fire-and-forget** — the HubSpot call is made in the background and does not block the chat UI. The form is tagged `columbus-pro` in HubSpot regardless of which chat path triggered it.

---

## Field Mapping

| Form field | HubSpot property | Standard property? |
|---|---|---|
| `email` | `email` | ✅ Yes |
| `firstName` | `firstname` | ✅ Yes |
| `lastName` | `lastname` | ✅ Yes |
| `message` | `message` | ✅ Yes |
| `industry` | `industry` | ✅ Yes |
| `companySize` | `numemployees` | ✅ Yes |
| `role` | `jobtitle` | ✅ Yes |
| `heardFrom` | `how_did_you_hear_about_us` | ⚠️ Custom (created manually) |

> **Note on `how_did_you_hear_about_us`:** This is not a default HubSpot contact property. It was created manually in HubSpot → Settings → Properties as a single-line text field. If it is ever deleted from the portal, submissions will return a 400 error. The full HubSpot error body is logged server-side (`[contact] HubSpot 400: ...`) which will identify the missing property.

> **Note on `companySize`:** The Columbus Pro form labels this field "Your name" but uses the internal name `companySize` with placeholder "Number of employees." It is mapped to `numemployees` in HubSpot accordingly.

> **Note on `role`:** Used for "Role you're interested in" on the Careers tab, and "Organization" on the Investors tab. Both map to `jobtitle` in HubSpot — differentiate by the `tab` value in server logs if needed.

---

## Honeypot Spam Protection

Each standalone form (main contact page, technology/careers form) contains a hidden text input named `website`:

- Positioned off-screen (`left: -9999px`), `tabIndex={-1}`, `aria-hidden`
- Legitimate users never see or fill it
- Bots that auto-fill all inputs will populate it
- The API route checks this field first — if non-empty it returns `200` silently and exits without calling HubSpot

The business helper chat form does not have a honeypot because it is already behind a user interaction (opening the chat widget).

---

## Environment Variables

| Variable | Where to find it |
|---|---|
| `HUBSPOT_PORTAL_ID` | HubSpot → Settings → Account Setup → Account Defaults |
| `HUBSPOT_FORM_GUID` | HubSpot → Marketing → Forms → (select form) → Share → Embed code URL |

Both are set in `.env.local` (gitignored) and documented as empty templates in `.env.example`.

---

## Product Updates Opt-in

The Elio and Investors tabs include a checkbox: "I want to receive product updates from Columbus Earth." When checked, the API route attaches a `legalConsentOptions.consent` block to the HubSpot submission:

```json
{
  "legalConsentOptions": {
    "consent": {
      "consentToProcess": true,
      "text": "I agree to allow Columbus Earth to store and process my personal data."
    }
  }
}
```

This records consent against the contact in HubSpot. If your portal is GDPR-enabled and you require subscription type tracking, you will need to add a `communications` array with your portal's subscription type ID (found in HubSpot → Settings → Marketing → Email → Subscription Types).

---

## Testing a Submission End-to-End

1. Ensure the dev server is running (`npm run dev`) — env vars are loaded at server start.
2. Navigate to `http://localhost:3000/contact`.
3. Fill in at least **Email** and any other required fields for your chosen tab.
4. Click **Submit**.
5. The bottle animation should play (main contact page) or the success screen should appear (careers form / chat).
6. In HubSpot go to **CRM → Contacts** — the new contact should appear within a few seconds.
7. To test a failure, temporarily set `HUBSPOT_FORM_GUID=bad-guid` in `.env.local`, restart the server, and submit — you should see the red error message.
8. To test the honeypot, send a POST directly with `{ "honeypot": "filled", "email": "bot@test.com" }` to `/api/contact` — it will return `200` but no contact will appear in HubSpot.

---

## Server-Side Logging

All errors from the HubSpot API are logged to the server console with the prefix `[contact]`:

```
[contact] HubSpot 400: {"status":"error","message":"...","errors":[...]}
[contact] HubSpot network error: FetchError: ...
[contact] HUBSPOT_PORTAL_ID or HUBSPOT_FORM_GUID not set
```

Check these logs first when diagnosing submission failures.
