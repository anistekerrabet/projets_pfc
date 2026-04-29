import { useState, createContext, useContext } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const THEME = {
  dark: { bg:"#0a0a0a",surface:"#111111",surfaceAlt:"#1a1a1a",border:"#222222",text:"#f5f5f5",textMuted:"#888888",accent:"#f97316",accentSoft:"rgba(249,115,22,0.12)",danger:"#ef4444",success:"#22c55e",warning:"#eab308",info:"#3b82f6" },
  light: { bg:"#fafafa",surface:"#ffffff",surfaceAlt:"#f3f4f6",border:"#e5e7eb",text:"#111111",textMuted:"#6b7280",accent:"#f97316",accentSoft:"rgba(249,115,22,0.10)",danger:"#ef4444",success:"#16a34a",warning:"#ca8a04",info:"#2563eb" },
};

const NAV_ITEMS = [
  { id:"dashboard", label:"Dashboard",   icon:"◈" },
  { id:"vehicles",  label:"Véhicules",   icon:"⬡" },
  { id:"contracts", label:"Contrats",    icon:"◻" },
  { id:"clients",   label:"Clients",     icon:"◎" },
  { id:"maintenance",label:"Maintenance",icon:"◷" },
  { id:"reports",   label:"Rapports",   icon:"▦" },
];

const VEHICLE_STATUS  = { available:{label:"Disponible",color:"success"}, rented:{label:"En location",color:"accent"}, maintenance:{label:"Maintenance",color:"warning"}, inactive:{label:"Inactif",color:"muted"} };
const CONTRACT_STATUS = { active:{label:"Actif",color:"success"}, pending:{label:"En attente",color:"warning"}, closed:{label:"Clôturé",color:"muted"}, cancelled:{label:"Annulé",color:"danger"} };
const MAINTENANCE_STATUS = { scheduled:{label:"Planifiée",color:"info"}, ongoing:{label:"En cours",color:"warning"}, done:{label:"Terminée",color:"success"} };

const MOCK_VEHICLES = [
  {id:"V001",brand:"Renault",model:"Clio V",year:2022,plate:"16-001-AA",status:"available",km:24000,fuel:"Essence",category:"Citadine",dailyRate:3500},
  {id:"V002",brand:"Peugeot",model:"308",year:2021,plate:"16-002-BB",status:"rented",km:51000,fuel:"Diesel",category:"Berline",dailyRate:4500},
  {id:"V003",brand:"Dacia",model:"Duster",year:2023,plate:"16-003-CC",status:"available",km:8000,fuel:"Diesel",category:"SUV",dailyRate:5500},
  {id:"V004",brand:"Toyota",model:"Corolla",year:2022,plate:"16-004-DD",status:"maintenance",km:62000,fuel:"Hybride",category:"Berline",dailyRate:5000},
  {id:"V005",brand:"Hyundai",model:"Tucson",year:2023,plate:"16-005-EE",status:"available",km:12000,fuel:"Diesel",category:"SUV",dailyRate:6000},
  {id:"V006",brand:"Kia",model:"Sportage",year:2021,plate:"16-006-FF",status:"rented",km:44000,fuel:"Essence",category:"SUV",dailyRate:5800},
  {id:"V007",brand:"Renault",model:"Megane",year:2020,plate:"16-007-GG",status:"inactive",km:88000,fuel:"Diesel",category:"Berline",dailyRate:4000},
  {id:"V008",brand:"Ford",model:"Focus",year:2022,plate:"16-008-HH",status:"available",km:19000,fuel:"Essence",category:"Berline",dailyRate:4200},
];
const MOCK_CLIENTS = [
  {id:"C001",firstName:"Amine",lastName:"Bensalem",phone:"0551234567",email:"amine@email.com",city:"Alger",totalContracts:5,balance:0},
  {id:"C002",firstName:"Nadia",lastName:"Hamidi",phone:"0661234567",email:"nadia@email.com",city:"Oran",totalContracts:2,balance:0},
  {id:"C003",firstName:"Yacine",lastName:"Khelifa",phone:"0771234567",email:"yacine@email.com",city:"Blida",totalContracts:8,balance:5000},
  {id:"C004",firstName:"Samira",lastName:"Aoufi",phone:"0551112233",email:"samira@email.com",city:"Tizi Ouzou",totalContracts:1,balance:0},
  {id:"C005",firstName:"Raouf",lastName:"Meziane",phone:"0661112233",email:"raouf@email.com",city:"Alger",totalContracts:3,balance:0},
  {id:"C006",firstName:"Djamila",lastName:"Oukaci",phone:"0771112233",email:"djamila@email.com",city:"Béjaïa",totalContracts:4,balance:2000},
];
const MOCK_CONTRACTS = [
  {id:"CTR001",clientId:"C001",vehicleId:"V002",startDate:"2025-04-15",endDate:"2025-04-22",totalAmount:31500,status:"active",deposit:10000},
  {id:"CTR002",clientId:"C003",vehicleId:"V006",startDate:"2025-04-18",endDate:"2025-04-25",totalAmount:40600,status:"active",deposit:15000},
  {id:"CTR003",clientId:"C002",vehicleId:"V001",startDate:"2025-04-10",endDate:"2025-04-14",totalAmount:14000,status:"closed",deposit:10000},
  {id:"CTR004",clientId:"C005",vehicleId:"V003",startDate:"2025-04-25",endDate:"2025-05-02",totalAmount:38500,status:"pending",deposit:15000},
  {id:"CTR005",clientId:"C006",vehicleId:"V008",startDate:"2025-04-05",endDate:"2025-04-09",totalAmount:16800,status:"closed",deposit:10000},
  {id:"CTR006",clientId:"C004",vehicleId:"V005",startDate:"2025-04-28",endDate:"2025-05-05",totalAmount:42000,status:"pending",deposit:15000},
];
const MOCK_MAINTENANCE = [
  {id:"M001",vehicleId:"V004",type:"Révision",description:"Vidange + filtres",scheduledDate:"2025-04-20",status:"ongoing",cost:8500},
  {id:"M002",vehicleId:"V001",type:"Pneus",description:"Remplacement 4 pneus",scheduledDate:"2025-05-05",status:"scheduled",cost:18000},
  {id:"M003",vehicleId:"V007",type:"Freins",description:"Disques et plaquettes AV",scheduledDate:"2025-04-15",status:"done",cost:12000},
  {id:"M004",vehicleId:"V003",type:"Révision",description:"Vidange 15 000 km",scheduledDate:"2025-05-10",status:"scheduled",cost:6000},
  {id:"M005",vehicleId:"V006",type:"Carrosserie",description:"Réparation bosse portière",scheduledDate:"2025-04-18",status:"done",cost:22000},
];
const CHART_DATA = [
  {month:"Nov",revenue:95000},{month:"Déc",revenue:112000},{month:"Jan",revenue:88000},
  {month:"Fév",revenue:134000},{month:"Mar",revenue:162000},{month:"Avr",revenue:185400},
];
const MAINTENANCE_TYPES = ["Révision","Pneus","Freins","Carrosserie","Moteur","Électricité","Climatisation","Autre"];

// ─────────────────────────────────────────────────────────────────────────────
// THEME CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const ThemeCtx = createContext(null);
function ThemeProvider({children}) {
  const [mode,setMode] = useState("dark");
  const t = THEME[mode];
  return <ThemeCtx.Provider value={{mode,toggle:()=>setMode(m=>m==="dark"?"light":"dark"),t}}>{children}</ThemeCtx.Provider>;
}
const useTheme = () => useContext(ThemeCtx);

// ─────────────────────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Badge({color="muted",children}) {
  const {t}=useTheme();
  const map={success:{bg:"rgba(34,197,94,0.12)",tx:t.success,bd:"rgba(34,197,94,0.3)"},warning:{bg:"rgba(234,179,8,0.12)",tx:t.warning,bd:"rgba(234,179,8,0.3)"},danger:{bg:"rgba(239,68,68,0.12)",tx:t.danger,bd:"rgba(239,68,68,0.3)"},accent:{bg:t.accentSoft,tx:t.accent,bd:"rgba(249,115,22,0.35)"},info:{bg:"rgba(59,130,246,0.12)",tx:t.info,bd:"rgba(59,130,246,0.3)"},muted:{bg:"rgba(136,136,136,0.12)",tx:t.textMuted,bd:"rgba(136,136,136,0.25)"}};
  const s=map[color]||map.muted;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 10px",borderRadius:20,background:s.bg,color:s.tx,border:`1px solid ${s.bd}`,fontSize:11,fontWeight:600,letterSpacing:"0.04em",whiteSpace:"nowrap"}}><span style={{width:5,height:5,borderRadius:"50%",background:s.tx,flexShrink:0}}/>{children}</span>;
}

function Card({children,style={}}) {
  const {t}=useTheme();
  return <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:12,padding:"20px 24px",...style}}>{children}</div>;
}

function Btn({children,variant="primary",onClick,style={},small=false}) {
  const {t}=useTheme();
  const vs={primary:{background:t.accent,color:"#fff",border:"none"},ghost:{background:"transparent",color:t.textMuted,border:`1px solid ${t.border}`},danger:{background:"rgba(239,68,68,0.12)",color:t.danger,border:"1px solid rgba(239,68,68,0.3)"}};
  return <button onClick={onClick} style={{...vs[variant],padding:small?"5px 12px":"8px 18px",borderRadius:8,cursor:"pointer",fontSize:small?12:13,fontWeight:600,fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:6,transition:"opacity .15s",...style}} onMouseEnter={e=>e.currentTarget.style.opacity=".75"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{children}</button>;
}

function Inp({value,onChange,placeholder,style={},type="text"}) {
  const {t}=useTheme();
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{background:t.surfaceAlt,color:t.text,border:`1px solid ${t.border}`,borderRadius:8,padding:"8px 14px",fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box",...style}}/>;
}

function Sel({value,onChange,children,style={}}) {
  const {t}=useTheme();
  return <select value={value} onChange={onChange} style={{background:t.surfaceAlt,color:t.text,border:`1px solid ${t.border}`,borderRadius:8,padding:"7px 12px",fontSize:13,fontFamily:"inherit",cursor:"pointer",outline:"none",...style}}>{children}</select>;
}

function Lbl({children}) {
  const {t}=useTheme();
  return <label style={{display:"block",fontSize:11,color:t.textMuted,marginBottom:5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>{children}</label>;
}

function Table({columns,data,onRowClick}) {
  const {t}=useTheme();
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr>{columns.map(c=><th key={c.key} style={{textAlign:c.align||"left",padding:"10px 14px",color:t.textMuted,fontWeight:600,fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap"}}>{c.label}</th>)}</tr></thead>
        <tbody>
          {data.length===0&&<tr><td colSpan={columns.length} style={{textAlign:"center",padding:32,color:t.textMuted}}>Aucun résultat</td></tr>}
          {data.map((row,i)=>(
            <tr key={row.id||i} onClick={()=>onRowClick&&onRowClick(row)} style={{borderBottom:`1px solid ${t.border}`,cursor:onRowClick?"pointer":"default",transition:"background .12s"}} onMouseEnter={e=>{if(onRowClick)e.currentTarget.style.background=t.surfaceAlt}} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {columns.map(c=><td key={c.key} style={{padding:"12px 14px",color:t.text,textAlign:c.align||"left",whiteSpace:"nowrap"}}>{c.render?c.render(row[c.key],row):row[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Modal({open,onClose,title,children,width=540}) {
  const {t}=useTheme();
  if(!open)return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:16,width:"100%",maxWidth:width,padding:28,position:"relative",boxShadow:"0 24px 64px rgba(0,0,0,0.4)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <span style={{fontWeight:700,fontSize:16,color:t.text}}>{title}</span>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:t.textMuted,cursor:"pointer",fontSize:20,lineHeight:1,padding:4}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatCard({label,value,sub,accent=false,icon}) {
  const {t}=useTheme();
  return (
    <Card style={{position:"relative",overflow:"hidden"}}>
      {accent&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${t.accent},transparent)`}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{color:t.textMuted,fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
          <div style={{color:accent?t.accent:t.text,fontSize:28,fontWeight:800,lineHeight:1}}>{value}</div>
          {sub&&<div style={{color:t.textMuted,fontSize:12,marginTop:6}}>{sub}</div>}
        </div>
        {icon&&<div style={{fontSize:24,opacity:0.18,color:accent?t.accent:t.text}}>{icon}</div>}
      </div>
    </Card>
  );
}

function PageHeader({title,sub,action}) {
  const {t}=useTheme();
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
      <div>
        <h2 style={{margin:0,color:t.text,fontSize:22,fontWeight:800}}>{title}</h2>
        {sub&&<p style={{margin:"4px 0 0",color:t.textMuted,fontSize:13}}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function SearchBar({value,onChange,placeholder}) {
  const {t}=useTheme();
  return (
    <div style={{position:"relative",minWidth:220}}>
      <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:t.textMuted,fontSize:14,pointerEvents:"none"}}>⌕</span>
      <Inp value={value} onChange={onChange} placeholder={placeholder||"Rechercher…"} style={{paddingLeft:32}}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({activePage,onNavigate}) {
  const {t}=useTheme();
  return (
    <aside style={{width:220,minWidth:220,background:t.surface,borderRight:`1px solid ${t.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
      <div style={{padding:"24px 20px 20px",borderBottom:`1px solid ${t.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:t.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff",letterSpacing:"-1px"}}>FL</div>
          <div>
            <div style={{fontWeight:800,fontSize:14,color:t.text,letterSpacing:"-0.3px"}}>FleetAdmin</div>
            <div style={{fontSize:10,color:t.textMuted,marginTop:1}}>Gestion de flotte</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"16px 12px",display:"flex",flexDirection:"column",gap:2}}>
        {NAV_ITEMS.map(item=>{
          const active=activePage===item.id;
          return (
            <button key={item.id} onClick={()=>onNavigate(item.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,background:active?t.accentSoft:"transparent",border:active?"1px solid rgba(249,115,22,0.2)":"1px solid transparent",color:active?t.accent:t.textMuted,cursor:"pointer",fontSize:13,fontWeight:active?700:500,fontFamily:"inherit",textAlign:"left",width:"100%",transition:"all .12s"}} onMouseEnter={e=>{if(!active){e.currentTarget.style.color=t.text;e.currentTarget.style.background=t.surfaceAlt;}}} onMouseLeave={e=>{e.currentTarget.style.color=active?t.accent:t.textMuted;e.currentTarget.style.background=active?t.accentSoft:"transparent";}}>
              <span style={{fontSize:15,lineHeight:1}}>{item.icon}</span>
              {item.label}
              {active&&<span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:t.accent}}/>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"14px 20px",borderTop:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:t.accentSoft,border:"1px solid rgba(249,115,22,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:t.accent}}>A</div>
        <div>
          <div style={{color:t.text,fontWeight:600,fontSize:12}}>Administrateur</div>
          <div style={{fontSize:10,color:t.textMuted}}>admin@fleet.dz</div>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
function Topbar({activePage}) {
  const {t,mode,toggle}=useTheme();
  const [notif,setNotif]=useState(true);
  const label=NAV_ITEMS.find(n=>n.id===activePage)?.label||"Dashboard";
  return (
    <header style={{height:58,background:t.surface,borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{color:t.textMuted,fontSize:13}}>FleetAdmin</span>
        <span style={{color:t.border}}>›</span>
        <span style={{color:t.text,fontWeight:700,fontSize:14}}>{label}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{color:t.textMuted,fontSize:12}}>{new Date().toLocaleDateString("fr-DZ",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</span>
        <button onClick={toggle} style={{width:34,height:34,borderRadius:8,background:t.surfaceAlt,border:`1px solid ${t.border}`,color:t.text,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>{mode==="dark"?"☀":"☾"}</button>
        <button onClick={()=>setNotif(false)} style={{position:"relative",width:34,height:34,borderRadius:8,background:t.surfaceAlt,border:`1px solid ${t.border}`,color:t.text,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>
          🔔{notif&&<span style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:t.accent,border:`2px solid ${t.surface}`}}/>}
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function DashboardPage({onNavigate}) {
  const {t}=useTheme();
  const max=Math.max(...CHART_DATA.map(d=>d.revenue));
  const summary={available:MOCK_VEHICLES.filter(v=>v.status==="available").length,rented:MOCK_VEHICLES.filter(v=>v.status==="rented").length,maintenance:MOCK_VEHICLES.filter(v=>v.status==="maintenance").length,inactive:MOCK_VEHICLES.filter(v=>v.status==="inactive").length};
  return (
    <div>
      <PageHeader title="Dashboard" sub="Bonjour 👋 — vue d'ensemble de votre flotte"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Véhicules dispo" value={4} sub="/ 8 au total" icon="⬡" accent/>
        <StatCard label="Contrats actifs" value={2} sub="2 en attente" icon="◻"/>
        <StatCard label="Clients" value={6} sub="inscrits" icon="◎"/>
        <StatCard label="Maintenance" value={2} sub="en cours" icon="◷"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14,marginBottom:20}}>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{color:t.textMuted,fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>Revenus mensuels</div>
              <div style={{color:t.text,fontSize:22,fontWeight:800,marginTop:4}}>185 400 DA</div>
            </div>
            <Badge color="success">+14.4% ce mois</Badge>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:100}}>
            {CHART_DATA.map((d,i)=>{const h=Math.round((d.revenue/max)*100);const isLast=i===CHART_DATA.length-1;return(
              <div key={d.month} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <div style={{width:"100%",height:h,background:isLast?t.accent:"linear-gradient(180deg,rgba(249,115,22,0.4),rgba(249,115,22,0.1))",borderRadius:"4px 4px 0 0",border:isLast?"none":"1px solid rgba(249,115,22,0.2)",borderBottom:"none"}}/>
                <span style={{fontSize:10,color:t.textMuted}}>{d.month}</span>
              </div>
            );})}
          </div>
        </Card>
        <Card>
          <div style={{color:t.textMuted,fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:16}}>État de la flotte</div>
          {Object.entries(summary).map(([key,count])=>{
            const info=VEHICLE_STATUS[key];
            const cMap={success:t.success,accent:t.accent,warning:t.warning,muted:t.textMuted};
            const color=cMap[info.color];
            const pct=Math.round((count/8)*100);
            return(<div key={key} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:t.text}}>{info.label}</span><span style={{fontSize:12,fontWeight:700,color}}>{count} <span style={{color:t.textMuted,fontWeight:400}}>({pct}%)</span></span></div><div style={{height:5,background:t.surfaceAlt,borderRadius:4}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:4}}/></div></div>);
          })}
        </Card>
      </div>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{fontWeight:700,color:t.text}}>Contrats récents</span>
          <button onClick={()=>onNavigate("contracts")} style={{background:"none",border:"none",color:t.accent,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Voir tout →</button>
        </div>
        {MOCK_CONTRACTS.slice(0,4).map(c=>{
          const client=MOCK_CLIENTS.find(cl=>cl.id===c.clientId);
          const vehicle=MOCK_VEHICLES.find(v=>v.id===c.vehicleId);
          const status=CONTRACT_STATUS[c.status];
          return(
            <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${t.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:8,background:t.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:t.accent}}>{client?.firstName[0]}{client?.lastName[0]}</div>
                <div>
                  <div style={{color:t.text,fontWeight:600,fontSize:13}}>{client?.firstName} {client?.lastName}</div>
                  <div style={{color:t.textMuted,fontSize:11}}>{vehicle?.brand} {vehicle?.model} · {c.id}</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <span style={{fontWeight:700,color:t.text,fontSize:13}}>{c.totalAmount.toLocaleString("fr-DZ")} DA</span>
                <Badge color={status.color}>{status.label}</Badge>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: VEHICLES
// ─────────────────────────────────────────────────────────────────────────────
function VehiclesPage() {
  const {t}=useTheme();
  const [vehicles,setVehicles]=useState(MOCK_VEHICLES);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("all");
  const [modalOpen,setModalOpen]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({brand:"",model:"",year:2024,plate:"",fuel:"Diesel",category:"Berline",km:0,dailyRate:0,status:"available"});
  const [delId,setDelId]=useState(null);

  const filtered=vehicles.filter(v=>{const q=search.toLowerCase();return(!q||[v.brand,v.model,v.plate,v.id].some(f=>f.toLowerCase().includes(q)))&&(filterStatus==="all"||v.status===filterStatus);});
  const openAdd=()=>{setForm({brand:"",model:"",year:2024,plate:"",fuel:"Diesel",category:"Berline",km:0,dailyRate:0,status:"available"});setEditId(null);setModalOpen(true);};
  const openEdit=v=>{setForm({...v});setEditId(v.id);setModalOpen(true);};
  const save=()=>{if(editId)setVehicles(vs=>vs.map(v=>v.id===editId?{...v,...form}:v));else{const id=`V${String(vehicles.length+1).padStart(3,"0")}`;setVehicles(vs=>[...vs,{...form,id}]);}setModalOpen(false);};
  const del=id=>{setVehicles(vs=>vs.filter(v=>v.id!==id));setDelId(null);};

  const cols=[
    {key:"id",label:"ID",render:v=><span style={{color:t.textMuted,fontFamily:"monospace",fontSize:12}}>{v}</span>},
    {key:"brand",label:"Véhicule",render:(_,r)=><div><div style={{fontWeight:700,color:t.text}}>{r.brand} {r.model}</div><div style={{fontSize:11,color:t.textMuted}}>{r.year} · {r.fuel}</div></div>},
    {key:"plate",label:"Immatriculation",render:v=><span style={{fontFamily:"monospace",fontWeight:700,background:t.surfaceAlt,padding:"2px 8px",borderRadius:5,border:`1px solid ${t.border}`,fontSize:12}}>{v}</span>},
    {key:"category",label:"Catégorie"},
    {key:"km",label:"Km",align:"right",render:v=>`${v.toLocaleString("fr-DZ")} km`},
    {key:"dailyRate",label:"Tarif/j",align:"right",render:v=><span style={{color:t.accent,fontWeight:700}}>{v.toLocaleString("fr-DZ")} DA</span>},
    {key:"status",label:"Statut",render:v=>{const s=VEHICLE_STATUS[v];return<Badge color={s.color}>{s.label}</Badge>;}},
    {key:"id",label:"",render:(_,r)=><div style={{display:"flex",gap:5}}><Btn small variant="ghost" onClick={e=>{e.stopPropagation();openEdit(r);}}>✎</Btn><Btn small variant="danger" onClick={e=>{e.stopPropagation();setDelId(r.id);}}>✕</Btn></div>},
  ];

  return (
    <div>
      <PageHeader title="Véhicules" sub={`${vehicles.length} véhicules dans la flotte`} action={<Btn onClick={openAdd}>+ Ajouter</Btn>}/>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <SearchBar value={search} onChange={e=>setSearch(e.target.value)} placeholder="Marque, modèle, immat…"/>
        <Sel value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">Tous les statuts</option>
          {Object.entries(VEHICLE_STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </Sel>
        <div style={{display:"flex",gap:6,marginLeft:"auto",flexWrap:"wrap"}}>
          {Object.entries(VEHICLE_STATUS).map(([k,v])=>{const count=vehicles.filter(ve=>ve.status===k).length;return(<button key={k} onClick={()=>setFilterStatus(filterStatus===k?"all":k)} style={{background:filterStatus===k?t.accentSoft:t.surfaceAlt,border:`1px solid ${filterStatus===k?t.accent:t.border}`,color:filterStatus===k?t.accent:t.textMuted,borderRadius:8,padding:"5px 10px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{v.label} <strong>{count}</strong></button>);})}
        </div>
      </div>
      <Card style={{padding:0}}><Table columns={cols} data={filtered} onRowClick={openEdit}/></Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editId?"Modifier le véhicule":"Ajouter un véhicule"} width={560}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["Marque","brand"],["Modèle","model"],["Année","year","number"],["Immatriculation","plate"],["Kilométrage","km","number"],["Tarif/jour (DA)","dailyRate","number"]].map(([l,k,tp])=>(
            <div key={k}><Lbl>{l}</Lbl><Inp value={form[k]} onChange={e=>setForm(f=>({...f,[k]:tp==="number"?Number(e.target.value):e.target.value}))} placeholder={l}/></div>
          ))}
          <div><Lbl>Carburant</Lbl><Sel value={form.fuel} onChange={e=>setForm(f=>({...f,fuel:e.target.value}))} style={{width:"100%"}}>{["Essence","Diesel","Hybride","Électrique"].map(f=><option key={f}>{f}</option>)}</Sel></div>
          <div><Lbl>Catégorie</Lbl><Sel value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{width:"100%"}}>{["Citadine","Berline","SUV","Utilitaire","Luxe"].map(c=><option key={c}>{c}</option>)}</Sel></div>
          <div style={{gridColumn:"span 2"}}><Lbl>Statut</Lbl><Sel value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={{width:"100%"}}>{Object.entries(VEHICLE_STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</Sel></div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}><Btn variant="ghost" onClick={()=>setModalOpen(false)}>Annuler</Btn><Btn onClick={save}>{editId?"Enregistrer":"Ajouter"}</Btn></div>
      </Modal>

      <Modal open={!!delId} onClose={()=>setDelId(null)} title="Supprimer le véhicule" width={380}>
        <p style={{color:t.textMuted,fontSize:13,margin:"0 0 20px"}}>Cette action est irréversible.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>setDelId(null)}>Annuler</Btn><Btn variant="danger" onClick={()=>del(delId)}>Supprimer</Btn></div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: CONTRACTS
// ─────────────────────────────────────────────────────────────────────────────
function calcTotal(vehicleId,start,end,vehicles){const v=vehicles.find(v=>v.id===vehicleId);if(!v||!start||!end)return 0;const d=Math.max(1,Math.round((new Date(end)-new Date(start))/86400000));return d*v.dailyRate;}

function ContractsPage() {
  const {t}=useTheme();
  const [contracts,setContracts]=useState(MOCK_CONTRACTS);
  const [vehicles]=useState(MOCK_VEHICLES);
  const [clients]=useState(MOCK_CLIENTS);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("all");
  const [modalOpen,setModalOpen]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({clientId:"",vehicleId:"",startDate:"",endDate:"",deposit:0,status:"pending"});
  const [viewC,setViewC]=useState(null);
  const [delId,setDelId]=useState(null);

  const filtered=contracts.filter(c=>{const cl=clients.find(x=>x.id===c.clientId);const vh=vehicles.find(x=>x.id===c.vehicleId);const q=search.toLowerCase();return(!q||[c.id,cl?.firstName,cl?.lastName,vh?.brand,vh?.model,vh?.plate].filter(Boolean).some(f=>f.toLowerCase().includes(q)))&&(filterStatus==="all"||c.status===filterStatus);});
  const stats={active:contracts.filter(c=>c.status==="active").length,pending:contracts.filter(c=>c.status==="pending").length,total:contracts.filter(c=>c.status!=="cancelled").reduce((s,c)=>s+c.totalAmount,0)};
  const openAdd=()=>{setForm({clientId:"",vehicleId:"",startDate:"",endDate:"",deposit:0,status:"pending"});setEditId(null);setModalOpen(true);};
  const openEdit=c=>{setForm({...c});setEditId(c.id);setModalOpen(true);};
  const save=()=>{const total=calcTotal(form.vehicleId,form.startDate,form.endDate,vehicles);if(editId)setContracts(cs=>cs.map(c=>c.id===editId?{...c,...form,totalAmount:total}:c));else{const id=`CTR${String(contracts.length+1).padStart(3,"0")}`;setContracts(cs=>[...cs,{...form,id,totalAmount:total}]);}setModalOpen(false);};
  const del=id=>{setContracts(cs=>cs.filter(c=>c.id!==id));setDelId(null);};

  const previewTotal=calcTotal(form.vehicleId,form.startDate,form.endDate,vehicles);
  const days=form.startDate&&form.endDate?Math.max(0,Math.round((new Date(form.endDate)-new Date(form.startDate))/86400000)):0;

  const cols=[
    {key:"id",label:"N° Contrat",render:v=><span style={{fontFamily:"monospace",fontSize:12,color:t.textMuted}}>{v}</span>},
    {key:"clientId",label:"Client",render:v=>{const c=clients.find(cl=>cl.id===v);return c?<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:6,background:t.accentSoft,color:t.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{c.firstName[0]}{c.lastName[0]}</div><span style={{fontWeight:600,color:t.text}}>{c.firstName} {c.lastName}</span></div>:v;}},
    {key:"vehicleId",label:"Véhicule",render:v=>{const vh=vehicles.find(x=>x.id===v);return vh?<div><div style={{fontWeight:600,color:t.text,fontSize:13}}>{vh.brand} {vh.model}</div><div style={{fontSize:11,color:t.textMuted,fontFamily:"monospace"}}>{vh.plate}</div></div>:v;}},
    {key:"startDate",label:"Début",render:v=>new Date(v).toLocaleDateString("fr-DZ")},
    {key:"endDate",label:"Fin",render:v=>new Date(v).toLocaleDateString("fr-DZ")},
    {key:"totalAmount",label:"Montant",align:"right",render:v=><span style={{fontWeight:700,color:t.accent}}>{v.toLocaleString("fr-DZ")} DA</span>},
    {key:"status",label:"Statut",render:v=>{const s=CONTRACT_STATUS[v];return<Badge color={s.color}>{s.label}</Badge>;}},
    {key:"id",label:"",render:(_,r)=><div style={{display:"flex",gap:5}}><Btn small variant="ghost" onClick={e=>{e.stopPropagation();setViewC(r);}}>👁</Btn><Btn small variant="ghost" onClick={e=>{e.stopPropagation();openEdit(r);}}>✎</Btn><Btn small variant="danger" onClick={e=>{e.stopPropagation();setDelId(r.id);}}>✕</Btn></div>},
  ];

  return (
    <div>
      <PageHeader title="Contrats" sub={`${contracts.length} contrats au total`} action={<Btn onClick={openAdd}>+ Nouveau contrat</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Contrats actifs" value={stats.active} icon="◻" accent/>
        <StatCard label="En attente" value={stats.pending} icon="⏳"/>
        <StatCard label="Revenus totaux" value={`${(stats.total/1000).toFixed(0)}K DA`} icon="▦"/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <SearchBar value={search} onChange={e=>setSearch(e.target.value)} placeholder="Client, véhicule, N° contrat…"/>
        <Sel value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="all">Tous les statuts</option>{Object.entries(CONTRACT_STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</Sel>
      </div>
      <Card style={{padding:0}}><Table columns={cols} data={filtered} onRowClick={r=>setViewC(r)}/></Card>

      {/* View */}
      <Modal open={!!viewC} onClose={()=>setViewC(null)} title={`Contrat ${viewC?.id}`} width={500}>
        {viewC&&(()=>{const cl=clients.find(c=>c.id===viewC.clientId);const vh=vehicles.find(v=>v.id===viewC.vehicleId);const st=CONTRACT_STATUS[viewC.status];const d=Math.max(1,Math.round((new Date(viewC.endDate)-new Date(viewC.startDate))/86400000));return(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><Badge color={st.color}>{st.label}</Badge><span style={{fontFamily:"monospace",fontSize:11,color:t.textMuted}}>{viewC.id}</span></div>
            {[["Client",`${cl?.firstName} ${cl?.lastName}`],["Téléphone",cl?.phone],["Véhicule",`${vh?.brand} ${vh?.model}`],["Immatriculation",vh?.plate],["Période",`${new Date(viewC.startDate).toLocaleDateString("fr-DZ")} → ${new Date(viewC.endDate).toLocaleDateString("fr-DZ")}`],["Durée",`${d} jour${d>1?"s":""}`],["Caution",`${viewC.deposit.toLocaleString("fr-DZ")} DA`],["Montant total",`${viewC.totalAmount.toLocaleString("fr-DZ")} DA`]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}><span style={{color:t.textMuted}}>{l}</span><span style={{color:t.text,fontWeight:600}}>{v}</span></div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:18,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setViewC(null);openEdit(viewC);}}>✎ Modifier</Btn><Btn variant="ghost" onClick={()=>setViewC(null)}>Fermer</Btn></div>
          </div>
        );})()}
      </Modal>

      {/* Edit/Add */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editId?"Modifier le contrat":"Nouveau contrat"} width={520}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><Lbl>Client</Lbl><Sel value={form.clientId} onChange={e=>setForm(f=>({...f,clientId:e.target.value}))} style={{width:"100%"}}><option value="">-- Sélectionner --</option>{clients.map(c=><option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}</Sel></div>
          <div style={{gridColumn:"span 2"}}><Lbl>Véhicule</Lbl><Sel value={form.vehicleId} onChange={e=>setForm(f=>({...f,vehicleId:e.target.value}))} style={{width:"100%"}}><option value="">-- Sélectionner --</option>{vehicles.filter(v=>v.status==="available"||v.id===form.vehicleId).map(v=><option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate}) — {v.dailyRate.toLocaleString("fr-DZ")} DA/j</option>)}</Sel></div>
          <div><Lbl>Date de début</Lbl><Inp type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))}/></div>
          <div><Lbl>Date de fin</Lbl><Inp type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))}/></div>
          <div><Lbl>Caution (DA)</Lbl><Inp value={form.deposit} onChange={e=>setForm(f=>({...f,deposit:Number(e.target.value)}))} placeholder="0"/></div>
          <div><Lbl>Statut</Lbl><Sel value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={{width:"100%"}}>{Object.entries(CONTRACT_STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</Sel></div>
        </div>
        {previewTotal>0&&<div style={{marginTop:14,padding:"12px 16px",background:t.accentSoft,border:"1px solid rgba(249,115,22,0.25)",borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:t.textMuted,fontSize:12}}>{days} jour{days>1?"s":""} × tarif journalier</span><span style={{color:t.accent,fontWeight:800,fontSize:16}}>{previewTotal.toLocaleString("fr-DZ")} DA</span></div>}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}}><Btn variant="ghost" onClick={()=>setModalOpen(false)}>Annuler</Btn><Btn onClick={save}>{editId?"Enregistrer":"Créer"}</Btn></div>
      </Modal>

      <Modal open={!!delId} onClose={()=>setDelId(null)} title="Supprimer le contrat" width={360}>
        <p style={{color:t.textMuted,fontSize:13,margin:"0 0 20px"}}>Cette action est irréversible.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>setDelId(null)}>Annuler</Btn><Btn variant="danger" onClick={()=>del(delId)}>Supprimer</Btn></div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: CLIENTS
// ─────────────────────────────────────────────────────────────────────────────
function ClientsPage() {
  const {t}=useTheme();
  const [clients,setClients]=useState(MOCK_CLIENTS);
  const [search,setSearch]=useState("");
  const [modalOpen,setModalOpen]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({firstName:"",lastName:"",phone:"",email:"",city:""});
  const [viewCl,setViewCl]=useState(null);
  const [delId,setDelId]=useState(null);

  const filtered=clients.filter(c=>{const q=search.toLowerCase();return!q||[c.firstName,c.lastName,c.phone,c.email,c.city,c.id].some(f=>f?.toLowerCase().includes(q));});
  const openAdd=()=>{setForm({firstName:"",lastName:"",phone:"",email:"",city:""});setEditId(null);setModalOpen(true);};
  const openEdit=c=>{setForm({...c});setEditId(c.id);setModalOpen(true);};
  const save=()=>{if(editId)setClients(cs=>cs.map(c=>c.id===editId?{...c,...form}:c));else{const id=`C${String(clients.length+1).padStart(3,"0")}`;setClients(cs=>[...cs,{...form,id,totalContracts:0,balance:0}]);}setModalOpen(false);};
  const del=id=>{setClients(cs=>cs.filter(c=>c.id!==id));setDelId(null);};
  const getContracts=id=>MOCK_CONTRACTS.filter(c=>c.clientId===id);

  const cols=[
    {key:"firstName",label:"Client",render:(_,r)=><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:8,background:t.accentSoft,color:t.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,border:"1px solid rgba(249,115,22,0.25)"}}>{r.firstName[0]}{r.lastName[0]}</div><div><div style={{fontWeight:700,color:t.text}}>{r.firstName} {r.lastName}</div><div style={{fontSize:11,color:t.textMuted}}>{r.id}</div></div></div>},
    {key:"phone",label:"Téléphone",render:v=><span style={{fontFamily:"monospace",fontSize:13}}>{v}</span>},
    {key:"email",label:"Email",render:v=><span style={{color:t.textMuted,fontSize:12}}>{v}</span>},
    {key:"city",label:"Ville"},
    {key:"totalContracts",label:"Contrats",align:"center",render:v=><span style={{fontWeight:700,color:t.text}}>{v}</span>},
    {key:"balance",label:"Solde dû",align:"right",render:v=>v>0?<span style={{color:t.danger,fontWeight:700}}>{v.toLocaleString("fr-DZ")} DA</span>:<span style={{color:t.success}}>✓ Soldé</span>},
    {key:"id",label:"",render:(_,r)=><div style={{display:"flex",gap:5}}><Btn small variant="ghost" onClick={e=>{e.stopPropagation();setViewCl(r);}}>👁</Btn><Btn small variant="ghost" onClick={e=>{e.stopPropagation();openEdit(r);}}>✎</Btn><Btn small variant="danger" onClick={e=>{e.stopPropagation();setDelId(r.id);}}>✕</Btn></div>},
  ];

  return (
    <div>
      <PageHeader title="Clients" sub={`${clients.length} clients enregistrés`} action={<Btn onClick={openAdd}>+ Nouveau client</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Total clients" value={clients.length} icon="◎" accent/>
        <StatCard label="Solde dû" value={clients.filter(c=>c.balance>0).length} icon="⚠"/>
        <StatCard label="Contrats actifs" value={MOCK_CONTRACTS.filter(c=>c.status==="active").length} icon="◻"/>
      </div>
      <div style={{marginBottom:16}}><SearchBar value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom, téléphone, email, ville…"/></div>
      <Card style={{padding:0}}><Table columns={cols} data={filtered} onRowClick={r=>setViewCl(r)}/></Card>

      <Modal open={!!viewCl} onClose={()=>setViewCl(null)} title="Fiche client" width={480}>
        {viewCl&&(()=>{const cc=getContracts(viewCl.id);return(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"0 0 18px",marginBottom:18,borderBottom:`1px solid ${t.border}`}}>
              <div style={{width:54,height:54,borderRadius:12,background:t.accentSoft,color:t.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:18,border:"1px solid rgba(249,115,22,0.3)"}}>{viewCl.firstName[0]}{viewCl.lastName[0]}</div>
              <div>
                <div style={{fontWeight:800,color:t.text,fontSize:16}}>{viewCl.firstName} {viewCl.lastName}</div>
                <div style={{color:t.textMuted,fontSize:12}}>{viewCl.city} · {viewCl.id}</div>
                {viewCl.balance>0&&<Badge color="danger">Solde dû : {viewCl.balance.toLocaleString("fr-DZ")} DA</Badge>}
              </div>
            </div>
            {[["Téléphone",viewCl.phone],["Email",viewCl.email],["Ville",viewCl.city]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${t.border}`,fontSize:13}}><span style={{color:t.textMuted}}>{l}</span><span style={{color:t.text,fontWeight:600}}>{v}</span></div>
            ))}
            <div style={{marginTop:18}}><div style={{fontWeight:700,color:t.text,fontSize:13,marginBottom:10}}>Historique des contrats</div>
              {cc.length===0?<p style={{color:t.textMuted,fontSize:12}}>Aucun contrat</p>:cc.map(c=>{const s=CONTRACT_STATUS[c.status];return(<div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",marginBottom:6,borderRadius:8,background:t.surfaceAlt,fontSize:12}}><span style={{color:t.textMuted,fontFamily:"monospace"}}>{c.id}</span><span style={{color:t.text}}>{new Date(c.startDate).toLocaleDateString("fr-DZ")}</span><span style={{color:t.accent,fontWeight:700}}>{c.totalAmount.toLocaleString("fr-DZ")} DA</span><Badge color={s.color}>{s.label}</Badge></div>);})}
            </div>
            <div style={{display:"flex",gap:10,marginTop:18,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>{setViewCl(null);openEdit(viewCl);}}>✎ Modifier</Btn><Btn variant="ghost" onClick={()=>setViewCl(null)}>Fermer</Btn></div>
          </div>
        );})()}
      </Modal>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editId?"Modifier le client":"Nouveau client"} width={480}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["Prénom","firstName"],["Nom","lastName"],["Téléphone","phone"],["Email","email"],["Ville","city"]].map(([l,k])=>(
            <div key={k} style={{gridColumn:k==="email"||k==="city"?"span 2":"span 1"}}><Lbl>{l}</Lbl><Inp value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={l}/></div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}}><Btn variant="ghost" onClick={()=>setModalOpen(false)}>Annuler</Btn><Btn onClick={save}>{editId?"Enregistrer":"Ajouter"}</Btn></div>
      </Modal>

      <Modal open={!!delId} onClose={()=>setDelId(null)} title="Supprimer le client" width={360}>
        <p style={{color:t.textMuted,fontSize:13,margin:"0 0 20px"}}>Cette action est irréversible.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>setDelId(null)}>Annuler</Btn><Btn variant="danger" onClick={()=>del(delId)}>Supprimer</Btn></div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: MAINTENANCE
// ─────────────────────────────────────────────────────────────────────────────
function MaintenancePage() {
  const {t}=useTheme();
  const [records,setRecords]=useState(MOCK_MAINTENANCE);
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("all");
  const [modalOpen,setModalOpen]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({vehicleId:"",type:"Révision",description:"",scheduledDate:"",status:"scheduled",cost:0});
  const [delId,setDelId]=useState(null);

  const filtered=records.filter(r=>{const v=MOCK_VEHICLES.find(ve=>ve.id===r.vehicleId);const q=search.toLowerCase();return(!q||[r.id,r.type,r.description,v?.brand,v?.model,v?.plate].filter(Boolean).some(f=>f.toLowerCase().includes(q)))&&(filterStatus==="all"||r.status===filterStatus);});
  const stats={scheduled:records.filter(r=>r.status==="scheduled").length,ongoing:records.filter(r=>r.status==="ongoing").length,total:records.reduce((s,r)=>s+r.cost,0)};
  const openAdd=()=>{setForm({vehicleId:"",type:"Révision",description:"",scheduledDate:"",status:"scheduled",cost:0});setEditId(null);setModalOpen(true);};
  const openEdit=r=>{setForm({...r});setEditId(r.id);setModalOpen(true);};
  const save=()=>{if(editId)setRecords(rs=>rs.map(r=>r.id===editId?{...r,...form}:r));else{const id=`M${String(records.length+1).padStart(3,"0")}`;setRecords(rs=>[...rs,{...form,id}]);}setModalOpen(false);};
  const del=id=>{setRecords(rs=>rs.filter(r=>r.id!==id));setDelId(null);};

  const cols=[
    {key:"id",label:"ID",render:v=><span style={{fontFamily:"monospace",fontSize:12,color:t.textMuted}}>{v}</span>},
    {key:"vehicleId",label:"Véhicule",render:v=>{const vh=MOCK_VEHICLES.find(x=>x.id===v);return vh?<div><div style={{fontWeight:700,color:t.text}}>{vh.brand} {vh.model}</div><div style={{fontSize:11,color:t.textMuted,fontFamily:"monospace"}}>{vh.plate}</div></div>:v;}},
    {key:"type",label:"Type",render:v=><span style={{padding:"2px 10px",borderRadius:6,background:t.surfaceAlt,color:t.text,fontSize:12,fontWeight:600,border:`1px solid ${t.border}`}}>{v}</span>},
    {key:"description",label:"Description",render:v=><span style={{color:t.textMuted,fontSize:12}}>{v}</span>},
    {key:"scheduledDate",label:"Date",render:v=>new Date(v).toLocaleDateString("fr-DZ")},
    {key:"cost",label:"Coût",align:"right",render:v=><span style={{fontWeight:700,color:t.text}}>{v.toLocaleString("fr-DZ")} DA</span>},
    {key:"status",label:"Statut",render:v=>{const s=MAINTENANCE_STATUS[v];return<Badge color={s.color}>{s.label}</Badge>;}},
    {key:"id",label:"",render:(_,r)=><div style={{display:"flex",gap:4}}>
      {r.status==="scheduled"&&<Btn small variant="ghost" onClick={e=>{e.stopPropagation();setRecords(rs=>rs.map(x=>x.id===r.id?{...x,status:"ongoing"}:x));}}>▶</Btn>}
      {r.status==="ongoing"&&<Btn small variant="ghost" onClick={e=>{e.stopPropagation();setRecords(rs=>rs.map(x=>x.id===r.id?{...x,status:"done"}:x));}}>✓</Btn>}
      <Btn small variant="ghost" onClick={e=>{e.stopPropagation();openEdit(r);}}>✎</Btn>
      <Btn small variant="danger" onClick={e=>{e.stopPropagation();setDelId(r.id);}}>✕</Btn>
    </div>},
  ];

  return (
    <div>
      <PageHeader title="Maintenance" sub="Suivi des interventions sur la flotte" action={<Btn onClick={openAdd}>+ Planifier</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Planifiées" value={stats.scheduled} icon="◷" accent/>
        <StatCard label="En cours" value={stats.ongoing} icon="⚙"/>
        <StatCard label="Coût total" value={`${(stats.total/1000).toFixed(0)}K DA`} icon="▦"/>
      </div>
      <Card style={{marginBottom:20}}>
        <div style={{fontWeight:700,color:t.text,marginBottom:14,fontSize:13}}>Calendrier des interventions</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {records.filter(r=>r.status!=="done").sort((a,b)=>new Date(a.scheduledDate)-new Date(b.scheduledDate)).map(r=>{
            const v=MOCK_VEHICLES.find(ve=>ve.id===r.vehicleId);const s=MAINTENANCE_STATUS[r.status];const cMap={info:t.info,warning:t.warning,success:t.success};
            return(<div key={r.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:8,background:t.surfaceAlt,border:`1px solid ${t.border}`}}><div style={{width:3,height:36,borderRadius:4,background:cMap[s.color],flexShrink:0}}/><div style={{flex:1}}><div style={{fontWeight:600,color:t.text,fontSize:13}}>{v?.brand} {v?.model}</div><div style={{color:t.textMuted,fontSize:11}}>{r.type} · {r.description}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:12,color:t.text,fontWeight:600}}>{new Date(r.scheduledDate).toLocaleDateString("fr-DZ")}</div><Badge color={s.color}>{s.label}</Badge></div></div>);
          })}
        </div>
      </Card>
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <SearchBar value={search} onChange={e=>setSearch(e.target.value)} placeholder="Véhicule, type…"/>
        <Sel value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="all">Tous</option>{Object.entries(MAINTENANCE_STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</Sel>
      </div>
      <Card style={{padding:0}}><Table columns={cols} data={filtered}/></Card>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editId?"Modifier":"Planifier une maintenance"} width={500}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><Lbl>Véhicule</Lbl><Sel value={form.vehicleId} onChange={e=>setForm(f=>({...f,vehicleId:e.target.value}))} style={{width:"100%"}}><option value="">-- Sélectionner --</option>{MOCK_VEHICLES.map(v=><option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate})</option>)}</Sel></div>
          <div><Lbl>Type</Lbl><Sel value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{width:"100%"}}>{MAINTENANCE_TYPES.map(ty=><option key={ty}>{ty}</option>)}</Sel></div>
          <div><Lbl>Date prévue</Lbl><Inp type="date" value={form.scheduledDate} onChange={e=>setForm(f=>({...f,scheduledDate:e.target.value}))}/></div>
          <div style={{gridColumn:"span 2"}}><Lbl>Description</Lbl><Inp value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Détail…"/></div>
          <div><Lbl>Coût estimé (DA)</Lbl><Inp value={form.cost} onChange={e=>setForm(f=>({...f,cost:Number(e.target.value)}))} placeholder="0"/></div>
          <div><Lbl>Statut</Lbl><Sel value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={{width:"100%"}}>{Object.entries(MAINTENANCE_STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</Sel></div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}}><Btn variant="ghost" onClick={()=>setModalOpen(false)}>Annuler</Btn><Btn onClick={save}>{editId?"Enregistrer":"Planifier"}</Btn></div>
      </Modal>

      <Modal open={!!delId} onClose={()=>setDelId(null)} title="Supprimer l'intervention" width={360}>
        <p style={{color:t.textMuted,fontSize:13,margin:"0 0 20px"}}>Cette action est irréversible.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn variant="ghost" onClick={()=>setDelId(null)}>Annuler</Btn><Btn variant="danger" onClick={()=>del(delId)}>Supprimer</Btn></div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: REPORTS
// ─────────────────────────────────────────────────────────────────────────────
function ReportsPage() {
  const {t}=useTheme();
  const totalRevenue=MOCK_CONTRACTS.filter(c=>c.status!=="cancelled").reduce((s,c)=>s+c.totalAmount,0);
  const maintCost=MOCK_MAINTENANCE.reduce((s,m)=>s+m.cost,0);
  const max=Math.max(...CHART_DATA.map(d=>d.revenue));

  const topClients=MOCK_CLIENTS.map(c=>({...c,spent:MOCK_CONTRACTS.filter(co=>co.clientId===c.id&&co.status!=="cancelled").reduce((s,co)=>s+co.totalAmount,0)})).sort((a,b)=>b.spent-a.spent).slice(0,5);
  const vUtil=MOCK_VEHICLES.map(v=>({...v,cnt:MOCK_CONTRACTS.filter(c=>c.vehicleId===v.id).length})).sort((a,b)=>b.cnt-a.cnt);
  const maxCnt=Math.max(...vUtil.map(v=>v.cnt))||1;

  return (
    <div>
      <PageHeader title="Rapports" sub="Synthèse et analyses de votre activité"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Revenus bruts" value={`${(totalRevenue/1000).toFixed(0)}K DA`} icon="▦" accent/>
        <StatCard label="Coûts maintenance" value={`${(maintCost/1000).toFixed(0)}K DA`} icon="◷"/>
        <StatCard label="Revenus nets" value={`${((totalRevenue-maintCost)/1000).toFixed(0)}K DA`} icon="◈"/>
        <StatCard label="Taux occupation" value={`${Math.round((MOCK_VEHICLES.filter(v=>v.status==="rented").length/MOCK_VEHICLES.length)*100)}%`} icon="⬡"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card>
          <div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:14}}>Revenus mensuels</div>
          <div style={{color:t.textMuted,fontSize:11,marginBottom:16}}>6 derniers mois</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>
            {CHART_DATA.map((d,i)=>{const h=Math.round((d.revenue/max)*80);const isLast=i===CHART_DATA.length-1;return(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontSize:9,color:t.textMuted}}>{Math.round(d.revenue/1000)}K</span>
                <div style={{width:"100%",height:h,background:isLast?t.accent:`${t.accent}55`,borderRadius:"3px 3px 0 0",border:isLast?"none":`1px solid ${t.accent}44`,borderBottom:"none"}}/>
                <span style={{fontSize:9,color:t.textMuted}}>{d.month}</span>
              </div>
            );})}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:12,padding:"10px 0 0",borderTop:`1px solid ${t.border}`}}><span style={{color:t.textMuted,fontSize:12}}>Total période</span><span style={{fontWeight:800,color:t.accent}}>{CHART_DATA.reduce((s,d)=>s+d.revenue,0).toLocaleString("fr-DZ")} DA</span></div>
        </Card>
        <Card>
          <div style={{fontWeight:700,color:t.text,marginBottom:4,fontSize:14}}>Contrats par statut</div>
          <div style={{color:t.textMuted,fontSize:11,marginBottom:20}}>Répartition globale</div>
          {Object.entries(CONTRACT_STATUS).map(([k,v])=>{const count=MOCK_CONTRACTS.filter(c=>c.status===k).length;const pct=Math.round((count/MOCK_CONTRACTS.length)*100);const cMap={success:t.success,warning:t.warning,danger:t.danger,muted:t.textMuted,accent:t.accent};const c=cMap[v.color];return(
            <div key={k} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:t.text}}>{v.label}</span><span style={{fontSize:12,fontWeight:700,color:c}}>{count} <span style={{color:t.textMuted,fontWeight:400}}>({pct}%)</span></span></div><div style={{height:5,background:t.surfaceAlt,borderRadius:4}}><div style={{height:"100%",width:`${pct}%`,background:c,borderRadius:4}}/></div></div>
          );})}
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <div style={{fontWeight:700,color:t.text,marginBottom:16,fontSize:14}}>Top clients</div>
          {topClients.map((c,i)=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<topClients.length-1?`1px solid ${t.border}`:"none"}}>
              <span style={{fontWeight:800,color:t.textMuted,fontSize:13,width:20}}>#{i+1}</span>
              <div style={{width:32,height:32,borderRadius:8,background:i===0?t.accentSoft:t.surfaceAlt,color:i===0?t.accent:t.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,border:`1px solid ${i===0?"rgba(249,115,22,0.3)":t.border}`}}>{c.firstName[0]}{c.lastName[0]}</div>
              <div style={{flex:1}}><div style={{fontWeight:600,color:t.text,fontSize:13}}>{c.firstName} {c.lastName}</div><div style={{color:t.textMuted,fontSize:11}}>{c.totalContracts} contrat{c.totalContracts>1?"s":""}</div></div>
              <span style={{fontWeight:700,color:t.text,fontSize:13}}>{c.spent.toLocaleString("fr-DZ")} DA</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontWeight:700,color:t.text,marginBottom:16,fontSize:14}}>Utilisation des véhicules</div>
          {vUtil.map(v=>{const pct=Math.round((v.cnt/maxCnt)*100);const s=VEHICLE_STATUS[v.status];const cMap={success:t.success,accent:t.accent,warning:t.warning,muted:t.textMuted};return(
            <div key={v.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:t.text,fontWeight:600}}>{v.brand} {v.model}</span><Badge color={s.color}>{s.label}</Badge></div><span style={{fontSize:12,color:t.textMuted}}>{v.cnt} loc.</span></div>
              <div style={{height:4,background:t.surfaceAlt,borderRadius:4}}><div style={{height:"100%",width:`${pct}%`,background:cMap[s.color],borderRadius:4}}/></div>
            </div>
          );})}
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP SHELL
// ─────────────────────────────────────────────────────────────────────────────
function AppShell() {
  const {t}=useTheme();
  const [page,setPage]=useState("dashboard");
  const pages={dashboard:<DashboardPage onNavigate={setPage}/>,vehicles:<VehiclesPage/>,contracts:<ContractsPage/>,clients:<ClientsPage/>,maintenance:<MaintenancePage/>,reports:<ReportsPage/>};
  return (
    <div style={{display:"flex",minHeight:"100vh",background:t.bg,color:t.text,fontFamily:"'DM Sans','Outfit','Segoe UI',sans-serif",fontSize:14}}>
      <Sidebar activePage={page} onNavigate={setPage}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <Topbar activePage={page}/>
        <main style={{flex:1,padding:"24px 28px",overflowY:"auto"}}>{pages[page]}</main>
      </div>
    </div>
  );
}

export default function FleetAdmin() {
  return <ThemeProvider><AppShell/></ThemeProvider>;
}
