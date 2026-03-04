export default function PelaporanKpi({ title, value, subtitle }) {
  return (
    <div className="u-kpi u-kpi--blue">
      <div className="u-kpi__label">{title}</div>
      <div className="u-kpi__value">{value}</div>
      {subtitle && <div className="u-kpi__hint">{subtitle}</div>}
    </div>
  );
}
