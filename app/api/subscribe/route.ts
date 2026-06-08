import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
const FORM_GUID = process.env.HUBSPOT_SUBSCRIBE_FORM_GUID;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    email?: string;
    source?: string;
    pageUri?: string;
    pageName?: string;
  };

  const email = body.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!PORTAL_ID || !FORM_GUID) {
    console.error("[subscribe] HUBSPOT_PORTAL_ID or HUBSPOT_SUBSCRIBE_FORM_GUID not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const hsPayload = {
    fields: [{ objectTypeId: "0-1", name: "email", value: email }],
    context: {
      pageUri: body.pageUri ?? "https://columbus.earth/blog",
      pageName: body.pageName ?? "Blog",
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: "I agree to allow Columbus Earth to store and process my personal data.",
      },
    },
  };

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hsPayload),
    });
  } catch (err) {
    console.error("[subscribe] HubSpot network error", err);
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[subscribe] HubSpot ${res.status}: ${text}`);
    return NextResponse.json(
      { error: "Submission failed" },
      { status: res.status >= 500 ? 502 : 400 },
    );
  }

  console.info(`[subscribe] ok — email: ${email} source: ${body.source ?? "unknown"}`);

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: email,
    event: "blog_subscribed",
    properties: {
      source: body.source ?? "unknown",
      page_uri: body.pageUri,
    },
  });

  return NextResponse.json({ ok: true });
}
