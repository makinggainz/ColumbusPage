import Image from "next/image";

export default function PhoneMockup() {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        width: 320,
        height: 700,
        borderRadius: 40,
        overflow: "hidden",
        border: "7px solid #000000",
        boxShadow: "0px 4px 61px rgba(0, 0, 0, 0.25)",
        boxSizing: "content-box",
        zIndex: 50,
        top: "50%",
        marginTop: -160,
      }}
    >
      <Image
        src="/consumer/elioHome1.png"
        alt="Elio App"
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
