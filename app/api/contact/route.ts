import { NextRequest, NextResponse } from "next/server";

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
const FORM_GUID = process.env.HUBSPOT_FORM_GUID;

type Field = { objectTypeId: "0-1"; name: string; value: string };

type Payload = {
  tab?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  message?: string;
  industry?: string;
  heardFrom?: string;
  companySize?: string;
  role?: string;
  updates?: boolean;
  honeypot?: string;
  pageUri?: string;
  pageName?: string;
};

export async function POST(req: NextRequest) {
  const body: Payload = await req.json().catch(() => ({}));

  // Honeypot: silently succeed so bots don't learn they were blocked
  if (body.honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!PORTAL_ID || !FORM_GUID) {
    console.error("[contact] HUBSPOT_PORTAL_ID or HUBSPOT_FORM_GUID not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (!body.email?.trim()) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const fields: Field[] = [];
  const push = (name: string, value: string | undefined) => {
    if (value?.trim()) fields.push({ objectTypeId: "0-1", name, value: value.trim() });
  };

  push("email", body.email);
  push("firstname", body.firstName);
  push("lastname", body.lastName);
  // "description" is a standard HubSpot contact property — "message" is not,
  // which caused HubSpot to reject submissions silently.
  push("description", body.message);
  push("industry", body.industry);
  // Columbus Pro "Number of employees" field
  push("numemployees", body.companySize);
  // Role interest (careers) or organization name (investors)
  push("jobtitle", body.role);
  // Attribution — requires a custom contact property named "how_did_you_hear_about_us"
  // in HubSpot (Settings → Properties → Create property). Skipped if missing/empty.
  push("how_did_you_hear_about_us", body.heardFrom);

  const hsPayload: Record<string, unknown> = {
    fields,
    context: {
      pageUri: body.pageUri ?? "https://columbus.earth/contact",
      pageName: body.pageName ?? "Contact",
    },
  };

  if (body.updates) {
    hsPayload.legalConsentOptions = {
      consent: {
        consentToProcess: true,
        text: "I agree to allow Columbus Earth to store and process my personal data.",
      },
    };
  }

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hsPayload),
    });
  } catch (err) {
    console.error("[contact] HubSpot network error", err);
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      `[contact] HubSpot ${res.status} — fields sent: [${fields.map(f => f.name).join(", ")}] — body: ${text}`,
    );
    // Forward 4xx as 400 (client config issue), 5xx as 502
    return NextResponse.json(
      { error: "Submission failed" },
      { status: res.status >= 500 ? 502 : 400 },
    );
  }

  console.log(`[contact] ok — fields saved: [${fields.map(f => f.name).join(", ")}]`);
  return NextResponse.json({ ok: true });
}
