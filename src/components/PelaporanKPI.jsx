export default function PelaporanKpi({ title, value, subtitle }) {
  return (
    <div
      className="card"
      style={{
        padding: 16,
        borderRadius: 18,
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 900 }}>
        {title}
      </div>

      <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>
        {value}
      </div>

      {subtitle ? (
        <div style={{ fontSize: 12, color: "#6b7280" }}>{subtitle}</div>
      ) : null}
    </div>
  );
}
