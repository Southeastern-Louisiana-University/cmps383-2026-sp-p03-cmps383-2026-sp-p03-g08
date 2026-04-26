import { useState, useEffect, createContext, useContext } from "react";

const CaffeinatedLionsLogo = "/Caffeinated Lions Logo.png";
const accent = "#fcd34d";
const gold   = "#C8973A";

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

const btn = (bg: string, c = "#fff"): React.CSSProperties => ({
  background: bg, color: c, border: "none", borderRadius: 8,
  padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer",
});

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

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
  { id:1, name:"Hammond",     addr:"110 N Cate St",         city:"Hammond, LA 70403",      phone:"(985) 555-0101", hours:"Mon–Fri 6AM–9PM, Sat–Sun 7AM–8PM" },
  { id:2, name:"New York",    addr:"72 E 1st St",           city:"New York, NY 10003",     phone:"(212) 555-0102", hours:"Mon–Fri 7AM–8PM, Sat–Sun 8AM–7PM" },
  { id:3, name:"New Orleans", addr:"1140 S Carrollton Ave", city:"New Orleans, LA 70118",  phone:"(504) 555-0103", hours:"Daily 7AM–9PM" },
];

const USERS = [
  { id:"c",  email:"guest@lions.com",           password:"Password123!", role:"customer", name:"John",    points:0, location:1, lastOrder:null },
  { id:"s1", email:"staff.hammond@lions.com",   password:"Password123!", role:"staff",    name:"Staff H", points:0, location:1, lastOrder:null },
  { id:"s2", email:"staff.newyork@lions.com",   password:"Password123!", role:"staff",    name:"Staff NY",points:0, location:2, lastOrder:null },
  { id:"s3", email:"staff.neworleans@lions.com",password:"Password123!", role:"staff",    name:"Staff NO",points:0, location:3, lastOrder:null },
  { id:"m1", email:"manager.hammond@lions.com", password:"Password123!", role:"manager",  name:"Mgr H",   points:0, location:1, lastOrder:null },
  { id:"m2", email:"manager.newyork@lions.com", password:"Password123!", role:"manager",  name:"Mgr NY",  points:0, location:2, lastOrder:null },
  { id:"m3", email:"manager.neworleans@lions.com",password:"Password123!",role:"manager", name:"Mgr NO",  points:0, location:3, lastOrder:null },
  { id:"a",  email:"admin@lions.com",           password:"Password123!", role:"admin",    name:"Alex",    points:0, location:0, lastOrder:null },
];

const STATUS_NEXT  = { Pending:"Preparing", Preparing:"Ready", Ready:"Done" } as Record<string,string>;
const STATUS_COLOR = { Pending:"#f59e0b", Preparing:"#3b82f6", Ready:"#16a34a", Done:"#9ca3af" } as Record<string,string>;
const ROLE_COLOR   = { customer:"#16a34a", staff:"#2563eb", manager:"#7c3aed", admin:"#dc2626" } as Record<string,string>;

const STAFF_ROSTER = [
  {n:"Sara L.",   role:"Staff",   loc:"Hammond",      status:"On Shift"},
  {n:"James R.",  role:"Staff",   loc:"Hammond",      status:"On Shift"},
  {n:"Mike A.",   role:"Manager", loc:"Hammond",      status:"On Shift"},
  {n:"Carol T.",  role:"Staff",   loc:"New York",     status:"Break"},
  {n:"David M.",  role:"Staff",   loc:"New York",     status:"On Shift"},
  {n:"Eve S.",    role:"Manager", loc:"New Orleans",  status:"On Shift"},
  {n:"Frank B.",  role:"Staff",   loc:"New Orleans",  status:"On Shift"},
];

const ptsForSpend  = (amount: number) => Math.floor(amount * 10);
const ptsToDollars = (pts: number) => (pts / 100).toFixed(2);
const ptsCostFor   = (amount: number) => Math.ceil(amount * 100);

function Card({ children, style={}, onClick }:{ children:any, style?:React.CSSProperties, onClick?:()=>void }) {
  const T = useTheme();
  return <div onClick={onClick} style={{ background:T.card, borderRadius:14, border:`1px solid ${T.border}`, boxShadow:T.shadow, overflow:"hidden", cursor:onClick?"pointer":"default", ...style }}>{children}</div>;
}

function PaymentModal({ total, onPay, onClose, user, isGuest, onSignUp }:any) {
  const T = useTheme();
  const [method, setMethod] = useState("card");
  const [card,   setCard]   = useState({ num:"", exp:"", cvv:"", name:"" });
  const [err,    setErr]    = useState("");
  const tax      = (total * 0.0875).toFixed(2);
  const grand    = (total + parseFloat(tax)).toFixed(2);
  const ptsCost  = ptsCostFor(total);
  const hasEnoughPts = (user?.points||0) >= ptsCost;
  const ptsEarned = ptsForSpend(total);

  const pay = () => {
    if (method==="card") {
      if (card.num.replace(/\s/g,"").length < 16) { setErr("Please enter a valid card number."); return; }
      if (!card.exp)                               { setErr("Please enter an expiry date.");      return; }
      if (card.cvv.length < 3)                     { setErr("Please enter a valid CVV.");         return; }
      if (!card.name)                              { setErr("Please enter the name on the card."); return; }
    }
    if (method==="points" && !hasEnoughPts) { setErr("Not enough points."); return; }
    onPay(method);
  };

  const fmtCard = (v:string) => v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);
  const fmtExp  = (v:string) => v.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1/$2").slice(0,5);
  const payDisabled = method==="points" && !hasEnoughPts;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
      <div style={{ background:T.card, borderRadius:16, padding:24, width:"100%", maxWidth:400, color:T.text, maxHeight:"90vh", overflowY:"auto" as const }}>
        <div style={{ fontWeight:900, fontSize:18, marginBottom:4 }}>💳 Payment</div>
        <div style={{ color:T.subtext, fontSize:13, marginBottom:20 }}>Complete your order</div>
        {isGuest && (
          <div style={{ background:T.isDark?"#1a1500":"#fffbeb", border:`1px solid ${accent}50`, borderRadius:10, padding:"10px 14px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
            <div>
              <div style={{ color:"#92400e", fontWeight:800, fontSize:13 }}>⭐ You'll miss {ptsEarned} points!</div>
              <div style={{ color:"#92400e", fontSize:11, marginTop:2 }}>Sign up free to earn rewards on this order</div>
            </div>
            <button onClick={onSignUp} style={{ ...btn(accent,"#111"), padding:"6px 12px", fontSize:11, fontWeight:800, whiteSpace:"nowrap" as const }}>Sign Up</button>
          </div>
        )}
        <div style={{ background:T.surface2, borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext, marginBottom:4 }}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext, marginBottom:8 }}><span>Tax (8.75%)</span><span>${tax}</span></div>
          <div style={{ display:"flex", justifyContent:"space-between", fontWeight:900, fontSize:15, color:T.text }}><span>Total</span><span style={{ color:accent }}>${grand}</span></div>
        </div>
        <div style={{ fontWeight:700, fontSize:13, color:T.text, marginBottom:10 }}>Payment Method</div>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[{v:"card",l:"💳 Credit Card"},{v:"apple",l:"🍎 Apple Pay"}].map(m=>(
            <button key={m.v} onClick={()=>{ setMethod(m.v); setErr(""); }}
              style={{ ...btn(method===m.v?accent:T.surface2, method===m.v?"#111":T.text), flex:1, padding:"9px 6px", fontSize:11, fontWeight:method===m.v?900:500 }}>{m.l}</button>
          ))}
          {!isGuest && (
            <button onClick={()=>{ setMethod("points"); setErr(""); }}
              style={{ ...btn(method==="points"?accent:T.surface2, method==="points"?"#111":T.text), flex:1, padding:"9px 6px", fontSize:11, fontWeight:method==="points"?900:500 }}>⭐ Points</button>
          )}
        </div>
        {method==="card" && (
          <div>
            <input placeholder="Name on card" value={card.name} onChange={e=>setCard({...card,name:e.target.value})}
              style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.inputBorder}`, background:T.inputBg, color:T.inputText, fontSize:13, marginBottom:10, boxSizing:"border-box" as const }} />
            <input placeholder="Card number" value={card.num} onChange={e=>setCard({...card,num:fmtCard(e.target.value)})}
              style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.inputBorder}`, background:T.inputBg, color:T.inputText, fontSize:13, marginBottom:10, boxSizing:"border-box" as const }} />
            <div style={{ display:"flex", gap:10 }}>
              <input placeholder="MM/YY" value={card.exp} onChange={e=>setCard({...card,exp:fmtExp(e.target.value)})}
                style={{ flex:1, padding:"11px 14px", borderRadius:8, border:`1px solid ${T.inputBorder}`, background:T.inputBg, color:T.inputText, fontSize:13 }} />
              <input placeholder="CVV" value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value.slice(0,4)})}
                style={{ width:80, padding:"11px 14px", borderRadius:8, border:`1px solid ${T.inputBorder}`, background:T.inputBg, color:T.inputText, fontSize:13 }} />
            </div>
          </div>
        )}
        {method==="points" && !isGuest && (
          <div style={{ background:T.isDark?"#1a1500":"#fffbeb", border:`1px solid ${hasEnoughPts?accent+"40":"#fca5a5"}`, borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontWeight:700, color:"#92400e", fontSize:14 }}>⭐ Pay with loyalty points</div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#92400e", marginTop:6 }}>
              <span>Cost</span><span style={{ fontWeight:800 }}>{ptsCost.toLocaleString()} pts</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#92400e", marginTop:4 }}>
              <span>Your balance</span><span style={{ fontWeight:800 }}>{(user?.points||0).toLocaleString()} pts</span>
            </div>
            {!hasEnoughPts && (
              <div style={{ color:"#dc2626", fontSize:12, fontWeight:700, marginTop:8 }}>
                ⚠️ You need {(ptsCost-(user?.points||0)).toLocaleString()} more pts to pay this way.
              </div>
            )}
          </div>
        )}
        {method==="apple" && (
          <div style={{ background:T.surface2, borderRadius:10, padding:"14px", textAlign:"center" }}>
            <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>🍎 Apple Pay</div>
            <div style={{ color:T.subtext, fontSize:12, marginTop:4 }}>Confirm with Face ID or Touch ID</div>
          </div>
        )}
        {err && <div style={{ color:"#dc2626", fontSize:12, marginTop:10 }}>{err}</div>}
        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <button onClick={onClose} style={{ ...btn(T.surface2,T.text), flex:1, padding:"12px 0" }}>Cancel</button>
          <button onClick={pay} disabled={payDisabled}
            style={{ ...btn(payDisabled?"#9ca3af":accent, payDisabled?"#fff":"#111"), flex:2, padding:"12px 0", fontWeight:900, cursor:payDisabled?"not-allowed":"pointer" }}>
            Pay ${grand}
          </button>
        </div>
      </div>
    </div>
  );
}

function Receipt({ order, onClose, isGuest, onSignUp }:any) {
  const T = useTheme();
  const tax       = (order.total * 0.0875).toFixed(2);
  const grand     = (order.total + parseFloat(tax)).toFixed(2);
  const receiptNo = "RCP-" + Math.floor(Math.random()*900000+100000);
  const authNo    = "AUTH-" + Math.floor(Math.random()*9000000+1000000);
  const usedPoints = order.payMethod === "points";
  const ptsCost    = ptsCostFor(order.total);
  const ptsEarned  = ptsForSpend(order.total);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:20 }}>
      <div style={{ background:T.card, borderRadius:16, padding:24, width:"100%", maxWidth:380, color:T.text, maxHeight:"90vh", overflowY:"auto" as const }}>
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:36 }}>🧾</div>
          <div style={{ fontWeight:900, fontSize:18 }}>Order Confirmed!</div>
          <div style={{ color:T.subtext, fontSize:12, marginTop:4 }}>Receipt #{receiptNo}</div>
        </div>
        <div style={{ background:T.isDark?"#14291a":"#f0fdf4", borderRadius:10, padding:"10px 14px", marginBottom:14, display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:"#16a34a", fontWeight:700, fontSize:13 }}>
            ✅ {order.payMethod==="card"?"Card":order.payMethod==="points"?"Points":"Apple Pay"} Payment
          </span>
          <span style={{ color:"#16a34a", fontSize:11 }}>{authNo}</span>
        </div>
        <div style={{ borderTop:`2px dashed ${T.border}`, borderBottom:`2px dashed ${T.border}`, padding:"12px 0", marginBottom:12 }}>
          {order.items.map((item:any,i:number)=>(
            <div key={i} style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                <span style={{ fontWeight:600 }}>{item.name}</span><span>${item.price.toFixed(2)}</span>
              </div>
              {item.customizations && (
                <div style={{ fontSize:11, color:T.subtext, marginTop:2 }}>
                  {[item.customizations.size, item.customizations.milk, item.customizations.temp, ...(item.customizations.extras||[])].filter(Boolean).join(" · ")}
                  {item.customizations.notes && ` · "${item.customizations.notes}"`}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext, marginBottom:4 }}><span>Subtotal</span><span>${order.total.toFixed(2)}</span></div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext, marginBottom:8 }}><span>Tax (8.75%)</span><span>${tax}</span></div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:900, borderTop:`1px solid ${T.border}`, paddingTop:8, color:T.text }}>
          <span>Total Paid</span><span style={{ color:accent }}>${grand}</span>
        </div>
        {isGuest ? (
          <div style={{ background:T.isDark?"#1a1500":"#fffbeb", border:`1px solid ${accent}50`, borderRadius:10, padding:"12px 14px", marginTop:14 }}>
            <div style={{ color:"#92400e", fontWeight:800, fontSize:14 }}>⭐ You missed {ptsEarned} points!</div>
            <div style={{ color:"#92400e", fontSize:12, marginTop:4 }}>
              Create a free account to earn {ptsEarned} pts on this order — worth ${ptsToDollars(ptsEarned)} off your next visit.
            </div>
            <button onClick={onSignUp} style={{ ...btn(accent,"#111"), width:"100%", padding:"10px 0", marginTop:10, fontWeight:900 }}>Create Free Account</button>
          </div>
        ) : (
          <div style={{ background:T.isDark?"#1a1500":"#fffbeb", border:`1px solid ${accent}40`, borderRadius:8, padding:"10px 14px", marginTop:12, display:"flex", justifyContent:"space-between", fontSize:13 }}>
            <span style={{ color:"#92400e", fontWeight:700 }}>{usedPoints ? "⭐ Points Used" : "⭐ Points Earned"}</span>
            <span style={{ color: usedPoints?"#dc2626":"#92400e", fontWeight:800 }}>
              {usedPoints ? `-${ptsCost.toLocaleString()} pts` : `+${ptsEarned} pts`}
            </span>
          </div>
        )}
        <button onClick={onClose} style={{ ...btn(T.isDark?"#333":"#1a1a1a"), width:"100%", marginTop:14, padding:"13px 0", fontSize:14 }}>Close</button>
      </div>
    </div>
  );
}

function DriveThruCode({ code, order, onClose }:any) {
  const T = useTheme();
  const [arrived, setArrived] = useState(false);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, padding:20 }}>
      <div style={{ background:T.card, borderRadius:16, padding:28, width:"100%", maxWidth:360, color:T.text, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🚗</div>
        <div style={{ fontWeight:900, fontSize:20, marginBottom:4 }}>Your Drive-Thru Code</div>
        <div style={{ color:T.subtext, fontSize:13, marginBottom:20 }}>Show this to staff when you pull up</div>
        <div style={{ background:T.isDark?"#1a1500":"#fffbeb", border:`3px solid ${accent}`, borderRadius:16, padding:"24px 0", marginBottom:20 }}>
          <div style={{ fontSize:48, fontWeight:900, letterSpacing:8, color:T.text }}>{code}</div>
          <div style={{ color:T.subtext, fontSize:12, marginTop:6 }}>Order {order.id}</div>
        </div>
        {!arrived
          ? <button onClick={()=>setArrived(true)} style={{ ...btn("#16a34a"), width:"100%", padding:"14px 0", fontSize:15, marginBottom:10 }}>🟢 I'm Here!</button>
          : <div style={{ background:"#dcfce7", borderRadius:12, padding:"14px 0", marginBottom:10 }}><div style={{ fontWeight:800, color:"#15803d", fontSize:15 }}>✅ Staff has been notified!</div><div style={{ color:"#166534", fontSize:12, marginTop:4 }}>Your order is being prepared</div></div>
        }
        <button onClick={onClose} style={{ ...btn(T.surface2,T.text), width:"100%", padding:"11px 0" }}>Close</button>
      </div>
    </div>
  );
}

function CustomizeModal({ item, onAdd, onClose }:any) {
  const T = useTheme();
  const [size,   setSize]   = useState("Medium");
  const [milk,   setMilk]   = useState("Whole Milk");
  const [sweet,  setSweet]  = useState("Normal");
  const [temp,   setTemp]   = useState(item.cat==="Iced Coffee"?"Iced":"Hot");
  const [extras, setExtras] = useState<string[]>([]);
  const [notes,  setNotes]  = useState("");

  // ✅ FIX: was referenced but never declared — caused the white screen crash
  const isFood = item.cat === "Food";

  const sizes  = [{l:"Small",adj:-0.50},{l:"Medium",adj:0},{l:"Large",adj:0.75}];
  const milks  = ["Whole Milk","Oat Milk","Almond Milk","Skim Milk","Soy Milk","No Milk"];
  const sweets = ["None","Light","Normal","Extra"];
  const temps  = item.cat==="Iced Coffee" ? ["Iced","Blended"] : ["Hot","Iced","Warm"];
  const FOOD_ADDONS: Record<string, {l:string, adj:number}[]> = {
    "Croissant":        [{l:"Butter",adj:0},{l:"Jam",adj:0},{l:"Extra Napkins",adj:0},{l:"Almond Filling",adj:0.75},{l:"Chocolate Drizzle",adj:0.50}],
    "Cheesecake Slice": [{l:"Whipped Cream",adj:0.50},{l:"Caramel Drizzle",adj:0.50},{l:"Strawberry Sauce",adj:0.75},{l:"Extra Slice",adj:4.00}],
    "Blueberry Muffin": [{l:"Butter",adj:0},{l:"Extra Blueberries",adj:0.50},{l:"Cream Cheese",adj:0.75},{l:"Warmed Up",adj:0}],
  };
  const addOns = isFood
    ? (FOOD_ADDONS[item.name] ?? [{l:"Butter",adj:0},{l:"Extra Napkins",adj:0}])
    : [{l:"Extra Shot",adj:0.75},{l:"Vanilla Syrup",adj:0.50},{l:"Caramel Drizzle",adj:0.50},{l:"Whipped Cream",adj:0.75},{l:"Oat Milk Foam",adj:0.75}];
  const sizeAdj    = sizes.find(s=>s.l===size)?.adj||0;
  const extrasAdj  = extras.reduce((s,e)=>s+(addOns.find(a=>a.l===e)?.adj||0),0);
  const finalPrice = item.price + sizeAdj + extrasAdj;
  const toggleExtra = (e:string) => setExtras(x=>x.includes(e)?x.filter(i=>i!==e):[...x,e]);
  const handleAdd = () => { onAdd({ ...item, price:finalPrice, customizations:{ size, milk, sweet, temp, extras, notes } }); onClose(); };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:998, padding:20 }}>
      <div style={{ background:T.card, borderRadius:16, width:"100%", maxWidth:420, maxHeight:"90vh", overflowY:"auto" as const, color:T.text }}>
        <div style={{ position:"sticky", top:0, background:T.card, padding:"16px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div><div style={{ fontWeight:900, fontSize:16 }}>{item.name}</div><div style={{ color:accent, fontWeight:800, fontSize:15, marginTop:2 }}>${finalPrice.toFixed(2)}</div></div>
          <button onClick={onClose} style={{ ...btn(T.surface2,T.subtext), padding:"6px 12px" }}>✕</button>
        </div>
        <div style={{ padding:"16px 20px" }}>
          {!isFood && (
            <div style={{ marginBottom:18 }}>
              <div style={{ fontWeight:700, fontSize:13, color:T.text, marginBottom:8 }}>Size</div>
              <div style={{ display:"flex", gap:8 }}>
                {sizes.map(s=>(
                  <button key={s.l} onClick={()=>setSize(s.l)} style={{ ...btn(size===s.l?accent:T.surface2,size===s.l?"#111":T.text), flex:1, padding:"10px 0", fontSize:12, fontWeight:size===s.l?900:500 }}>
                    {s.l}{s.adj!==0?` (${s.adj>0?"+":""}${Math.abs(s.adj).toFixed(2)})`:""}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!isFood && (
            <>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontWeight:700, fontSize:13, color:T.text, marginBottom:8 }}>Temperature</div>
                <div style={{ display:"flex", gap:8 }}>
                  {temps.map(t=><button key={t} onClick={()=>setTemp(t)} style={{ ...btn(temp===t?accent:T.surface2,temp===t?"#111":T.text), padding:"9px 16px", fontSize:12, fontWeight:temp===t?900:500 }}>{t==="Hot"?"🔥":t==="Iced"?"🧊":"☕"} {t}</button>)}
                </div>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontWeight:700, fontSize:13, color:T.text, marginBottom:8 }}>Milk</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {milks.map(m=><button key={m} onClick={()=>setMilk(m)} style={{ ...btn(milk===m?accent:T.surface2,milk===m?"#111":T.text), padding:"9px 0", fontSize:12, fontWeight:milk===m?900:500 }}>{m}</button>)}
                </div>
              </div>
              <div style={{ marginBottom:18 }}>
                <div style={{ fontWeight:700, fontSize:13, color:T.text, marginBottom:8 }}>Sweetness</div>
                <div style={{ display:"flex", gap:8 }}>
                  {sweets.map(s=><button key={s} onClick={()=>setSweet(s)} style={{ ...btn(sweet===s?accent:T.surface2,sweet===s?"#111":T.text), flex:1, padding:"9px 0", fontSize:12, fontWeight:sweet===s?900:500 }}>{s}</button>)}
                </div>
              </div>
            </>
          )}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontWeight:700, fontSize:13, color:T.text, marginBottom:8 }}>Add-ons</div>
            {addOns.map(a=>(
              <div key={a.l} onClick={()=>toggleExtra(a.l)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", borderRadius:10, background:extras.includes(a.l)?`${accent}22`:T.surface2, border:`1.5px solid ${extras.includes(a.l)?accent:T.border}`, cursor:"pointer", marginBottom:8 }}>
                <span style={{ fontSize:13, color:T.text, fontWeight:extras.includes(a.l)?700:400 }}>{a.l}</span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:T.subtext, fontSize:12 }}>+${a.adj.toFixed(2)}</span>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:extras.includes(a.l)?accent:T.surface2, border:`1.5px solid ${extras.includes(a.l)?accent:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#111" }}>{extras.includes(a.l)?"✓":""}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontWeight:700, fontSize:13, color:T.text, marginBottom:8 }}>Special Instructions</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any special requests? (optional)"
              style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1px solid ${T.border}`, background:T.inputBg, color:T.inputText, fontSize:13, resize:"none" as const, height:70, boxSizing:"border-box" as const, outline:"none" }} />
          </div>
          <div style={{ background:T.surface2, borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.subtext, marginBottom:4 }}><span>Base</span><span>${item.price.toFixed(2)}</span></div>
            {sizeAdj!==0&&<div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.subtext, marginBottom:4 }}><span>{size}</span><span>{sizeAdj>0?"+":"-"}${Math.abs(sizeAdj).toFixed(2)}</span></div>}
            {extras.map(e=><div key={e} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.subtext, marginBottom:4 }}><span>{e}</span><span>+${(addOns.find(a=>a.l===e)?.adj||0).toFixed(2)}</span></div>)}
            <div style={{ display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:14, color:T.text, borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:4 }}><span>Total</span><span style={{ color:accent }}>${finalPrice.toFixed(2)}</span></div>
          </div>
          <button onClick={handleAdd} style={{ ...btn(accent,"#111"), width:"100%", padding:"14px 0", fontSize:15, fontWeight:900, borderRadius:10 }}>Add to Cart — ${finalPrice.toFixed(2)}</button>
        </div>
      </div>
    </div>
  );
}

function SettingsMenu({ user, onClose, setPage }:any) {
  const T = useTheme();
  const { isDark, setIsDark } = T;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:62, right:16, background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:20, width:290, boxShadow:T.shadow, color:T.text }}>
        {user && (
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
            <div>
              <div style={{ fontWeight:800, fontSize:15 }}>{user.name}</div>
              <div style={{ color:T.subtext, fontSize:12 }}>{user.email}</div>
              <span style={{ background:ROLE_COLOR[user.role], color:"#fff", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:20, textTransform:"uppercase" as const }}>{user.role}</span>
            </div>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:14, fontWeight:700 }}>{isDark?"🌙 Dark Mode":"☀️ Light Mode"}</span>
          <div onClick={()=>setIsDark(!isDark)} style={{ width:48, height:26, borderRadius:13, background:isDark?accent:"#ddd", cursor:"pointer", position:"relative", transition:"background .3s" }}>
            <div style={{ position:"absolute", top:3, left:isDark?24:3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .3s" }} />
          </div>
        </div>
        {user?.role==="customer" && (
          <div style={{ marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ color:T.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase" as const, marginBottom:10 }}>My Account</div>
            {[{icon:"⭐",label:"My Rewards",sub:`${user.points} pts = $${ptsToDollars(user.points)}`,pg:"rewards"},{icon:"📦",label:"Order History",sub:"Past orders & receipts",pg:"track"}].map((r,i)=>(
              <div key={i} onClick={()=>{setPage(r.pg);onClose();}} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", borderRadius:10, background:T.surface2, cursor:"pointer", marginBottom:8 }}>
                <div><div style={{ fontWeight:700, fontSize:13 }}>{r.icon} {r.label}</div><div style={{ color:T.subtext, fontSize:11 }}>{r.sub}</div></div>
                <span style={{ color:accent, fontWeight:800 }}>›</span>
              </div>
            ))}
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

function Nav({ user, page, setPage, onLogout, history, goBack }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const links = user
    ? user.role==="customer" ? ["Menu","Drive-Thru","Reservations","Track","Rewards","Locations"]
    : user.role==="staff"    ? ["Orders","Drive-Thru"]
    : user.role==="manager"  ? ["Orders","Drive-Thru","Dashboard"]
    : ["Dashboard","Menu","Orders","Locations","Staff","Settings"]
    : ["Home","Menu","Locations"];
  const toPage = (l:string) => l.toLowerCase().replace(" ","-");
  return (
    <>
      <nav style={{ background:T.navBg, borderBottom:`1px solid ${T.navBorder}`, position:"sticky", top:0, zIndex:200 }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${accent},${gold})` }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:isMobile?"10px 16px":"10px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {history.length>0 && <button onClick={goBack} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.subtext, borderRadius:7, padding:"5px 10px", fontSize:12, fontWeight:700, cursor:"pointer" }}>←</button>}
            <div onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
              <img src={CaffeinatedLionsLogo} alt="logo" style={{ height:36, width:36, objectFit:"contain", borderRadius:8 }} />
              <span style={{ color:accent, fontWeight:900, fontSize:17 }}>Caffeinated Lions</span>
            </div>
          </div>
          {!isMobile && (
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              {links.map(l=>(
                <span key={l} onClick={()=>setPage(toPage(l))} style={{ color:page===toPage(l)?accent:T.navLink, fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" as const }}>{l}</span>
              ))}
            </div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {user && !isMobile && user.role==="customer" && <span style={{ color:accent, fontSize:12, fontWeight:700 }}>⭐ {user.points} pts</span>}
            {user && !isMobile && <span style={{ color:T.navText, fontSize:13, fontWeight:700 }}>{user.name}</span>}
            <button onClick={()=>setShowSettings(s=>!s)} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.navText, borderRadius:7, padding:"5px 10px", fontSize:13, cursor:"pointer" }}>⚙️</button>
            {!isMobile && user && <button onClick={onLogout} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.subtext, borderRadius:6, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>Logout</button>}
            {!isMobile && !user && <button onClick={()=>setPage("login")} style={{ ...btn(accent,"#111"), fontWeight:800 }}>Log In</button>}
            {isMobile && <button onClick={()=>setMenuOpen(o=>!o)} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.navText, borderRadius:7, padding:"5px 10px", fontSize:18, cursor:"pointer" }}>☰</button>}
          </div>
        </div>
        {isMobile && menuOpen && (
          <div style={{ background:T.card, borderTop:`1px solid ${T.border}`, padding:"12px 16px" }}>
            {links.map(l=>(
              <div key={l} onClick={()=>{setPage(toPage(l));setMenuOpen(false);}} style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}`, color:page===toPage(l)?accent:T.text, fontWeight:600, fontSize:15, cursor:"pointer" }}>{l}</div>
            ))}
            {user
              ? <button onClick={()=>{onLogout();setMenuOpen(false);}} style={{ ...btn("#fee2e2","#dc2626"), width:"100%", marginTop:10, padding:"12px 0" }}>Logout</button>
              : <button onClick={()=>{setPage("login");setMenuOpen(false);}} style={{ ...btn(accent,"#111"), width:"100%", marginTop:10, padding:"12px 0", fontWeight:800 }}>Log In</button>}
          </div>
        )}
      </nav>
      {showSettings && <SettingsMenu user={user} onClose={()=>setShowSettings(false)} setPage={setPage} />}
    </>
  );
}

function PopularReel({ onOrder }:any) {
  const T = useTheme();
  const popular = MENU.filter(m=>m.popular).sort((a,b)=>b.orders-a.orders);
  const [current, setCurrent] = useState(0);
  const [next,    setNext]    = useState(1);
  const [fading,  setFading]  = useState(false);

  useEffect(()=>{
    const t = setInterval(()=>{
      const nxt = (current + 1) % popular.length;
      setNext(nxt);
      setFading(true);
      setTimeout(()=>{ setCurrent(nxt); setFading(false); }, 500);
    }, 3000);
    return ()=>clearInterval(t);
  },[current, popular.length]);

  const cur = popular[current];
  const nxt = popular[next % popular.length];

  return (
    <div style={{ position:"relative", height:420, overflow:"hidden", background:"#1a1a1a" }}>
      <img src={nxt.img} alt={nxt.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
      <img src={cur.img} alt={cur.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:fading?0:1, transition:"opacity 0.5s" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(0,0,0,.2),rgba(0,0,0,.75))" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"32px 24px" }}>
        <div style={{ display:"inline-block", background:accent, color:"#111", fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:20, marginBottom:10, letterSpacing:1 }}>🔥 MOST POPULAR</div>
        <div style={{ color:"#fff", fontWeight:900, fontSize:28, marginBottom:4, textShadow:"0 2px 8px rgba(0,0,0,.5)", opacity:fading?0:1, transition:"opacity 0.5s" }}>{cur.name}</div>
        <div style={{ color:accent, fontSize:18, fontWeight:800, marginBottom:16, opacity:fading?0:1, transition:"opacity 0.5s" }}>${cur.price.toFixed(2)}</div>
        <button onClick={onOrder} style={{ ...btn(accent,"#111"), padding:"12px 28px", fontSize:15, fontWeight:900, borderRadius:10 }}>Order Now</button>
      </div>
      <div style={{ position:"absolute", bottom:16, right:24, display:"flex", gap:6 }}>
        {popular.map((_,i)=>(
          <div key={i} onClick={()=>{ setNext(i); setFading(true); setTimeout(()=>{ setCurrent(i); setFading(false); },500); }}
            style={{ width:i===current?24:8, height:8, borderRadius:4, background:i===current?accent:"rgba(255,255,255,.5)", cursor:"pointer", transition:"all .3s" }} />
        ))}
      </div>
    </div>
  );
}

function GuestHome({ setPage }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const top3 = [...MENU].sort((a,b)=>b.orders-a.orders).slice(0,3);
  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <PopularReel onOrder={()=>setPage("menu")} />
      <div style={{ background:T.sectionBg, padding:isMobile?"32px 16px":"48px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <h2 style={{ fontWeight:900, fontSize:isMobile?18:22, color:T.text, margin:0 }}>Most Popular This Week</h2>
            <span style={{ background:accent, color:"#111", fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>⭐ Top Picks</span>
          </div>
          <p style={{ color:T.subtext, fontSize:13, marginBottom:20 }}>Our customers can't get enough of these</p>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)", gap:isMobile?12:16 }}>
            {top3.map((item,i)=>(
              <Card key={item.id} style={{ position:"relative" }} onClick={()=>setPage("menu")}>
                {i===0 && <div style={{ position:"absolute", top:10, left:10, background:accent, color:"#111", fontSize:10, fontWeight:900, padding:"3px 10px", borderRadius:20, zIndex:1 }}>#1</div>}
                <img src={item.img} alt={item.name} style={{ width:"100%", height:isMobile?100:150, objectFit:"cover" }} />
                <div style={{ padding:"12px 14px" }}>
                  <div style={{ fontWeight:800, fontSize:isMobile?12:14, color:T.text }}>{item.name}</div>
                  <div style={{ color:T.subtext, fontSize:11, margin:"3px 0 10px" }}>{item.orders} orders · {item.cat}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ color:accent, fontWeight:900, fontSize:15 }}>${item.price.toFixed(2)}</span>
                    <button onClick={e=>{e.stopPropagation();setPage("menu");}} style={{ ...btn(accent,"#111"), padding:"5px 12px", fontSize:11, fontWeight:800 }}>Order</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", padding:isMobile?"36px 16px":"48px 24px", textAlign:"center" }}>
        <div style={{ display:"inline-block", background:accent, color:"#111", fontSize:11, fontWeight:800, padding:"4px 14px", borderRadius:20, marginBottom:12 }}>🎁 REWARDS PROGRAM</div>
        <h2 style={{ color:"#fff", fontSize:isMobile?20:26, fontWeight:900, marginBottom:8 }}>Earn Points on Every Order</h2>
        <p style={{ color:"#aaa", fontSize:14, marginBottom:24, maxWidth:500, margin:"0 auto 24px" }}>Spend $10 → earn 100 points. 1,000 points = $10 off your next order!</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" as const }}>
          <button onClick={()=>setPage("login")} style={{ ...btn(accent,"#111"), padding:"14px 32px", fontSize:15, fontWeight:900, borderRadius:10 }}>Create Free Account</button>
          <button onClick={()=>setPage("menu")} style={{ background:"transparent", border:`2px solid ${accent}`, color:accent, borderRadius:10, padding:"14px 32px", fontSize:15, fontWeight:900, cursor:"pointer" }}>Order as Guest</button>
        </div>
      </div>
    </div>
  );
}

function Login({ onLogin, setPage, mode }:any) {
  const T = useTheme();
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [name,     setName]     = useState("");
  const [err,      setErr]      = useState("");
  const [isSignup, setIsSignup] = useState(mode==="signup");

  const go = async () => {
    setErr("");
    const roleMap: Record<string, string> = {
      "admin": "admin", "staff": "staff", "manager": "manager",
      "customer": "customer", "user": "customer",
    };
    try {
      if (isSignup) {
        const res = await fetch("/api/authentication/register", {
          method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ userName: name || email, email, password: pass }),
        });
        if (!res.ok) { setErr(await res.text() || "Registration failed."); return; }
        const apiUser = await res.json();
        const pointsRes = await fetch("/api/users/points", { credentials: "include" });
        const realPoints = pointsRes.ok ? await pointsRes.json() : 0;
        onLogin({ ...apiUser, role: roleMap[apiUser.roles?.[0]?.toLowerCase()] ?? "customer", name: apiUser.userName, email: apiUser.userName, points: realPoints, location: 1, lastOrder: null });
      } else {
        let apiOk = false;
        try {
          const res = await fetch("/api/authentication/login", {
            method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
            body: JSON.stringify({ userName: email, password: pass }),
          });
          if (res.ok) {
            apiOk = true;
            const apiUser = await res.json();
            const localUser = USERS.find(u => u.email === email);
            const pointsRes = await fetch("/api/users/points", { credentials: "include" });
            const realPoints = pointsRes.ok ? await pointsRes.json() : 0;
            onLogin({
              ...apiUser,
              role: localUser?.role ?? roleMap[apiUser.roles?.[0]?.toLowerCase()] ?? "customer",
              name: localUser?.name ?? apiUser.userName,
              email: apiUser.userName,
              points: realPoints,
              location: localUser?.location ?? 1,
              lastOrder: null,
            });
          }
        } catch (_) {}
        if (!apiOk) {
          // Fallback: local test accounts (for dev/demo when backend lacks these users)
          const localUser = USERS.find(u => u.email === email && u.password === pass);
          if (localUser) { onLogin({ ...localUser }); return; }
          setErr("Invalid credentials.");
        }
      }
    } catch (e) { setErr("Network error. Please try again."); }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ height:4, background:`linear-gradient(90deg,${accent},${gold})`, position:"fixed", top:0, left:0, right:0 }} />
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <img src={CaffeinatedLionsLogo} alt="logo" style={{ height:70, width:"auto", marginBottom:10 }} />
        <div style={{ color:accent, fontWeight:900, fontSize:22 }}>Caffeinated Lions</div>
        <div style={{ color:T.subtext, fontSize:12, marginTop:4 }}>{isSignup?"Create your account":"Welcome back!"}</div>
      </div>
      <div style={{ background:T.card, borderRadius:14, padding:28, width:"100%", maxWidth:380, border:`1px solid ${T.border}` }}>
        {isSignup && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name"
            style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"13px 14px", color:T.inputText, fontSize:14, marginBottom:10, boxSizing:"border-box" as const }} />
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
          style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"13px 14px", color:T.inputText, fontSize:14, boxSizing:"border-box" as const }} />
        <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password"
          style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"13px 14px", color:T.inputText, fontSize:14, marginTop:10, boxSizing:"border-box" as const }} />
        {err && <div style={{ color:"#f87171", fontSize:12, marginTop:6 }}>{err}</div>}
        <button onClick={go} style={{ ...btn(accent,"#111"), width:"100%", padding:"14px 0", marginTop:14, fontSize:15, fontWeight:900 }}>{isSignup?"Create Account":"Sign In"}</button>
        <div style={{ textAlign:"center", marginTop:14, color:T.subtext, fontSize:12 }}>
          {isSignup?"Already have an account? ":"Don't have an account? "}
          <span onClick={()=>setIsSignup(!isSignup)} style={{ color:accent, cursor:"pointer", fontWeight:700 }}>{isSignup?"Sign In":"Sign Up Free"}</span>
        </div>
        <div style={{ textAlign:"center", marginTop:10 }}>
          <span onClick={()=>setPage("menu")} style={{ color:T.subtext, fontSize:12, cursor:"pointer" }}>Continue as Guest</span>
        </div>
      </div>
    </div>
  );
}

function RewardsPage({ user, setPage }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  if (!user || user.isGuest) return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:isMobile?"16px":"24px" }}>
      <div style={{ background:"linear-gradient(135deg,#1a1a1a,#2d2000)", borderRadius:16, padding:isMobile?20:28, marginBottom:20, color:"#fff", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🏆</div>
        <div style={{ color:accent, fontWeight:900, fontSize:22, marginBottom:8 }}>Loyalty Rewards</div>
        <div style={{ color:"#aaa", fontSize:14, maxWidth:400, margin:"0 auto 20px" }}>Create a free account to start earning points on every order!</div>
        <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:16, marginBottom:20, textAlign:"left" as const }}>
          {[["Spend $10","Earn 100 points"],["1,000 points","$10 off your order"],["5,000 points","$50 off your order"]].map(([k,v],i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<2?`1px solid rgba(255,255,255,.1)`:"none" }}>
              <span style={{ color:"#aaa", fontSize:13 }}>{k}</span>
              <span style={{ color:accent, fontWeight:700, fontSize:13 }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>setPage("login")} style={{ ...btn(accent,"#111"), padding:"14px 32px", fontSize:15, fontWeight:900, borderRadius:10 }}>Create Free Account</button>
      </div>
    </div>
  );
  const tier = user.points>=10000?"🥇 Gold":user.points>=5000?"🥈 Silver":"🥉 Bronze";
  const nextMilestone = user.points>=10000?15000:user.points>=5000?10000:5000;
  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:isMobile?"16px":"24px" }}>
      <div style={{ background:"linear-gradient(135deg,#1a1a1a,#2d2000)", borderRadius:16, padding:isMobile?20:28, marginBottom:20, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:accent, fontSize:11, fontWeight:800, textTransform:"uppercase" as const, marginBottom:4, letterSpacing:1 }}>Your Balance</div>
            <div style={{ color:accent, fontSize:isMobile?44:56, fontWeight:900, lineHeight:1 }}>{user.points.toLocaleString()}</div>
            <div style={{ color:"#aaa", fontSize:13 }}>points · worth <strong style={{ color:accent }}>${ptsToDollars(user.points)}</strong></div>
          </div>
          <div style={{ textAlign:"center" as const }}><div style={{ fontSize:isMobile?40:52 }}>🏆</div><div style={{ color:accent, fontWeight:800, fontSize:15 }}>{tier}</div></div>
        </div>
        <div style={{ background:"rgba(252,211,77,.15)", borderRadius:8, padding:"10px 14px", marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#ccc" }}><span>Progress to next tier</span><span>{user.points.toLocaleString()} / {nextMilestone.toLocaleString()}</span></div>
          <div style={{ background:"rgba(255,255,255,.15)", borderRadius:4, height:8, marginTop:8 }}><div style={{ background:accent, width:`${Math.min((user.points/nextMilestone)*100,100)}%`, height:"100%", borderRadius:4 }} /></div>
        </div>
        <div style={{ marginTop:12, background:"rgba(252,211,77,.1)", borderRadius:8, padding:"10px 14px" }}>
          <div style={{ color:"#ccc", fontSize:12 }}>💡 Spend $1 → earn 10 pts · 1,000 pts = $10 in rewards</div>
        </div>
      </div>
      <Card style={{ padding:isMobile?16:24 }}>
        <div style={{ fontWeight:800, fontSize:16, color:T.text, marginBottom:16 }}>🎁 Redeem Your Points</div>
        {[{pts:1000,reward:"$10 Off",icon:"☕"},{pts:5000,reward:"$50 Off",icon:"🥤"},{pts:10000,reward:"$100 Off",icon:"🍽️"}].map((r,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:i<2?`1px solid ${T.border}`:"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:28 }}>{r.icon}</span>
              <div><div style={{ fontWeight:700, fontSize:14, color:T.text }}>{r.reward}</div><div style={{ color:T.subtext, fontSize:12 }}>{r.pts.toLocaleString()} pts required</div></div>
            </div>
            <button style={{ ...btn(user.points>=r.pts?accent:T.surface2, user.points>=r.pts?"#111":T.subtext), padding:"8px 16px", fontSize:12, fontWeight:800 }}>{user.points>=r.pts?"Redeem":"🔒 Locked"}</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

function GuestMenuPage({ setPage }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [filter,      setFilter]      = useState("Popular");
  const [cart,        setCart]        = useState<any[]>([]);
  const [customizing, setCustomizing] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [receipt,     setReceipt]     = useState<any>(null);
  const [driveCode,   setDriveCode]   = useState<any>(null);
  const [selectedLoc, setSelectedLoc] = useState(1);

  const cats  = ["Popular","Hot Coffee","Iced Coffee","Food"];
  const shown = filter==="Popular" ? [...MENU].sort((a,b)=>b.orders-a.orders) : MENU.filter(m=>m.cat===filter);
  const total = cart.reduce((s:number,i:any)=>s+i.price,0);

  const handlePay = async (payMethod: string) => {
      const code    = "CL-" + Math.floor(1000+Math.random()*9000);
      const locName = LOCATIONS.find(l=>l.id===selectedLoc)?.name ?? "Hammond";
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locationId: selectedLoc,
            type: "dine-in",
            isGuest: true,
            items: cart.map((i:any) => ({ name: i.name, price: i.price })),
            total,
          }),
        });
      } catch {}
      const o = {
        id: "#G" + Math.floor(1000+Math.random()*9000), code,
        customer: "Guest", items: cart, total,
        date: new Date().toLocaleDateString(), payMethod,
        type: "dine-in", status: "Pending",
        time: new Date().toLocaleTimeString(), location: locName, count: cart.length,
      };
      setShowPayment(false);
      setReceipt({ ...o, payMethod });
      setCart([]);
    };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      {receipt     && <Receipt order={receipt} onClose={()=>setReceipt(null)} isGuest={true} onSignUp={()=>setPage("signup")} />}
      {driveCode   && <DriveThruCode code={driveCode.code} order={driveCode.order} onClose={()=>setDriveCode(null)} />}
      {customizing && <CustomizeModal item={customizing} onAdd={(item:any)=>setCart((c:any)=>[...c,item])} onClose={()=>setCustomizing(null)} />}
      {showPayment && <PaymentModal total={total} onPay={handlePay} onClose={()=>setShowPayment(false)} user={null} isGuest={true} onSignUp={()=>setPage("signup")} />}
      <div style={{ background:T.isDark?"#1a1500":"#fffbeb", borderBottom:`1px solid ${accent}30`, padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, flexWrap:"wrap" as const }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>⭐</span>
          <span style={{ color:T.isDark?"#f5f5f5":"#111", fontSize:13 }}><strong>You're missing out on points!</strong> Sign up free to earn rewards on every order.</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setPage("signup")} style={{ ...btn(accent,"#111"), padding:"6px 16px", fontSize:12, fontWeight:800 }}>Sign Up Free</button>
          <button onClick={()=>setPage("login")} style={{ background:"transparent", border:`1px solid ${T.border}`, color:T.subtext, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }}>Sign In</button>
        </div>
      </div>
      <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", padding:"8px 20px", display:"flex", alignItems:"center", gap:12, overflowX:"auto" as const }}>
        <span style={{ color:"#aaa", fontSize:12, whiteSpace:"nowrap" as const }}>📍 Location:</span>
        {LOCATIONS.map(l=>(
          <button key={l.id} onClick={()=>setSelectedLoc(l.id)} style={{ ...btn(selectedLoc===l.id?accent:"rgba(255,255,255,.1)", selectedLoc===l.id?"#111":"#ccc"), padding:"5px 14px", fontSize:12, borderRadius:20, whiteSpace:"nowrap" as const }}>{l.name}</button>
        ))}
      </div>
      <div style={{ maxWidth:900, margin:"0 auto", padding:isMobile?"16px":"24px" }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const, marginBottom:16 }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{ ...btn(filter===c?accent:T.surface2, filter===c?"#111":T.subtext), padding:"7px 14px", fontSize:12, borderRadius:20, fontWeight:filter===c?800:600 }}>
              {c==="Popular"?"🔥 Popular":c}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(200px,1fr))", gap:isMobile?12:16 }}>
          {shown.map((item,i)=>(
            <Card key={item.id} style={{ position:"relative" }}>
              {filter==="Popular"&&i===0&&<div style={{ position:"absolute", top:8, left:8, background:accent, color:"#111", fontSize:9, fontWeight:900, padding:"2px 8px", borderRadius:20, zIndex:1 }}>#1</div>}
              <img src={item.img} alt={item.name} style={{ width:"100%", height:isMobile?100:130, objectFit:"cover" }} />
              <div style={{ padding:isMobile?"8px 10px":"10px 12px" }}>
                <div style={{ fontWeight:800, fontSize:isMobile?12:13, color:T.text }}>{item.name}</div>
                <div style={{ color:T.subtext, fontSize:10, marginBottom:6 }}>{item.cat}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:accent, fontWeight:900, fontSize:13 }}>${item.price.toFixed(2)}</span>
                  <button onClick={()=>setCustomizing(item)} style={{ ...btn(accent,"#111"), padding:"6px 12px", fontSize:11, fontWeight:800 }}>+ Add</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {cart.length>0 && (
        <div style={{ position:"fixed", bottom:20, right:20, background:T.card, borderRadius:14, border:`2px solid ${accent}`, padding:18, width:isMobile?undefined:290, zIndex:100, boxShadow:T.shadow }}>
          {!isMobile && (
            <>
              <div style={{ fontWeight:800, fontSize:14, marginBottom:10, color:T.text }}>🛒 Cart ({cart.length})</div>
              {cart.map((i:any,idx:number)=>(
                <div key={idx} style={{ padding:"5px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.text }}><span style={{ fontWeight:600 }}>{i.name}</span><span style={{ color:accent }}>${i.price.toFixed(2)}</span></div>
                </div>
              ))}
              <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:8, display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:14, color:T.text }}><span>Total</span><span style={{ color:accent }}>${total.toFixed(2)}</span></div>
              <div style={{ background:T.isDark?"#1a1500":"#fffbeb", borderRadius:8, padding:"8px 10px", marginTop:10, fontSize:11, color:"#92400e" }}>
                ⭐ Sign up to earn <strong>{ptsForSpend(total)} pts</strong> on this order!
                <span onClick={()=>setPage("signup")} style={{ color:accent, cursor:"pointer", fontWeight:700, marginLeft:6 }}>Sign Up →</span>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:10 }}>
                <button onClick={()=>setCart([])} style={{ ...btn(T.surface2,T.subtext), flex:1, padding:"8px 0", fontSize:12 }}>Clear</button>
                <button onClick={()=>setShowPayment(true)} style={{ ...btn(accent,"#111"), flex:1, padding:"8px 0", fontSize:12, fontWeight:800 }}>Checkout</button>
              </div>
            </>
          )}
          {isMobile && (
            <div onClick={()=>setShowPayment(true)} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
              <span style={{ fontSize:18 }}>🛒</span>
              <span style={{ color:"#111", fontWeight:900, fontSize:14 }}>{cart.length} · ${total.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CustomerApp({ user, setUser, page, setPage, sharedOrders, setSharedOrders }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [cart,setCart]               = useState<any[]>([]);
  const [receipt,setReceipt]         = useState<any>(null);
  const [filter,setFilter]           = useState("Popular");
  const [showCart,setShowCart]       = useState(false);
  const [driveCode,setDriveCode]     = useState<any>(null);
  const [customizing,setCustomizing] = useState<any>(null);
  const [showPayment,setShowPayment] = useState(false);
  const [selectedLoc,setSelectedLoc] = useState(user.location||1);
  const [isDriveThruCheckout,setIsDriveThruCheckout] = useState(false);

  const cats  = ["Popular","Hot Coffee","Iced Coffee","Food"];
  const shown = filter==="Popular" ? [...MENU].sort((a,b)=>b.orders-a.orders) : MENU.filter(m=>m.cat===filter);
  const total = cart.reduce((s:number,i:any)=>s+i.price,0);

  const handleCheckout = (isDT=false) => {
    if (!cart.length) return;
    setIsDriveThruCheckout(isDT);
    setShowPayment(true);
    if (showCart) setShowCart(false);
  };

  const handlePay = async (payMethod: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          locationId: selectedLoc,
          type: isDriveThruCheckout ? "drive-thru" : "dine-in",
          items: cart.map(i => ({ name: i.name, price: i.price })),
          total,
        }),
      });
      if (!res.ok) { console.error("Order failed:", await res.text()); return; }
      const order = await res.json();
      const pointsRes = await fetch("/api/users/points", { credentials: "include" });
      const newPoints = pointsRes.ok ? await pointsRes.json() : user.points;
      const code    = "CL-" + Math.floor(1000 + Math.random() * 9000);
      const locName = LOCATIONS.find(l => l.id === selectedLoc)?.name || "Hammond";
      const o = {
        id: `#${order.id}`, code, customer: user.name, items: cart, total,
        date: new Date().toLocaleDateString(), payMethod,
        type: isDriveThruCheckout ? "drive-thru" : "dine-in",
        status: "Pending", time: new Date().toLocaleTimeString(), location: locName, count: cart.length,
      };
      setSharedOrders((prev: any[]) => [o, ...prev]);
      setShowPayment(false);
      if (isDriveThruCheckout) setDriveCode({ code, order: o });
      else setReceipt({ ...o, payMethod });
      setCart([]);
      const ptsCost   = ptsCostFor(total);
      const ptsChange = payMethod === "points" ? -ptsCost : ptsForSpend(total);
      setUser((u: any) => ({ ...u, points: Math.max(0, newPoints + (payMethod === "points" ? ptsChange : 0)), lastOrder: o }));
    } catch (e) { console.error("Order failed", e); }
  };

  if (page==="rewards") return <RewardsPage user={user} setPage={setPage} />;

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      {receipt     && <Receipt order={receipt} onClose={()=>setReceipt(null)} isGuest={false} />}
      {driveCode   && <DriveThruCode code={driveCode.code} order={driveCode.order} onClose={()=>setDriveCode(null)} />}
      {customizing && <CustomizeModal item={customizing} onAdd={(item:any)=>setCart((c:any)=>[...c,item])} onClose={()=>setCustomizing(null)} />}
      {showPayment && <PaymentModal total={total} onPay={handlePay} onClose={()=>setShowPayment(false)} user={user} isGuest={false} />}
      {isMobile && showCart && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:400 }} onClick={()=>setShowCart(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", bottom:0, left:0, right:0, background:T.card, borderRadius:"20px 20px 0 0", padding:24, maxHeight:"70vh", overflowY:"auto" as const }}>
            <div style={{ fontWeight:800, fontSize:16, color:T.text, marginBottom:16 }}>🛒 Your Cart</div>
            {cart.length===0 ? <div style={{ color:T.subtext, textAlign:"center", padding:20 }}>Cart is empty</div> :
              cart.map((i:any,idx:number)=>(
                <div key={idx} style={{ borderBottom:`1px solid ${T.border}`, paddingBottom:8, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", color:T.text }}><span style={{ fontWeight:600 }}>{i.name}</span><span style={{ color:accent }}>${i.price.toFixed(2)}</span></div>
                  {i.customizations&&<div style={{ fontSize:11, color:T.subtext }}>{[i.customizations.size,i.customizations.milk,i.customizations.temp,...(i.customizations.extras||[])].filter(Boolean).join(" · ")}</div>}
                </div>
              ))
            }
            {cart.length>0 && <>
              <div style={{ display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:16, color:T.text, margin:"14px 0" }}><span>Total</span><span style={{ color:accent }}>${total.toFixed(2)}</span></div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setCart([])} style={{ ...btn(T.surface2,T.subtext), flex:1, padding:"13px 0" }}>Clear</button>
                <button onClick={()=>handleCheckout(false)} style={{ ...btn(accent,"#111"), flex:2, padding:"13px 0", fontSize:14, fontWeight:900 }}>Checkout</button>
              </div>
            </>}
          </div>
        </div>
      )}
      <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", padding:"8px 20px", display:"flex", alignItems:"center", gap:12, overflowX:"auto" as const }}>
        <span style={{ color:"#aaa", fontSize:12, whiteSpace:"nowrap" as const }}>📍 Location:</span>
        {LOCATIONS.map(l=>(
          <button key={l.id} onClick={()=>setSelectedLoc(l.id)} style={{ ...btn(selectedLoc===l.id?accent:"rgba(255,255,255,.1)", selectedLoc===l.id?"#111":"#ccc"), padding:"5px 14px", fontSize:12, borderRadius:20, whiteSpace:"nowrap" as const }}>{l.name}</button>
        ))}
      </div>
      {user.lastOrder && page==="menu" && (
        <div style={{ background:T.isDark?"#1a1500":"#fffbeb", borderBottom:`1px solid ${accent}30`, padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap" as const, gap:8 }}>
          <div><span style={{ color:accent, fontWeight:800, fontSize:12 }}>🔄 Last Order: </span><span style={{ color:T.text, fontSize:12 }}>{user.lastOrder.items[0].name} — ${user.lastOrder.total.toFixed(2)}</span></div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setReceipt(user.lastOrder)} style={{ ...btn(T.surface2,T.subtext), padding:"5px 12px", fontSize:11 }}>Receipt</button>
            <button onClick={()=>setCart(user.lastOrder.items)} style={{ ...btn(accent,"#111"), padding:"5px 12px", fontSize:11, fontWeight:800 }}>Reorder</button>
          </div>
        </div>
      )}
      <div style={{ maxWidth:900, margin:"0 auto", padding:isMobile?"16px":"24px 20px", paddingBottom:isMobile?90:24 }}>
        {page==="menu" && (
          <div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const, marginBottom:16 }}>
              {cats.map(c=>(
                <button key={c} onClick={()=>setFilter(c)} style={{ ...btn(filter===c?accent:T.surface2, filter===c?"#111":T.subtext), padding:"7px 14px", fontSize:12, borderRadius:20, fontWeight:filter===c?800:600 }}>
                  {c==="Popular"?"🔥 Popular":c}
                </button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(200px,1fr))", gap:isMobile?12:16 }}>
              {shown.map((item,i)=>(
                <Card key={item.id} style={{ position:"relative" }}>
                  {filter==="Popular"&&i===0&&<div style={{ position:"absolute", top:8, left:8, background:accent, color:"#111", fontSize:9, fontWeight:900, padding:"2px 8px", borderRadius:20, zIndex:1 }}>#1</div>}
                  <img src={item.img} alt={item.name} style={{ width:"100%", height:isMobile?100:130, objectFit:"cover" }} />
                  <div style={{ padding:isMobile?"8px 10px":"10px 12px" }}>
                    <div style={{ fontWeight:800, fontSize:isMobile?12:13, color:T.text }}>{item.name}</div>
                    <div style={{ color:T.subtext, fontSize:10, marginBottom:6 }}>{item.cat}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:accent, fontWeight:900, fontSize:13 }}>${item.price.toFixed(2)}</span>
                      <button onClick={()=>setCustomizing(item)} style={{ ...btn(accent,"#111"), padding:"6px 12px", fontSize:11, fontWeight:800 }}>+ Add</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {!isMobile && cart.length>0 && (
              <div style={{ position:"fixed", bottom:20, right:20, background:T.card, borderRadius:14, border:`2px solid ${accent}`, padding:18, width:290, zIndex:100, boxShadow:T.shadow }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:10, color:T.text }}>🛒 Cart ({cart.length})</div>
                {cart.map((i:any,idx:number)=>(
                  <div key={idx} style={{ padding:"5px 0", borderBottom:`1px solid ${T.border}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.text }}><span style={{ fontWeight:600 }}>{i.name}</span><span style={{ color:accent }}>${i.price.toFixed(2)}</span></div>
                    {i.customizations&&<div style={{ fontSize:10, color:T.subtext }}>{[i.customizations.size,i.customizations.milk,i.customizations.temp,...(i.customizations.extras||[])].filter(Boolean).join(" · ")}</div>}
                  </div>
                ))}
                <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:8, marginTop:8, display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:14, color:T.text }}><span>Total</span><span style={{ color:accent }}>${total.toFixed(2)}</span></div>
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  <button onClick={()=>setCart([])} style={{ ...btn(T.surface2,T.subtext), flex:1, padding:"8px 0", fontSize:12 }}>Clear</button>
                  <button onClick={()=>handleCheckout(false)} style={{ ...btn(accent,"#111"), flex:1, padding:"8px 0", fontSize:12, fontWeight:800 }}>Checkout</button>
                </div>
              </div>
            )}
          </div>
        )}
        {page==="drive-thru" && (
          <div>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:4 }}>🚗 Drive-Thru Order</h2>
            <p style={{ color:T.subtext, fontSize:13, marginBottom:20 }}>Order ahead — get a code — show it at the window</p>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
              {MENU.filter(m=>m.cat!=="Food").map(item=>(
                <Card key={item.id}>
                  <img src={item.img} alt={item.name} style={{ width:"100%", height:isMobile?90:110, objectFit:"cover" }} />
                  <div style={{ padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><div style={{ fontWeight:700, fontSize:12, color:T.text }}>{item.name}</div><div style={{ color:accent, fontWeight:800, fontSize:12 }}>${item.price.toFixed(2)}</div></div>
                    <button onClick={()=>setCustomizing(item)} style={{ ...btn(accent,"#111"), padding:"6px 12px", fontSize:11, fontWeight:800 }}>+</button>
                  </div>
                </Card>
              ))}
            </div>
            {cart.length>0 && (
              <Card style={{ padding:16, marginTop:16 }}>
                {cart.map((i:any,idx:number)=><div key={idx} style={{ fontSize:13, color:T.subtext, padding:"2px 0" }}>• {i.name} — ${i.price.toFixed(2)}</div>)}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}` }}>
                  <span style={{ fontWeight:800, color:accent, fontSize:15 }}>Total: ${total.toFixed(2)}</span>
                  <button onClick={()=>handleCheckout(true)} style={{ ...btn(accent,"#111"), fontWeight:900 }}>Get My Code 🚗</button>
                </div>
              </Card>
            )}
          </div>
        )}
        {page==="reservations" && <ReservationsTab isMobile={isMobile} />}
        {page==="track" && (
          <Card style={{ padding:isMobile?16:24 }}>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>📦 Track Your Order</h2>
            {!user.lastOrder ? <p style={{ color:T.subtext }}>No active order. Place one first!</p> :
              ["Order Received","Being Prepared","Quality Check","Ready for Pickup"].map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:i<3?accent:T.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:i<3?"#111":T.subtext, fontWeight:900, flexShrink:0 }}>{i<3?"✓":i+1}</div>
                  <div><div style={{ fontSize:14, fontWeight:i<3?800:400, color:i<3?T.text:T.subtext }}>{s}</div>{i<3&&<div style={{ fontSize:11, color:"#16a34a" }}>Completed</div>}</div>
                </div>
              ))
            }
          </Card>
        )}
        {page==="rewards"   && <RewardsPage user={user} setPage={setPage} />}
        {page==="locations" && <LocationsPage />}
      </div>
      {isMobile && cart.length>0 && (page==="menu"||page==="drive-thru") && (
        <div onClick={()=>page==="drive-thru"?handleCheckout(true):setShowCart(true)}
          style={{ position:"fixed", bottom:20, right:16, background:accent, borderRadius:30, padding:"14px 20px", display:"flex", alignItems:"center", gap:8, boxShadow:`0 4px 16px ${accent}66`, cursor:"pointer", zIndex:100 }}>
          <span style={{ fontSize:18 }}>🛒</span>
          <span style={{ color:"#111", fontWeight:900, fontSize:14 }}>{cart.length} · ${total.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}

function ReservationsTab({ isMobile }:any) {
  const T = useTheme();
  const [step,setStep]           = useState(1);
  const [date,setDate]           = useState("");
  const [time,setTime]           = useState("");
  const [guests,setGuests]       = useState(2);
  const [confirmed,setConfirmed] = useState(false);
  const times = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"];
  const today = new Date().toISOString().split("T")[0];
  const reset = () => { setStep(1);setDate("");setTime("");setGuests(2);setConfirmed(false); };
  if(confirmed) return (
    <Card style={{ padding:32, textAlign:"center" }}>
      <div style={{ fontSize:52, marginBottom:12 }}>✅</div>
      <h2 style={{ fontWeight:900, fontSize:20, color:T.text, marginBottom:8 }}>Reservation Confirmed!</h2>
      <div style={{ background:T.isDark?"#1a1500":"#fffbeb", border:`1px solid ${accent}40`, borderRadius:12, padding:20, margin:"16px 0", textAlign:"left" }}>
        {[["📅 Date",new Date(date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})],["🕐 Time",time],["👥 Guests",`${guests} ${guests===1?"person":"people"}`],["💳 Deposit","Charged to card on file"]].map(([l,v],i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><span style={{ color:T.subtext, fontSize:14 }}>{l}</span><span style={{ fontWeight:700, color:T.text, fontSize:14 }}>{v}</span></div>
        ))}
      </div>
      <button onClick={reset} style={{ ...btn(accent,"#111"), padding:"11px 28px", fontWeight:900 }}>Make Another Reservation</button>
    </Card>
  );
  return (
    <Card style={{ padding:isMobile?16:28 }}>
      <h2 style={{ fontWeight:900, fontSize:20, color:T.text, marginBottom:4 }}>🪑 Reserve a Table</h2>
      <p style={{ color:T.subtext, fontSize:13, marginBottom:24 }}>Book at least 2 hours in advance · 1-hour slots · Up to 2 days ahead</p>
      {step===1 && (
        <div>
          <label style={{ display:"block", fontWeight:700, fontSize:14, color:T.text, marginBottom:8 }}>📅 Select Date</label>
          <input type="date" value={date} min={today} onChange={e=>setDate(e.target.value)} style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:`2px solid ${date?accent:T.border}`, background:T.inputBg, color:T.inputText, fontSize:14, boxSizing:"border-box" as const, outline:"none" }} />
          {date && (
            <div style={{ marginTop:20 }}>
              <label style={{ display:"block", fontWeight:700, fontSize:14, color:T.text, marginBottom:8 }}>🕐 Select Time</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:8 }}>
                {times.map(t=><button key={t} onClick={()=>setTime(t)} style={{ ...btn(time===t?accent:T.surface2, time===t?"#111":T.text), padding:"9px 6px", fontSize:12, borderRadius:8, fontWeight:time===t?800:500 }}>{t}</button>)}
              </div>
            </div>
          )}
          <button onClick={()=>setStep(2)} disabled={!date||!time} style={{ ...btn(!date||!time?T.surface2:accent, !date||!time?T.subtext:"#111"), width:"100%", padding:"13px 0", marginTop:24, fontSize:14, fontWeight:900 }}>Continue →</button>
        </div>
      )}
      {step===2 && (
        <div>
          <div style={{ background:T.surface2, borderRadius:12, padding:14, marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:T.subtext }}><span>📅 {new Date(date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span><span>🕐 {time}</span></div>
          </div>
          <label style={{ display:"block", fontWeight:700, fontSize:14, color:T.text, marginBottom:16 }}>👥 How many guests?</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
            {[1,2,3,4,5,6,7,8].map(n=><button key={n} onClick={()=>setGuests(n)} style={{ ...btn(guests===n?accent:T.surface2, guests===n?"#111":T.text), padding:"18px 0", borderRadius:12, fontSize:16, fontWeight:guests===n?900:600 }}>{n}{n===8?"+":""}</button>)}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(1)} style={{ ...btn(T.surface2,T.text), flex:1, padding:"13px 0" }}>← Back</button>
            <button onClick={()=>setStep(3)} style={{ ...btn(accent,"#111"), flex:2, padding:"13px 0", fontWeight:900 }}>Continue →</button>
          </div>
        </div>
      )}
      {step===3 && (
        <div>
          <div style={{ background:T.isDark?"#1a1500":"#fffbeb", border:`1px solid ${accent}40`, borderRadius:12, padding:20, marginBottom:20 }}>
            <h3 style={{ fontWeight:800, fontSize:16, color:T.text, marginBottom:12 }}>Reservation Summary</h3>
            {[["📅 Date",new Date(date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})],["🕐 Time",time],["👥 Guests",`${guests} ${guests===1?"person":"people"}`],["💳 Deposit","Required at booking"]].map(([l,v],i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:14 }}><span style={{ color:T.subtext }}>{l}</span><span style={{ fontWeight:700, color:T.text }}>{v}</span></div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(2)} style={{ ...btn(T.surface2,T.text), flex:1, padding:"13px 0" }}>← Back</button>
            <button onClick={()=>setConfirmed(true)} style={{ ...btn(accent,"#111"), flex:2, padding:"13px 0", fontWeight:900 }}>Confirm & Pay Deposit</button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ── StaffApp — wired to real backend ──────────────────────────────────
function StaffApp({ user, page, setPage, sharedOrders, setSharedOrders }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const isManager = user.role==="manager";
  const userLocation = LOCATIONS.find(l=>l.id===user.location)?.name||"Hammond";
  const [apiOrders, setApiOrders] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetch(`/api/orders?date=${today}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setApiOrders(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch("/api/users", { credentials: "include" })
      .then(r => r.json())
      .then(data => setStaffList(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const advance = async (id: number) => {
    const order = apiOrders.find((o: any) => o.id === id);
    if (!order) return;
    const nextStatus = STATUS_NEXT[order.status];
    if (!nextStatus) return;
    await fetch(`/api/orders/${id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify(nextStatus),
    });
    setApiOrders(o => o.map((x: any) => x.id === id ? { ...x, status: nextStatus } : x));
  };

  const myOrders = apiOrders.filter((o: any) => o.status !== "Done");
  const locationStaff = staffList.filter((s: any) =>
    s.roles?.some((r: string) => r === "Staff" || r === "Manager") &&
    s.locationId === user.location
  );

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:isMobile?"16px":"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <h2 style={{ fontWeight:900, fontSize:18, color:T.text, margin:0 }}>
            {page==="orders"?"Live Order Queue":page==="drive-thru"?"Drive-Thru Queue":"Dashboard"}
          </h2>
          <span style={{ background:accent, color:"#111", fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>📍 {userLocation}</span>
        </div>
        {page==="orders" && (
          <div>
            {myOrders.filter((o:any)=>o.type!=="drive-thru").length===0
              ? <div style={{ textAlign:"center", color:T.subtext, padding:40, fontSize:14 }}>No active orders</div>
              : myOrders.filter((o:any)=>o.type!=="drive-thru").map((o:any)=>(
                <Card key={o.id} style={{ padding:16, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap" as const, gap:8 }}>
                    <div>
                      <div style={{ fontWeight:900, fontSize:15, color:T.text }}>{o.userName}</div>
                      <div style={{ color:T.subtext, fontSize:12, marginTop:2 }}>{o.items.map((i:any)=>i.name).join(", ")}</div>
                      <div style={{ color:T.subtext, fontSize:11, marginTop:4 }}>#{o.id} · 📍 {o.locationName} · ${o.total?.toFixed(2)} · {new Date(o.createdAt + "Z").toLocaleTimeString("en-US",{timeZone:"America/Chicago"})}</div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" as const }}>
                      <span style={{ background:STATUS_COLOR[o.status], color:"#fff", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>{o.status}</span>
                      {STATUS_NEXT[o.status]&&<button onClick={()=>advance(o.id)} style={{ ...btn("#2563eb"), padding:"6px 12px", fontSize:11 }}>→ {STATUS_NEXT[o.status]}</button>}
                      {isManager&&<button style={{ ...btn("#fee2e2","#dc2626"), padding:"6px 12px", fontSize:11 }}>Refund</button>}
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        )}
        {page==="drive-thru" && (
          <div>
            {myOrders.filter((o:any)=>o.type==="drive-thru").length===0
              ? <div style={{ textAlign:"center", color:T.subtext, padding:40, fontSize:14 }}>No drive-thru orders</div>
              : myOrders.filter((o:any)=>o.type==="drive-thru").map((o:any)=>(
                <Card key={o.id} style={{ padding:16, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:900, fontSize:15, color:T.text }}>{o.userName}</div>
                      <div style={{ color:T.subtext, fontSize:12 }}>{o.items.map((i:any)=>i.name).join(", ")}</div>
                      <div style={{ color:T.subtext, fontSize:11, marginTop:4 }}>📍 {o.locationName} · ${o.total?.toFixed(2)}</div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ background:STATUS_COLOR[o.status], color:"#fff", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>{o.status}</span>
                      {STATUS_NEXT[o.status]&&<button onClick={()=>advance(o.id)} style={{ ...btn("#2563eb"), padding:"6px 12px", fontSize:11 }}>→ {STATUS_NEXT[o.status]}</button>}
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        )}
        {page==="dashboard" && isManager && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
              {[
                {l:"Today's Orders", v:myOrders.length,                                                                    i:"📦"},
                {l:"Revenue Today",  v:"$"+myOrders.reduce((s:number,o:any)=>s+(o.total||0),0).toFixed(0),                i:"💰"},
                {l:"Drive-Thru",     v:myOrders.filter((o:any)=>o.type==="drive-thru").length,                             i:"🚗"},
                {l:"Staff On Shift", v:STAFF_ROSTER.filter(s=>s.loc===userLocation&&s.status==="On Shift").length,         i:"👥"},
              ].map((s,i)=>(
                <Card key={i} style={{ padding:16, textAlign:"center" }}>
                  <div style={{ fontSize:28 }}>{s.i}</div>
                  <div style={{ fontWeight:900, fontSize:20, color:accent }}>{s.v}</div>
                  <div style={{ fontSize:11, color:T.subtext }}>{s.l}</div>
                </Card>
              ))}
            </div>
            <Card style={{ padding:20 }}>
              <div style={{ fontWeight:800, fontSize:14, color:T.text, marginBottom:14 }}>👥 Staff at {userLocation}</div>
              {locationStaff.length===0
                ? <div style={{ color:T.subtext, fontSize:13, textAlign:"center", padding:"16px 0" }}>No staff found for this location</div>
                : locationStaff.map((s:any, i:number) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<locationStaff.length-1?`1px solid ${T.border}`:"none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:T.surface2, display:"flex", alignItems:"center", justifyContent:"center" }}>👤</div>
                      <div>
                        <div style={{ fontWeight:700, color:T.text }}>{s.name || s.userName}</div>
                        <div style={{ color:T.subtext, fontSize:12 }}>{s.roles?.[0]}</div>
                      </div>
                    </div>
                    <span style={{ background:"#dcfce7", color:"#16a34a", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>On Shift</span>
                  </div>
                ))
              }
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminApp({ sharedOrders, setSharedOrders, page }:any) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [menu,setMenu]     = useState(MENU);
  const [selLoc,setSelLoc] = useState(0);
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const toggle  = (id:number) => setMenu(m=>m.map(x=>x.id===id?{...x,popular:!x.popular}:x));
  const advance = (id:string) => setSharedOrders((o:any[])=>o.map((x:any)=>x.id===id&&STATUS_NEXT[x.status]?{...x,status:STATUS_NEXT[x.status]}:x));

  const filteredOrders = selLoc===0 ? sharedOrders : sharedOrders.filter((o:any)=>o.location===LOCATIONS[selLoc-1]?.name);
  const todayIdx       = new Date().getDay()===0 ? 6 : new Date().getDay()-1;
  const totalRev       = filteredOrders.reduce((s:number,o:any)=>s+(o.total||0),0);
  const dtCount        = filteredOrders.filter((o:any)=>o.type==="drive-thru").length;
  const tablesActive   = filteredOrders.filter((o:any)=>o.type==="dine-in"&&o.status!=="Done").length;
  const hist           = [0,0,0,0,0,0,0];
  const dayData        = hist.map((v:number,i:number)=>i===todayIdx ? Math.max(sharedOrders.length,0) : v);
  const maxDay         = Math.max(...dayData,1);
  const revenueByLoc   = LOCATIONS.map(l=>({ name:l.name, rev:sharedOrders.filter((o:any)=>o.location===l.name).reduce((s:number,o:any)=>s+(o.total||0),0) }));
  const maxLocRev      = Math.max(...revenueByLoc.map(l=>l.rev),1);
  const itemCounts:Record<string,number> = {};
  sharedOrders.forEach((o:any)=>o.items.forEach((it:any)=>{ itemCounts[it.name]=(itemCounts[it.name]||0)+1; }));
  const topItems = Object.entries(itemCounts).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const sellers  = topItems.map(([name,cnt])=>({name,cnt:cnt as number}));
  const maxSell  = sellers.length>0 ? sellers[0].cnt : 1;
  const showLocFilter = ["dashboard","orders","staff"].includes(page);

  return (
    <div style={{ minHeight:"100vh", background:T.sectionBg }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:isMobile?"16px":"24px" }}>
        {showLocFilter && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" as const }}>
            <span style={{ color:T.subtext, fontSize:13, fontWeight:700 }}>📍 Viewing:</span>
            {["All Locations",...LOCATIONS.map(l=>l.name)].map((l,i)=>(
              <button key={i} onClick={()=>setSelLoc(i)} style={{ ...btn(selLoc===i?accent:T.surface2, selLoc===i?"#111":T.subtext), padding:"6px 14px", fontSize:12, borderRadius:20, fontWeight:selLoc===i?800:500 }}>{l}</button>
            ))}
          </div>
        )}
        {page==="dashboard" && (
          <div>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>📊 Overview — {selLoc===0?"All Locations":LOCATIONS[selLoc-1].name}</h2>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:isMobile?10:14, marginBottom:20 }}>
              {[
                {l:"Orders Today",  v:filteredOrders.length,   i:"📦"},
                {l:"Revenue",       v:"$"+totalRev.toFixed(0), i:"💰"},
                {l:"Tables Active", v:tablesActive+" active",  i:"🪑"},
                {l:"Drive-Thru",    v:dtCount,                 i:"🚗"},
              ].map((s,i)=>(
                <Card key={i} style={{ padding:isMobile?14:20, textAlign:"center" }}>
                  <div style={{ fontSize:isMobile?24:28 }}>{s.i}</div>
                  <div style={{ fontWeight:900, fontSize:isMobile?18:22, color:accent }}>{s.v}</div>
                  <div style={{ fontSize:11, color:T.subtext }}>{s.l}</div>
                </Card>
              ))}
            </div>
            <Card style={{ padding:isMobile?14:20, marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:14, color:T.text, marginBottom:16 }}>📅 Orders by Day This Week</div>
              {sharedOrders.length===0
                ? <div style={{ textAlign:"center", color:T.subtext, padding:"20px 0", fontSize:13 }}>No orders yet — data appears here as customers order</div>
                : <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120, padding:"0 4px" }}>
                    {days.map((d,i)=>(
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column" as const, alignItems:"center", gap:4 }}>
                        <div style={{ color:T.subtext, fontSize:10 }}>{dayData[i]}</div>
                        <div style={{ width:"100%", background:i===todayIdx?accent:"#4b5563", borderRadius:"4px 4px 0 0", height:`${(dayData[i]/maxDay)*90}%`, minHeight:4, transition:"height .3s" }} />
                        <div style={{ color:i===todayIdx?accent:T.subtext, fontSize:11, fontWeight:i===todayIdx?800:400 }}>{d}</div>
                      </div>
                    ))}
                  </div>
              }
            </Card>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:14 }}>
              <Card style={{ padding:isMobile?14:20 }}>
                <div style={{ fontWeight:800, fontSize:14, color:T.text, marginBottom:12 }}>🔥 Top Sellers</div>
                {sellers.length===0
                  ? <div style={{ color:T.subtext, fontSize:13, textAlign:"center", padding:"16px 0" }}>No orders yet</div>
                  : sellers.map((x,i)=>(
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3, color:T.text }}><span>{x.name}</span><span style={{ color:T.subtext }}>{x.cnt} order{x.cnt!==1?"s":""}</span></div>
                      <div style={{ background:T.surface2, borderRadius:4, height:6 }}><div style={{ background:accent, width:`${(x.cnt/maxSell)*100}%`, height:"100%", borderRadius:4 }} /></div>
                    </div>
                  ))
                }
              </Card>
              <Card style={{ padding:isMobile?14:20 }}>
                <div style={{ fontWeight:800, fontSize:14, color:T.text, marginBottom:12 }}>📍 Revenue by Location</div>
                {sharedOrders.length===0
                  ? <div style={{ color:T.subtext, fontSize:13, textAlign:"center", padding:"16px 0" }}>No orders yet</div>
                  : revenueByLoc.map((l,i)=>(
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3, color:T.text }}><span>{l.name}</span><span style={{ color:accent, fontWeight:700 }}>${l.rev.toFixed(0)}</span></div>
                      <div style={{ background:T.surface2, borderRadius:4, height:6 }}><div style={{ background:accent, width:`${(l.rev/maxLocRev)*100}%`, height:"100%", borderRadius:4 }} /></div>
                    </div>
                  ))
                }
              </Card>
            </div>
          </div>
        )}
        {page==="menu" && (
          <div>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>🍽 Menu Management</h2>
            {menu.map(item=>(
              <Card key={item.id} style={{ display:"flex", alignItems:"center", gap:isMobile?10:14, padding:isMobile?12:14, marginBottom:10 }}>
                <img src={item.img} alt={item.name} style={{ width:44, height:44, borderRadius:10, objectFit:"cover", flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:isMobile?12:14, color:T.text }}>{item.name}</div>
                  <div style={{ color:T.subtext, fontSize:11 }}>{item.cat} · ${item.price.toFixed(2)}</div>
                </div>
                <button onClick={()=>toggle(item.id)} style={{ ...btn(item.popular?accent:T.surface2, item.popular?"#111":T.subtext), padding:"5px 10px", fontSize:10, whiteSpace:"nowrap" as const }}>{item.popular?"🔥 Popular":"Set Pop"}</button>
                <button style={{ background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:8, padding:"5px 10px", fontSize:10, cursor:"pointer", fontWeight:700 }}>Disable</button>
              </Card>
            ))}
          </div>
        )}
        {page==="orders" && (
          <div>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>📦 All Orders</h2>
            {filteredOrders.length===0
              ? <div style={{ textAlign:"center", color:T.subtext, padding:40 }}>No orders yet</div>
              : filteredOrders.map((o:any,i:number)=>(
                <Card key={i} style={{ padding:isMobile?12:16, marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap" as const, gap:8 }}>
                    <div>
                      <div style={{ fontWeight:900, fontSize:13, color:T.text }}>{o.customer} — {o.items.map((it:any)=>it.name).join(", ")}</div>
                      <div style={{ color:T.subtext, fontSize:11 }}>{o.id} · {o.type} · 📍 {o.location} · {o.id} · {o.type} · 📍 {o.location} · {o.createdAt ? new Date(o.createdAt).toLocaleTimeString("en-US",{timeZone:"America/Chicago"}) : o.time}</div>
                      {o.type==="drive-thru"&&<span style={{ background:accent, color:"#111", fontSize:10, fontWeight:800, padding:"1px 8px", borderRadius:20 }}>Code: {o.code}</span>}
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ background:STATUS_COLOR[o.status], color:"#fff", fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:20 }}>{o.status}</span>
                      {STATUS_NEXT[o.status]&&<button onClick={()=>advance(o.id)} style={{ ...btn("#2563eb"), padding:"6px 12px", fontSize:11 }}>→ {STATUS_NEXT[o.status]}</button>}
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        )}
        {page==="locations" && <LocationsPage isAdmin />}
        {page==="staff" && (
          <div>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>👥 Staff</h2>
            {STAFF_ROSTER.filter(s=>selLoc===0||s.loc===LOCATIONS[selLoc-1]?.name).map((s,i)=>(
              <Card key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:isMobile?12:16, marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:T.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👤</div>
                  <div><div style={{ fontWeight:700, fontSize:13, color:T.text }}>{s.n}</div><div style={{ color:T.subtext, fontSize:11 }}>{s.role} · 📍 {s.loc}</div></div>
                </div>
                <span style={{ background:s.status==="On Shift"?T.isDark?"#14291a":"#dcfce7":s.status==="Break"?"#fef3c7":T.surface2, color:s.status==="On Shift"?"#16a34a":s.status==="Break"?"#92400e":T.subtext, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>{s.status}</span>
              </Card>
            ))}
          </div>
        )}
        {page==="settings" && (
          <Card style={{ padding:isMobile?16:24 }}>
            <h2 style={{ fontWeight:900, fontSize:18, color:T.text, marginBottom:16 }}>⚙️ Settings</h2>
            {[["Drive-Thru","Enabled"],["Table Reservations","Enabled"],["Online Ordering","Enabled"],["Rewards Program","Enabled"],["Loyalty Points","Enabled"]].map(([k,v],i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:14, color:T.text }}>{k}</span>
                <span style={{ background:v==="Enabled"?T.isDark?"#14291a":"#dcfce7":T.surface2, color:v==="Enabled"?"#16a34a":T.subtext, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>{v}</span>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

function LocationsPage({ isAdmin=false }:{ isAdmin?:boolean }) {
  const T = useTheme();
  const isMobile = useIsMobile();
  const [selected,setSelected] = useState<number|null>(null);
  return (
    <div>
      {!isAdmin && (
        <div style={{ background:T.isDark?"#0a0a0a":"#1a1a1a", padding:isMobile?"28px 16px":"36px 24px", textAlign:"center" as const }}>
          <div style={{ display:"inline-block", background:accent, color:"#111", fontSize:11, fontWeight:800, padding:"4px 14px", borderRadius:20, marginBottom:10 }}>3 LOCATIONS</div>
          <h1 style={{ color:"#fff", fontWeight:900, fontSize:isMobile?20:26, margin:0 }}>Find a Caffeinated Lions</h1>
          <p style={{ color:"#aaa", fontSize:13, marginTop:6 }}>Hammond · New York · New Orleans</p>
        </div>
      )}
      <div style={{ maxWidth:900, margin:"0 auto", padding:isMobile?"16px":"24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:isMobile?12:16, marginBottom:20 }}>
          {LOCATIONS.map(loc=>(
            <div key={loc.id} onClick={()=>setSelected(selected===loc.id?null:loc.id)}
              style={{ background:T.card, borderRadius:14, border:`2px solid ${selected===loc.id?accent:T.border}`, padding:isMobile?16:20, cursor:"pointer", boxShadow:T.shadow }}>
              <div style={{ fontWeight:900, fontSize:16, color:T.text, marginBottom:4 }}>📍 {loc.name}</div>
              <div style={{ color:T.subtext, fontSize:13 }}>{loc.addr}</div>
              <div style={{ color:T.subtext, fontSize:12, marginBottom:4 }}>{loc.city}</div>
              <div style={{ color:T.subtext, fontSize:12, marginBottom:4 }}>📞 {loc.phone}</div>
              <div style={{ color:T.subtext, fontSize:12, marginBottom:14 }}>🕐 {loc.hours}</div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ ...btn(accent,"#111"), flex:1, padding:"9px 0", fontSize:12, fontWeight:800 }}>Order Here</button>
                <button style={{ ...btn(T.surface2,T.subtext), flex:1, padding:"9px 0", fontSize:12 }}>Directions</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user,         setUser]         = useState<any>(null);
  const [page,         setPage]         = useState(() => window.location.hash.replace("#","") || "home");
  const [history,      setHistory]      = useState<string[]>([]);
  const [isDark,       setIsDark]       = useState(false);
  const [sharedOrders, setSharedOrders] = useState<any[]>([]);
  const T = { ...getTheme(isDark), isDark, setIsDark };

  const navigate = (p:string) => { setHistory(h=>[...h,page]); setPage(p); window.history.pushState({page:p},"",`#${p}`); };
  const goBack   = () => { window.history.back(); };

  useEffect(()=>{
    const handlePop = () => { const p=window.location.hash.replace("#","")||"home"; setPage(p); setHistory(h=>h.length>0?h.slice(0,-1):h); };
    window.history.replaceState({page},"",`#${page}`);
    window.addEventListener("popstate",handlePop);
    return ()=>window.removeEventListener("popstate",handlePop);
  },[]);

  const handleLogin  = (u:any) => { setUser(u); navigate(u.role==="staff"||u.role==="manager"?"orders":u.role==="admin"?"dashboard":"menu"); };
  const handleLogout = () => { setUser(null); setHistory([]); setPage("home"); window.history.pushState({page:"home"},"","#home"); };

  const customerPages = ["menu","drive-thru","reservations","track","rewards","locations"];
  const staffPages    = ["orders","drive-thru","dashboard"];

  return (
    <ThemeContext.Provider value={T}>
      <div style={{ fontFamily:"sans-serif", minHeight:"100vh", background:T.bg, color:T.text, transition:"background .3s,color .3s" }}>
        <Nav user={user} page={page} setPage={navigate} onLogout={handleLogout} history={history} goBack={goBack} />
        {!user && page==="home"      && <GuestHome setPage={navigate} />}
        {!user && page==="menu"      && <GuestMenuPage setPage={navigate} />}
        {!user && page==="login"     && <Login onLogin={handleLogin} setPage={navigate} mode="login" />}
        {!user && page==="signup"    && <Login onLogin={handleLogin} setPage={navigate} mode="signup" />}
        {!user && page==="locations" && <LocationsPage />}
        {!user && page==="rewards"   && <RewardsPage user={null} setPage={navigate} />}
        {user && page==="home"       && <GuestHome setPage={navigate} />}
        {user?.role==="customer" && customerPages.includes(page) && <CustomerApp user={user} setUser={setUser} page={page} setPage={navigate} sharedOrders={sharedOrders} setSharedOrders={setSharedOrders} />}
        {(user?.role==="staff"||user?.role==="manager") && staffPages.includes(page) && <StaffApp user={user} page={page} setPage={navigate} sharedOrders={sharedOrders} setSharedOrders={setSharedOrders} />}
        {user?.role==="admin" && <AdminApp sharedOrders={sharedOrders} setSharedOrders={setSharedOrders} page={page} />}
      </div>
    </ThemeContext.Provider>
  );
}