import { serializeKb } from "@/lib/columbus-kb";

/**
 * AI fallback for the in-page Columbus helper (components/business/
 * BusinessHelper.tsx). The widget first tries its local keyword matcher;
 * only when that misses does it POST here. The model answers strictly from
 * the knowledge base or declines — and ANY miss (model declines, upstream
 * error, timeout, or no key configured) returns `{ answer: null }`, which
 * the client treats as "show the contact form" exactly as before. No key,
 * model, or KB ever ships to the browser, and this only runs on an
 * unmatched send, so page load is untouched.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
/* Small + fast: this only has to paraphrase from the provided KB or decline,
   so an 8B model is plenty. Overridable via env, and the endpoint is
   OpenAI-compatible, so swapping provider/model later is a config change. */
const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const REQUEST_TIMEOUT_MS = 6000;
/* What the model emits when the KB doesn't cover the question. The client
   never sees this — it's mapped to a null answer (→ contact form). Kept as a
   plain token (no surrounding underscores): models treat `__x__` as markdown
   and strip the underscores, which would slip the literal word through. */
const NO_ANSWER = "NO_ANSWER";
const MAX_TURNS = 10;
const MAX_CHARS_PER_TURN = 2000;

/* True when the model's reply is really the decline token, however it
   reformats it ("NO_ANSWER", "__NO_ANSWER__", "No answer.", …). Compares on
   letters only so punctuation/underscores/case don't matter; the short-reply
   guard catches a token with a stray wrapper word without false-positiving a
   real answer that merely mentions "no answer". */
function isDecline(raw: string): boolean {
  const letters = raw.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return (
    letters === "NOANSWER" ||
    (raw.trim().length <= 24 && letters.includes("NOANSWER"))
  );
}

type Turn = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(): string {
  return [
    "You are the Columbus website assistant, embedded on the Columbus for Business product page.",
    "Answer the visitor's latest question using ONLY the facts in the <kb> block below.",
    "Rules:",
    `- If the answer is not clearly supported by <kb>, reply with exactly ${NO_ANSWER} and nothing else.`,
    "- Never invent features, pricing, datasets, integrations, timelines, or claims that are not in <kb>.",
    "- Keep it to 1-3 short sentences, friendly and plain. No markdown, no bullet points, no headings.",
    "- Do not output raw URLs or paths; if relevant, invite them to book a demo in words.",
    '- Speak as Columbus (use "we" / "Columbus").',
    "",
    "<kb>",
    serializeKb(),
    "</kb>",
  ].join("\n");
}

function jsonAnswer(answer: string | null): Response {
  return new Response(JSON.stringify({ answer }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY;
  /* No key configured → behave exactly like before: the client falls back
     to the contact form. Lets the feature ship dark until a key is set. */
  if (!apiKey) return jsonAnswer(null);

  let turns: Turn[] = [];
  try {
    const body = (await req.json()) as { messages?: unknown };
    if (Array.isArray(body.messages)) {
      turns = body.messages
        .filter(
          (m): m is Turn =>
            !!m &&
            typeof (m as Turn).content === "string" &&
            ((m as Turn).role === "user" || (m as Turn).role === "assistant"),
        )
        .slice(-MAX_TURNS)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, MAX_CHARS_PER_TURN),
        }));
    }
  } catch {
    return jsonAnswer(null);
  }
  if (turns.length === 0) return jsonAnswer(null);

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 320,
        messages: [{ role: "system", content: buildSystemPrompt() }, ...turns],
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return jsonAnswer(null);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!raw || isDecline(raw)) return jsonAnswer(null);
    return jsonAnswer(raw);
  } catch {
    /* Upstream error, abort/timeout, or bad JSON — treat as "no answer" so
       the client shows the contact form instead of surfacing an error. */
    return jsonAnswer(null);
  }
}
