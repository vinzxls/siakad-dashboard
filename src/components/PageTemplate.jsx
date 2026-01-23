export default function PageTemplate({
  title,
  description,
  filters,
  kpis = [],
  table,
}) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          border: "1px solid #e6e6e6",
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>
        {description ? (
          <div style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>
            {description}
          </div>
        ) : null}
      </div>

      {/* Filters */}
      {filters ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 12,
            border: "1px solid #e6e6e6",
          }}
        >
          {filters}
        </div>
      ) : null}

      {/* KPI mini */}
      {kpis.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          {kpis}
        </div>
      ) : null}

      {/* Table / Chart */}
      {table ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            border: "1px solid #e6e6e6",
          }}
        >
          {table}
        </div>
      ) : null}
    </div>
  );
}
