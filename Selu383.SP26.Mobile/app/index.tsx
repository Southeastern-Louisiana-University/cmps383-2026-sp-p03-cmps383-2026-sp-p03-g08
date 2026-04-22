import { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Image,
  StyleSheet, Dimensions, StatusBar, Modal, Platform, Animated,
  Switch, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const accent  = "#fcd34d";
const gold    = "#C8973A";
const API_URL = "https://selu383-sp26-p03-g08.azurewebsites.net";

const logoImg = require("../assets/logo/logo.png");
const heroImg = require("../assets/logo/hero.jpg");

// ── API Helpers ───────────────────────────────────────────────────────
const api = {
  login: async (userName: string, password: string) => {
    const res = await fetch(`${API_URL}/api/authentication/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userName, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials.");
    return res.json();
  },
  register: async (userName: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/authentication/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userName, email, password }),
    });
    if (!res.ok) throw new Error("Registration failed. Username may already be taken.");
    return res.json();
  },
  logout: async () => {
    await fetch(`${API_URL}/api/authentication/logout`, {
      method: "POST",
      credentials: "include",
    });
  },
  me: async () => {
    const res = await fetch(`${API_URL}/api/authentication/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  },
  getMenu: async () => {
    const res = await fetch(`${API_URL}/api/menu`);
    if (!res.ok) return [];
    return res.json();
  },
  getLocations: async () => {
    const res = await fetch(`${API_URL}/api/locations`);
    if (!res.ok) return [];
    return res.json();
  },
  createOrder: async (locationId: number, total: number, items: any[]) => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        locationId,
        total,
        items: items.map(i => ({ name: i.name, price: i.price })),
      }),
    });
    if (!res.ok) throw new Error("Order failed.");
    return res.json();
  },
  getMyOrders: async () => {
    const res = await fetch(`${API_URL}/api/orders/my`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  },
  getPoints: async () => {
    const res = await fetch(`${API_URL}/api/users/points`, {
      credentials: "include",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.points ?? 0;
  },
};

// ── Image/Category mapping (frontend display only) ────────────────────
const MENU_IMAGES: Record<string, { img: string; cat: string; popular: boolean; orders: number }> = {
  "Classic Latte":    { img:"https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&q=80", cat:"Hot Coffee",  popular:true,  orders:142 },
  "Cappuccino":       { img:"https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80", cat:"Hot Coffee",  popular:true,  orders:118 },
  "Iced Latte":       { img:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80", cat:"Iced Coffee", popular:true,  orders:203 },
  "Matcha Latte":     { img:"https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80", cat:"Iced Coffee", popular:false, orders:87  },
  "Croissant":        { img:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80", cat:"Food",        popular:false, orders:64  },
  "Cheesecake Slice": { img:"https://images.unsplash.com/photo-1567327613485-fbc7bf196198?w=400&q=80", cat:"Food",        popular:true,  orders:95  },
  "Americano":        { img:"https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=80", cat:"Hot Coffee",  popular:false, orders:76  },
  "Blueberry Muffin": { img:"https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80", cat:"Food",        popular:false, orders:58  },
};

const DEFAULT_MENU_META = { img:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", cat:"Other", popular:false, orders:0 };

function enrichMenuItem(item: any) {
  const meta = MENU_IMAGES[item.name] ?? DEFAULT_MENU_META;
  return { ...item, ...meta };
}

// ── Theme ─────────────────────────────────────────────────────────────
function getTheme(isDark: boolean) {
  return {
    isDark,
    bg:          isDark ? "#0f0f0f" : "#f9fafb",
    surface:     isDark ? "#1c1c1c" : "#ffffff",
    surface2:    isDark ? "#252525" : "#f0f0f0",
    card:        isDark ? "#1c1c1c" : "#ffffff",
    border:      isDark ? "#333333" : "#e5e7eb",
    text:        isDark ? "#f5f5f5" : "#111111",
    subtext:     isDark ? "#999999" : "#555555",
    navBg:       isDark ? "#0a0a0a" : "#ffffff",
    inputBg:     isDark ? "#2a2a2a" : "#f3f4f6",
    inputBorder: isDark ? "#3a3a3a" : "#d1d5db",
    inputText:   isDark ? "#ffffff" : "#111111",
    sectionBg:   isDark ? "#111111" : "#f9fafb",
  };
}

// ── Fallback static data (used only if API fails) ─────────────────────
const FALLBACK_MENU = [
  { id:1, name:"Classic Latte",    price:4.50, description:"" },
  { id:2, name:"Cappuccino",       price:4.75, description:"" },
  { id:3, name:"Iced Latte",       price:5.00, description:"" },
  { id:4, name:"Matcha Latte",     price:5.25, description:"" },
  { id:5, name:"Croissant",        price:3.25, description:"" },
  { id:6, name:"Cheesecake Slice", price:4.00, description:"" },
  { id:7, name:"Americano",        price:3.75, description:"" },
  { id:8, name:"Blueberry Muffin", price:3.50, description:"" },
].map(enrichMenuItem);

const FALLBACK_LOCATIONS = [
  { id:1, name:"Hammond"     },
  { id:2, name:"New York"    },
  { id:3, name:"New Orleans" },
];

const STAFF_ROSTER = [
  {n:"Sara L.",   role:"Staff",   loc:"Hammond",     status:"On Shift"},
  {n:"James R.",  role:"Staff",   loc:"Hammond",     status:"On Shift"},
  {n:"Mike A.",   role:"Manager", loc:"Hammond",     status:"On Shift"},
  {n:"Carol T.",  role:"Staff",   loc:"New York",    status:"Break"},
  {n:"David M.",  role:"Staff",   loc:"New York",    status:"On Shift"},
  {n:"Eve S.",    role:"Manager", loc:"New Orleans", status:"On Shift"},
  {n:"Frank B.",  role:"Staff",   loc:"New Orleans", status:"On Shift"},
];

const STATUS_NEXT  = { Pending:"Preparing", Preparing:"Ready", Ready:"Done" } as Record<string,string>;
const STATUS_COLOR = { Pending:"#f59e0b", Preparing:"#3b82f6", Ready:"#16a34a", Done:"#9ca3af" } as Record<string,string>;
const ROLE_COLOR   = { customer:"#16a34a", User:"#16a34a", staff:"#2563eb", Staff:"#2563eb", manager:"#7c3aed", Manager:"#7c3aed", admin:"#dc2626", Admin:"#dc2626" } as Record<string,string>;

const ptsForSpend  = (amt: number) => Math.floor(amt * 10);
const ptsCostFor   = (amt: number) => Math.ceil(amt * 100);
const ptsToDollars = (pts: number) => (pts / 100).toFixed(2);

function getRoleKey(roles: string[] | string | undefined): string {
  if (!roles) return "customer";
  const arr = Array.isArray(roles) ? roles : [roles];
  if (arr.some(r => r.toLowerCase() === "admin"))   return "admin";
  if (arr.some(r => r.toLowerCase() === "manager")) return "manager";
  if (arr.some(r => r.toLowerCase() === "staff"))   return "staff";
  return "customer";
}

// ── Shared Components ─────────────────────────────────────────────────
function Card({ children, style, T }: any) {
  return (
    <View style={[{ backgroundColor:T.card, borderRadius:14, borderWidth:1, borderColor:T.border,
      shadowColor:"#000", shadowOpacity:0.06, shadowRadius:6, elevation:2, overflow:"hidden" }, style]}>
      {children}
    </View>
  );
}

function GoldBtn({ label, onPress, style, disabled=false }: any) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}
      style={[{ backgroundColor:disabled?"#9ca3af":accent, borderRadius:8, paddingVertical:12,
        paddingHorizontal:20, alignItems:"center" as const }, style]}>
      <Text style={{ color:"#111", fontWeight:"700", fontSize:14 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function OutlineBtn({ label, onPress, style, T }: any) {
  return (
    <TouchableOpacity onPress={onPress}
      style={[{ borderRadius:8, borderWidth:2, borderColor:accent, paddingVertical:10,
        paddingHorizontal:20, alignItems:"center" as const }, style]}>
      <Text style={{ color:accent, fontWeight:"700", fontSize:13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function BottomNav({ tabs, active, setActive, T }: any) {
  return (
    <View style={{ flexDirection:"row", backgroundColor:T.navBg, borderTopWidth:1, borderTopColor:T.border,
      paddingBottom:Platform.OS==="ios"?20:8, paddingTop:8 }}>
      {tabs.map((t:any) => (
        <TouchableOpacity key={t.val} onPress={() => setActive(t.val)}
          style={{ flex:1, alignItems:"center", paddingVertical:4 }}>
          {active===t.val && <View style={{ position:"absolute", top:0, width:"60%", height:2,
            backgroundColor:accent, borderRadius:2 }} />}
          <Text style={{ fontSize:20 }}>{t.icon}</Text>
          <Text style={{ fontSize:10, fontWeight:"700", color:active===t.val?accent:T.subtext, marginTop:2 }}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Payment Modal ─────────────────────────────────────────────────────
function PaymentModal({ total, onPay, onClose, user, T }: any) {
  const [method, setMethod] = useState("card");
  const [card,   setCard]   = useState({ num:"", exp:"", cvv:"", name:"" });
  const [err,    setErr]    = useState("");
  const tax      = (total * 0.0875).toFixed(2);
  const grand    = (total + parseFloat(tax)).toFixed(2);
  const ptsCost  = ptsCostFor(total);
  const hasEnoughPts = (user?.points||0) >= ptsCost;
  const payDisabled  = method==="points" && !hasEnoughPts;

  const pay = () => {
    if (method==="card") {
      if (card.num.replace(/\s/g,"").length < 16) { setErr("Please enter a valid card number."); return; }
      if (!card.exp)       { setErr("Please enter an expiry date."); return; }
      if (card.cvv.length < 3) { setErr("Please enter a valid CVV."); return; }
      if (!card.name)      { setErr("Please enter the name on the card."); return; }
    }
    if (method==="points" && !hasEnoughPts) { setErr("Not enough points."); return; }
    onPay(method);
  };

  const fmtCard = (v:string) => v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);
  const fmtExp  = (v:string) => v.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1/$2").slice(0,5);

  return (
    <Modal transparent animationType="slide">
      <View style={s.overlay}>
        <ScrollView style={{ width:"100%" }} contentContainerStyle={{ alignItems:"center", padding:20 }}>
          <View style={[s.modalBox, { backgroundColor:T.card, width:"100%" }]}>
            <Text style={[s.modalTitle, { color:T.text }]}>💳 Payment</Text>
            <Text style={[s.modalSub, { color:T.subtext }]}>Complete your order</Text>
            <View style={{ backgroundColor:T.surface2, borderRadius:10, padding:14, marginBottom:16 }}>
              <View style={s.row}><Text style={{ color:T.subtext, fontSize:13 }}>Subtotal</Text><Text style={{ color:T.subtext, fontSize:13 }}>${total.toFixed(2)}</Text></View>
              <View style={s.row}><Text style={{ color:T.subtext, fontSize:13 }}>Tax (8.75%)</Text><Text style={{ color:T.subtext, fontSize:13 }}>${tax}</Text></View>
              <View style={[s.row, { marginTop:6 }]}>
                <Text style={{ fontWeight:"900", fontSize:15, color:T.text }}>Total</Text>
                <Text style={{ fontWeight:"900", fontSize:15, color:accent }}>${grand}</Text>
              </View>
            </View>
            <Text style={{ fontWeight:"700", fontSize:13, color:T.text, marginBottom:10 }}>Payment Method</Text>
            <View style={{ flexDirection:"row", gap:8, marginBottom:16 }}>
              {[{v:"card",l:"💳 Card"},{v:"points",l:"⭐ Points"},{v:"apple",l:"🍎 Apple Pay"}].map(m=>(
                <TouchableOpacity key={m.v} onPress={()=>{ setMethod(m.v); setErr(""); }}
                  style={{ flex:1, backgroundColor:method===m.v?accent:T.surface2, borderRadius:8, padding:10, alignItems:"center" }}>
                  <Text style={{ color:method===m.v?"#111":T.subtext, fontWeight:"700", fontSize:11 }}>{m.l}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {method==="card" && (
              <View>
                <TextInput placeholder="Name on card" placeholderTextColor={T.subtext} value={card.name}
                  onChangeText={v=>setCard({...card,name:v})}
                  style={[s.input, { backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText, marginBottom:10 }]} />
                <TextInput placeholder="Card number" placeholderTextColor={T.subtext} value={card.num}
                  onChangeText={v=>setCard({...card,num:fmtCard(v)})} keyboardType="numeric"
                  style={[s.input, { backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText, marginBottom:10 }]} />
                <View style={{ flexDirection:"row", gap:10 }}>
                  <TextInput placeholder="MM/YY" placeholderTextColor={T.subtext} value={card.exp}
                    onChangeText={v=>setCard({...card,exp:fmtExp(v)})} keyboardType="numeric"
                    style={[s.input, { flex:1, backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText }]} />
                  <TextInput placeholder="CVV" placeholderTextColor={T.subtext} value={card.cvv}
                    onChangeText={v=>setCard({...card,cvv:v.slice(0,4)})} keyboardType="numeric" secureTextEntry
                    style={[s.input, { width:80, backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText }]} />
                </View>
              </View>
            )}
            {method==="points" && (
              <View style={{ backgroundColor:T.isDark?"#1a1500":"#fffbeb", borderRadius:10, padding:14,
                borderWidth:1, borderColor:hasEnoughPts?`${accent}40`:"#fca5a5" }}>
                <Text style={{ fontWeight:"700", color:"#92400e", fontSize:14 }}>⭐ Pay with loyalty points</Text>
                <View style={[s.row, { marginTop:8 }]}>
                  <Text style={{ color:"#92400e", fontSize:13 }}>Cost</Text>
                  <Text style={{ color:"#92400e", fontWeight:"800", fontSize:13 }}>{ptsCost.toLocaleString()} pts</Text>
                </View>
                <View style={s.row}>
                  <Text style={{ color:"#92400e", fontSize:13 }}>Your balance</Text>
                  <Text style={{ color:"#92400e", fontWeight:"800", fontSize:13 }}>{(user?.points||0).toLocaleString()} pts</Text>
                </View>
                {!hasEnoughPts && <Text style={{ color:"#dc2626", fontSize:12, fontWeight:"700", marginTop:8 }}>
                  ⚠️ You need {(ptsCost-(user?.points||0)).toLocaleString()} more pts.</Text>}
              </View>
            )}
            {method==="apple" && (
              <View style={{ backgroundColor:T.surface2, borderRadius:10, padding:14, alignItems:"center" }}>
                <Text style={{ fontWeight:"700", color:T.text, fontSize:14 }}>🍎 Apple Pay</Text>
                <Text style={{ color:T.subtext, fontSize:12, marginTop:4 }}>Confirm with Face ID or Touch ID</Text>
              </View>
            )}
            {!!err && <Text style={{ color:"#dc2626", fontSize:12, marginTop:10 }}>{err}</Text>}
            <View style={{ flexDirection:"row", gap:10, marginTop:20 }}>
              <TouchableOpacity onPress={onClose} style={{ flex:1, backgroundColor:T.surface2, borderRadius:8, padding:12, alignItems:"center" }}>
                <Text style={{ color:T.text, fontWeight:"700" }}>Cancel</Text>
              </TouchableOpacity>
              <GoldBtn label={`Pay $${grand}`} onPress={pay} disabled={payDisabled} style={{ flex:2 }} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Receipt Modal ─────────────────────────────────────────────────────
function ReceiptModal({ order, onClose, T }: any) {
  const tax      = (order.total * 0.0875).toFixed(2);
  const grand    = (order.total + parseFloat(tax)).toFixed(2);
  const receiptNo= "RCP-" + Math.floor(Math.random()*900000+100000);
  const usedPts  = order.payMethod === "points";
  const ptsCost  = ptsCostFor(order.total);
  return (
    <Modal transparent animationType="slide">
      <View style={s.overlay}>
        <View style={[s.modalBox, { backgroundColor:T.card, maxHeight:"85%" }]}>
          <ScrollView>
            <Text style={{ fontSize:36, textAlign:"center" }}>🧾</Text>
            <Text style={[s.modalTitle, { color:T.text }]}>Order Confirmed!</Text>
            <Text style={[s.modalSub, { color:T.subtext }]}>Receipt #{receiptNo}</Text>
            <View style={{ backgroundColor:T.isDark?"#14291a":"#f0fdf4", borderRadius:10, padding:12, marginBottom:12 }}>
              <Text style={{ color:"#16a34a", fontWeight:"700", fontSize:13 }}>
                ✅ {order.payMethod==="card"?"Card":order.payMethod==="points"?"Points":"Apple Pay"} Payment
              </Text>
            </View>
            <View style={[s.dashed, { borderColor:T.border }]} />
            {order.items.map((item:any, i:number) => (
              <View key={i} style={s.row}>
                <Text style={{ fontSize:13, color:T.text, fontWeight:"600" }}>{item.name}</Text>
                <Text style={{ fontSize:13, color:T.text }}>${item.price.toFixed(2)}</Text>
              </View>
            ))}
            <View style={[s.dashed, { borderColor:T.border }]} />
            <View style={s.row}><Text style={{ color:T.subtext, fontSize:13 }}>Subtotal</Text><Text style={{ color:T.subtext, fontSize:13 }}>${order.total.toFixed(2)}</Text></View>
            <View style={s.row}><Text style={{ color:T.subtext, fontSize:13 }}>Tax (8.75%)</Text><Text style={{ color:T.subtext, fontSize:13 }}>${tax}</Text></View>
            <View style={[s.row, { marginTop:8 }]}>
              <Text style={{ fontWeight:"900", fontSize:16, color:T.text }}>Total Paid</Text>
              <Text style={{ fontWeight:"900", fontSize:16, color:accent }}>${grand}</Text>
            </View>
            <View style={{ backgroundColor:T.isDark?"#1a1500":"#fffbeb", borderRadius:8, padding:10, marginTop:12, flexDirection:"row", justifyContent:"space-between" }}>
              <Text style={{ color:"#92400e", fontWeight:"700", fontSize:13 }}>{usedPts?"⭐ Points Used":"⭐ Points Earned"}</Text>
              <Text style={{ color:usedPts?"#dc2626":"#92400e", fontWeight:"800", fontSize:13 }}>
                {usedPts?`-${ptsCost.toLocaleString()} pts`:`+${ptsForSpend(order.total)} pts`}
              </Text>
            </View>
            <GoldBtn label="Close" onPress={onClose} style={{ marginTop:16 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Drive-Thru Code Modal ─────────────────────────────────────────────
function DriveThruModal({ code, order, onClose, T }: any) {
  const [arrived, setArrived] = useState(false);
  return (
    <Modal transparent animationType="slide">
      <View style={s.overlay}>
        <View style={[s.modalBox, { backgroundColor:T.card, alignItems:"center" }]}>
          <Text style={{ fontSize:48, marginBottom:8 }}>🚗</Text>
          <Text style={[s.modalTitle, { color:T.text }]}>Your Drive-Thru Code</Text>
          <Text style={[s.modalSub, { color:T.subtext }]}>Show this to staff when you pull up</Text>
          <View style={{ backgroundColor:T.isDark?"#1a1500":"#fffbeb", borderRadius:16, padding:24, marginVertical:16,
            borderWidth:3, borderColor:accent, width:"100%", alignItems:"center" }}>
            <Text style={{ fontSize:40, fontWeight:"900", letterSpacing:8, color:T.text }}>{code}</Text>
            <Text style={{ color:T.subtext, fontSize:12, marginTop:6 }}>Order {order.id}</Text>
          </View>
          {!arrived
            ? <GoldBtn label="🟢 I'm Here!" onPress={()=>setArrived(true)} style={{ width:"100%", marginBottom:10, backgroundColor:"#16a34a" }} />
            : <View style={{ backgroundColor:"#dcfce7", borderRadius:12, padding:14, width:"100%", alignItems:"center", marginBottom:10 }}>
                <Text style={{ fontWeight:"800", color:"#15803d" }}>✅ Staff has been notified!</Text>
              </View>
          }
          <TouchableOpacity onPress={onClose} style={{ backgroundColor:T.surface2, borderRadius:8, padding:12, width:"100%", alignItems:"center" }}>
            <Text style={{ color:T.text, fontWeight:"700" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── App Header ────────────────────────────────────────────────────────
function AppHeader({ user, T, isDark, setIsDark, onLogout }: any) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const roleKey = getRoleKey(user?.roles ?? user?.role);
  return (
    <>
      <View style={[s.appHeader, { backgroundColor:T.navBg, borderBottomColor:T.border }]}>
        <View style={{ flexDirection:"row", alignItems:"center", gap:10 }}>
          <Image source={logoImg} style={{ width:36, height:36, borderRadius:8 }} />
          <View>
            <Text style={[s.appHeaderTitle, { color:accent }]}>Caffeinated Lions</Text>
            {user && <Text style={[s.appHeaderSub, { color:T.subtext }]}>{user.userName ?? user.name} · ⭐ {user.points||0} pts</Text>}
          </View>
        </View>
        <View style={{ flexDirection:"row", gap:8 }}>
          <TouchableOpacity onPress={()=>setSettingsOpen(true)} style={[s.iconBtn, { borderColor:T.border }]}>
            <Text style={{ fontSize:16 }}>⚙️</Text>
          </TouchableOpacity>
          {user && (
            <TouchableOpacity onPress={onLogout} style={[s.iconBtn, { borderColor:T.border }]}>
              <Text style={{ color:T.subtext, fontSize:12 }}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {settingsOpen && (
        <Modal transparent animationType="slide">
          <View style={s.overlay}>
            <View style={[s.modalBox, { backgroundColor:T.card, maxHeight:"85%" }]}>
              <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <Text style={[s.modalTitle, { color:T.text, marginTop:0, textAlign:"left" }]}>⚙️ Settings</Text>
                <TouchableOpacity onPress={()=>setSettingsOpen(false)}>
                  <Text style={{ color:T.subtext, fontSize:20 }}>✕</Text>
                </TouchableOpacity>
              </View>
              {user && (
                <View style={{ backgroundColor:T.surface2, borderRadius:12, padding:14, marginBottom:16, flexDirection:"row", alignItems:"center" }}>
                  <View style={{ width:44, height:44, borderRadius:22, backgroundColor:accent, alignItems:"center", justifyContent:"center" }}>
                    <Text style={{ fontSize:20 }}>👤</Text>
                  </View>
                  <View style={{ marginLeft:12 }}>
                    <Text style={{ fontWeight:"800", fontSize:15, color:T.text }}>{user.userName ?? user.name}</Text>
                    <View style={[s.roleBadge, { backgroundColor:ROLE_COLOR[roleKey]??"#16a34a" }]}>
                      <Text style={s.roleBadgeTxt}>{roleKey.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
              )}
              <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingVertical:14, borderBottomWidth:1, borderBottomColor:T.border }}>
                <Text style={{ fontSize:15, fontWeight:"700", color:T.text }}>{isDark?"🌙 Dark Mode":"☀️ Light Mode"}</Text>
                <Switch value={isDark} onValueChange={setIsDark} trackColor={{ false:"#ddd", true:accent }} thumbColor="#fff" />
              </View>
              <TouchableOpacity onPress={()=>setSettingsOpen(false)} style={{ marginTop:20, alignItems:"center" }}>
                <Text style={{ color:T.subtext }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

// ── Popular Reel ──────────────────────────────────────────────────────
function PopularReel({ onOrder, T, menu }: any) {
  const popular = [...menu].filter((m:any)=>m.popular).sort((a:any,b:any)=>b.orders-a.orders);
  const [active, setActive] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (popular.length === 0) return;
    const t = setInterval(() => {
      Animated.timing(fade, { toValue:0, duration:300, useNativeDriver:true }).start(() => {
        setActive(i => (i+1)%popular.length);
        Animated.timing(fade, { toValue:1, duration:300, useNativeDriver:true }).start();
      });
    }, 3000);
    return () => clearInterval(t);
  }, [popular.length]);

  if (popular.length === 0) return null;

  return (
    <View style={{ backgroundColor:T.isDark?"#0a0a0a":"#1a1a1a", padding:24, alignItems:"center" }}>
      <Text style={{ color:"#aaa", fontSize:11, fontWeight:"800", letterSpacing:2, marginBottom:16 }}>🔥 MOST POPULAR</Text>
      <Animated.View style={{ opacity:fade, alignItems:"center" }}>
        <Image source={{ uri:popular[active].img }} style={{ width:width-80, height:200, borderRadius:16, marginBottom:14 }} />
        <Text style={{ color:"#fff", fontWeight:"900", fontSize:20 }}>{popular[active].name}</Text>
        <Text style={{ color:accent, fontSize:16, fontWeight:"700", marginTop:4 }}>${popular[active].price.toFixed(2)}</Text>
      </Animated.View>
      <View style={{ flexDirection:"row", justifyContent:"center", gap:8, marginTop:14 }}>
        {popular.map((_:any,i:number) => (
          <TouchableOpacity key={i} onPress={() => setActive(i)}
            style={{ width:8, height:8, borderRadius:4, backgroundColor:i===active?accent:"#555" }} />
        ))}
      </View>
      <GoldBtn label="Order Now" onPress={onOrder} style={{ marginTop:20, width:"100%" }} />
    </View>
  );
}

// ── Guest Home ────────────────────────────────────────────────────────
function GuestHome({ onLogin, isDark, setIsDark, menu, locations }: any) {
  const T    = getTheme(isDark);
  const top3 = [...menu].sort((a:any,b:any)=>b.orders-a.orders).slice(0,3);
  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.bg }]}>
      <StatusBar barStyle={isDark?"light-content":"dark-content"} />
      <AppHeader user={null} T={T} isDark={isDark} setIsDark={setIsDark} onLogout={null} />
      <ScrollView>
        <View style={s.hero}>
          <Image source={heroImg} style={s.heroBg} />
          <View style={[s.heroOverlay, { backgroundColor:"rgba(0,0,0,0.55)" }]} />
          <View style={s.heroContent}>
            <Text style={s.heroTitle}>Fuel Your <Text style={{ color:accent }}>Pride</Text>,{"\n"}One Sip at a Time</Text>
            <Text style={s.heroSub}>Order from your table. Skip the line.</Text>
            <GoldBtn label="Order Now" onPress={onLogin} style={{ marginTop:18 }} />
          </View>
        </View>
        <PopularReel onOrder={onLogin} T={T} menu={menu} />
        <View style={{ padding:20, backgroundColor:T.sectionBg }}>
          <Text style={[s.secTitle, { color:T.text }]}>⭐ Most Popular This Week</Text>
          {top3.map((item:any,i:number) => (
            <Card key={item.id} style={{ flexDirection:"row", marginBottom:12 }} T={T}>
              <Image source={{ uri:item.img }} style={s.menuImg} />
              <View style={{ flex:1, padding:12 }}>
                {i===0&&<View style={s.badge}><Text style={s.badgeTxt}>#1 Best Seller</Text></View>}
                <Text style={[s.menuName, { color:T.text }]}>{item.name}</Text>
                <Text style={[s.menuCat, { color:T.subtext }]}>{item.orders} orders · {item.cat}</Text>
                <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                  <Text style={s.menuPrice}>${item.price.toFixed(2)}</Text>
                  <GoldBtn label="Order" onPress={onLogin} style={{ paddingVertical:7, paddingHorizontal:14 }} />
                </View>
              </View>
            </Card>
          ))}
        </View>
        <View style={{ backgroundColor:T.isDark?"#0a0a0a":"#1a1a1a", padding:28, alignItems:"center" }}>
          <Text style={{ color:"#fff", fontWeight:"900", fontSize:20, textAlign:"center", marginBottom:8 }}>🎁 Earn Points on Every Order</Text>
          <Text style={{ color:"#aaa", fontSize:13, textAlign:"center", marginBottom:16 }}>Spend $10 → earn 100 points. 1,000 pts = $10 off!</Text>
          <GoldBtn label="Create Free Account" onPress={onLogin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Login ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onGuest, isDark, setIsDark }: any) {
  const T = getTheme(isDark);
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [err,      setErr]      = useState("");
  const [isSignup, setSign]     = useState(false);
  const [loading,  setLoading]  = useState(false);

  const go = async () => {
    if (!username || !pass) { setErr("Please fill in all fields."); return; }
    setLoading(true);
    setErr("");
    try {
      if (isSignup) {
        if (!email) { setErr("Please enter your email."); setLoading(false); return; }
        const u = await api.register(username, email, pass);
        onLogin({ ...u, points: 0, role: getRoleKey(u.roles) });
      } else {
        const u = await api.login(username, pass);
        // Fetch points separately
        let pts = 0;
        try { pts = await api.getPoints(); } catch {}
        onLogin({ ...u, points: pts, role: getRoleKey(u.roles) });
      }
    } catch (e: any) {
      setErr(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.isDark?"#111":T.bg }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ alignItems:"center", padding:24, paddingTop:48 }}>
        <Image source={logoImg} style={{ width:80, height:80, borderRadius:40, marginBottom:12 }} />
        <Text style={{ color:accent, fontWeight:"900", fontSize:26, marginBottom:4 }}>Caffeinated Lions</Text>
        <Text style={{ color:T.subtext, fontSize:13, marginBottom:32 }}>{isSignup?"Create your account":"Welcome back!"}</Text>
        <View style={{ width:"100%" }}>
          <TextInput value={username} onChangeText={setUsername} placeholder="Username"
            placeholderTextColor={T.subtext} autoCapitalize="none"
            style={[s.input, { backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText }]} />
          {isSignup && (
            <TextInput value={email} onChangeText={setEmail} placeholder="Email"
              placeholderTextColor={T.subtext} keyboardType="email-address" autoCapitalize="none"
              style={[s.input, { backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText, marginTop:10 }]} />
          )}
          <TextInput value={pass} onChangeText={setPass} placeholder="Password"
            placeholderTextColor={T.subtext} secureTextEntry
            style={[s.input, { backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText, marginTop:10 }]} />
          {!!err && <Text style={{ color:"#f87171", fontSize:12, marginTop:6 }}>{err}</Text>}
          {loading
            ? <ActivityIndicator color={accent} style={{ marginTop:16 }} />
            : <GoldBtn label={isSignup?"Create Account":"Sign In"} onPress={go} style={{ marginTop:16 }} />
          }
          <TouchableOpacity onPress={() => { setSign(!isSignup); setErr(""); }} style={{ marginTop:14, alignItems:"center" }}>
            <Text style={{ color:T.subtext, fontSize:13 }}>
              {isSignup?"Already have an account? ":"Don't have an account? "}
              <Text style={{ color:accent, fontWeight:"700" }}>{isSignup?"Sign In":"Sign Up Free"}</Text>
            </Text>
          </TouchableOpacity>
          {onGuest && (
            <TouchableOpacity onPress={onGuest} style={{ marginTop:10, alignItems:"center" }}>
              <Text style={{ color:T.subtext, fontSize:13 }}>Browse as Guest</Text>
            </TouchableOpacity>
          )}

          {/* For Testing Only */}
          <View style={{ marginTop:24, borderTopWidth:1, borderTopColor:T.border, paddingTop:16 }}>
            <View style={{ backgroundColor:T.isDark?"#1a1500":"#fffbeb", borderRadius:8, padding:8,
              marginBottom:10, borderWidth:1, borderColor:`${accent}40`, alignItems:"center" }}>
              <Text style={{ color:"#92400e", fontSize:11, fontWeight:"700" }}>🧪 For Testing Only — Remove Before Launch</Text>
            </View>
            {[
              { label:"Guest Customer",  user:"guest",   pass:"guest123"   },
              { label:"Staff",           user:"staff",   pass:"staff123"   },
              { label:"Manager",         user:"manager", pass:"manager123" },
              { label:"Admin",           user:"admin",   pass:"admin123"   },
            ].map(u => (
              <TouchableOpacity key={u.user} onPress={() => { setUsername(u.user); setPass(u.pass); setErr(""); setSign(false); }}
                style={[s.demoRow, { backgroundColor:T.surface2, borderColor:T.border }]}>
                <Text style={{ color:T.subtext, fontSize:12 }}>{u.label}</Text>
                <Text style={{ color:T.subtext, fontSize:11 }}>{u.user} / {u.pass}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Rewards Screen ────────────────────────────────────────────────────
function RewardsScreen({ user, T }: any) {
  const pts           = user.points ?? 0;
  const tier          = pts>=10000?"🥇 Gold":pts>=5000?"🥈 Silver":"🥉 Bronze";
  const nextMilestone = pts>=10000?15000:pts>=5000?10000:5000;
  return (
    <ScrollView contentContainerStyle={{ padding:16, paddingBottom:20 }}>
      <View style={{ backgroundColor:T.isDark?"#0a0a0a":"#1a1a1a", borderRadius:16, padding:24, marginBottom:16 }}>
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
          <View>
            <Text style={{ color:"#aaa", fontSize:11, fontWeight:"700", textTransform:"uppercase" }}>Your Balance</Text>
            <Text style={{ color:accent, fontSize:52, fontWeight:"900" }}>{pts.toLocaleString()}</Text>
            <Text style={{ color:"#aaa", fontSize:13 }}>points · worth ${ptsToDollars(pts)}</Text>
          </View>
          <View style={{ alignItems:"center" }}>
            <Text style={{ fontSize:48 }}>🏆</Text>
            <Text style={{ color:accent, fontWeight:"800" }}>{tier}</Text>
          </View>
        </View>
        <View style={{ backgroundColor:"rgba(255,255,255,0.15)", borderRadius:4, height:8, marginTop:12 }}>
          <View style={{ backgroundColor:accent, width:`${Math.min((pts/nextMilestone)*100,100)}%` as any, height:8, borderRadius:4 }} />
        </View>
        <Text style={{ color:"#888", fontSize:12, marginTop:6 }}>{(nextMilestone-pts).toLocaleString()} pts to next tier</Text>
        <Text style={{ color:"#aaa", fontSize:12, marginTop:8 }}>💡 Spend $1 → earn 10 pts · 1,000 pts = $10</Text>
      </View>
      <Card style={{ padding:16 }} T={T}>
        <Text style={{ fontWeight:"800", fontSize:16, color:T.text, marginBottom:14 }}>🎁 Redeem Your Points</Text>
        {[{pts:1000,reward:"$10 Off",icon:"☕"},{pts:5000,reward:"$50 Off",icon:"🥤"},{pts:10000,reward:"$100 Off",icon:"🍽️"}].map((r,i) => (
          <View key={i} style={[{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingVertical:14 },
            i<2&&{ borderBottomWidth:1, borderBottomColor:T.border }]}>
            <View style={{ flexDirection:"row", alignItems:"center", gap:12 }}>
              <Text style={{ fontSize:28 }}>{r.icon}</Text>
              <View>
                <Text style={{ fontWeight:"700", fontSize:14, color:T.text }}>{r.reward}</Text>
                <Text style={{ color:T.subtext, fontSize:12 }}>{r.pts.toLocaleString()} pts required</Text>
              </View>
            </View>
            <TouchableOpacity style={{ backgroundColor:pts>=r.pts?accent:T.surface2, borderRadius:8, paddingHorizontal:14, paddingVertical:8 }}>
              <Text style={{ color:pts>=r.pts?"#111":T.subtext, fontWeight:"700", fontSize:12 }}>
                {pts>=r.pts?"Redeem":"🔒 Locked"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

// ── Locations Screen ──────────────────────────────────────────────────
function LocationsScreen({ T, locations }: any) {
  const [sel, setSel] = useState<number|null>(null);
  const LOCATION_DETAILS: Record<string, { addr: string; city: string; phone: string; hours: string }> = {
    "Hammond":     { addr:"110 N Cate St",         city:"Hammond, LA 70403",     phone:"(985) 555-0101", hours:"Mon–Fri 6AM–9PM, Sat–Sun 7AM–8PM" },
    "New York":    { addr:"72 E 1st St",           city:"New York, NY 10003",    phone:"(212) 555-0102", hours:"Mon–Fri 7AM–8PM, Sat–Sun 8AM–7PM" },
    "New Orleans": { addr:"1140 S Carrollton Ave", city:"New Orleans, LA 70118", phone:"(504) 555-0103", hours:"Daily 7AM–9PM" },
  };
  return (
    <ScrollView contentContainerStyle={{ padding:16, paddingBottom:20 }}>
      <Text style={[s.secTitle, { color:T.text }]}>📍 Our Locations</Text>
      {locations.map((loc:any) => {
        const det = LOCATION_DETAILS[loc.name] ?? { addr:"", city:"", phone:"", hours:"" };
        return (
          <TouchableOpacity key={loc.id} onPress={() => setSel(sel===loc.id?null:loc.id)}>
            <Card style={[{ padding:18, marginBottom:12 }, sel===loc.id&&{ borderColor:accent, borderWidth:2 }]} T={T}>
              <Text style={{ fontWeight:"900", fontSize:16, color:T.text, marginBottom:4 }}>📍 {loc.name}</Text>
              {det.addr ? <>
                <Text style={{ color:T.subtext, fontSize:13 }}>{det.addr}</Text>
                <Text style={{ color:T.subtext, fontSize:12, marginBottom:4 }}>{det.city}</Text>
                <Text style={{ color:T.subtext, fontSize:12, marginTop:4 }}>📞 {det.phone}</Text>
                <Text style={{ color:T.subtext, fontSize:12, marginTop:4 }}>🕐 {det.hours}</Text>
              </> : null}
              <View style={{ flexDirection:"row", gap:10, marginTop:14 }}>
                <GoldBtn label="Order Here" onPress={() => {}} style={{ flex:1, paddingVertical:10 }} />
                <OutlineBtn label="Directions" onPress={() => {}} style={{ flex:1 }} T={T} />
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ── Reservations Screen ───────────────────────────────────────────────
function ReservationsScreen({ T }: any) {
  const [step, setStep]           = useState(1);
  const [date, setDate]           = useState("");
  const [time, setTime]           = useState("");
  const [guests, setGuests]       = useState(2);
  const [confirmed, setConfirmed] = useState(false);
  const times = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"];
  const reset = () => { setStep(1); setDate(""); setTime(""); setGuests(2); setConfirmed(false); };

  if (confirmed) return (
    <ScrollView contentContainerStyle={{ padding:20 }}>
      <View style={{ alignItems:"center", padding:20 }}>
        <Text style={{ fontSize:60, marginBottom:12 }}>✅</Text>
        <Text style={{ fontWeight:"900", fontSize:22, color:T.text, marginBottom:8 }}>Reservation Confirmed!</Text>
        <View style={{ backgroundColor:T.isDark?"#14291a":"#f0fdf4", borderRadius:14, padding:20, width:"100%", marginVertical:16 }}>
          {[["📅 Date", new Date(date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})],
            ["🕐 Time", time],["👥 Guests", `${guests} ${guests===1?"person":"people"}`],["💳 Deposit","Charged to card on file"]
          ].map(([l,v],i) => (
            <View key={i} style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:10 }}>
              <Text style={{ color:T.subtext, fontSize:14 }}>{l}</Text>
              <Text style={{ fontWeight:"700", color:T.text, fontSize:14 }}>{v}</Text>
            </View>
          ))}
        </View>
        <GoldBtn label="Make Another Reservation" onPress={reset} />
      </View>
    </ScrollView>
  );

  return (
    <ScrollView contentContainerStyle={{ padding:16, paddingBottom:40 }}>
      <Text style={[s.secTitle, { color:T.text }]}>🪑 Reserve a Table</Text>
      <Text style={[s.secSub, { color:T.subtext }]}>Book at least 2 hours in advance · 1-hour slots</Text>
      {step===1 && (
        <View>
          <Text style={{ fontWeight:"700", fontSize:14, color:T.text, marginBottom:10 }}>📅 Select Date</Text>
          <View style={{ flexDirection:"row", flexWrap:"wrap", gap:8, marginBottom:20 }}>
            {Array.from({length:14},(_,i)=>{
              const d=new Date(); d.setDate(d.getDate()+i);
              const val=d.toISOString().split("T")[0];
              const lbl=i===0?"Today":i===1?"Tomorrow":d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
              return (
                <TouchableOpacity key={val} onPress={()=>setDate(val)}
                  style={{ backgroundColor:date===val?accent:T.surface2, borderRadius:10, padding:10,
                    borderWidth:2, borderColor:date===val?accent:"transparent" }}>
                  <Text style={{ color:date===val?"#111":T.subtext, fontSize:11, fontWeight:"700" }}>{lbl}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {date && (
            <View>
              <Text style={{ fontWeight:"700", fontSize:14, color:T.text, marginBottom:10 }}>🕐 Select Time</Text>
              <View style={{ flexDirection:"row", flexWrap:"wrap", gap:8, marginBottom:20 }}>
                {times.map(t => (
                  <TouchableOpacity key={t} onPress={()=>setTime(t)}
                    style={{ backgroundColor:time===t?accent:T.surface2, borderRadius:10, padding:10,
                      borderWidth:2, borderColor:time===t?accent:"transparent" }}>
                    <Text style={{ color:time===t?"#111":T.subtext, fontSize:12, fontWeight:"700" }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <GoldBtn label="Continue →" onPress={()=>setStep(2)} disabled={!date||!time} />
        </View>
      )}
      {step===2 && (
        <View>
          <View style={{ backgroundColor:T.surface2, borderRadius:12, padding:14, marginBottom:20 }}>
            <Text style={{ color:T.subtext, fontSize:13 }}>
              📅 {new Date(date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}  🕐 {time}
            </Text>
          </View>
          <Text style={{ fontWeight:"700", fontSize:14, color:T.text, marginBottom:14 }}>👥 How many guests?</Text>
          <View style={s.tableGrid}>
            {[1,2,3,4,5,6,7,8].map(n=>(
              <TouchableOpacity key={n} onPress={()=>setGuests(n)}
                style={[s.tableBtn, { backgroundColor:guests===n?accent:T.surface2, borderWidth:2, borderColor:guests===n?accent:"transparent" }]}>
                <Text style={[s.tableBtnTxt, { color:guests===n?"#111":T.text }]}>{n}{n===8?"+":""}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection:"row", gap:10, marginTop:20 }}>
            <OutlineBtn label="← Back" onPress={()=>setStep(1)} style={{ flex:1 }} T={T} />
            <GoldBtn label="Continue →" onPress={()=>setStep(3)} style={{ flex:2 }} />
          </View>
        </View>
      )}
      {step===3 && (
        <View>
          <View style={{ backgroundColor:T.isDark?"#1a1500":"#fffbeb", borderRadius:12, padding:20, marginBottom:20,
            borderWidth:1, borderColor:`${accent}40` }}>
            <Text style={{ fontWeight:"800", fontSize:16, color:T.text, marginBottom:12 }}>Reservation Summary</Text>
            {[["📅 Date",new Date(date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})],
              ["🕐 Time",time],["👥 Guests",`${guests} ${guests===1?"person":"people"}`],["💳 Deposit","Required at booking"]
            ].map(([l,v],i)=>(
              <View key={i} style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:8 }}>
                <Text style={{ color:T.subtext, fontSize:14 }}>{l}</Text>
                <Text style={{ fontWeight:"700", color:T.text, fontSize:14 }}>{v}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection:"row", gap:10 }}>
            <OutlineBtn label="← Back" onPress={()=>setStep(2)} style={{ flex:1 }} T={T} />
            <GoldBtn label="Confirm & Pay Deposit" onPress={()=>setConfirmed(true)} style={{ flex:2 }} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ── Customize Modal ───────────────────────────────────────────────────
function CustomizeModal({ item, onAdd, onClose, T }: any) {
  const [size, setSize] = useState("Medium");
  const [milk, setMilk] = useState("Whole Milk");
  const [sweet, setSweet] = useState("Normal");
  const [temp, setTemp] = useState(item.cat === "Iced Coffee" ? "Iced" : "Hot");
  const [extras, setExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const sizes = [{ l: "Small", adj: -0.50 }, { l: "Medium", adj: 0 }, { l: "Large", adj: 0.75 }];
  const milks = ["Whole Milk", "Oat Milk", "Almond Milk", "Skim Milk", "Soy Milk", "No Milk"];
  const sweets = ["None", "Light", "Normal", "Extra"];
  const temps = item.cat === "Iced Coffee" ? ["Iced", "Blended"] : ["Hot", "Iced", "Warm"];
  const addOns = [{ l: "Extra Shot", adj: 0.75 }, { l: "Vanilla Syrup", adj: 0.50 }, { l: "Caramel Drizzle", adj: 0.50 }, { l: "Whipped Cream", adj: 0.75 }, { l: "Oat Milk Foam", adj: 0.75 }];

  const sizeAdj = sizes.find(s => s.l === size)?.adj || 0;
  const extrasAdj = extras.reduce((s, e) => s + (addOns.find(a => a.l === e)?.adj || 0), 0);
  const finalPrice = item.price + sizeAdj + extrasAdj;

  const toggleExtra = (e: string) => setExtras(x => x.includes(e) ? x.filter(i => i !== e) : [...x, e]);
  const handleAdd = () => {
    onAdd({ ...item, price: finalPrice, customizations: { size, milk, sweet, temp, extras, notes } });
    onClose();
  };

  return (
    <Modal transparent animationType="slide">
      <View style={s.overlay}>
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center", padding: 20 }}>
          <View style={[s.modalBox, { backgroundColor: T.card, width: "100%", maxWidth: 400, maxHeight: "90%" }]}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <View>
                <Text style={[s.modalTitle, { color: T.text, marginTop: 0, textAlign: "left" }]}>{item.name}</Text>
                <Text style={{ color: accent, fontWeight: "800", fontSize: 18, marginTop: 4 }}>${finalPrice.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: T.subtext, fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontWeight: "700", fontSize: 14, color: T.text, marginBottom: 10 }}>Size</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                {sizes.map(s => (
                  <TouchableOpacity key={s.l} onPress={() => setSize(s.l)}
                    style={{ flex: 1, backgroundColor: size === s.l ? accent : T.surface2, borderRadius: 8, padding: 10, alignItems: "center" }}>
                    <Text style={{ color: size === s.l ? "#111" : T.text, fontWeight: "700", fontSize: 12 }}>
                      {s.l}{s.adj !== 0 ? ` (${s.adj > 0 ? "+" : ""}$${Math.abs(s.adj).toFixed(2)})` : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {item.cat !== "Food" && (
                <>
                  <Text style={{ fontWeight: "700", fontSize: 14, color: T.text, marginBottom: 10 }}>Temperature</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                    {temps.map(t => (
                      <TouchableOpacity key={t} onPress={() => setTemp(t)}
                        style={{ backgroundColor: temp === t ? accent : T.surface2, borderRadius: 8, padding: 10, alignItems: "center" }}>
                        <Text style={{ color: temp === t ? "#111" : T.text, fontWeight: "700", fontSize: 12 }}>
                          {t === "Hot" ? "🔥" : t === "Iced" ? "🧊" : "☕"} {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={{ fontWeight: "700", fontSize: 14, color: T.text, marginBottom: 10 }}>Milk</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {milks.map(m => (
                      <TouchableOpacity key={m} onPress={() => setMilk(m)}
                        style={{ backgroundColor: milk === m ? accent : T.surface2, borderRadius: 8, padding: 10, alignItems: "center", minWidth: 80 }}>
                        <Text style={{ color: milk === m ? "#111" : T.text, fontWeight: "700", fontSize: 12 }}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={{ fontWeight: "700", fontSize: 14, color: T.text, marginBottom: 10 }}>Sweetness</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
                    {sweets.map(s => (
                      <TouchableOpacity key={s} onPress={() => setSweet(s)}
                        style={{ flex: 1, backgroundColor: sweet === s ? accent : T.surface2, borderRadius: 8, padding: 10, alignItems: "center" }}>
                        <Text style={{ color: sweet === s ? "#111" : T.text, fontWeight: "700", fontSize: 12 }}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
              <Text style={{ fontWeight: "700", fontSize: 14, color: T.text, marginBottom: 10 }}>Add-ons</Text>
              {addOns.map(a => (
                <TouchableOpacity key={a.l} onPress={() => toggleExtra(a.l)}
                  style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 10, backgroundColor: extras.includes(a.l) ? `${accent}22` : T.surface2, borderWidth: 1.5, borderColor: extras.includes(a.l) ? accent : T.border, marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, color: T.text, fontWeight: extras.includes(a.l) ? "700" : "400" }}>{a.l}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ color: T.subtext, fontSize: 12 }}>+${a.adj.toFixed(2)}</Text>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: extras.includes(a.l) ? accent : T.surface2, borderWidth: 1.5, borderColor: extras.includes(a.l) ? accent : T.border, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 12, color: "#111" }}>{extras.includes(a.l) ? "✓" : ""}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <Text style={{ fontWeight: "700", fontSize: 14, color: T.text, marginBottom: 10 }}>Special Instructions</Text>
              <TextInput value={notes} onChangeText={setNotes} placeholder="Any special requests? (optional)"
                placeholderTextColor={T.subtext} multiline numberOfLines={3}
                style={[s.input, { backgroundColor: T.inputBg, borderColor: T.inputBorder, color: T.inputText, height: 70, textAlignVertical: "top" }]} />
              <View style={{ backgroundColor: T.surface2, borderRadius: 10, padding: 14, marginTop: 16, marginBottom: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ color: T.subtext, fontSize: 12 }}>Base</Text>
                  <Text style={{ color: T.subtext, fontSize: 12 }}>${item.price.toFixed(2)}</Text>
                </View>
                {sizeAdj !== 0 && (
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ color: T.subtext, fontSize: 12 }}>{size}</Text>
                    <Text style={{ color: T.subtext, fontSize: 12 }}>{sizeAdj > 0 ? "+" : "-"}${Math.abs(sizeAdj).toFixed(2)}</Text>
                  </View>
                )}
                {extras.map(e => (
                  <View key={e} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ color: T.subtext, fontSize: 12 }}>{e}</Text>
                    <Text style={{ color: T.subtext, fontSize: 12 }}>+${(addOns.find(a => a.l === e)?.adj || 0).toFixed(2)}</Text>
                  </View>
                ))}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, borderTopWidth: 1, borderTopColor: T.border, paddingTop: 8 }}>
                  <Text style={{ fontWeight: "900", fontSize: 14, color: T.text }}>Total</Text>
                  <Text style={{ fontWeight: "900", fontSize: 14, color: accent }}>${finalPrice.toFixed(2)}</Text>
                </View>
              </View>
              <GoldBtn label={`Add to Cart — $${finalPrice.toFixed(2)}`} onPress={handleAdd} style={{ marginBottom: 20 }} />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Customer App ──────────────────────────────────────────────────────
function CustomerApp({ user, setUser, onLogout, isDark, setIsDark, sharedOrders, setSharedOrders, menu, locations }: any) {
  const T = getTheme(isDark);
  const [tab,         setTab]         = useState("menu");
  const [cart,        setCart]        = useState<any[]>([]);
  const [receipt,     setReceipt]     = useState<any>(null);
  const [filter,      setFilter]      = useState("Popular");
  const [cartOpen,    setCartOpen]    = useState(false);
  const [driveCode,   setDriveCode]   = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState(locations[0]?.id ?? 1);
  const [isDriveThru, setIsDriveThru] = useState(false);
  const [customizing, setCustomizing] = useState<any>(null);

  const cats  = ["Popular","Hot Coffee","Iced Coffee","Food"];
  const shown = filter==="Popular"
    ? [...menu].sort((a:any,b:any)=>b.orders-a.orders)
    : menu.filter((m:any)=>m.cat===filter);
  const total = cart.reduce((s:number,i:any)=>s+i.price, 0);

  const handleCheckout = (isDT=false) => {
    if (!cart.length) return;
    setIsDriveThru(isDT);
    setShowPayment(true);
    setCartOpen(false);
  };

  const handlePay = async (payMethod: string) => {
    const code    = "CL-" + Math.floor(1000+Math.random()*9000);
    const locName = locations.find((l:any)=>l.id===selectedLoc)?.name ?? "Hammond";
    try {
      // Post to real API
      await api.createOrder(selectedLoc, total, cart);
      // Refresh points
      let newPts = user.points;
      try { newPts = await api.getPoints(); } catch {}
      setUser((u: any) => ({ ...u, points: newPts }));
    } catch (e) {
      // If order fails (e.g. guest), still show receipt locally
    }

    const o = {
      id:"#"+(1040+sharedOrders.length+1), code, customer: user.userName ?? user.name,
      items:cart, total, date:new Date().toLocaleDateString(),
      payMethod, type:isDriveThru?"drive-thru":"dine-in",
      status:"Pending", time:"Just now", location:locName, count:cart.length,
    };
    setSharedOrders((prev:any[])=>[o,...prev]);
    setShowPayment(false);
    if (isDriveThru) setDriveCode({ code, order:o });
    else setReceipt({ ...o, payMethod });
    setCart([]);
  };

  const navTabs = [
    {icon:"🍽️",label:"Menu",      val:"menu"        },
    {icon:"🚗",label:"Drive-Thru", val:"drive-thru"  },
    {icon:"⭐",label:"Rewards",    val:"rewards"     },
    {icon:"🪑",label:"Reserve",    val:"reservations"},
    {icon:"📍",label:"Locations",  val:"locations"   },
  ];

  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.bg }]}>
      <StatusBar barStyle={isDark?"light-content":"dark-content"} />
      {receipt    && <ReceiptModal order={receipt} onClose={()=>setReceipt(null)} T={T} />}
      {driveCode  && <DriveThruModal code={driveCode.code} order={driveCode.order} onClose={()=>setDriveCode(null)} T={T} />}
      {showPayment && <PaymentModal total={total} onPay={handlePay} onClose={()=>setShowPayment(false)} user={user} T={T} />}
      {customizing && <CustomizeModal item={customizing} onAdd={(item:any)=>setCart((c:any)=>[...c,item])} onClose={()=>setCustomizing(null)} T={T} />}

      <Modal transparent visible={cartOpen} animationType="slide">
        <View style={s.overlay}>
          <View style={[s.modalBox, { backgroundColor:T.card, maxHeight:"75%" }]}>
            <Text style={[s.modalTitle, { color:T.text }]}>🛒 Your Cart</Text>
            {cart.length===0
              ? <Text style={{ color:T.subtext, textAlign:"center", padding:20 }}>Cart is empty</Text>
              : (
                <ScrollView>
                  {cart.map((i:any,idx:number) => (
                    <View key={idx} style={[s.row, { borderBottomWidth:1, borderBottomColor:T.border, paddingVertical:10 }]}>
                      <Text style={{ color:T.text }}>{i.name}</Text>
                      <Text style={{ color:accent }}>${i.price.toFixed(2)}</Text>
                    </View>
                  ))}
                  <View style={[s.row, { marginTop:12, paddingTop:12, borderTopWidth:1, borderTopColor:T.border }]}>
                    <Text style={{ fontWeight:"900", fontSize:16, color:T.text }}>Total</Text>
                    <Text style={{ fontWeight:"900", fontSize:16, color:accent }}>${total.toFixed(2)}</Text>
                  </View>
                  <View style={{ flexDirection:"row", gap:10, marginTop:16 }}>
                    <TouchableOpacity onPress={()=>setCart([])}
                      style={{ flex:1, borderWidth:2, borderColor:T.border, borderRadius:8, padding:12, alignItems:"center" }}>
                      <Text style={{ color:T.subtext, fontWeight:"700" }}>Clear</Text>
                    </TouchableOpacity>
                    <GoldBtn label="Checkout" onPress={()=>handleCheckout(false)} style={{ flex:2 }} />
                  </View>
                </ScrollView>
              )
            }
            <TouchableOpacity onPress={()=>setCartOpen(false)} style={{ marginTop:14, alignItems:"center" }}>
              <Text style={{ color:T.subtext }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AppHeader user={user} T={T} isDark={isDark} setIsDark={setIsDark} onLogout={onLogout} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ backgroundColor:T.isDark?"#0a0a0a":"#1a1a1a", maxHeight:44 }}
        contentContainerStyle={{ alignItems:"center", paddingHorizontal:12, gap:8 }}>
        <Text style={{ color:"#aaa", fontSize:12 }}>📍</Text>
        {locations.map((l:any)=>(
          <TouchableOpacity key={l.id} onPress={()=>setSelectedLoc(l.id)}
            style={{ backgroundColor:selectedLoc===l.id?accent:"rgba(255,255,255,.1)", borderRadius:20, paddingHorizontal:14, paddingVertical:6 }}>
            <Text style={{ color:selectedLoc===l.id?"#111":"#ccc", fontSize:12, fontWeight:"700" }}>{l.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:100, backgroundColor:T.bg }}>
        {tab==="menu" && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
              {cats.map(c=>(
                <TouchableOpacity key={c} onPress={()=>setFilter(c)}
                  style={{ backgroundColor:filter===c?accent:T.surface2, borderRadius:20, paddingHorizontal:14, paddingVertical:8, marginRight:8 }}>
                  <Text style={{ color:filter===c?"#111":T.subtext, fontSize:13, fontWeight:"600" }}>{c==="Popular"?"🔥 Popular":c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {shown.map((item:any,i:number)=>(
              <Card key={item.id} style={{ flexDirection:"row", marginBottom:12 }} T={T}>
                <Image source={{ uri:item.img }} style={s.menuImg} />
                <View style={{ flex:1, padding:12 }}>
                  {filter==="Popular"&&i===0&&<View style={s.badge}><Text style={s.badgeTxt}>#1 THIS WEEK</Text></View>}
                  <Text style={[s.menuName, { color:T.text }]}>{item.name}</Text>
                  <Text style={[s.menuCat, { color:T.subtext }]}>{item.cat}</Text>
                  <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <Text style={s.menuPrice}>${item.price.toFixed(2)}</Text>
                    <GoldBtn label="+ Add" onPress={()=>setCustomizing(item)} style={{ paddingVertical:7, paddingHorizontal:14 }} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {tab==="drive-thru" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>🚗 Drive-Thru Order</Text>
            <Text style={[s.secSub, { color:T.subtext }]}>Order ahead — get a code — show it at the window</Text>
            {menu.filter((m:any)=>m.cat!=="Food").map((item:any)=>(
              <Card key={item.id} style={{ flexDirection:"row", marginBottom:12 }} T={T}>
                <Image source={{ uri:item.img }} style={s.menuImg} />
                <View style={{ flex:1, padding:12 }}>
                  <Text style={[s.menuName, { color:T.text }]}>{item.name}</Text>
                  <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <Text style={s.menuPrice}>${item.price.toFixed(2)}</Text>
                    <GoldBtn label="+ Add" onPress={()=>setCustomizing(item)} style={{ paddingVertical:7, paddingHorizontal:14 }} />
                  </View>
                </View>
              </Card>
            ))}
            {cart.length>0 && (
              <Card style={{ padding:16 }} T={T}>
                {cart.map((i:any,idx:number)=>(
                  <Text key={idx} style={{ color:T.subtext, fontSize:13, paddingVertical:2 }}>• {i.name} — ${i.price.toFixed(2)}</Text>
                ))}
                <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:12, paddingTop:12, borderTopWidth:1, borderTopColor:T.border }}>
                  <Text style={{ fontWeight:"800", color:accent, fontSize:15 }}>Total: ${total.toFixed(2)}</Text>
                  <GoldBtn label="Get My Code 🚗" onPress={()=>handleCheckout(true)} />
                </View>
              </Card>
            )}
          </View>
        )}

        {tab==="rewards"      && <RewardsScreen user={user} T={T} />}
        {tab==="reservations" && <ReservationsScreen T={T} />}
        {tab==="locations"    && <LocationsScreen T={T} locations={locations} />}
      </ScrollView>

      {cart.length>0 && (tab==="menu"||tab==="drive-thru") && (
        <TouchableOpacity onPress={()=>tab==="drive-thru"?handleCheckout(true):setCartOpen(true)} style={s.cartFab}>
          <Text style={{ color:"#111", fontWeight:"800", fontSize:14 }}>🛒 {cart.length} · ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      <BottomNav tabs={navTabs} active={tab} setActive={setTab} T={T} />
    </SafeAreaView>
  );
}

// ── Staff / Manager App ───────────────────────────────────────────────
function StaffApp({ user, onLogout, isDark, setIsDark, sharedOrders, setSharedOrders, locations }: any) {
  const T          = getTheme(isDark);
  const isManager  = getRoleKey(user.roles ?? user.role) === "manager";
  const [tab, setTab] = useState("orders");
  const userLocation  = locations.find((l:any)=>l.id===user.locationId)?.name ?? locations[0]?.name ?? "Hammond";
  const advance = (id:string) => setSharedOrders((o:any[])=>o.map((x:any)=>x.id===id&&STATUS_NEXT[x.status]?{...x,status:STATUS_NEXT[x.status]}:x));
  const myOrders = sharedOrders.filter((o:any)=>o.location===userLocation&&o.status!=="Done");

  const tabs = isManager
    ? [{icon:"📋",label:"Orders",val:"orders"},{icon:"🚗",label:"Drive-Thru",val:"drive-thru"},{icon:"📊",label:"Dashboard",val:"dashboard"}]
    : [{icon:"📋",label:"Orders",val:"orders"},{icon:"🚗",label:"Drive-Thru",val:"drive-thru"}];

  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.bg }]}>
      <StatusBar barStyle={isDark?"light-content":"dark-content"} />
      <AppHeader user={user} T={T} isDark={isDark} setIsDark={setIsDark} onLogout={onLogout} />
      <View style={{ backgroundColor:T.surface2, padding:12, flexDirection:"row", alignItems:"center", gap:8 }}>
        <Text style={{ color:accent, fontWeight:"800", fontSize:13 }}>📍 {userLocation}</Text>
        <Text style={{ color:T.subtext, fontSize:12 }}>
          {tab==="orders"?"Live Order Queue":tab==="drive-thru"?"Drive-Thru Queue":"Dashboard"}
        </Text>
      </View>
      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:100, backgroundColor:T.bg }}>
        {tab==="orders" && (
          <View>
            {myOrders.filter((o:any)=>o.type!=="drive-thru").length===0
              ? <Text style={{ color:T.subtext, textAlign:"center", padding:40 }}>No active orders at {userLocation}</Text>
              : myOrders.filter((o:any)=>o.type!=="drive-thru").map((o:any)=>(
                <Card key={o.id} style={{ padding:16, marginBottom:12 }} T={T}>
                  <Text style={{ fontWeight:"900", fontSize:15, color:T.text }}>{o.customer}</Text>
                  <Text style={{ color:T.subtext, fontSize:12, marginTop:2 }}>{o.items.map((i:any)=>i.name).join(", ")} · {o.count} item{o.count>1?"s":""}</Text>
                  <Text style={{ color:T.subtext, fontSize:11, marginTop:4 }}>{o.id} · {o.time}</Text>
                  <View style={{ flexDirection:"row", alignItems:"center", gap:10, marginTop:10 }}>
                    <View style={[s.statusBadge, { backgroundColor:STATUS_COLOR[o.status] }]}>
                      <Text style={s.statusBadgeTxt}>{o.status}</Text>
                    </View>
                    {STATUS_NEXT[o.status]&&(
                      <TouchableOpacity onPress={()=>advance(o.id)} style={s.advanceBtn}>
                        <Text style={{ color:"#fff", fontSize:12, fontWeight:"700" }}>→ {STATUS_NEXT[o.status]}</Text>
                      </TouchableOpacity>
                    )}
                    {isManager&&(
                      <TouchableOpacity style={{ backgroundColor:"#fee2e2", borderRadius:8, paddingHorizontal:12, paddingVertical:7 }}>
                        <Text style={{ color:"#dc2626", fontSize:11, fontWeight:"700" }}>Refund</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              ))
            }
          </View>
        )}
        {tab==="drive-thru" && (
          <View>
            {myOrders.filter((o:any)=>o.type==="drive-thru").length===0
              ? <Text style={{ color:T.subtext, textAlign:"center", padding:40 }}>No drive-thru orders at {userLocation}</Text>
              : myOrders.filter((o:any)=>o.type==="drive-thru").map((o:any)=>(
                <Card key={o.id} style={{ padding:16, marginBottom:12 }} T={T}>
                  <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
                    <View>
                      <Text style={{ fontWeight:"900", fontSize:15, color:T.text }}>{o.customer}</Text>
                      <Text style={{ color:T.subtext, fontSize:12 }}>{o.items.map((i:any)=>i.name).join(", ")}</Text>
                      <View style={{ backgroundColor:accent, borderRadius:20, paddingHorizontal:10, paddingVertical:3, alignSelf:"flex-start", marginTop:6 }}>
                        <Text style={{ color:"#111", fontWeight:"800", fontSize:11 }}>Code: {o.code}</Text>
                      </View>
                    </View>
                    <View>
                      <View style={[s.statusBadge, { backgroundColor:STATUS_COLOR[o.status] }]}>
                        <Text style={s.statusBadgeTxt}>{o.status}</Text>
                      </View>
                      {STATUS_NEXT[o.status]&&(
                        <TouchableOpacity onPress={()=>advance(o.id)} style={[s.advanceBtn, { marginTop:8 }]}>
                          <Text style={{ color:"#fff", fontSize:11, fontWeight:"700" }}>→ {STATUS_NEXT[o.status]}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Card>
              ))
            }
          </View>
        )}
        {tab==="dashboard" && isManager && (
          <View>
            <View style={s.statsGrid}>
              {[
                {l:"Today's Orders", v:myOrders.length,                                                                i:"📦"},
                {l:"Revenue Today",  v:"$"+myOrders.reduce((s:number,o:any)=>s+(o.total||0),0).toFixed(0),            i:"💰"},
                {l:"Drive-Thru",     v:myOrders.filter((o:any)=>o.type==="drive-thru").length,                         i:"🚗"},
                {l:"Staff On Shift", v:STAFF_ROSTER.filter(st=>st.loc===userLocation&&st.status==="On Shift").length,  i:"👥"},
              ].map((st,i)=>(
                <Card key={i} style={[s.statCard, { alignItems:"center" }]} T={T}>
                  <Text style={{ fontSize:28 }}>{st.i}</Text>
                  <Text style={[s.statVal, { color:accent }]}>{st.v}</Text>
                  <Text style={[s.statLbl, { color:T.subtext }]}>{st.l}</Text>
                </Card>
              ))}
            </View>
            <Card style={{ padding:20 }} T={T}>
              <Text style={{ fontWeight:"800", fontSize:14, color:T.text, marginBottom:14 }}>👥 Staff at {userLocation}</Text>
              {STAFF_ROSTER.filter(st=>st.loc===userLocation).map((st,i,arr)=>(
                <View key={i} style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center",
                  paddingVertical:10, borderBottomWidth:i<arr.length-1?1:0, borderBottomColor:T.border }}>
                  <View style={{ flexDirection:"row", alignItems:"center", gap:10 }}>
                    <View style={{ width:34, height:34, borderRadius:17, backgroundColor:T.surface2, alignItems:"center", justifyContent:"center" }}>
                      <Text>👤</Text>
                    </View>
                    <View>
                      <Text style={{ fontWeight:"700", color:T.text }}>{st.n}</Text>
                      <Text style={{ color:T.subtext, fontSize:12 }}>{st.role}</Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor:st.status==="On Shift"?"#dcfce7":"#fef3c7", borderRadius:20, paddingHorizontal:10, paddingVertical:4 }}>
                    <Text style={{ color:st.status==="On Shift"?"#16a34a":"#92400e", fontWeight:"700", fontSize:11 }}>{st.status}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
      <BottomNav tabs={tabs} active={tab} setActive={setTab} T={T} />
    </SafeAreaView>
  );
}

// ── Admin App ─────────────────────────────────────────────────────────
function AdminApp({ user, onLogout, isDark, setIsDark, sharedOrders, setSharedOrders, menu, locations }: any) {
  const T = getTheme(isDark);
  const [tab,    setTab]    = useState("dashboard");
  const [selLoc, setSelLoc] = useState(0);

  const advance = (id:string) => setSharedOrders((o:any[])=>o.map((x:any)=>x.id===id&&STATUS_NEXT[x.status]?{...x,status:STATUS_NEXT[x.status]}:x));

  const filteredOrders = selLoc===0 ? sharedOrders : sharedOrders.filter((o:any)=>o.location===locations[selLoc-1]?.name);
  const totalRev       = filteredOrders.reduce((s:number,o:any)=>s+(o.total||0),0);
  const dtCount        = filteredOrders.filter((o:any)=>o.type==="drive-thru").length;
  const tablesActive   = filteredOrders.filter((o:any)=>o.type==="dine-in"&&o.status!=="Done").length;
  const revenueByLoc   = locations.map((l:any)=>({ name:l.name, rev:sharedOrders.filter((o:any)=>o.location===l.name).reduce((s:number,o:any)=>s+(o.total||0),0) }));
  const maxLocRev      = Math.max(...revenueByLoc.map((l:any)=>l.rev),1);
  const itemCounts:Record<string,number> = {};
  sharedOrders.forEach((o:any)=>o.items.forEach((it:any)=>{ itemCounts[it.name]=(itemCounts[it.name]||0)+1; }));
  const sellers  = Object.entries(itemCounts).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([name,cnt])=>({name,cnt:cnt as number}));
  const maxSell  = sellers.length>0 ? sellers[0].cnt : 1;

  const tabs = [{icon:"📊",label:"Dashboard",val:"dashboard"},{icon:"🍽️",label:"Menu",val:"menu"},
    {icon:"📦",label:"Orders",val:"orders"},{icon:"📍",label:"Locations",val:"locations"},{icon:"👥",label:"Staff",val:"staff"}];
  const showLocFilter = ["dashboard","orders","staff"].includes(tab);

  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.bg }]}>
      <StatusBar barStyle={isDark?"light-content":"dark-content"} />
      <AppHeader user={user} T={T} isDark={isDark} setIsDark={setIsDark} onLogout={onLogout} />
      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:100, backgroundColor:T.bg }}>
        {showLocFilter && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
            {["All Locations",...locations.map((l:any)=>l.name)].map((l:any,i:number)=>(
              <TouchableOpacity key={i} onPress={()=>setSelLoc(i)}
                style={{ backgroundColor:selLoc===i?accent:T.surface2, borderRadius:20, paddingHorizontal:14, paddingVertical:8, marginRight:8 }}>
                <Text style={{ color:selLoc===i?"#111":T.subtext, fontSize:12, fontWeight:"700" }}>{l}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {tab==="dashboard" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>📊 Overview — {selLoc===0?"All Locations":locations[selLoc-1]?.name}</Text>
            <View style={s.statsGrid}>
              {[
                {l:"Orders Today",  v:filteredOrders.length,   i:"📦"},
                {l:"Revenue",       v:"$"+totalRev.toFixed(0), i:"💰"},
                {l:"Tables Active", v:tablesActive+" active",  i:"🪑"},
                {l:"Drive-Thru",    v:dtCount,                 i:"🚗"},
              ].map((st,i)=>(
                <Card key={i} style={[s.statCard, { alignItems:"center" }]} T={T}>
                  <Text style={{ fontSize:28 }}>{st.i}</Text>
                  <Text style={[s.statVal, { color:accent }]}>{st.v}</Text>
                  <Text style={[s.statLbl, { color:T.subtext }]}>{st.l}</Text>
                </Card>
              ))}
            </View>
            <Card style={{ padding:16, marginBottom:14 }} T={T}>
              <Text style={{ fontWeight:"800", fontSize:14, color:T.text, marginBottom:12 }}>🔥 Top Sellers</Text>
              {sellers.length===0
                ? <Text style={{ color:T.subtext, textAlign:"center", padding:16 }}>No orders yet</Text>
                : sellers.map((x,i)=>(
                  <View key={i} style={{ marginBottom:10 }}>
                    <View style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:4 }}>
                      <Text style={{ fontSize:13, color:T.text }}>{x.name}</Text>
                      <Text style={{ color:T.subtext, fontSize:13 }}>{x.cnt} order{x.cnt!==1?"s":""}</Text>
                    </View>
                    <View style={{ backgroundColor:T.surface2, borderRadius:4, height:6 }}>
                      <View style={{ backgroundColor:accent, width:`${(x.cnt/maxSell)*100}%` as any, height:6, borderRadius:4 }} />
                    </View>
                  </View>
                ))
              }
            </Card>
            <Card style={{ padding:16 }} T={T}>
              <Text style={{ fontWeight:"800", fontSize:14, color:T.text, marginBottom:12 }}>📍 Revenue by Location</Text>
              {sharedOrders.length===0
                ? <Text style={{ color:T.subtext, textAlign:"center", padding:16 }}>No orders yet</Text>
                : revenueByLoc.map((l:any,i:number)=>(
                  <View key={i} style={{ marginBottom:10 }}>
                    <View style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:4 }}>
                      <Text style={{ fontSize:13, color:T.text }}>{l.name}</Text>
                      <Text style={{ color:accent, fontWeight:"700", fontSize:13 }}>${l.rev.toFixed(0)}</Text>
                    </View>
                    <View style={{ backgroundColor:T.surface2, borderRadius:4, height:6 }}>
                      <View style={{ backgroundColor:accent, width:`${(l.rev/maxLocRev)*100}%` as any, height:6, borderRadius:4 }} />
                    </View>
                  </View>
                ))
              }
            </Card>
          </View>
        )}
        {tab==="menu" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>🍽 Menu Management</Text>
            {menu.map((item:any)=>(
              <Card key={item.id} style={{ flexDirection:"row", alignItems:"center", padding:12, marginBottom:10, gap:10 }} T={T}>
                <Image source={{ uri:item.img }} style={{ width:48, height:48, borderRadius:10 }} />
                <View style={{ flex:1 }}>
                  <Text style={{ fontWeight:"800", fontSize:13, color:T.text }}>{item.name}</Text>
                  <Text style={{ color:T.subtext, fontSize:11 }}>{item.cat} · ${item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor:item.popular?accent:T.surface2, borderRadius:8, paddingHorizontal:10, paddingVertical:6 }}>
                  <Text style={{ color:item.popular?"#111":T.subtext, fontSize:11, fontWeight:"700" }}>{item.popular?"🔥 Popular":"Set Pop"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor:"#fee2e2", borderRadius:8, paddingHorizontal:10, paddingVertical:6 }}>
                  <Text style={{ color:"#dc2626", fontSize:11, fontWeight:"700" }}>Disable</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}
        {tab==="orders" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>📦 All Orders</Text>
            {filteredOrders.length===0
              ? <Text style={{ color:T.subtext, textAlign:"center", padding:40 }}>No orders yet</Text>
              : filteredOrders.map((o:any,i:number)=>(
                <Card key={i} style={{ padding:14, marginBottom:10 }} T={T}>
                  <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <View style={{ flex:1 }}>
                      <Text style={{ fontWeight:"900", fontSize:13, color:T.text }}>
                        {o.customer} — {o.items.map((it:any)=>it.name).join(", ")}
                      </Text>
                      <Text style={{ color:T.subtext, fontSize:11, marginTop:2 }}>
                        {o.id} · {o.type} · 📍 {o.location} · {o.time}
                      </Text>
                      {o.type==="drive-thru"&&(
                        <View style={{ backgroundColor:accent, borderRadius:20, paddingHorizontal:8, paddingVertical:2, alignSelf:"flex-start", marginTop:4 }}>
                          <Text style={{ color:"#111", fontSize:10, fontWeight:"800" }}>Code: {o.code}</Text>
                        </View>
                      )}
                    </View>
                    <View style={{ alignItems:"flex-end", gap:8 }}>
                      <View style={[s.statusBadge, { backgroundColor:STATUS_COLOR[o.status] }]}>
                        <Text style={s.statusBadgeTxt}>{o.status}</Text>
                      </View>
                      {STATUS_NEXT[o.status]&&(
                        <TouchableOpacity onPress={()=>advance(o.id)} style={s.advanceBtn}>
                          <Text style={{ color:"#fff", fontSize:11, fontWeight:"700" }}>→ {STATUS_NEXT[o.status]}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Card>
              ))
            }
          </View>
        )}
        {tab==="locations" && <LocationsScreen T={T} locations={locations} />}
        {tab==="staff" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>👥 Staff</Text>
            {STAFF_ROSTER.filter(st=>selLoc===0||st.loc===locations[selLoc-1]?.name).map((st,i)=>(
              <Card key={i} style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:14, marginBottom:10 }} T={T}>
                <View style={{ flexDirection:"row", alignItems:"center", gap:10 }}>
                  <View style={{ width:36, height:36, borderRadius:18, backgroundColor:T.surface2, alignItems:"center", justifyContent:"center" }}>
                    <Text>👤</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight:"700", color:T.text }}>{st.n}</Text>
                    <Text style={{ color:T.subtext, fontSize:12 }}>{st.role} · 📍 {st.loc}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor:st.status==="On Shift"?"#dcfce7":st.status==="Break"?"#fef3c7":T.surface2,
                  borderRadius:20, paddingHorizontal:10, paddingVertical:4 }}>
                  <Text style={{ color:st.status==="On Shift"?"#16a34a":st.status==="Break"?"#92400e":T.subtext,
                    fontWeight:"700", fontSize:11 }}>{st.status}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
        {tab==="settings" && (
          <Card style={{ padding:20 }} T={T}>
            <Text style={[s.secTitle, { color:T.text }]}>⚙️ Settings</Text>
            <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingVertical:14, borderBottomWidth:1, borderBottomColor:T.border }}>
              <Text style={{ fontSize:15, fontWeight:"700", color:T.text }}>{isDark?"🌙 Dark Mode":"☀️ Light Mode"}</Text>
              <Switch value={isDark} onValueChange={setIsDark} trackColor={{ false:"#ddd", true:accent }} thumbColor="#fff" />
            </View>
            {[["Drive-Thru","Enabled"],["Table Reservations","Enabled"],["Online Ordering","Enabled"],["Rewards Program","Enabled"]].map(([k,v],i)=>(
              <View key={i} style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingVertical:12, borderBottomWidth:1, borderBottomColor:T.border }}>
                <Text style={{ fontSize:14, color:T.text }}>{k}</Text>
                <View style={{ backgroundColor:T.isDark?"#14291a":"#dcfce7", borderRadius:20, paddingHorizontal:10, paddingVertical:4 }}>
                  <Text style={{ color:"#16a34a", fontWeight:"700", fontSize:11 }}>{v}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
      <BottomNav tabs={[...tabs,{icon:"⚙️",label:"Settings",val:"settings"}]} active={tab} setActive={setTab} T={T} />
    </SafeAreaView>
  );
}

// ── Root ──────────────────────────────────────────────────────────────
export default function Index() {
  const [user,         setUser]         = useState<any>(null);
  const [screen,       setScreen]       = useState<"guest"|"login"|"app">("guest");
  const [isDark,       setIsDark]       = useState(false);
  const [sharedOrders, setSharedOrders] = useState<any[]>([]);
  const [menu,         setMenu]         = useState<any[]>(FALLBACK_MENU);
  const [locations,    setLocations]    = useState<any[]>(FALLBACK_LOCATIONS);
  const [loading,      setLoading]      = useState(true);

  // Fetch menu and locations on app load
  useEffect(() => {
    Promise.all([api.getMenu(), api.getLocations()])
      .then(([menuData, locData]) => {
        if (menuData?.length)  setMenu(menuData.map(enrichMenuItem));
        if (locData?.length)   setLocations(locData);
      })
      .catch(() => {}) // keep fallback data on failure
      .finally(() => setLoading(false));
  }, []);

  const handleLogin  = (u: any) => { setUser(u); setScreen("app"); };
  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    setUser(null);
    setScreen("guest");
  };

  if (loading) return (
    <View style={{ flex:1, alignItems:"center", justifyContent:"center", backgroundColor:"#1a1a1a" }}>
      <Image source={logoImg} style={{ width:80, height:80, borderRadius:40, marginBottom:16 }} />
      <ActivityIndicator color={accent} size="large" />
      <Text style={{ color:"#aaa", marginTop:12, fontSize:13 }}>Loading Caffeinated Lions...</Text>
    </View>
  );

  const roleKey = getRoleKey(user?.roles ?? user?.role);

  if (screen==="login")
    return <LoginScreen onLogin={handleLogin} onGuest={()=>setScreen("guest")} isDark={isDark} setIsDark={setIsDark} />;
  if (screen==="guest")
    return <GuestHome onLogin={()=>setScreen("login")} isDark={isDark} setIsDark={setIsDark} menu={menu} locations={locations} />;

  if (roleKey==="customer" || roleKey==="User" || !user?.roles)
    return <CustomerApp user={user} setUser={setUser} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} sharedOrders={sharedOrders} setSharedOrders={setSharedOrders} menu={menu} locations={locations} />;
  if (roleKey==="staff" || roleKey==="manager")
    return <StaffApp user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} sharedOrders={sharedOrders} setSharedOrders={setSharedOrders} locations={locations} />;
  if (roleKey==="admin")
    return <AdminApp user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} sharedOrders={sharedOrders} setSharedOrders={setSharedOrders} menu={menu} locations={locations} />;

  return <LoginScreen onLogin={handleLogin} onGuest={()=>setScreen("guest")} isDark={isDark} setIsDark={setIsDark} />;
}

// ── Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:        { flex:1 },
  input:         { borderWidth:1, borderRadius:8, padding:14, fontSize:14 },
  appHeader:     { padding:14, flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderBottomWidth:1 },
  appHeaderTitle:{ fontWeight:"900", fontSize:17 },
  appHeaderSub:  { fontSize:12, marginTop:1 },
  iconBtn:       { borderWidth:1, borderRadius:7, paddingHorizontal:10, paddingVertical:6, alignItems:"center", justifyContent:"center" },
  hero:          { height:340, position:"relative", justifyContent:"flex-end" },
  heroBg:        { position:"absolute", width:"100%", height:"100%" },
  heroOverlay:   { position:"absolute", width:"100%", height:"100%" },
  heroContent:   { padding:24, paddingBottom:32 },
  heroTitle:     { color:"#fff", fontSize:28, fontWeight:"900", lineHeight:36, textShadowColor:"rgba(0,0,0,0.8)", textShadowOffset:{width:0,height:2}, textShadowRadius:8 },
  heroSub:       { color:"#ddd", fontSize:14, marginTop:8 },
  secTitle:      { fontWeight:"900", fontSize:18, marginBottom:4 },
  secSub:        { fontSize:13, marginBottom:16 },
  menuImg:       { width:100, height:100 },
  menuName:      { fontWeight:"800", fontSize:14 },
  menuCat:       { fontSize:12, marginTop:2 },
  menuPrice:     { color:accent, fontWeight:"800", fontSize:15 },
  badge:         { backgroundColor:accent, borderRadius:12, paddingHorizontal:8, paddingVertical:2, alignSelf:"flex-start", marginBottom:6 },
  badgeTxt:      { color:"#111", fontSize:9, fontWeight:"800" },
  demoRow:       { flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderRadius:7, padding:10, marginBottom:6, borderWidth:1 },
  roleBadge:     { borderRadius:20, paddingHorizontal:7, paddingVertical:2, marginTop:4, alignSelf:"flex-start" },
  roleBadgeTxt:  { color:"#fff", fontSize:9, fontWeight:"800" },
  overlay:       { flex:1, backgroundColor:"rgba(0,0,0,0.75)", justifyContent:"center", alignItems:"center", padding:20 },
  modalBox:      { borderRadius:16, padding:24, width:"100%" },
  modalTitle:    { fontWeight:"900", fontSize:18, textAlign:"center", marginTop:8 },
  modalSub:      { fontSize:12, textAlign:"center", marginTop:4, marginBottom:16 },
  dashed:        { borderTopWidth:2, borderStyle:"dashed", marginVertical:12 },
  row:           { flexDirection:"row", justifyContent:"space-between", paddingVertical:4 },
  cartFab:       { position:"absolute", bottom:90, right:16, backgroundColor:accent, borderRadius:30, paddingHorizontal:20, paddingVertical:14, shadowColor:accent, shadowOpacity:0.5, shadowRadius:10, elevation:8 },
  tableGrid:     { flexDirection:"row", flexWrap:"wrap", gap:10 },
  tableBtn:      { width:(width-72)/4, aspectRatio:1, borderRadius:12, alignItems:"center", justifyContent:"center" },
  tableBtnTxt:   { fontWeight:"800", fontSize:14 },
  statusBadge:   { borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  statusBadgeTxt:{ color:"#fff", fontWeight:"800", fontSize:11 },
  advanceBtn:    { backgroundColor:"#2563eb", borderRadius:8, paddingHorizontal:12, paddingVertical:7 },
  statsGrid:     { flexDirection:"row", flexWrap:"wrap", gap:10, marginBottom:14 },
  statCard:      { width:(width-52)/2, padding:16 },
  statVal:       { fontWeight:"900", fontSize:22 },
  statLbl:       { fontSize:12 },
});