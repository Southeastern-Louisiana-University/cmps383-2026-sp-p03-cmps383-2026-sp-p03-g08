import { useState, useEffect, createContext, useContext } from "react";

const CaffeinatedLionsLogo = "/Caffeinated Lions Logo.png";
const HeroLion = "/Latte cup back.jpg";

// ── Theme ─────────────────────────────────────────────────────────────
const ThemeContext = createContext<any>(null);
const useTheme = () => useContext(ThemeContext);

function getTheme(isDark: boolean) {
  return {
    isDark,
    bg:          isDark ? "#0f0f0f" : "#ffffff",
    surface:     isDark ? "#1c1c1c" : "#f9fafb",
    surface2:    isDark ? "#252525" : "#f0f0f0",
    card:        isDark ? "#1c1c1c" : "#ffffff",
    border:      isDark ? "#333333" : "#e5e7eb",
    text:        isDark ? "#f5f5f5" : "#111111",
    subtext:     isDark ? "#999999" : "#555555",
    navBg:       isDark ? "#0a0a0a" : "#ffffff",
    navBorder:   isDark ? "#222222" : "#e5e7eb",
    navText:     isDark ? "#eeeeee" : "#111111",
    navLink:     isDark ? "#999999" : "#444444",
    inputBg:     isDark ? "#2a2a2a" : "#f3f4f6",
    inputBorder: isDark ? "#3a3a3a" : "#d1d5db",
    inputText:   isDark ? "#ffffff" : "#111111",
    sectionBg:   isDark ? "#111111" : "#f9fafb",
    shadow:      isDark ? "0 4px 16px rgba(0,0,0,.5)" : "0 2px 8px rgba(0,0,0,.08)",
  };
}

const gold = "#C8973A";
const btn = (bg: string, c = "#fff"): React.CSSProperties => ({
  background: bg, color: c, border: "none", borderRadius: 8,
  padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer",
});

// ── Hook: isMobile ────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

// ── Data ──────────────────────────────────────────────────────────────
const MENU = [
  { id:1, name:"Classic Latte",    price:4.50, cat:"Hot Coffee",  popular:true,  orders:142, img:"https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&q=80" },
  { id:2, name:"Cappuccino",       price:4.75, cat:"Hot Coffee",  popular:true,  orders:118, img:"https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80" },
  { id:3, name:"Iced Latte",       price:5.00, cat:"Iced Coffee", popular:true,  orders:203, img:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80" },
  { id:4, name:"Matcha Latte",     price:5.25, cat:"Iced Coffee", popular:false, orders:87,  img:"https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80" },
  { id:5, name:"Croissant",        price:3.25, cat:"Food",        popular:false, orders:64,  img:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80" },
  { id:6, name:"Cheesecake Slice", price:4.00, cat:"Food",        popular:true,  orders:95,  img:"https://images.unsplash.com/photo-1567327613485-fbc7bf196198?w=400&q=80" },
  { id:7, name:"Americano",        price:3.75, cat:"Hot Coffee",  popular:false, orders:76,  img:"https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=80" },
  { id:8, name:"Blueberry Muffin", price:3.50, cat:"Food",        popular:false, orders:58,  img:"https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80" },
];
const LOCATIONS = [
  { id:1, name:"Downtown",  addr:"123 Main St",      city:"Hammond, LA 70401",    phone:"(985) 555-0101", hours:"Mon–Fri 6AM–9PM, Sat–Sun 7AM–8PM" },
  { id:2, name:"Northside", addr:"456 Oak Ave",       city:"Hammond, LA 70403",    phone:"(985) 555-0102", hours:"Mon–Fri 7AM–8PM, Sat–Sun 8AM–7PM" },
  { id:3, name:"Lakefront", addr:"789 Lake Shore Dr", city:"Mandeville, LA 70448", phone:"(985) 555-0103", hours:"Daily 7AM–9PM" },
];
const USERS = [
  { id:"c", email:"guest@lions.com", password:"Password123!", role:"customer", name:"John", points:120,
    lastOrder:{ id:"#1038", items:[{name:"Iced Latte",price:5.00},{name:"Croissant",price:3.25}], total:8.25, date:"Mar 15, 2026" }},
  { id:"s", email:"staff@lions.com", password:"Password123!", role:"staff",    name:"Sara", points:0, lastOrder:null },
  { id:"a", email:"admin@lions.com", password:"Password123!", role:"admin",    name:"Mike", points:0, lastOrder:null },
];
const STATUS_NEXT  = { Pending:"Preparing", Preparing:"Ready", Ready:"Done" } as Record<string,string>;
const STATUS_COLOR = { Pending:"#f59e0b", Preparing:"#3b82f6", Ready:"#16a34a", Done:"#9ca3af" } as Record<string,string>;
const ROLE_COLOR   = { customer:"#16a34a", staff:"#2563eb", admin:"#dc2626" } as Record<string,string>;
const INIT_ORDERS  = [
  { id:"#1042", items:"Iced Latte + Croissant", table:"T3",         status:"Pending",   time:"2 min ago" },
  { id:"#1041", items:"Cappuccino",             table:"Drive-Thru", status:"Preparing", time:"5 min ago" },
  { id:"#1040", items:"Classic Latte x2",       table:"T1",         status:"Ready",     time:"8 min ago" },
];

// ── Card ──────────────────────────────────────────────────────────────
function Card({ children, style={} }:{ children:any, style?:React.CSSProperties }) {
  const T = useTheme();
  return <div style={{ background:T.card, borderRadius:14, border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden", ...style }}>{children}</div>;
}

// ── Receipt ───────────────────────────────────────────────────────────
function Receipt({ order, onClose }:any) {
  const T = useTheme();
  const tax = (order.total * 0.0875).toFixed(2);
  const grand = (order.total + parseFloat(tax)).toFixed(2);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:20 }}>
      <div style={{ background:T.card, borderRadius:16, padding:24, width:"100%", maxWidth:360, color:T.text }}>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:36 }}>🧾</div>
          <div style={{ fontWeight:900, fontSize:18 }}>Order Receipt</div>
          <div style={{ color:T.subtext, fontSize:12, marginTop:4 }}>Order {order.id} · {order.date || new Date().toLocaleDateString()}</div>
        </div>
        <div style={{ borderTop:`2px dashed ${T.border}`, borderBottom:`2px dashed ${T.border}`, padding:"12px 0", marginBottom:12 }}>
          {order.items.map((item:any,i:number)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"4px 0" }}>
              <span>{item.name}</span><span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext, marginBottom:4 }}><span>Subtotal</span><span>${order.total.toFixed(2)}</span></div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext, marginBottom:8 }}><span>Tax (8.75%)</span><span>${tax}</span></div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:900, borderTop:`1px solid ${T.border}`, paddingTop:8, color:T.text }}>
          <span>Total</span><span style={{ color:gold }}>${grand}</span>
        </div>
        <div style={{ background:T.isDark?"#14291a":"#f0fdf4", borderRadius:8, padding:"10px 14px", marginTop:12, display:"flex", justifyContent:"space-between", fontSize:13 }}>
          <span style={{ color:"#16a34a", fontWeight:700 }}>⭐ Points Earned</span>
          <span style={{ color:"#16a34a", fontWeight:800 }}>+{Math.floor(order.total*10)} pts</span>
        </div>
        <button onClick={onClose} style={{ ...btn(T.isDark?"#333":"#1a1a1a"), width:"100%", marginTop:14, padding:"13px 0", fontSize:14 }}>Close</button>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────
function SettingsMenu({ user, onClose, setPage }:any) {
  const T = useTheme();
  const { isDark, setIsDark } = T;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{ position:"absolute", top:62, right:16, background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:20, width:290, boxShadow:T.shadow, color:T.text }}>
        {user && (
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
            <div>
              <div style={{ fontWeight:800, fontSize:15 }}>{user.name}</div>
              <div style={{ color:T.subtext, fontSize:12 }}>{user.email}</div>
              <span style={{ background:ROLE_COLOR[user.role], color:"#fff", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:20, textTransform:"uppercase" as const }}>{user.role}</span>
            </div>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:14, fontWeight:700 }}>{isDark?"🌙 Dark Mode":"☀️ Light Mode"}</span>
          <div onClick={()=>setIsDark(!isDark)} style={{ width:48, height:26, borderRadius:13, background:isDark?gold:"#ddd", cursor:"pointer", position:"relative", transition:"background .3s" }}>
            <div style={{ position:"absolute", top:3, left:isDark?24:3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .3s" }} />
          </div>
        </div>
        {user?.role==="customer" && (
          <div style={{ marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ color:T.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase" as const, marginBottom:10 }}>My Account</div>
            {[{icon:"⭐",label:"My Rewards",sub:`${user.points} points`,pg:"rewards"},{icon:"📦",label:"Order History",sub:"Past orders & receipts",pg:"history"}].map((r,i)=>(
              <div key={i} onClick={()=>{setPage(r.pg);onClose();}}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", borderRadius:10, background:T.surface2, cursor:"pointer", marginBottom:8 }}>
                <div><div style={{ fontWeight:700, fontSize:13 }}>{r.icon} {r.label}</div><div style={{ color:T.subtext, fontSize:11 }}>{r.sub}</div></div>
                <span style={{ color:gold, fontWeight:800 }}>›</span>
              </div>
            ))}
            <div style={{ padding:"10px 12px", borderRadius:10, background:T.surface2 }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:6 }}>👤 Account Info</div>
              <div style={{ fontSize:12, color:T.subtext }}>Name: {user.name}</div>
              <div style={{ fontSize:12, color:T.subtext }}>Email: {user.email}</div>
              <div style={{ fontSize:12, color:T.subtext }}>Tier: {user.points>=200?"🥇 Gold":user.points>=100?"🥈 Silver":"🥉 Bronze"}</div>
            </div>
          </div>
        )}
        <div>
          <div style={{ color:T.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase" as const, marginBottom:10 }}>Preferences</div>
          {["Notifications","Location Services","Accessibility"].map((s,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"8px 0", borderBottom:i<2?`1px solid ${T.border}`:"none", color:T.text }}>
              <span>{s}</span><span style={{ color:T.subtext, fontSize:11 }}>Manage</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────
function Nav({ user, page, setPage, onLogout, history, goBack }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = user
    ? user.role==="customer" ? ["Home","Menu","Rewards","Locations"]
    : user.role==="staff"    ? ["Orders","Reservations","Drive-Thru"]
    : ["Dashboard","Menu","Orders","Locations","Staff"]
    : ["Home","Menu","Locations"];

  return (
    <>
      <nav style={{ background:T.navBg, borderBottom:`1px solid ${T.navBorder}`, position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding: isMobile?"10px 16px":"10px 20px" }}>
          {/* Left */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {history.length > 0 && (
              <button onClick={goBack} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.subtext, borderRadius:7, padding:"5px 10px", fontSize:12, fontWeight:700, cursor:"pointer" }}>←</button>
            )}
            <div onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
              <img src={CaffeinatedLionsLogo} alt="icon" style={{ height:36, width:36, objectFit:"contain", borderRadius:8 }} />
              {!isMobile && <span style={{ color:gold, fontWeight:900, fontSize:17 }}>Caffeinated Lions</span>}
              {isMobile && <span style={{ color:gold, fontWeight:900, fontSize:15 }}>Caffeinated Lions</span>}
            </div>
          </div>

          {/* Desktop Links */}
          {!isMobile && (
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              {links.map(l=>(
                <span key={l} onClick={()=>setPage(l.toLowerCase())}
                  style={{ color:page===l.toLowerCase()?gold:T.navLink, fontSize:13, fontWeight:600, cursor:"pointer" }}>{l}</span>
              ))}
            </div>
          )}

          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {user && !isMobile && user.role==="customer" && <span style={{ color:gold, fontSize:12, fontWeight:700 }}>⭐ {user.points} pts</span>}
            {user && !isMobile && <span style={{ color:T.navText, fontSize:13 }}>{user.name}</span>}
            <button onClick={()=>setShowSettings(s=>!s)} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.navText, borderRadius:7, padding:"5px 10px", fontSize:13, cursor:"pointer" }}>⚙️</button>
            {!isMobile && user && <button onClick={onLogout} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.subtext, borderRadius:6, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>Logout</button>}
            {!isMobile && !user && <button onClick={()=>setPage("login")} style={btn(gold)}>Log In</button>}
            {isMobile && (
              <button onClick={()=>setMenuOpen(o=>!o)} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.navText, borderRadius:7, padding:"5px 10px", fontSize:18, cursor:"pointer" }}>☰</button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobile && menuOpen && (
          <div style={{ background:T.card, borderTop:`1px solid ${T.border}`, padding:"12px 16px" }}>
            {links.map(l=>(
              <div key={l} onClick={()=>{setPage(l.toLowerCase());setMenuOpen(false);}}
                style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}`, color:page===l.toLowerCase()?gold:T.text, fontWeight:600, fontSize:15, cursor:"pointer" }}>{l}</div>
            ))}
            {user?.role==="customer" && (
              <div style={{ padding:"10px 0", color:gold, fontWeight:700, fontSize:13 }}>⭐ {user.points} points</div>
            )}
            {user
              ? <button onClick={()=>{onLogout();setMenuOpen(false);}} style={{ ...btn("#fee2e2","#dc2626"), width:"100%", marginTop:10, padding:"12px 0" }}>Logout</button>
              : <button onClick={()=>{setPage("login");setMenuOpen(false);}} style={{ ...btn(gold), width:"100%", marginTop:10, padding:"12px 0" }}>Log In</button>
            }
          </div>
        )}
      </nav>

      {showSettings && <SettingsMenu user={user} onClose={()=>setShowSettings(false)} setPage={setPage} />}
    </>
  );
}

// ── Bottom Tab Bar (Mobile) ───────────────────────────────────────────
function BottomTabBar({ user, tab, setTab }:any) {
  const T = useTheme();
  const tabs = user?.role==="customer"
    ? [{icon:"🏠",label:"Home",val:"home"},{icon:"🍽️",label:"Menu",val:"menu"},{icon:"🛒",label:"Order",val:"drive-thru"},{icon:"⭐",label:"Rewards",val:"rewards"},{icon:"📍",label:"Locations",val:"locations"}]
    : user?.role==="staff"
    ? [{icon:"📦",label:"Orders",val:"orders"},{icon:"🪑",label:"Tables",val:"reservations"},{icon:"🚗",label:"Drive-Thru",val:"drive-thru"}]
    : [{icon:"📊",label:"Dash",val:"dashboard"},{icon:"🍽️",label:"Menu",val:"menu"},{icon:"📦",label:"Orders",val:"orders"},{icon:"📍",label:"Locations",val:"locations"},{icon:"👥",label:"Staff",val:"staff"}];

  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:T.navBg, borderTop:`1px solid ${T.navBorder}`, display:"flex", zIndex:150, paddingBottom:"env(safe-area-inset-bottom)" }}>
      {tabs.map(t=>(
        <div key={t.val} onClick={()=>setTab(t.val)}
          style={{ flex:1, display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", padding:"8px 0", cursor:"pointer", borderTop:tab===t.val?`2px solid ${gold}`:"2px solid transparent" }}>
          <span style={{ fontSize:20 }}>{t.icon}</span>
          <span style={{ fontSize:10, fontWeight:700, color:tab===t.val?gold:T.subtext, marginTop:2 }}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Reservations Tab ─────────────────────────────────────────────────
function ReservationsTab({ isMobile }:any) {
  const T = useTheme();
  const [step,     setStep]     = useState(1);
  const [date,     setDate]     = useState("");
  const [time,     setTime]     = useState("");
  const [guests,   setGuests]   = useState(2);
  const [table,    setTable]    = useState<number|null>(null);
  const [confirmed,setConfirmed]= useState(false);

  const times = ["8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM",
    "4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM"];

  const today = new Date().toISOString().split("T")[0];

  const confirm = () => { if(table) setConfirmed(true); };
  const reset   = () => { setStep(1); setDate(""); setTime(""); setGuests(2); setTable(null); setConfirmed(false); };

  if(confirmed) return (
    <div style={{ ...C.card, padding:32, textAlign:"center", background:T.card, border:`1px solid ${T.border}` }}>
      <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
      <h2 style={{ fontWeight:900, fontSize:20, color:T.text, marginBottom:8 }}>Reservation Confirmed!</h2>
      <div style={{ background:T.isDark?"#14291a":"#f0fdf4", borderRadius:12, padding:20, margin:"16px 0", textAlign:"left" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ color:T.subtext, fontSize:14 }}>📅 Date</span>
          <span style={{ fontWeight:700, color:T.text, fontSize:14 }}>{new Date(date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ color:T.subtext, fontSize:14 }}>🕐 Time</span>
          <span style={{ fontWeight:700, color:T.text, fontSize:14 }}>{time}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ color:T.subtext, fontSize:14 }}>👥 Guests</span>
          <span style={{ fontWeight:700, color:T.text, fontSize:14 }}>{guests} {guests===1?"person":"people"}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:T.subtext, fontSize:14 }}>🪑 Table</span>
          <span style={{ fontWeight:700, color:T.text, fontSize:14 }}>Table {table}</span>
        </div>
      </div>
      <p style={{ color:T.subtext, fontSize:13, marginBottom:20 }}>We'll see you soon! A confirmation has been sent to your email.</p>
      <button onClick={reset} style={{ ...btn(gold), padding:"11px 28px" }}>Make Another Reservation</button>
    </div>
  );

  return (
    <div style={{ ...C.card, padding:isMobile?16:28, background:T.card, border:`1px solid ${T.border}` }}>
      <h2 style={{ fontWeight:900, fontSize:20, color:T.text, marginBottom:4 }}>🪑 Reserve a Table</h2>
      <p style={{ color:T.subtext, fontSize:13, marginBottom:24 }}>Book your spot at Caffeinated Lions</p>

      {/* Step Indicator */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
        {["Date & Time","Party Size","Choose Table"].map((s,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", flex: i<2?1:"auto" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:step>i?gold:step===i+1?gold:T.surface2,
                color:step>=i+1?"#fff":T.subtext, display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:13 }}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{ fontSize:10, fontWeight:700, color:step===i+1?gold:T.subtext, whiteSpace:"nowrap" }}>{s}</span>
            </div>
            {i<2 && <div style={{ flex:1, height:2, background:step>i+1?gold:T.surface2, margin:"0 8px", marginBottom:18 }} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Date & Time */}
      {step===1 && (
        <div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontWeight:700, fontSize:14, color:T.text, marginBottom:8 }}>📅 Select Date</label>
            <input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)}
              style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:`2px solid ${date?gold:T.border}`,
                background:T.inputBg, color:T.inputText, fontSize:14, boxSizing:"border-box", outline:"none" }} />
          </div>
          {date && (
            <div>
              <label style={{ display:"block", fontWeight:700, fontSize:14, color:T.text, marginBottom:8 }}>🕐 Select Time</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:8 }}>
                {times.map(t=>(
                  <button key={t} onClick={()=>setTime(t)}
                    style={{ ...btn(time===t?gold:T.surface2, time===t?"#fff":T.text), padding:"9px 6px", fontSize:12, borderRadius:8 }}>{t}</button>
                ))}
              </div>
            </div>
          )}
          <button onClick={()=>setStep(2)} disabled={!date||!time}
            style={{ ...btn(!date||!time?T.surface2:gold, !date||!time?T.subtext:"#fff"), width:"100%", padding:"13px 0", marginTop:24, fontSize:14 }}>
            Continue →
          </button>
        </div>
      )}

      {/* Step 2 — Party Size */}
      {step===2 && (
        <div>
          <div style={{ background:T.surface2, borderRadius:12, padding:16, marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext, marginBottom:4 }}>
              <span>📅 {new Date(date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</span>
              <span>🕐 {time}</span>
            </div>
          </div>
          <label style={{ display:"block", fontWeight:700, fontSize:14, color:T.text, marginBottom:16 }}>👥 How many guests?</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
            {[1,2,3,4,5,6,7,8].map(n=>(
              <button key={n} onClick={()=>setGuests(n)}
                style={{ ...btn(guests===n?gold:T.surface2, guests===n?"#fff":T.text), padding:"18px 0", borderRadius:12, fontSize:16, fontWeight:800 }}>
                {n}{n===8?"+":""}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(1)} style={{ ...btn(T.surface2,T.text), flex:1, padding:"13px 0" }}>← Back</button>
            <button onClick={()=>setStep(3)} style={{ ...btn(gold), flex:2, padding:"13px 0", fontSize:14 }}>Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Choose Table */}
      {step===3 && (
        <div>
          <div style={{ background:T.surface2, borderRadius:12, padding:16, marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext }}>
              <span>📅 {new Date(date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
              <span>🕐 {time}</span>
              <span>👥 {guests} guests</span>
            </div>
          </div>
          <label style={{ display:"block", fontWeight:700, fontSize:14, color:T.text, marginBottom:8 }}>🪑 Select a table</label>
          <p style={{ color:T.subtext, fontSize:12, marginBottom:16 }}>
            <span style={{ display:"inline-block", width:12, height:12, borderRadius:"50%", background:"#16a34a", marginRight:6 }} />Available &nbsp;
            <span style={{ display:"inline-block", width:12, height:12, borderRadius:"50%", background:"#e5e7eb", marginRight:6 }} />Taken
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
            {[1,2,3,4,5,6,7,8].map(t=>{
              const taken = [2,5].includes(t);
              return (
                <button key={t} onClick={()=>!taken&&setTable(t)} disabled={taken}
                  style={{ ...btn(table===t?gold:taken?"#e5e7eb":T.surface2, table===t?"#fff":taken?"#aaa":T.text),
                    padding:"20px 0", borderRadius:12, fontSize:14, fontWeight:800,
                    border: table===t?`2px solid ${gold}`:"2px solid transparent",
                    cursor: taken?"not-allowed":"pointer" }}>
                  T{t}{taken?"🚫":""}
                </button>
              );
            })}
          </div>
          {table && (
            <div style={{ background:T.isDark?"#14291a":"#f0fdf4", borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
              <div style={{ fontWeight:700, color:"#16a34a", fontSize:14 }}>✅ Table {table} selected</div>
              <div style={{ color:T.subtext, fontSize:12, marginTop:2 }}>
                {new Date(date).toLocaleDateString("en-US",{month:"short",day:"numeric"})} at {time} · {guests} guests
              </div>
            </div>
          )}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(2)} style={{ ...btn(T.surface2,T.text), flex:1, padding:"13px 0" }}>← Back</button>
            <button onClick={confirm} disabled={!table}
              style={{ ...btn(!table?T.surface2:gold, !table?T.subtext:"#fff"), flex:2, padding:"13px 0", fontSize:14 }}>
              Confirm Reservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── C helper (needed for ReservationsTab) ─────────────────────────────
const C = {
  card: { background:"#fff", borderRadius:14, border:"1px solid #e5e7eb", boxShadow:"0 2px 8px rgba(0,0,0,.05)", overflow:"hidden" } as React.CSSProperties,
};
function PopularReel({ onSignup }:any) {
  const T = useTheme();
  const popular = MENU.filter(m=>m.popular).sort((a,b)=>b.orders-a.orders);
  const [active,setActive] = useState(0);
  const [fade,setFade]     = useState(true);
  useEffect(()=>{
    const t = setInterval(()=>{ setFade(false); setTimeout(()=>{ setActive(i=>(i+1)%popular.length); setFade(true); },400); },3000);
    return ()=>clearInterval(t);
  },[]);
  const item = popular[active];
  return (
    <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", padding:"40px 20px", textAlign:"center" }}>
      <div style={{ color:"#aaa", fontSize:11, fontWeight:800, letterSpacing:2, textTransform:"uppercase" as const, marginBottom:12 }}>🔥 Most Popular Right Now</div>
      <div style={{ opacity:fade?1:0, transition:"opacity 0.4s", maxWidth:360, margin:"0 auto" }}>
        <img src={item.img} alt={item.name} style={{ width:"100%", height:200, objectFit:"cover", borderRadius:16, marginBottom:16 }} />
        <div style={{ color:"#fff", fontWeight:900, fontSize:22 }}>{item.name}</div>
        <div style={{ color:gold, fontSize:16, fontWeight:700, marginTop:4 }}>${item.price.toFixed(2)}</div>
        <div style={{ color:"#888", fontSize:12, marginTop:4 }}>{item.orders} orders this week</div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:16 }}>
        {popular.map((_,i)=>(
          <div key={i} onClick={()=>{setFade(false);setTimeout(()=>{setActive(i);setFade(true);},200);}}
            style={{ width:8, height:8, borderRadius:"50%", background:i===active?gold:"#555", cursor:"pointer" }} />
        ))}
      </div>
      <div style={{ marginTop:24, background:"#ffffff12", border:"1px solid #ffffff1a", borderRadius:12, padding:"16px 20px", maxWidth:400, margin:"24px auto 0" }}>
        <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:6 }}>🎁 Join Rewards & Earn Free Drinks</div>
        <div style={{ color:"#aaa", fontSize:12, marginBottom:14 }}>Sign up today and get 50 bonus points on your first order!</div>
        <button onClick={onSignup} style={{ ...btn(gold), width:"100%", padding:"13px 0" }}>Create Free Account</button>
      </div>
    </div>
  );
}

// ── Guest Home ────────────────────────────────────────────────────────
function GuestHome({ setPage: _setPage }:any) {
  const setPage = _setPage;
  const T = useTheme();
  const isMobile = useIsMobile();
  const top3 = [...MENU].sort((a,b)=>b.orders-a.orders).slice(0,3);
  return (
    <div style={{ background:T.bg, minHeight:"100vh", paddingBottom: isMobile ? 70 : 0 }}>
      <div style={{ position:"relative", height: isMobile ? 320 : 420, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        <img src={HeroLion} alt="hero" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", opacity:T.isDark?.9:.85 }} />
        <div style={{ position:"absolute", inset:0, background:T.isDark?"linear-gradient(to bottom,#00000044,#000000bb)":"linear-gradient(to bottom,#1a1a1a66,#1a1a1add)" }} />
        <div style={{ position:"relative", textAlign:"center", padding:20 }}>
          <h1 style={{ color:"#fff", fontSize: isMobile?"clamp(22px,6vw,36px)":"clamp(26px,5vw,48px)", fontWeight:900, lineHeight:1.2, margin:0, textShadow:"0 2px 12px rgba(0,0,0,.8)" }}>
            Fuel Your <span style={{ color:gold }}>Pride</span>,<br/>One Sip at a Time
          </h1>
          <p style={{ color:"#ddd", fontSize: isMobile?13:14, margin:"12px 0 20px", textShadow:"0 1px 6px rgba(0,0,0,.8)" }}>Order from your table. Skip the line.</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" as const }}>
            <button onClick={()=>setPage("login")} style={{ ...btn(gold), padding: isMobile?"10px 20px":"11px 24px" }}>Order Now</button>
            <button onClick={()=>setPage("locations")} style={{ ...btn("transparent"), border:"2px solid #fff", padding: isMobile?"10px 20px":"11px 24px" }}>Find Location</button>
          </div>
        </div>
      </div>

      <PopularReel onSignup={()=>setPage("signup")} />

      <div style={{ background:T.sectionBg, padding: isMobile?"32px 16px":"48px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <h2 style={{ fontWeight:900, fontSize: isMobile?18:20, color:T.text, marginBottom:6 }}>⭐ Most Popular This Week</h2>
          <p style={{ color:T.subtext, fontSize:13, marginBottom:16 }}>Our customers can't get enough of these</p>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(3,1fr)", gap: isMobile?12:16 }}>
            {top3.map((item,i)=>(
              <Card key={item.id} style={{ position:"relative" }}>
                {i===0 && <div style={{ position:"absolute", top:8, left:8, background:gold, color:"#fff", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:20, zIndex:1 }}>#1</div>}
                <img src={item.img} alt={item.name} style={{ width:"100%", height: isMobile?100:140, objectFit:"cover" }} />
                <div style={{ padding:"10px 12px" }}>
                  <div style={{ fontWeight:800, fontSize: isMobile?12:14, color:T.text }}>{item.name}</div>
                  <div style={{ color:T.subtext, fontSize:11, margin:"3px 0 8px" }}>{item.cat}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ color:gold, fontWeight:800 }}>${item.price.toFixed(2)}</span>
                    <button onClick={()=>setPage("login")} style={{ ...btn(gold), padding:"5px 10px", fontSize:11 }}>Order</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", padding: isMobile?"36px 16px":"48px 24px", textAlign:"center" }}>
        <h2 style={{ color:"#fff", fontSize: isMobile?18:22, fontWeight:900, marginBottom:8 }}>Sign Up & Start Earning Rewards</h2>
        <p style={{ color:"#aaa", fontSize:13, marginBottom:20 }}>Every order earns points. Redeem for free drinks!</p>
        <div style={{ display:"flex", flexDirection: isMobile?"column":"row" as any, gap:10, maxWidth:440, margin:"0 auto" }}>
          <input placeholder="Enter your email..." style={{ flex:1, padding:"13px 16px", borderRadius:8, border:"none", fontSize:13, background:T.inputBg, color:T.inputText }} />
          <button onClick={()=>setPage("signup")} style={{ ...btn(gold), padding:"13px 20px" }}>Get Started</button>
        </div>
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────
function Login({ onLogin, setPage, mode }:any) {
  const T = useTheme();
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [name,setName]=useState("");   
  const [isSignup,setIsSignup]=useState(mode==="signup");
  
  const go = async () => {
  setErr("");
  const roleMap: Record<string, string> = {
    "admin": "admin",
    "staff": "staff",
    "customer": "customer",
    "user": "customer",
  };
  try {
    if (isSignup) {
      const res = await fetch("/api/authentication/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userName: name,
          email: email,
          password: pass,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setErr(msg || "Registration failed.");
        return;
      }
      const apiUser = await res.json();
      const localUser = USERS.find(u => u.email === email);

      // Fetch real points from backend
      const pointsRes = await fetch("/api/users/points", { credentials: "include" });
      const realPoints = pointsRes.ok ? await pointsRes.json() : 0;

      const mappedUser = {
        ...apiUser,
        role: localUser?.role ?? roleMap[apiUser.roles?.[0]?.toLowerCase()] ?? "customer",
        name: localUser?.name ?? apiUser.userName,
        email: apiUser.userName,
        points: realPoints,
        lastOrder: localUser?.lastOrder ?? null,
      };
      onLogin(mappedUser);
    } else {
      const res = await fetch("/api/authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userName: email, password: pass }),
      });
      if (!res.ok) {
        setErr("Invalid credentials.");
        return;
      }
      const apiUser = await res.json();
      const localUser = USERS.find(u => u.email === email);
      const pointsRes = await fetch("/api/users/points", { credentials: "include" });
      const realPoints = pointsRes.ok ? await pointsRes.json() : 0;
      const mappedUser = {
        ...apiUser,
        role: localUser?.role ?? roleMap[apiUser.roles?.[0]?.toLowerCase()] ?? "customer",
        name: localUser?.name ?? apiUser.userName,
        email: apiUser.userName,
        points: realPoints,
        lastOrder: localUser?.lastOrder ?? null,
      };
      onLogin(mappedUser);
    }
  } catch (e) {
    setErr("Network error. Please try again.");
  }
};
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <img src={CaffeinatedLionsLogo} alt="logo" style={{ height:70, width:"auto", marginBottom:10 }} />
        <div style={{ color:gold, fontWeight:900, fontSize:22 }}>Caffeinated Lions</div>
        <div style={{ color:T.subtext, fontSize:12, marginTop:4 }}>{isSignup?"Create your account":"Sign in to continue"}</div>
      </div>
      <div style={{ background:T.card, borderRadius:14, padding:28, width:"100%", maxWidth:360, border:`1px solid ${T.border}` }}>
        {isSignup && (
  <input
    value={name}
    onChange={e => setName(e.target.value)}
    placeholder="Full Name"
    style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"13px 14px", color:T.inputText, fontSize:14, marginBottom:10, boxSizing:"border-box" as const }}
  />
)}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
          style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"13px 14px", color:T.inputText, fontSize:14, boxSizing:"border-box" as const }} />
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password"
          style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"13px 14px", color:T.inputText, fontSize:14, marginTop:10, boxSizing:"border-box" as const }} />
        {err && <div style={{ color:"#f87171", fontSize:12, marginTop:6 }}>{err}</div>}
        <button onClick={go} style={{ ...btn(gold), width:"100%", padding:"14px 0", marginTop:14, fontSize:15 }}>{isSignup?"Create Account":"Sign In"}</button>
        <div style={{ textAlign:"center", marginTop:14, color:T.subtext, fontSize:13 }}>
          {isSignup?"Already have an account? ":"Don't have an account? "}
          <span onClick={()=>setIsSignup(!isSignup)} style={{ color:gold, cursor:"pointer", fontWeight:700 }}>{isSignup?"Sign In":"Sign Up Free"}</span>
        </div>
        <div style={{ marginTop:18, borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
          <div style={{ color:T.subtext, fontSize:10, textAlign:"center" as const, marginBottom:8, fontWeight:700 }}>DEMO ACCOUNTS</div>
          {USERS.map(u=>(
            <div key={u.id} onClick={()=>{setEmail(u.email);setPass(u.password);setErr("");}}
              style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:T.surface2, borderRadius:7, padding:"10px 12px", marginBottom:6, cursor:"pointer", border:`1px solid ${T.border}` }}>
              <span style={{ color:T.subtext, fontSize:12 }}>{u.email}</span>
              <span style={{ background:ROLE_COLOR[u.role], color:"#fff", fontSize:9, fontWeight:800, padding:"2px 7px", borderRadius:20, textTransform:"uppercase" as const }}>{u.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Rewards ───────────────────────────────────────────────────────────
function RewardsPage({ user }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const tier = user.points>=200?"🥇 Gold":user.points>=100?"🥈 Silver":"🥉 Bronze";
  const nextTier = user.points>=200?300:user.points>=100?200:100;
  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding: isMobile?"16px":"24px", paddingBottom: isMobile?90:24 }}>
      <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", borderRadius:16, padding: isMobile?20:28, marginBottom:20, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:"#aaa", fontSize:12, fontWeight:700, textTransform:"uppercase" as const, marginBottom:4 }}>Your Balance</div>
            <div style={{ color:gold, fontSize: isMobile?44:52, fontWeight:900, lineHeight:1 }}>{user.points}</div>
            <div style={{ color:"#aaa", fontSize:13 }}>points</div>
          </div>
          <div style={{ textAlign:"center" as const }}>
            <div style={{ fontSize: isMobile?40:52 }}>🏆</div>
            <div style={{ color:gold, fontWeight:800, fontSize:15 }}>{tier}</div>
          </div>
        </div>
        <div style={{ background:"#ffffff15", borderRadius:8, padding:"10px 14px", marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#ccc" }}>
            <span>Progress to next reward</span><span>{user.points%100}/100 pts</span>
          </div>
          <div style={{ background:"#ffffff20", borderRadius:4, height:8, marginTop:8 }}>
            <div style={{ background:gold, width:`${user.points%100}%`, height:"100%", borderRadius:4 }} />
          </div>
          <div style={{ color:"#888", fontSize:11, marginTop:6 }}>{nextTier-user.points} points until next reward</div>
        </div>
      </div>
      <Card style={{ padding: isMobile?16:24 }}>
        <div style={{ fontWeight:800, fontSize:16, color:T.text, marginBottom:16 }}>🎁 Rewards Available</div>
        {[{pts:100,reward:"Free Small Coffee",icon:"☕"},{pts:200,reward:"Free Medium Drink",icon:"🥤"},{pts:300,reward:"Free Any Drink + Food",icon:"🍽️"}].map((r,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:i<2?`1px solid ${T.border}`:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:28 }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:T.text }}>{r.reward}</div>
                <div style={{ color:T.subtext, fontSize:12 }}>{r.pts} pts required</div>
              </div>
            </div>
            <button style={{ ...btn(user.points>=r.pts?"#16a34a":T.surface2, user.points>=r.pts?"#fff":T.subtext), padding:"8px 14px", fontSize:12 }}>
              {user.points>=r.pts?"Redeem":"🔒"}
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Customer App ──────────────────────────────────────────────────────
function CustomerApp({ user, setUser, page, setPage }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [tab,setTab]         = useState(page==="rewards"?"rewards":"menu");
  const [cart,setCart]       = useState<any[]>([]);
  const [receipt,setReceipt] = useState<any>(null);
  const [filter,setFilter]   = useState("Popular");
  const [reserved,setRes]    = useState<number|null>(null);
  const [showCart,setShowCart] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(()=>{ if(page==="rewards") setTab("rewards"); },[page]);

  const cats  = ["Popular","Hot Coffee","Iced Coffee","Food"];
  const shown = filter==="Popular" ? [...MENU].sort((a,b)=>b.orders-a.orders) : MENU.filter(m=>m.cat===filter);
  const total = cart.reduce((s:number,i:any)=>s+i.price,0);

  const placeOrder = async () => {
  if(!cart.length) return;
  if(!selectedLocation) {
    setShowLocationPicker(true);
    return;
  }
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        locationId: selectedLocation.id,
        items: cart.map(i => ({ name: i.name, price: i.price })),
        total: total
      })
    });
    if (!res.ok) {
      console.error("Order failed:", await res.text());
      return;
    }
    const order = await res.json();
    const pointsRes = await fetch("/api/users/points", { credentials: "include" });
    const newPoints = await pointsRes.json();
    setReceipt({ 
      id: `#${order.id}`, 
      items: order.items, 
      total: order.total, 
      date: new Date().toLocaleDateString() 
    });
    setCart([]);
    setShowCart(false);
    setUser((u:any) => ({ ...u, points: newPoints, lastOrder: { id: `#${order.id}`, items: order.items, total: order.total, date: new Date().toLocaleDateString() } }));
  } catch(e) {
    console.error("Order failed", e);
  }
};

  const pb = isMobile ? 80 : 0;

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      {receipt && <Receipt order={receipt} onClose={()=>setReceipt(null)} />}
        {showLocationPicker && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:20 }}>
            <div style={{ background:T.card, borderRadius:16, padding:24, width:"100%", maxWidth:400, color:T.text }}>
              <div style={{ fontWeight:900, fontSize:18, marginBottom:6 }}>📍 Select a Location</div>
              <div style={{ color:T.subtext, fontSize:13, marginBottom:16 }}>Choose where you'd like to pick up your order</div>
              {LOCATIONS.map(loc => (
                <div key={loc.id} onClick={() => { setSelectedLocation(loc); setShowLocationPicker(false); }}
                  style={{ background:selectedLocation?.id===loc.id?gold:T.surface2, borderRadius:12, padding:"14px 16px", marginBottom:10, cursor:"pointer", border:`2px solid ${selectedLocation?.id===loc.id?gold:T.border}` }}>
                  <div style={{ fontWeight:800, fontSize:14, color:selectedLocation?.id===loc.id?"#fff":T.text }}>{loc.name}</div>
                  <div style={{ fontSize:12, color:selectedLocation?.id===loc.id?"#fff":T.subtext }}>{loc.addr}, {loc.city}</div>
                </div>
              ))}
              {selectedLocation && (
                <button onClick={() => setShowLocationPicker(false)} style={{ ...btn(gold), width:"100%", padding:"13px 0", marginTop:4 }}>Confirm Location</button>
              )}
              <button onClick={() => setShowLocationPicker(false)} style={{ ...btn(T.surface2, T.subtext), width:"100%", padding:"11px 0", marginTop:8 }}>Cancel</button>
            </div>
          </div>
        )}

      {/* Cart Drawer (Mobile) */}
      {isMobile && showCart && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:400 }} onClick={()=>setShowCart(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", bottom:0, left:0, right:0, background:T.card, borderRadius:"20px 20px 0 0", padding:24, maxHeight:"70vh", overflowY:"auto" as const }}>
            <div style={{ fontWeight:800, fontSize:16, color:T.text, marginBottom:16 }}>🛒 Your Cart</div>
            {cart.length===0 ? <div style={{ color:T.subtext, textAlign:"center", padding:20 }}>Cart is empty</div> :
              cart.map((i:any,idx:number)=>(
                <div key={idx} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.border}`, color:T.text }}>
                  <span>{i.name}</span><span style={{ color:gold }}>${i.price.toFixed(2)}</span>
                </div>
              ))
            }
            {cart.length>0 && (
              <>
                <div style={{ display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:16, color:T.text, margin:"14px 0" }}>
                  <span>Total</span><span style={{ color:gold }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>setCart([])} style={{ ...btn(T.surface2,T.subtext), flex:1, padding:"13px 0" }}>Clear</button>
                  <button onClick={placeOrder} style={{ ...btn("#16a34a"), flex:2, padding:"13px 0", fontSize:14 }}>Place Order</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Last Order Banner */}
      {user.lastOrder && tab==="menu" && (
        <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap" as const, gap:8 }}>
          <div style={{ fontSize:12 }}><span style={{ color:gold, fontWeight:800 }}>🔄 Last: </span><span style={{ color:"#ccc" }}>{user.lastOrder.items[0].name} — ${user.lastOrder.total.toFixed(2)}</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setReceipt(user.lastOrder)} style={{ ...btn("#ffffff20","#fff"), padding:"5px 12px", fontSize:11 }}>Receipt</button>
            <button onClick={()=>setCart(user.lastOrder.items)} style={{ ...btn(gold), padding:"5px 12px", fontSize:11 }}>Reorder</button>
          </div>
        </div>
      )}

      {/* Location Selector Bar */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"8px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:12, color:T.subtext }}>
          {selectedLocation ? `📍 ${selectedLocation.name} — ${selectedLocation.addr}` : "📍 No location selected"}
        </span>
        <button onClick={() => setShowLocationPicker(true)} style={{ ...btn(gold), padding:"5px 12px", fontSize:11 }}>
          {selectedLocation ? "Change" : "Select"}
        </button>
      </div>

      {/* Desktop Tab Bar */}
      {!isMobile && (
        <div style={{ background:T.navBg, borderBottom:`1px solid ${T.border}`, display:"flex", padding:"0 24px", gap:4 }}>
          {["menu","reservations","drive-thru","track","rewards"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ background:"transparent", color:tab===t?gold:T.navLink, border:"none", borderBottom:tab===t?`2px solid ${gold}`:"2px solid transparent", padding:"10px 14px", fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"capitalize" as const }}>{t}</button>
          ))}
        </div>
      )}

      <div style={{ maxWidth:900, margin:"0 auto", padding: isMobile?"16px":"24px 20px", paddingBottom: isMobile?90:24 }}>
        {tab==="menu" && (
          <div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const, marginBottom:16, overflowX:"auto" as const }}>
              {cats.map(c=>(
                <button key={c} onClick={()=>setFilter(c)}
                  style={{ ...btn(filter===c?T.text:T.surface2, filter===c?T.bg:T.subtext), padding:"8px 14px", fontSize:12, borderRadius:20, whiteSpace:"nowrap" as const }}>{c==="Popular"?"🔥 Popular":c}</button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(auto-fill,minmax(200px,1fr))", gap: isMobile?12:16 }}>
              {shown.map((item,i)=>(
                <Card key={item.id} style={{ position:"relative" }}>
                  {filter==="Popular"&&i===0&&<div style={{ position:"absolute", top:8, left:8, background:gold, color:"#fff", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:20, zIndex:1 }}>#1</div>}
                  <img src={item.img} alt={item.name} style={{ width:"100%", height: isMobile?100:130, objectFit:"cover" }} />
                  <div style={{ padding: isMobile?"8px 10px":"10px 12px" }}>
                    <div style={{ fontWeight:800, fontSize: isMobile?12:13, color:T.text }}>{item.name}</div>
                    <div style={{ color:T.subtext, fontSize:10, marginBottom:6 }}>{item.cat}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:gold, fontWeight:800, fontSize:13 }}>${item.price.toFixed(2)}</span>
                      <button onClick={()=>setCart((c:any)=>[...c,item])} style={{ ...btn(gold), padding:"6px 12px", fontSize:11 }}>+ Add</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Floating Cart */}
            {!isMobile && cart.length>0 && (
              <div style={{ position:"fixed", bottom:20, right:20, background:T.card, borderRadius:14, border:`1px solid ${T.border}`, padding:18, width:280, zIndex:100, boxShadow:T.shadow }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:10, color:T.text }}>🛒 Cart ({cart.length})</div>
                {cart.map((i:any,idx:number)=>(
                  <div key={idx} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.subtext, padding:"2px 0" }}><span>{i.name}</span><span>${i.price.toFixed(2)}</span></div>
                ))}
                <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:8, display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:14, color:T.text }}>
                  <span>Total</span><span style={{ color:gold }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  <button onClick={()=>setCart([])} style={{ ...btn(T.surface2,T.subtext), flex:1, padding:"8px 0", fontSize:12 }}>Clear</button>
                  <button onClick={placeOrder} style={{ ...btn("#16a34a"), flex:1, padding:"8px 0", fontSize:12 }}>Checkout</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="reservations" && (
          <Card style={{ padding: isMobile?16:24 }}>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:6 }}>🪑 Reserve a Table</h2>
            <p style={{ color:T.subtext, fontSize:13, marginBottom:16 }}>Tap a table to reserve it</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap: isMobile?10:12 }}>
              {[1,2,3,4,5,6,7,8].map(t=>(
                <button key={t} onClick={()=>setRes(t)}
                  style={{ ...btn(reserved===t?"#16a34a":T.surface2, reserved===t?"#fff":T.text), padding: isMobile?"16px 0":"18px 0", borderRadius:12, fontSize:14, fontWeight:800 }}>
                  T{t}{reserved===t?"✓":""}
                </button>
              ))}
            </div>
            {reserved && <div style={{ background:T.isDark?"#14291a":"#dcfce7", borderRadius:10, padding:"12px 16px", marginTop:16, color:"#16a34a", fontWeight:700 }}>✅ Table {reserved} reserved!</div>}
          </Card>
        )}

        {tab==="drive-thru" && (
          <Card style={{ padding: isMobile?16:24 }}>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:6 }}>🚗 Drive-Thru Order</h2>
            <p style={{ color:T.subtext, fontSize:13, marginBottom:16 }}>Order ahead — ready at the window</p>
            <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
              {MENU.filter(m=>m.cat!=="Food").map(item=>(
                <div key={item.id} style={{ background:T.surface, borderRadius:12, border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <img src={item.img} alt={item.name} style={{ width:"100%", height: isMobile?90:110, objectFit:"cover" }} />
                  <div style={{ padding:"8px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><div style={{ fontWeight:700, fontSize:12, color:T.text }}>{item.name}</div><div style={{ color:gold, fontWeight:800, fontSize:12 }}>${item.price.toFixed(2)}</div></div>
                    <button onClick={()=>setCart((c:any)=>[...c,item])} style={{ ...btn(gold), padding:"5px 10px", fontSize:11 }}>+</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length>0 && (
              <div style={{ background:T.surface2, borderRadius:12, padding:14, marginTop:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:800, color:gold, fontSize:15 }}>Total: ${total.toFixed(2)}</span>
                  <button onClick={placeOrder} style={{ ...btn("#16a34a"), fontSize:12 }}>Send to Window 🚗</button>
                </div>
              </div>
            )}
          </Card>
        )}

        {tab==="track" && (
          <Card style={{ padding: isMobile?16:24 }}>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>📦 Track Your Order</h2>
            {!user.lastOrder ? <p style={{ color:T.subtext }}>No active order. Place one first!</p> :
              ["Order Received","Being Prepared","Quality Check","Ready for Pickup"].map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:i<3?"#16a34a":T.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:i<3?"#fff":T.subtext, fontWeight:800, flexShrink:0 }}>{i<3?"✓":i+1}</div>
                  <div><div style={{ fontSize:14, fontWeight:i<3?800:400, color:i<3?T.text:T.subtext }}>{s}</div>{i<3&&<div style={{ fontSize:11, color:"#16a34a" }}>Completed</div>}</div>
                </div>
              ))
            }
          </Card>
        )}

        {tab==="rewards" && <RewardsPage user={user} />}
        {tab==="locations" && <LocationsPage />}
      </div>

      {/* Mobile Cart FAB */}
      {isMobile && cart.length>0 && tab==="menu" && (
        <div onClick={()=>setShowCart(true)} style={{ position:"fixed", bottom:80, right:16, background:gold, borderRadius:50, padding:"14px 20px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 16px rgba(200,151,58,.5)", cursor:"pointer", zIndex:100 }}>
          <span style={{ fontSize:18 }}>🛒</span>
          <span style={{ color:"#fff", fontWeight:800, fontSize:14 }}>{cart.length} · ${total.toFixed(2)}</span>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      {isMobile && <BottomTabBar user={user} tab={tab} setTab={setTab} />}
    </div>
  );
}

// ── Staff App ─────────────────────────────────────────────────────────
function StaffApp() {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [tab,setTab]       = useState("orders");
  const [orders,setOrders] = useState<any[]>([]);

useEffect(() => {
  fetch("/api/orders", { credentials: "include" })
    .then(r => r.json())
    .then(setOrders)
    .catch(console.error);
}, []);
  const advance = async (id:number) => {
    const order = orders.find((o:any) => o.id === id);
    if (!order) return;
    const nextStatus = STATUS_NEXT[order.status];
    if (!nextStatus) return;
    await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(nextStatus)
    });
    setOrders(o => o.map((x:any) => x.id===id ? {...x, status:nextStatus} : x));
  };
  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      {!isMobile && (
        <div style={{ background:T.navBg, borderBottom:`1px solid ${T.border}`, display:"flex", padding:"0 24px", gap:4 }}>
          {["orders","reservations","drive-thru"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ background:"transparent", color:tab===t?gold:T.navLink, border:"none", borderBottom:tab===t?`2px solid ${gold}`:"2px solid transparent", padding:"10px 14px", fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"capitalize" as const }}>{t}</button>
          ))}
        </div>
      )}
      <div style={{ maxWidth:800, margin:"0 auto", padding: isMobile?"16px":"24px", paddingBottom: isMobile?90:24 }}>
        {tab==="orders" && (
          <div>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>Live Order Queue</h2>
            {orders.filter((o:any)=>o.status!=="Done").map((o:any)=>(
              <Card key={o.id} style={{ padding:16, marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap" as const, gap:8 }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, color:T.text }}>#{o.id} — {o.items.map((i:any)=>i.name).join(", ")}</div>
                    <div style={{ color:T.subtext, fontSize:12 }}>👤 {o.userName} · 📍 {o.locationName} · ${o.total.toFixed(2)} · {new Date(o.createdAt).toLocaleTimeString()}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ background:STATUS_COLOR[o.status], color:"#fff", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>{o.status}</span>
                    {STATUS_NEXT[o.status]&&<button onClick={()=>advance(o.id)} style={{ ...btn("#2563eb"), padding:"6px 12px", fontSize:11 }}>→ {STATUS_NEXT[o.status]}</button>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {tab==="reservations" && (
          <Card style={{ padding: isMobile?16:24 }}>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>Today's Reservations</h2>
            {[{t:"T2",n:"Alice M.",time:"2:00 PM"},{t:"T5",n:"Bob K.",time:"3:30 PM"},{t:"T7",n:"Carol S.",time:"5:00 PM"}].map((r,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:14, padding:"12px 0", borderBottom:`1px solid ${T.border}`, color:T.text }}>
                <span>Table {r.t} — <strong>{r.n}</strong></span><span style={{ color:T.subtext }}>{r.time}</span>
              </div>
            ))}
          </Card>
        )}
        {tab==="drive-thru" && (
          <Card style={{ padding: isMobile?16:24 }}>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>Drive-Thru Queue</h2>
            {[{id:"DT-07",items:"Iced Latte",status:"Pending"},{id:"DT-06",items:"Cappuccino + Croissant",status:"Preparing"}].map((o,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:14, color:T.text }}>{o.id} — {o.items}</span>
                <span style={{ background:STATUS_COLOR[o.status], color:"#fff", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>{o.status}</span>
              </div>
            ))}
          </Card>
        )}
      </div>
      {isMobile && <BottomTabBar user={{ role:"staff" }} tab={tab} setTab={setTab} />}
    </div>
  );
}

// ── Admin App ─────────────────────────────────────────────────────────
function AdminApp() {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [tab,setTab]   = useState("Dashboard");
  const [menu,setMenu] = useState(MENU);
  const toggle = (id:number) => setMenu(m=>m.map(x=>x.id===id?{...x,popular:!x.popular}:x));
  const tabs = ["Dashboard","Menu","Orders","Locations","Staff","Settings"];
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" as const }}>
      <div style={{ display:"flex", flex:1 }}>
        {!isMobile && (
          <div style={{ width:180, background:T.isDark?"#0a0a0a":"#1a1a1a", padding:"16px 0", flexShrink:0 }}>
            {tabs.map(t=>(
              <div key={t} onClick={()=>setTab(t)} style={{ padding:"10px 18px", color:tab===t?gold:"#aaa", background:tab===t?T.isDark?"#1c1c1c":"#2a2a2a":"transparent", fontSize:13, fontWeight:tab===t?800:500, borderLeft:tab===t?`3px solid ${gold}`:"3px solid transparent", cursor:"pointer" }}>{t}</div>
            ))}
          </div>
        )}
        <div style={{ flex:1, background:T.sectionBg, padding: isMobile?"16px":"24px", overflowY:"auto" as const, paddingBottom: isMobile?90:24 }}>
          {tab==="Dashboard" && (
            <div>
              <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>📊 Overview</h2>
              <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(4,1fr)", gap: isMobile?10:14, marginBottom:20 }}>
                {[{l:"Orders",v:"142",i:"📦"},{l:"Revenue",v:"$638",i:"💰"},{l:"Tables",v:"6/8",i:"🪑"},{l:"Drive-Thru",v:"34",i:"🚗"}].map((s,i)=>(
                  <Card key={i} style={{ padding: isMobile?14:20, textAlign:"center" }}>
                    <div style={{ fontSize: isMobile?24:28 }}>{s.i}</div>
                    <div style={{ fontWeight:900, fontSize: isMobile?18:22, color:T.text }}>{s.v}</div>
                    <div style={{ fontSize:11, color:T.subtext }}>{s.l}</div>
                  </Card>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:14 }}>
                <Card style={{ padding: isMobile?14:20 }}>
                  <div style={{ fontWeight:800, fontSize:14, color:T.text, marginBottom:12 }}>🔥 Top Sellers</div>
                  {[...MENU].sort((a,b)=>b.orders-a.orders).slice(0,4).map((x,i)=>(
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3, color:T.text }}><span>{x.name}</span><span style={{ color:T.subtext }}>{x.orders}</span></div>
                      <div style={{ background:T.surface2, borderRadius:4, height:6 }}><div style={{ background:gold, width:`${(x.orders/203)*100}%`, height:"100%", borderRadius:4 }} /></div>
                    </div>
                  ))}
                </Card>
                <Card style={{ padding: isMobile?14:20 }}>
                  <div style={{ fontWeight:800, fontSize:14, color:T.text, marginBottom:12 }}>📈 Hourly Volume</div>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:80 }}>
                    {[20,35,55,80,60,45,70,90,65,40,55,30].map((h,i)=>(
                      <div key={i} style={{ flex:1, background:i===7?gold:T.surface2, borderRadius:"3px 3px 0 0", height:`${h}%` }} />
                    ))}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:T.subtext, marginTop:4 }}><span>8AM</span><span>12PM</span><span>4PM</span><span>8PM</span></div>
                </Card>
              </div>
            </div>
          )}
          {tab==="Menu" && (
            <div>
              <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>🍽 Menu Management</h2>
              {menu.map(item=>(
                <Card key={item.id} style={{ display:"flex", alignItems:"center", gap: isMobile?10:14, padding: isMobile?12:14, marginBottom:10 }}>
                  <img src={item.img} alt={item.name} style={{ width:44, height:44, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:800, fontSize: isMobile?12:14, color:T.text }}>{item.name}</div><div style={{ color:T.subtext, fontSize:11 }}>{item.cat} · ${item.price.toFixed(2)}</div></div>
                  <button onClick={()=>toggle(item.id)} style={{ ...btn(item.popular?"#f59e0b":T.surface2, item.popular?"#fff":T.subtext), padding:"5px 10px", fontSize:10, whiteSpace:"nowrap" as const }}>{item.popular?"🔥":"Set Pop"}</button>
                  <button style={{ background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:8, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 }}>✕</button>
                </Card>
              ))}
            </div>
          )}
          {tab==="Locations" && <LocationsPage isAdmin />}
          {tab==="Orders" && (
            <div>
              <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>📦 All Orders</h2>
              {INIT_ORDERS.map((o,i)=>(
                <Card key={i} style={{ padding: isMobile?12:16, marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap" as const, gap:8 }}>
                    <div><div style={{ fontWeight:800, fontSize:13, color:T.text }}>{o.id} — {o.items}</div><div style={{ color:T.subtext, fontSize:11 }}>{o.table} · {o.time}</div></div>
                    <span style={{ background:STATUS_COLOR[o.status], color:"#fff", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>{o.status}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {tab==="Staff" && (
            <div>
              <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>👥 Staff</h2>
              {[{n:"Sara L.",role:"Staff",status:"On Shift",orders:12},{n:"James R.",role:"Staff",status:"Off",orders:0},{n:"Mike A.",role:"Admin",status:"On Shift",orders:null}].map((s,i)=>(
                <Card key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding: isMobile?12:16, marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:T.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👤</div>
                    <div><div style={{ fontWeight:700, fontSize:13, color:T.text }}>{s.n}</div><div style={{ color:T.subtext, fontSize:11 }}>{s.role}{s.orders!==null?` · ${s.orders} orders`:""}</div></div>
                  </div>
                  <span style={{ background:s.status==="On Shift"?T.isDark?"#14291a":"#dcfce7":T.surface2, color:s.status==="On Shift"?"#16a34a":T.subtext, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>{s.status}</span>
                </Card>
              ))}
            </div>
          )}
          {tab==="Settings" && (
            <Card style={{ padding: isMobile?16:24 }}>
              <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>⚙️ Settings</h2>
              {[["Drive-Thru","Enabled"],["Table Reservations","Enabled"],["Online Ordering","Enabled"],["Rewards Program","Enabled"],["Loyalty Program","Disabled"]].map(([k,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:14, color:T.text }}>{k}</span>
                  <span style={{ background:v==="Enabled"?T.isDark?"#14291a":"#dcfce7":T.surface2, color:v==="Enabled"?"#16a34a":T.subtext, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>{v}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
      {isMobile && <BottomTabBar user={{ role:"admin" }} tab={tab} setTab={setTab} />}
    </div>
  );
}

// ── Locations ─────────────────────────────────────────────────────────
function LocationsPage({ isAdmin=false }:{ isAdmin?:boolean }) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [selected,setSelected] = useState<number|null>(null);
  return (
    <div style={{ paddingBottom: isMobile && !isAdmin ? 80 : 0 }}>
      {!isAdmin && (
        <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", padding: isMobile?"28px 16px":"36px 24px", textAlign:"center" as const }}>
          <h1 style={{ color:"#fff", fontWeight:900, fontSize: isMobile?20:24, margin:0 }}>Our Locations</h1>
          <p style={{ color:"#aaa", fontSize:13, marginTop:6 }}>Find a Caffeinated Lions near you</p>
        </div>
      )}
      <div style={{ maxWidth:900, margin:"0 auto", padding: isMobile?"16px":"24px" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"repeat(auto-fill,minmax(260px,1fr))", gap: isMobile?12:16, marginBottom:20 }}>
          {LOCATIONS.map(loc=>(
            <div key={loc.id} onClick={()=>setSelected(selected===loc.id?null:loc.id)}
              style={{ background:T.card, borderRadius:14, border:`2px solid ${selected===loc.id?gold:T.border}`, padding: isMobile?16:20, cursor:"pointer", boxShadow:T.shadow }}>
              <div style={{ fontWeight:900, fontSize:16, color:T.text, marginBottom:4 }}>📍 {loc.name}</div>
              <div style={{ color:T.subtext, fontSize:13 }}>{loc.addr}, {loc.city}</div>
              <div style={{ color:T.subtext, fontSize:12, marginTop:4 }}>📞 {loc.phone}</div>
              <div style={{ color:T.subtext, fontSize:12, marginTop:4, marginBottom:14 }}>🕐 {loc.hours}</div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ ...btn(gold), flex:1, padding:"10px 0", fontSize:13 }}>Order Here</button>
                <button style={{ ...btn(T.surface2,T.subtext), flex:1, padding:"10px 0", fontSize:13 }}>Directions</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:T.card, borderRadius:14, border:`1px solid ${T.border}`, height: isMobile?200:280, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" as const, gap:8 }}>
          <div style={{ fontSize:40 }}>🗺️</div>
          <div style={{ fontWeight:700, color:T.subtext, fontSize:14 }}>Map View</div>
          <div style={{ fontSize:12, color:T.subtext }}>Google Maps via Firebase</div>
          <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" as const, justifyContent:"center", padding:"0 16px" }}>
            {LOCATIONS.map(l=>(
              <div key={l.id} onClick={()=>setSelected(l.id)}
                style={{ background:selected===l.id?gold:T.surface2, color:selected===l.id?"#fff":T.text, border:`2px solid ${selected===l.id?gold:T.border}`, borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>📍 {l.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────
export default function App() {
  const [user,    setUser]    = useState<any>(null);
  const [page,    setPage]    = useState(() => window.location.hash.replace("#","") || "home");
  const [history, setHistory] = useState<string[]>([]);
  const [isDark,  setIsDark]  = useState(false);
  const T = { ...getTheme(isDark), isDark, setIsDark };

  const navigate = (p: string) => {
    setHistory(h => [...h, page]);
    setPage(p);
    window.history.pushState({ page: p }, "", `#${p}`);
  };

  const goBack = () => { window.history.back(); };

  useEffect(() => {
    const handlePop = () => {
      const p = window.location.hash.replace("#", "") || "home";
      setPage(p);
      setHistory(h => h.length > 0 ? h.slice(0,-1) : h);
    };
    window.history.replaceState({ page }, "", `#${page}`);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const handleLogin  = (u:any) => { setUser(u); navigate(u.role==="staff"?"orders":u.role==="admin"?"dashboard":"menu"); };
  const handleLogout = () => { setUser(null); setHistory([]); setPage("home"); window.history.pushState({ page:"home" }, "", "#home"); };

  return (
    <ThemeContext.Provider value={T}>
      <div style={{ fontFamily:"sans-serif", minHeight:"100vh", background:T.bg, color:T.text, transition:"background .3s, color .3s" }}>
        <Nav user={user} page={page} setPage={navigate} onLogout={handleLogout} history={history} goBack={goBack} />

        {!user && (page==="home"||page==="menu") && <GuestHome setPage={navigate} />}
        {!user && page==="login"     && <Login onLogin={handleLogin} setPage={navigate} mode="login"  />}
        {!user && page==="signup"    && <Login onLogin={handleLogin} setPage={navigate} mode="signup" />}
        {!user && page==="locations" && <LocationsPage />}

        {user && page==="home"      && <GuestHome setPage={navigate} />}
        {user && page==="locations" && <LocationsPage />}

        {user?.role==="customer" && !["home","locations"].includes(page) && <CustomerApp user={user} setUser={setUser} page={page} setPage={navigate} />}
        {user?.role==="staff"    && !["home","locations"].includes(page) && <StaffApp />}
        {user?.role==="admin"    && !["home","locations"].includes(page) && <AdminApp />}
      </div>
    </ThemeContext.Provider>
  );
}