export default function KpiCard({title,value}){
  return(
    <div style={{
      background:"#fff",
      border:"1px solid #e5e7eb",
      borderRadius:12,
      padding:16
    }}>
      <div style={{fontSize:13,color:"#6b7280"}}>{title}</div>
      <div style={{fontSize:26,fontWeight:900}}>{value}</div>
    </div>
  );
}
