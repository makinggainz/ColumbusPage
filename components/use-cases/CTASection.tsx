"use client";

export function CTASection() {
  return (
    <section
      style={{
        width: "100%",
        maxWidth: "1728px",
        margin: "0 auto",
        padding: "120px 20px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#1f2937",
          margin: 0,
        }}
      >
        We’d love to work with you.
        <br />
        Contact us, or
        <br />
        Check out our{" "}
        <a
          href="#"
          style={{
            textDecoration: "underline",
            color: "#111",
            fontWeight: 500,
          }}
        >
          Products →
        </a>
      </p>

      <div style={{ marginTop: "28px" }}>
        <button
          style={{
            width: "260px",
            height: "42px",
            border: "1px solid #546094",
            background: "#fff",
            fontSize: "15px",
            color: "#1C2756",
            cursor: "pointer",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
          }}
        >
          Get in touch
        </button>
      </div>
    </section>
  );
}