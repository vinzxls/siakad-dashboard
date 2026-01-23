export default function KpiCard({ title, value, subtitle, onClick }) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        border: "1px solid #e6e6e6",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>{value}</div>
      {subtitle ? (
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{subtitle}</div>
      ) : null}
    </div>
  );

  
}
