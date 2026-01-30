export default function StatCard({ title, value, note, icon, className = "" }) {
  return (
    <div className={`statcard ${className}`}>
      <div className="statcard__header">
        <div className="statcard__icon">{icon || "👥"}</div>
        <div className="statcard__title">{title}</div>
      </div>

      {note ? <div className="statcard__note">{note}</div> : null}

      <div className="statcard__value">{value}</div>
    </div>
  );
}
