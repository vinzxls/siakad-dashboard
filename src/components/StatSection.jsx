import StatCard from "./StatCard";

export default function StatSection({ items = [] }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        alignItems: "stretch",
      }}
    >
      {items.map((it, idx) => (
        <StatCard
          key={idx}
          title={it.title}
          value={it.value}
          note={it.note}
          icon={it.icon}
          className={it.className}
        />
      ))}
    </div>
  );
}
