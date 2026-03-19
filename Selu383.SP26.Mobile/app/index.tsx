import { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Image,
  StyleSheet, Dimensions, StatusBar, Modal, Platform, Animated,
  Switch, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const gold = "#C8973A";

const logoImg = require("../assets/logo.png");
const heroImg = require("../assets/hero.jpg");

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
  { id:1, name:"Downtown",  addr:"123 Main St",      city:"Hammond, LA 70401",    phone:"(985) 555-0101", hours:"Mon–Fri 6AM–9PM" },
  { id:2, name:"Northside", addr:"456 Oak Ave",       city:"Hammond, LA 70403",    phone:"(985) 555-0102", hours:"Mon–Fri 7AM–8PM" },
  { id:3, name:"Lakefront", addr:"789 Lake Shore Dr", city:"Mandeville, LA 70448", phone:"(985) 555-0103", hours:"Daily 7AM–9PM"   },
];

const USERS = [
  { id:"c", email:"guest@lions.com", password:"guest123", role:"customer", name:"John", points:120,
    lastOrder:{ id:"#1038", items:[{name:"Iced Latte",price:5.00},{name:"Croissant",price:3.25}], total:8.25, date:"Mar 15, 2026" }},
  { id:"s", email:"staff@lions.com", password:"staff123", role:"staff",    name:"Sara", points:0, lastOrder:null },
  { id:"a", email:"admin@lions.com", password:"admin123", role:"admin",    name:"Mike", points:0, lastOrder:null },
];

const STATUS_NEXT  = { Pending:"Preparing", Preparing:"Ready", Ready:"Done" } as Record<string,string>;
const STATUS_COLOR = { Pending:"#f59e0b", Preparing:"#3b82f6", Ready:"#16a34a", Done:"#9ca3af" } as Record<string,string>;
const ROLE_COLOR   = { customer:"#16a34a", staff:"#2563eb", admin:"#dc2626" } as Record<string,string>;
const INIT_ORDERS  = [
  { id:"#1042", items:"Iced Latte + Croissant", table:"T3",         status:"Pending",   time:"2 min ago" },
  { id:"#1041", items:"Cappuccino",             table:"Drive-Thru", status:"Preparing", time:"5 min ago" },
  { id:"#1040", items:"Classic Latte x2",       table:"T1",         status:"Ready",     time:"8 min ago" },
];

// ── Shared Components ─────────────────────────────────────────────────
function Card({ children, style, T }: any) {
  return (
    <View style={[{ backgroundColor:T.card, borderRadius:14, borderWidth:1, borderColor:T.border, shadowColor:"#000", shadowOpacity:0.06, shadowRadius:6, elevation:2, overflow:"hidden" }, style]}>
      {children}
    </View>
  );
}

function GoldBtn({ label, onPress, style }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={[{ backgroundColor:gold, borderRadius:8, paddingVertical:12, paddingHorizontal:20, alignItems:"center" as const }, style]}>
      <Text style={{ color:"#fff", fontWeight:"700", fontSize:14 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function OutlineBtn({ label, onPress, style, T }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={[{ borderRadius:8, borderWidth:2, borderColor:gold, paddingVertical:10, paddingHorizontal:20, alignItems:"center" as const }, style]}>
      <Text style={{ color:gold, fontWeight:"700", fontSize:13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function BottomNav({ tabs, active, setActive, T }: any) {
  return (
    <View style={{ flexDirection:"row", backgroundColor:T.navBg, borderTopWidth:1, borderTopColor:T.border, paddingBottom:Platform.OS==="ios"?20:8, paddingTop:8 }}>
      {tabs.map((t: any) => (
        <TouchableOpacity key={t.val} onPress={() => setActive(t.val)} style={{ flex:1, alignItems:"center", paddingVertical:4 }}>
          {active===t.val && <View style={{ position:"absolute", top:0, width:"60%", height:2, backgroundColor:gold, borderRadius:2 }} />}
          <Text style={{ fontSize:20 }}>{t.icon}</Text>
          <Text style={{ fontSize:10, fontWeight:"700", color:active===t.val?gold:T.subtext, marginTop:2 }}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Receipt Modal ─────────────────────────────────────────────────────
function ReceiptModal({ order, onClose, T }: any) {
  const tax   = (order.total * 0.0875).toFixed(2);
  const grand = (order.total + parseFloat(tax)).toFixed(2);
  return (
    <Modal transparent animationType="slide">
      <View style={s.overlay}>
        <View style={[s.modalBox, { backgroundColor:T.card }]}>
          <Text style={{ fontSize:36, textAlign:"center" }}>🧾</Text>
          <Text style={[s.modalTitle, { color:T.text }]}>Order Receipt</Text>
          <Text style={[s.modalSub, { color:T.subtext }]}>Order {order.id} · {order.date}</Text>
          <View style={[s.dashed, { borderColor:T.border }]} />
          {order.items.map((item: any, i: number) => (
            <View key={i} style={s.row}>
              <Text style={{ fontSize:13, color:T.text }}>{item.name}</Text>
              <Text style={{ fontSize:13, color:T.text }}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
          <View style={[s.dashed, { borderColor:T.border }]} />
          <View style={s.row}><Text style={{ color:T.subtext, fontSize:13 }}>Subtotal</Text><Text style={{ color:T.subtext, fontSize:13 }}>${order.total.toFixed(2)}</Text></View>
          <View style={s.row}><Text style={{ color:T.subtext, fontSize:13 }}>Tax (8.75%)</Text><Text style={{ color:T.subtext, fontSize:13 }}>${tax}</Text></View>
          <View style={[s.row, { marginTop:8 }]}>
            <Text style={{ fontWeight:"900", fontSize:16, color:T.text }}>Total</Text>
            <Text style={{ fontWeight:"900", fontSize:16, color:gold }}>${grand}</Text>
          </View>
          <View style={[s.pointsBadge, { backgroundColor:T.isDark?"#14291a":"#f0fdf4" }]}>
            <Text style={{ color:"#16a34a", fontWeight:"700", fontSize:13 }}>⭐ Points Earned: +{Math.floor(order.total*10)} pts</Text>
          </View>
          <GoldBtn label="Close" onPress={onClose} style={{ marginTop:16 }} />
        </View>
      </View>
    </Modal>
  );
}

// ── Settings Modal ────────────────────────────────────────────────────
function SettingsModal({ user, T, isDark, setIsDark, onClose, setScreen }: any) {
  return (
    <Modal transparent animationType="slide">
      <View style={s.overlay}>
        <View style={[s.modalBox, { backgroundColor:T.card, maxHeight:"85%" }]}>
          <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <Text style={[s.modalTitle, { color:T.text, marginTop:0, textAlign:"left" }]}>⚙️ Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color:T.subtext, fontSize:20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Profile */}
          {user && (
            <View style={[s.settingsRow, { backgroundColor:T.surface2, borderRadius:12, padding:14, marginBottom:16 }]}>
              <View style={{ width:44, height:44, borderRadius:22, backgroundColor:gold, alignItems:"center", justifyContent:"center" }}>
                <Text style={{ fontSize:20 }}>👤</Text>
              </View>
              <View style={{ marginLeft:12 }}>
                <Text style={{ fontWeight:"800", fontSize:15, color:T.text }}>{user.name}</Text>
                <Text style={{ color:T.subtext, fontSize:12 }}>{user.email}</Text>
                <View style={[s.roleBadge, { backgroundColor:ROLE_COLOR[user.role] }]}>
                  <Text style={s.roleBadgeTxt}>{user.role.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Dark Mode Toggle */}
          <View style={[s.settingsRow, { paddingVertical:14, borderBottomWidth:1, borderBottomColor:T.border }]}>
            <Text style={{ fontSize:15, fontWeight:"700", color:T.text }}>{isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}</Text>
            <Switch value={isDark} onValueChange={setIsDark} trackColor={{ false:"#ddd", true:gold }} thumbColor="#fff" />
          </View>

          {/* Customer-only account items */}
          {user?.role === "customer" && (
            <View style={{ marginTop:14 }}>
              <Text style={{ color:T.subtext, fontSize:11, fontWeight:"700", textTransform:"uppercase", marginBottom:10 }}>My Account</Text>
              {[{icon:"⭐",label:"My Rewards",sub:`${user.points} points`,screen:"rewards"},{icon:"📦",label:"Order History",sub:"Past orders & receipts",screen:"history"}].map((r,i) => (
                <TouchableOpacity key={i} onPress={() => { setScreen(r.screen); onClose(); }}
                  style={[s.settingsItem, { backgroundColor:T.surface2, marginBottom:8 }]}>
                  <View>
                    <Text style={{ fontWeight:"700", fontSize:14, color:T.text }}>{r.icon} {r.label}</Text>
                    <Text style={{ color:T.subtext, fontSize:12 }}>{r.sub}</Text>
                  </View>
                  <Text style={{ color:gold, fontSize:18 }}>›</Text>
                </TouchableOpacity>
              ))}
              <View style={[s.settingsItem, { backgroundColor:T.surface2, marginBottom:8, flexDirection:"column", alignItems:"flex-start" }]}>
                <Text style={{ fontWeight:"700", fontSize:14, color:T.text, marginBottom:6 }}>👤 Account Info</Text>
                <Text style={{ color:T.subtext, fontSize:13 }}>Name: {user.name}</Text>
                <Text style={{ color:T.subtext, fontSize:13 }}>Email: {user.email}</Text>
                <Text style={{ color:T.subtext, fontSize:13 }}>Tier: {user.points>=200?"🥇 Gold":user.points>=100?"🥈 Silver":"🥉 Bronze"}</Text>
              </View>
            </View>
          )}

          {/* Preferences */}
          <View style={{ marginTop:14 }}>
            <Text style={{ color:T.subtext, fontSize:11, fontWeight:"700", textTransform:"uppercase", marginBottom:10 }}>Preferences</Text>
            {["Notifications","Location Services","Accessibility"].map((pref,i) => (
              <View key={i} style={[s.settingsRow, { paddingVertical:12, borderBottomWidth:i<2?1:0, borderBottomColor:T.border }]}>
                <Text style={{ fontSize:14, color:T.text }}>{pref}</Text>
                <Text style={{ color:T.subtext, fontSize:12 }}>Manage</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={onClose} style={{ marginTop:20, alignItems:"center" }}>
            <Text style={{ color:T.subtext }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── App Header ────────────────────────────────────────────────────────
function AppHeader({ user, T, isDark, setIsDark, onLogout, showSettings=true }: any) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsScreen, setSettingsScreen] = useState("");
  return (
    <>
      <View style={[s.appHeader, { backgroundColor:T.navBg, borderBottomColor:T.border }]}>
        <View style={{ flexDirection:"row", alignItems:"center", gap:10 }}>
          <Image source={logoImg} style={{ width:36, height:36, borderRadius:8 }} />
          <View>
            <Text style={[s.appHeaderTitle, { color:gold }]}>Caffeinated Lions</Text>
            {user && <Text style={[s.appHeaderSub, { color:T.subtext }]}>{user.name} · ⭐ {user.points||0} pts</Text>}
          </View>
        </View>
        <View style={{ flexDirection:"row", gap:8 }}>
          {showSettings && (
            <TouchableOpacity onPress={() => setSettingsOpen(true)} style={[s.iconBtn, { borderColor:T.border }]}>
              <Text style={{ fontSize:16 }}>⚙️</Text>
            </TouchableOpacity>
          )}
          {user && (
            <TouchableOpacity onPress={onLogout} style={[s.iconBtn, { borderColor:T.border }]}>
              <Text style={{ color:T.subtext, fontSize:12 }}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {settingsOpen && (
        <SettingsModal user={user} T={T} isDark={isDark} setIsDark={setIsDark}
          onClose={() => setSettingsOpen(false)} setScreen={setSettingsScreen} />
      )}
    </>
  );
}

// ── Popular Reel ──────────────────────────────────────────────────────
function PopularReel({ onSignup, T }: any) {
  const popular = [...MENU].filter(m=>m.popular).sort((a,b)=>b.orders-a.orders);
  const [active, setActive] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const t = setInterval(() => {
      Animated.timing(fade, { toValue:0, duration:300, useNativeDriver:true }).start(() => {
        setActive(i => (i+1)%popular.length);
        Animated.timing(fade, { toValue:1, duration:300, useNativeDriver:true }).start();
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={[s.reelSection, { backgroundColor:T.isDark?"#0a0a0a":"#1a1a1a" }]}>
      <Text style={s.reelLabel}>🔥 MOST POPULAR RIGHT NOW</Text>
      <Animated.View style={{ opacity:fade, alignItems:"center" }}>
        <Image source={{ uri:popular[active].img }} style={s.reelImg} />
        <Text style={s.reelName}>{popular[active].name}</Text>
        <Text style={s.reelPrice}>${popular[active].price.toFixed(2)}</Text>
        <Text style={s.reelOrders}>{popular[active].orders} orders this week</Text>
      </Animated.View>
      <View style={{ flexDirection:"row", justifyContent:"center", gap:8, marginTop:14 }}>
        {popular.map((_,i) => (
          <TouchableOpacity key={i} onPress={() => setActive(i)}
            style={{ width:8, height:8, borderRadius:4, backgroundColor:i===active?gold:"#555" }} />
        ))}
      </View>
      <View style={s.reelSignup}>
        <Text style={s.reelSignupTitle}>🎁 Join Rewards & Earn Free Drinks</Text>
        <Text style={s.reelSignupSub}>Sign up and get 50 bonus points on your first order!</Text>
        <GoldBtn label="Create Free Account" onPress={onSignup} style={{ marginTop:14 }} />
      </View>
    </View>
  );
}

// ── Guest Home ────────────────────────────────────────────────────────
function GuestHome({ onLogin, isDark, setIsDark }: any) {
  const T = getTheme(isDark);
  const top3 = [...MENU].sort((a,b)=>b.orders-a.orders).slice(0,3);
  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.bg }]}>
      <StatusBar barStyle={isDark?"light-content":"dark-content"} />
      <AppHeader user={null} T={T} isDark={isDark} setIsDark={setIsDark} onLogout={null} />
      <ScrollView>
        {/* Hero */}
        <View style={s.hero}>
          <Image source={heroImg} style={s.heroBg} />
          <View style={[s.heroOverlay, { backgroundColor:isDark?"rgba(0,0,0,0.5)":"rgba(0,0,0,0.55)" }]} />
          <View style={s.heroContent}>
            <Text style={s.heroTitle}>Fuel Your <Text style={{ color:gold }}>Pride</Text>,{"\n"}One Sip at a Time</Text>
            <Text style={s.heroSub}>Order from your table. Skip the line.</Text>
            <View style={{ flexDirection:"row", gap:10, marginTop:18 }}>
              <GoldBtn label="Order Now" onPress={onLogin} style={{ flex:1 }} />
              <OutlineBtn label="Sign Up" onPress={onLogin} style={{ flex:1 }} T={T} />
            </View>
          </View>
        </View>

        <PopularReel onSignup={onLogin} T={T} />

        {/* Popular Items */}
        <View style={[s.section, { backgroundColor:T.sectionBg }]}>
          <Text style={[s.secTitle, { color:T.text }]}>⭐ Most Popular This Week</Text>
          <Text style={[s.secSub, { color:T.subtext }]}>Our customers can't get enough of these</Text>
          {top3.map((item,i) => (
            <Card key={item.id} style={{ flexDirection:"row", marginBottom:12 }} T={T}>
              <Image source={{ uri:item.img }} style={s.menuImg} />
              <View style={{ flex:1, padding:12 }}>
                {i===0 && <View style={s.badge}><Text style={s.badgeTxt}>#1 Best Seller</Text></View>}
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

        {/* Sign Up Banner */}
        <View style={[s.signupBanner, { backgroundColor:T.isDark?"#0a0a0a":"#1a1a1a" }]}>
          <Text style={s.signupTitle}>Sign Up & Start Earning Rewards</Text>
          <Text style={s.signupSub}>Every order earns points. Redeem for free drinks!</Text>
          <GoldBtn label="Get Started" onPress={onLogin} style={{ marginTop:16 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Login ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onGuest, isDark, setIsDark }: any) {
  const T = getTheme(isDark);
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [err,   setErr]     = useState("");
  const [isSignup, setSign] = useState(false);
  const go = () => {
    const u = USERS.find(x => x.email===email && x.password===pass);
    u ? (setErr(""), onLogin(u)) : setErr("Invalid credentials.");
  };
  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.isDark?"#111":T.bg }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ alignItems:"center", padding:24, paddingTop:48 }}>
        <Image source={logoImg} style={{ width:80, height:80, borderRadius:40, marginBottom:12 }} />
        <Text style={{ color:gold, fontWeight:"900", fontSize:26, marginBottom:4 }}>Caffeinated Lions</Text>
        <Text style={{ color:T.subtext, fontSize:13, marginBottom:32 }}>{isSignup?"Create your account":"Sign in to continue"}</Text>
        <View style={{ width:"100%" }}>
          {isSignup && <TextInput placeholder="Full Name" placeholderTextColor={T.subtext}
            style={[s.input, { backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText }]} />}
          <TextInput value={email} onChangeText={setEmail} placeholder="Email"
            placeholderTextColor={T.subtext} keyboardType="email-address" autoCapitalize="none"
            style={[s.input, { backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText }]} />
          <TextInput value={pass} onChangeText={setPass} placeholder="Password"
            placeholderTextColor={T.subtext} secureTextEntry
            style={[s.input, { backgroundColor:T.inputBg, borderColor:T.inputBorder, color:T.inputText, marginTop:10 }]} />
          {!!err && <Text style={{ color:"#f87171", fontSize:12, marginTop:6 }}>{err}</Text>}
          <GoldBtn label={isSignup?"Create Account":"Sign In"} onPress={go} style={{ marginTop:16 }} />
          <TouchableOpacity onPress={() => setSign(!isSignup)} style={{ marginTop:14, alignItems:"center" }}>
            <Text style={{ color:T.subtext, fontSize:13 }}>
              {isSignup?"Already have an account? ":"Don't have an account? "}
              <Text style={{ color:gold, fontWeight:"700" }}>{isSignup?"Sign In":"Sign Up Free"}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onGuest} style={{ marginTop:10, alignItems:"center" }}>
            <Text style={{ color:T.subtext, fontSize:13 }}>Continue as Guest</Text>
          </TouchableOpacity>
          <View style={{ marginTop:24, borderTopWidth:1, borderTopColor:T.border, paddingTop:16 }}>
            <Text style={{ color:T.subtext, fontSize:10, textAlign:"center", marginBottom:10, fontWeight:"700" }}>DEMO ACCOUNTS</Text>
            {USERS.map(u => (
              <TouchableOpacity key={u.id} onPress={() => { setEmail(u.email); setPass(u.password); setErr(""); }}
                style={[s.demoRow, { backgroundColor:T.surface2, borderColor:T.border }]}>
                <Text style={{ color:T.subtext, fontSize:12 }}>{u.email}</Text>
                <View style={[s.roleBadge, { backgroundColor:ROLE_COLOR[u.role] }]}>
                  <Text style={s.roleBadgeTxt}>{u.role.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Reservations Screen ───────────────────────────────────────────────
function ReservationsScreen({ T }: any) {
  const [step,      setStep]      = useState(1);
  const [date,      setDate]      = useState("");
  const [time,      setTime]      = useState("");
  const [guests,    setGuests]    = useState(2);
  const [table,     setTable]     = useState<number|null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const times = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM",
                 "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"];

  const reset = () => { setStep(1); setDate(""); setTime(""); setGuests(2); setTable(null); setConfirmed(false); };

  if (confirmed) return (
    <ScrollView contentContainerStyle={{ padding:20 }}>
      <View style={{ alignItems:"center", padding:20 }}>
        <Text style={{ fontSize:60, marginBottom:12 }}>✅</Text>
        <Text style={{ fontWeight:"900", fontSize:22, color:T.text, marginBottom:8 }}>Reservation Confirmed!</Text>
        <View style={{ backgroundColor:T.isDark?"#14291a":"#f0fdf4", borderRadius:14, padding:20, width:"100%", marginVertical:16 }}>
          {[["📅 Date", new Date(date).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})],
            ["🕐 Time", time],["👥 Guests", `${guests} ${guests===1?"person":"people"}`],["🪑 Table", `Table ${table}`]
          ].map(([label,val],i) => (
            <View key={i} style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:10 }}>
              <Text style={{ color:T.subtext, fontSize:14 }}>{label}</Text>
              <Text style={{ fontWeight:"700", color:T.text, fontSize:14 }}>{val}</Text>
            </View>
          ))}
        </View>
        <Text style={{ color:T.subtext, fontSize:13, textAlign:"center", marginBottom:20 }}>
          We'll see you soon! A confirmation has been sent to your email.
        </Text>
        <GoldBtn label="Make Another Reservation" onPress={reset} />
      </View>
    </ScrollView>
  );

  return (
    <ScrollView contentContainerStyle={{ padding:16, paddingBottom:40 }}>
      <Text style={[s.secTitle, { color:T.text }]}>🪑 Reserve a Table</Text>
      <Text style={[s.secSub, { color:T.subtext }]}>Book your spot at Caffeinated Lions</Text>

      {/* Step Indicator */}
      <View style={{ flexDirection:"row", alignItems:"center", marginBottom:24 }}>
        {["Date & Time","Party Size","Table"].map((label,i) => (
          <View key={i} style={{ flex: i<2?1:0, flexDirection:"row", alignItems:"center" }}>
            <View style={{ alignItems:"center" }}>
              <View style={{ width:32, height:32, borderRadius:16,
                backgroundColor:step>=i+1?gold:T.surface2,
                alignItems:"center", justifyContent:"center" }}>
                <Text style={{ color:step>=i+1?"#fff":T.subtext, fontWeight:"800", fontSize:13 }}>
                  {step>i+1?"✓":`${i+1}`}
                </Text>
              </View>
              <Text style={{ fontSize:9, fontWeight:"700", color:step===i+1?gold:T.subtext, marginTop:3 }}>{label}</Text>
            </View>
            {i<2 && <View style={{ flex:1, height:2, backgroundColor:step>i+1?gold:T.surface2, marginHorizontal:6, marginBottom:14 }} />}
          </View>
        ))}
      </View>

      {/* Step 1 — Date & Time */}
      {step===1 && (
        <View>
          <Text style={{ fontWeight:"700", fontSize:14, color:T.text, marginBottom:10 }}>📅 Select Date</Text>
          <View style={{ flexDirection:"row", flexWrap:"wrap", gap:8, marginBottom:20 }}>
            {Array.from({length:14},(_,i) => {
              const d = new Date(); d.setDate(d.getDate()+i);
              const val = d.toISOString().split("T")[0];
              const label = i===0?"Today":i===1?"Tomorrow":d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
              return (
                <TouchableOpacity key={val} onPress={() => setDate(val)}
                  style={{ backgroundColor:date===val?gold:T.surface2, borderRadius:10, padding:10, minWidth:70, alignItems:"center",
                    borderWidth:2, borderColor:date===val?gold:"transparent" }}>
                  <Text style={{ color:date===val?"#fff":T.subtext, fontSize:11, fontWeight:"700" }}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {date && (
            <View>
              <Text style={{ fontWeight:"700", fontSize:14, color:T.text, marginBottom:10 }}>🕐 Select Time</Text>
              <View style={{ flexDirection:"row", flexWrap:"wrap", gap:8, marginBottom:20 }}>
                {times.map(t => (
                  <TouchableOpacity key={t} onPress={() => setTime(t)}
                    style={{ backgroundColor:time===t?gold:T.surface2, borderRadius:10, padding:10,
                      borderWidth:2, borderColor:time===t?gold:"transparent" }}>
                    <Text style={{ color:time===t?"#fff":T.subtext, fontSize:12, fontWeight:"700" }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <GoldBtn label="Continue →" onPress={() => setStep(2)}
            style={{ opacity: !date||!time ? 0.4 : 1 }} />
        </View>
      )}

      {/* Step 2 — Party Size */}
      {step===2 && (
        <View>
          <View style={{ backgroundColor:T.surface2, borderRadius:12, padding:14, marginBottom:20 }}>
            <Text style={{ color:T.subtext, fontSize:13 }}>
              📅 {new Date(date).toLocaleDateString("en-US",{month:"long",day:"numeric"})}  🕐 {time}
            </Text>
          </View>
          <Text style={{ fontWeight:"700", fontSize:14, color:T.text, marginBottom:14 }}>👥 How many guests?</Text>
          <View style={s.tableGrid}>
            {[1,2,3,4,5,6,7,8].map(n => (
              <TouchableOpacity key={n} onPress={() => setGuests(n)}
                style={[s.tableBtn, { backgroundColor:guests===n?gold:T.surface2,
                  borderWidth:2, borderColor:guests===n?gold:"transparent" }]}>
                <Text style={[s.tableBtnTxt, { color:guests===n?"#fff":T.text }]}>{n}{n===8?"+":""}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection:"row", gap:10, marginTop:20 }}>
            <OutlineBtn label="← Back" onPress={() => setStep(1)} style={{ flex:1 }} T={T} />
            <GoldBtn label="Continue →" onPress={() => setStep(3)} style={{ flex:2 }} />
          </View>
        </View>
      )}

      {/* Step 3 — Choose Table */}
      {step===3 && (
        <View>
          <View style={{ backgroundColor:T.surface2, borderRadius:12, padding:14, marginBottom:20 }}>
            <Text style={{ color:T.subtext, fontSize:13 }}>
              📅 {new Date(date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}  🕐 {time}  👥 {guests} guests
            </Text>
          </View>
          <Text style={{ fontWeight:"700", fontSize:14, color:T.text, marginBottom:6 }}>🪑 Select a table</Text>
          <View style={{ flexDirection:"row", gap:12, marginBottom:16 }}>
            <Text style={{ color:T.subtext, fontSize:12 }}>🟢 Available</Text>
            <Text style={{ color:T.subtext, fontSize:12 }}>🔴 Taken</Text>
          </View>
          <View style={s.tableGrid}>
            {[1,2,3,4,5,6,7,8].map(tableNum => {
              const taken = [2,5].includes(tableNum);
              return (
                <TouchableOpacity key={tableNum} onPress={() => !taken && setTable(tableNum)} disabled={taken}
                  style={[s.tableBtn, {
                    backgroundColor: table===tableNum ? gold : taken ? "#fee2e2" : T.surface2,
                    borderWidth: 2,
                    borderColor: table===tableNum ? gold : taken ? "#fca5a5" : "transparent",
                    opacity: taken ? 0.6 : 1
                  }]}>
                  <Text style={[s.tableBtnTxt, { color: table===tableNum ? "#fff" : taken ? "#dc2626" : T.text }]}>
                    T{tableNum}{taken ? "🚫" : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {table && (
            <View style={[s.successBox, { backgroundColor:T.isDark?"#14291a":"#dcfce7", marginTop:16 }]}>
              <Text style={{ color:"#16a34a", fontWeight:"700" }}>✅ Table {table} selected</Text>
              <Text style={{ color:"#16a34a", fontSize:12, marginTop:2 }}>
                {new Date(date).toLocaleDateString("en-US",{month:"short",day:"numeric"})} at {time} · {guests} guests
              </Text>
            </View>
          )}
          <View style={{ flexDirection:"row", gap:10, marginTop:20 }}>
            <OutlineBtn label="← Back" onPress={() => setStep(2)} style={{ flex:1 }} T={T} />
            <GoldBtn label="Confirm Reservation" onPress={() => table && setConfirmed(true)}
              style={{ flex:2, opacity: !table?0.4:1 }} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}
function LocationsScreen({ T }: any) {
  const [sel, setSel] = useState<number|null>(null);
  return (
    <ScrollView contentContainerStyle={{ padding:16, paddingBottom:20 }}>
      <Text style={[s.secTitle, { color:T.text }]}>📍 Our Locations</Text>
      {LOCATIONS.map(loc => (
        <TouchableOpacity key={loc.id} onPress={() => setSel(sel===loc.id?null:loc.id)}>
          <Card style={[{ padding:18, marginBottom:12 }, sel===loc.id&&{ borderColor:gold, borderWidth:2 }]} T={T}>
            <Text style={[s.locName, { color:T.text }]}>📍 {loc.name}</Text>
            <Text style={[s.locAddr, { color:T.subtext }]}>{loc.addr}, {loc.city}</Text>
            <Text style={[s.locInfo, { color:T.subtext }]}>📞 {loc.phone}</Text>
            <Text style={[s.locInfo, { color:T.subtext }]}>🕐 {loc.hours}</Text>
            <View style={{ flexDirection:"row", gap:10, marginTop:14 }}>
              <GoldBtn label="Order Here" onPress={() => {}} style={{ flex:1, paddingVertical:10 }} />
              <OutlineBtn label="Directions" onPress={() => {}} style={{ flex:1 }} T={T} />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
      <Card style={{ padding:20, alignItems:"center" }} T={T}>
        <Text style={{ fontSize:40 }}>🗺️</Text>
        <Text style={{ fontWeight:"700", color:T.subtext, marginTop:8 }}>Map View</Text>
        <Text style={{ fontSize:12, color:T.subtext }}>Google Maps via Firebase</Text>
      </Card>
    </ScrollView>
  );
}

// ── Rewards Screen ────────────────────────────────────────────────────
function RewardsScreen({ user, T }: any) {
  const tier    = user.points>=200?"🥇 Gold":user.points>=100?"🥈 Silver":"🥉 Bronze";
  const nextTier = user.points>=200?300:user.points>=100?200:100;
  return (
    <ScrollView contentContainerStyle={{ padding:16, paddingBottom:20 }}>
      <View style={[s.rewardsCard, { backgroundColor:T.isDark?"#0a0a0a":"#1a1a1a" }]}>
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
          <View>
            <Text style={{ color:"#aaa", fontSize:12, fontWeight:"700" }}>YOUR BALANCE</Text>
            <Text style={{ color:gold, fontSize:52, fontWeight:"900" }}>{user.points}</Text>
            <Text style={{ color:"#aaa" }}>points</Text>
          </View>
          <View style={{ alignItems:"center" }}>
            <Text style={{ fontSize:48 }}>🏆</Text>
            <Text style={{ color:gold, fontWeight:"800" }}>{tier}</Text>
          </View>
        </View>
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width:`${user.points%100}%` as any }]} />
        </View>
        <Text style={{ color:"#888", fontSize:12, marginTop:6 }}>{nextTier-user.points} pts until next reward</Text>
      </View>
      <Card style={{ padding:16 }} T={T}>
        <Text style={{ fontWeight:"800", fontSize:16, color:T.text, marginBottom:14 }}>🎁 Rewards Available</Text>
        {[{pts:100,r:"Free Small Coffee",icon:"☕"},{pts:200,r:"Free Medium Drink",icon:"🥤"},{pts:300,r:"Free Any Drink + Food",icon:"🍽️"}].map((rw,i) => (
          <View key={i} style={[{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingVertical:14 }, i<2&&{ borderBottomWidth:1, borderBottomColor:T.border }]}>
            <View style={{ flexDirection:"row", alignItems:"center", gap:12 }}>
              <Text style={{ fontSize:28 }}>{rw.icon}</Text>
              <View>
                <Text style={{ fontWeight:"700", fontSize:14, color:T.text }}>{rw.r}</Text>
                <Text style={{ color:T.subtext, fontSize:12 }}>{rw.pts} pts required</Text>
              </View>
            </View>
            <TouchableOpacity style={[s.redeemBtn, { backgroundColor:user.points>=rw.pts?"#16a34a":T.surface2 }]}>
              <Text style={{ color:user.points>=rw.pts?"#fff":T.subtext, fontWeight:"700", fontSize:12 }}>
                {user.points>=rw.pts?"Redeem":"🔒"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

// ── Customer App ──────────────────────────────────────────────────────
function CustomerApp({ user, setUser, onLogout, isDark, setIsDark }: any) {
  const T = getTheme(isDark);
  const [tab,      setTab]      = useState("home");
  const [cart,     setCart]     = useState<any[]>([]);
  const [receipt,  setReceipt]  = useState<any>(null);
  const [filter,   setFilter]   = useState("Popular");
  const [reserved, setReserved] = useState<number|null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const cats  = ["Popular","Hot Coffee","Iced Coffee","Food"];
  const shown = filter==="Popular" ? [...MENU].sort((a,b)=>b.orders-a.orders) : MENU.filter(m=>m.cat===filter);
  const total = cart.reduce((s:number,i:any)=>s+i.price, 0);

  const placeOrder = () => {
    if (!cart.length) return;
    const o = { id:"#"+(1040+Math.floor(Math.random()*100)), items:cart, total, date:new Date().toLocaleDateString() };
    setReceipt(o); setCart([]); setCartOpen(false);
    setUser((u:any) => ({ ...u, points:u.points+Math.floor(total*10), lastOrder:o }));
  };

  const navTabs = [
    {icon:"🏠",label:"Home",     val:"home"        },
    {icon:"🍽️",label:"Menu",     val:"menu"        },
    {icon:"🚗",label:"Drive-Thru",val:"drive-thru" },
    {icon:"⭐",label:"Rewards",  val:"rewards"     },
    {icon:"📍",label:"Locations",val:"locations"   },
  ];

  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.bg }]}>
      <StatusBar barStyle={isDark?"light-content":"dark-content"} />
      {receipt && <ReceiptModal order={receipt} onClose={() => setReceipt(null)} T={T} />}

      {/* Cart Modal */}
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
                      <Text style={{ color:gold }}>${i.price.toFixed(2)}</Text>
                    </View>
                  ))}
                  <View style={[s.row, { marginTop:12, paddingTop:12, borderTopWidth:1, borderTopColor:T.border }]}>
                    <Text style={{ fontWeight:"900", fontSize:16, color:T.text }}>Total</Text>
                    <Text style={{ fontWeight:"900", fontSize:16, color:gold }}>${total.toFixed(2)}</Text>
                  </View>
                  <View style={{ flexDirection:"row", gap:10, marginTop:16 }}>
                    <TouchableOpacity onPress={() => setCart([])} style={[s.outlineBtnSm, { borderColor:T.border, flex:1 }]}>
                      <Text style={{ color:T.subtext, fontWeight:"700" }}>Clear</Text>
                    </TouchableOpacity>
                    <GoldBtn label="Place Order" onPress={placeOrder} style={{ flex:2 }} />
                  </View>
                </ScrollView>
              )
            }
            <TouchableOpacity onPress={() => setCartOpen(false)} style={{ marginTop:14, alignItems:"center" }}>
              <Text style={{ color:T.subtext }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AppHeader user={user} T={T} isDark={isDark} setIsDark={setIsDark} onLogout={onLogout} />

      {/* Last Order Banner */}
      {user.lastOrder && tab==="menu" && (
        <View style={[s.lastOrderBanner, { backgroundColor:T.isDark?"#0a0a0a":"#1a1a1a" }]}>
          <View style={{ flex:1 }}>
            <Text style={{ color:gold, fontWeight:"800", fontSize:12 }}>🔄 Last Order</Text>
            <Text style={{ color:"#ccc", fontSize:11 }} numberOfLines={1}>
              {user.lastOrder.items.map((i:any)=>i.name).join(", ")} — ${user.lastOrder.total.toFixed(2)}
            </Text>
          </View>
          <View style={{ flexDirection:"row", gap:8 }}>
            <TouchableOpacity onPress={() => setReceipt(user.lastOrder)} style={s.miniBtn}>
              <Text style={{ color:"#fff", fontSize:11 }}>Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCart(user.lastOrder.items)} style={[s.miniBtn, { backgroundColor:gold }]}>
              <Text style={{ color:"#fff", fontSize:11 }}>Reorder</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Sub Tab Bar for customer */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={[s.subTabBar, { backgroundColor:T.navBg, borderBottomColor:T.border }]}
        contentContainerStyle={{ paddingHorizontal:8 }}>
        {[...navTabs,{icon:"🪑",label:"Tables",val:"reservations"},{icon:"📦",label:"Track",val:"track"}].map(t => (
          <TouchableOpacity key={t.val} onPress={() => setTab(t.val)}
            style={[s.subTab, tab===t.val&&{ borderBottomColor:gold, borderBottomWidth:2 }]}>
            <Text style={{ fontSize:13, color:tab===t.val?gold:T.subtext, fontWeight:"700" }}>{t.icon} {t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:100, backgroundColor:T.bg }}>

        {tab==="home" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>⭐ Most Popular</Text>
            {[...MENU].sort((a,b)=>b.orders-a.orders).slice(0,4).map((item,i) => (
              <Card key={item.id} style={{ flexDirection:"row", marginBottom:12 }} T={T}>
                <Image source={{ uri:item.img }} style={s.menuImg} />
                <View style={{ flex:1, padding:12 }}>
                  {i===0&&<View style={s.badge}><Text style={s.badgeTxt}>#1 THIS WEEK</Text></View>}
                  <Text style={[s.menuName, { color:T.text }]}>{item.name}</Text>
                  <Text style={[s.menuCat, { color:T.subtext }]}>{item.orders} orders this week</Text>
                  <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <Text style={s.menuPrice}>${item.price.toFixed(2)}</Text>
                    <GoldBtn label="+ Add" onPress={() => setCart((c:any)=>[...c,item])} style={{ paddingVertical:7, paddingHorizontal:14 }} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {tab==="menu" && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
              {cats.map(c => (
                <TouchableOpacity key={c} onPress={() => setFilter(c)}
                  style={[s.chip, { backgroundColor:filter===c?T.text:T.surface2 }]}>
                  <Text style={{ color:filter===c?T.bg:T.subtext, fontSize:13, fontWeight:"600" }}>{c==="Popular"?"🔥 Popular":c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {shown.map((item,i) => (
              <Card key={item.id} style={{ flexDirection:"row", marginBottom:12 }} T={T}>
                <Image source={{ uri:item.img }} style={s.menuImg} />
                <View style={{ flex:1, padding:12 }}>
                  {filter==="Popular"&&i===0&&<View style={s.badge}><Text style={s.badgeTxt}>#1 THIS WEEK</Text></View>}
                  <Text style={[s.menuName, { color:T.text }]}>{item.name}</Text>
                  <Text style={[s.menuCat, { color:T.subtext }]}>{item.cat}</Text>
                  <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <Text style={s.menuPrice}>${item.price.toFixed(2)}</Text>
                    <GoldBtn label="+ Add" onPress={() => setCart((c:any)=>[...c,item])} style={{ paddingVertical:7, paddingHorizontal:14 }} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {tab==="drive-thru" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>🚗 Drive-Thru Order</Text>
            <Text style={[s.secSub, { color:T.subtext }]}>Order ahead — ready at the window</Text>
            {MENU.filter(m=>m.cat!=="Food").map(item => (
              <Card key={item.id} style={{ flexDirection:"row", marginBottom:12 }} T={T}>
                <Image source={{ uri:item.img }} style={s.menuImg} />
                <View style={{ flex:1, padding:12 }}>
                  <Text style={[s.menuName, { color:T.text }]}>{item.name}</Text>
                  <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <Text style={s.menuPrice}>${item.price.toFixed(2)}</Text>
                    <GoldBtn label="+ Add" onPress={() => setCart((c:any)=>[...c,item])} style={{ paddingVertical:7, paddingHorizontal:14 }} />
                  </View>
                </View>
              </Card>
            ))}
            {cart.length>0 && (
              <Card style={{ padding:16 }} T={T}>
                <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
                  <Text style={{ fontWeight:"800", color:gold, fontSize:16 }}>Total: ${total.toFixed(2)}</Text>
                  <GoldBtn label="Send to Window 🚗" onPress={placeOrder} />
                </View>
              </Card>
            )}
          </View>
        )}

        {tab==="rewards" && <RewardsScreen user={user} T={T} />}
        {tab==="locations" && <LocationsScreen T={T} />}

        {tab==="reservations" && <ReservationsScreen T={T} />}

        {tab==="track" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>📦 Track Your Order</Text>
            {!user.lastOrder
              ? <Text style={[s.secSub, { color:T.subtext }]}>No active order. Place one first!</Text>
              : ["Order Received","Being Prepared","Quality Check","Ready for Pickup"].map((step,i) => (
                <View key={i} style={[s.trackRow, { borderBottomColor:T.border }]}>
                  <View style={[s.trackDot, { backgroundColor:i<3?"#16a34a":T.surface2 }]}>
                    <Text style={{ color:i<3?"#fff":T.subtext, fontWeight:"800" }}>{i<3?"✓":i+1}</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight:i<3?"800":"400", color:i<3?T.text:T.subtext, fontSize:14 }}>{step}</Text>
                    {i<3&&<Text style={{ color:"#16a34a", fontSize:11 }}>Completed</Text>}
                  </View>
                </View>
              ))
            }
          </View>
        )}
      </ScrollView>

      {/* Cart FAB */}
      {cart.length>0 && (
        <TouchableOpacity onPress={() => setCartOpen(true)} style={s.cartFab}>
          <Text style={{ color:"#fff", fontWeight:"800", fontSize:14 }}>🛒 {cart.length} · ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      <BottomNav tabs={navTabs} active={tab} setActive={setTab} T={T} />
    </SafeAreaView>
  );
}

// ── Staff App ─────────────────────────────────────────────────────────
function StaffApp({ user, onLogout, isDark, setIsDark }: any) {
  const T = getTheme(isDark);
  const [tab, setTab]       = useState("orders");
  const [orders, setOrders] = useState(INIT_ORDERS);
  const advance = (id:string) => setOrders(o=>o.map((x:any)=>x.id===id&&STATUS_NEXT[x.status]?{...x,status:STATUS_NEXT[x.status]}:x));
  const tabs = [{icon:"📦",label:"Orders",val:"orders"},{icon:"🪑",label:"Tables",val:"reservations"},{icon:"🚗",label:"Drive-Thru",val:"drive-thru"}];

  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.bg }]}>
      <StatusBar barStyle={isDark?"light-content":"dark-content"} />
      <AppHeader user={user} T={T} isDark={isDark} setIsDark={setIsDark} onLogout={onLogout} />
      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:100, backgroundColor:T.bg }}>
        {tab==="orders" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>Live Order Queue</Text>
            {orders.filter((o:any)=>o.status!=="Done").map((o:any) => (
              <Card key={o.id} style={{ padding:16, marginBottom:12 }} T={T}>
                <Text style={{ fontWeight:"800", fontSize:14, color:T.text }}>{o.id} — {o.items}</Text>
                <Text style={{ color:T.subtext, fontSize:12, marginTop:2 }}>{o.table} · {o.time}</Text>
                <View style={{ flexDirection:"row", alignItems:"center", gap:10, marginTop:10 }}>
                  <View style={[s.statusBadge, { backgroundColor:STATUS_COLOR[o.status] }]}>
                    <Text style={s.statusBadgeTxt}>{o.status}</Text>
                  </View>
                  {STATUS_NEXT[o.status] && (
                    <TouchableOpacity onPress={() => advance(o.id)} style={s.advanceBtn}>
                      <Text style={{ color:"#fff", fontSize:12, fontWeight:"700" }}>→ {STATUS_NEXT[o.status]}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}
        {tab==="reservations" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>Today's Reservations</Text>
            {[{t:"T2",n:"Alice M.",time:"2:00 PM"},{t:"T5",n:"Bob K.",time:"3:30 PM"},{t:"T7",n:"Carol S.",time:"5:00 PM"}].map((r,i) => (
              <Card key={i} style={{ padding:16, marginBottom:10, flexDirection:"row", justifyContent:"space-between" }} T={T}>
                <Text style={{ fontWeight:"700", color:T.text }}>Table {r.t} — {r.n}</Text>
                <Text style={{ color:T.subtext }}>{r.time}</Text>
              </Card>
            ))}
          </View>
        )}
        {tab==="drive-thru" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>Drive-Thru Queue</Text>
            {[{id:"DT-07",items:"Iced Latte",status:"Pending"},{id:"DT-06",items:"Cappuccino + Croissant",status:"Preparing"}].map((o,i) => (
              <Card key={i} style={{ padding:16, marginBottom:10, flexDirection:"row", justifyContent:"space-between", alignItems:"center" }} T={T}>
                <Text style={{ fontWeight:"700", color:T.text }}>{o.id} — {o.items}</Text>
                <View style={[s.statusBadge, { backgroundColor:STATUS_COLOR[o.status] }]}>
                  <Text style={s.statusBadgeTxt}>{o.status}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
      <BottomNav tabs={tabs} active={tab} setActive={setTab} T={T} />
    </SafeAreaView>
  );
}

// ── Admin App ─────────────────────────────────────────────────────────
function AdminApp({ user, onLogout, isDark, setIsDark }: any) {
  const T = getTheme(isDark);
  const [tab, setTab]   = useState("dashboard");
  const [menu, setMenu] = useState(MENU);
  const toggle = (id:number) => setMenu(m=>m.map(x=>x.id===id?{...x,popular:!x.popular}:x));
  const tabs = [{icon:"📊",label:"Dashboard",val:"dashboard"},{icon:"🍽️",label:"Menu",val:"menu"},{icon:"📦",label:"Orders",val:"orders"},{icon:"📍",label:"Locations",val:"locations"},{icon:"👥",label:"Staff",val:"staff"}];

  return (
    <SafeAreaView style={[s.screen, { backgroundColor:T.bg }]}>
      <StatusBar barStyle={isDark?"light-content":"dark-content"} />
      <AppHeader user={user} T={T} isDark={isDark} setIsDark={setIsDark} onLogout={onLogout} />
      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:100, backgroundColor:T.bg }}>

        {tab==="dashboard" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>📊 Overview</Text>
            <View style={s.statsGrid}>
              {[{l:"Orders",v:"142",i:"📦"},{l:"Revenue",v:"$638",i:"💰"},{l:"Tables",v:"6/8",i:"🪑"},{l:"Drive-Thru",v:"34",i:"🚗"}].map((st,i) => (
                <Card key={i} style={[s.statCard, { alignItems:"center" }]} T={T}>
                  <Text style={{ fontSize:28 }}>{st.i}</Text>
                  <Text style={[s.statVal, { color:T.text }]}>{st.v}</Text>
                  <Text style={[s.statLbl, { color:T.subtext }]}>{st.l}</Text>
                </Card>
              ))}
            </View>
            <Card style={{ padding:16, marginTop:4 }} T={T}>
              <Text style={{ fontWeight:"800", fontSize:14, color:T.text, marginBottom:12 }}>🔥 Top Sellers</Text>
              {[...MENU].sort((a,b)=>b.orders-a.orders).slice(0,4).map((x,i) => (
                <View key={i} style={{ marginBottom:10 }}>
                  <View style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:4 }}>
                    <Text style={{ fontSize:13, color:T.text }}>{x.name}</Text>
                    <Text style={{ color:T.subtext, fontSize:13 }}>{x.orders}</Text>
                  </View>
                  <View style={{ backgroundColor:T.surface2, borderRadius:4, height:6 }}>
                    <View style={{ backgroundColor:gold, width:`${(x.orders/203)*100}%` as any, height:6, borderRadius:4 }} />
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}

        {tab==="menu" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>🍽 Menu Management</Text>
            {menu.map(item => (
              <Card key={item.id} style={{ flexDirection:"row", alignItems:"center", padding:12, marginBottom:10, gap:10 }} T={T}>
                <Image source={{ uri:item.img }} style={{ width:48, height:48, borderRadius:10 }} />
                <View style={{ flex:1 }}>
                  <Text style={{ fontWeight:"800", fontSize:13, color:T.text }}>{item.name}</Text>
                  <Text style={{ color:T.subtext, fontSize:11 }}>{item.cat} · ${item.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity onPress={() => toggle(item.id)}
                  style={[s.popBtn, { backgroundColor:item.popular?"#f59e0b":T.surface2 }]}>
                  <Text style={{ color:item.popular?"#fff":T.subtext, fontSize:11, fontWeight:"700" }}>{item.popular?"🔥":"Pop"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.popBtn, { backgroundColor:"#fee2e2" }]}>
                  <Text style={{ color:"#dc2626", fontSize:11, fontWeight:"700" }}>✕</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}

        {tab==="orders" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>📦 All Orders</Text>
            {INIT_ORDERS.map((o,i) => (
              <Card key={i} style={{ padding:14, marginBottom:10 }} T={T}>
                <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
                  <View>
                    <Text style={{ fontWeight:"800", fontSize:13, color:T.text }}>{o.id} — {o.items}</Text>
                    <Text style={{ color:T.subtext, fontSize:11 }}>{o.table} · {o.time}</Text>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor:STATUS_COLOR[o.status] }]}>
                    <Text style={s.statusBadgeTxt}>{o.status}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {tab==="locations" && <LocationsScreen T={T} />}

        {tab==="staff" && (
          <View>
            <Text style={[s.secTitle, { color:T.text }]}>👥 Staff</Text>
            {[{n:"Sara L.",role:"Staff",status:"On Shift"},{n:"James R.",role:"Staff",status:"Off"},{n:"Mike A.",role:"Admin",status:"On Shift"}].map((st,i) => (
              <Card key={i} style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:14, marginBottom:10 }} T={T}>
                <View style={{ flexDirection:"row", alignItems:"center", gap:10 }}>
                  <View style={{ width:36, height:36, borderRadius:18, backgroundColor:T.surface2, alignItems:"center", justifyContent:"center" }}>
                    <Text>👤</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight:"700", color:T.text }}>{st.n}</Text>
                    <Text style={{ color:T.subtext, fontSize:12 }}>{st.role}</Text>
                  </View>
                </View>
                <View style={[s.statusBadge, { backgroundColor:st.status==="On Shift"?T.isDark?"#14291a":"#dcfce7":T.surface2 }]}>
                  <Text style={{ color:st.status==="On Shift"?"#16a34a":T.subtext, fontWeight:"700", fontSize:11 }}>{st.status}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {tab==="settings" && (
          <Card style={{ padding:20 }} T={T}>
            <Text style={[s.secTitle, { color:T.text }]}>⚙️ Settings</Text>
            <View style={[s.settingsRow, { paddingVertical:14, borderBottomWidth:1, borderBottomColor:T.border }]}>
              <Text style={{ fontSize:15, fontWeight:"700", color:T.text }}>{isDark?"🌙 Dark Mode":"☀️ Light Mode"}</Text>
              <Switch value={isDark} onValueChange={setIsDark} trackColor={{ false:"#ddd", true:gold }} thumbColor="#fff" />
            </View>
            {[["Drive-Thru","Enabled"],["Table Reservations","Enabled"],["Online Ordering","Enabled"],["Rewards Program","Enabled"]].map(([k,v],i) => (
              <View key={i} style={[s.settingsRow, { paddingVertical:12, borderBottomWidth:1, borderBottomColor:T.border }]}>
                <Text style={{ fontSize:14, color:T.text }}>{k}</Text>
                <View style={{ backgroundColor:v==="Enabled"?T.isDark?"#14291a":"#dcfce7":T.surface2, borderRadius:20, paddingHorizontal:10, paddingVertical:4 }}>
                  <Text style={{ color:v==="Enabled"?"#16a34a":T.subtext, fontWeight:"700", fontSize:11 }}>{v}</Text>
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
  const [user,   setUser]   = useState<any>(null);
  const [screen, setScreen] = useState<"guest"|"login"|"app">("guest");
  const [isDark, setIsDark] = useState(false);

  const handleLogin  = (u:any) => { setUser(u); setScreen("app"); };
  const handleLogout = () => { setUser(null); setScreen("guest"); };

  if (screen==="login")
    return <LoginScreen onLogin={handleLogin} onGuest={() => setScreen("guest")} isDark={isDark} setIsDark={setIsDark} />;
  if (screen==="guest" || !user)
    return <GuestHome onLogin={() => setScreen("login")} isDark={isDark} setIsDark={setIsDark} />;
  if (user.role==="customer")
    return <CustomerApp user={user} setUser={setUser} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
  if (user.role==="staff")
    return <StaffApp user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
  if (user.role==="admin")
    return <AdminApp user={user} onLogout={handleLogout} isDark={isDark} setIsDark={setIsDark} />;
  return null;
}

// ── Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:         { flex:1 },
  input:          { borderWidth:1, borderRadius:8, padding:14, fontSize:14 },
  appHeader:      { padding:14, flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderBottomWidth:1 },
  appHeaderTitle: { fontWeight:"900", fontSize:17 },
  appHeaderSub:   { fontSize:12, marginTop:1 },
  iconBtn:        { borderWidth:1, borderRadius:7, paddingHorizontal:10, paddingVertical:6, alignItems:"center", justifyContent:"center" },
  hero:           { height:340, position:"relative", justifyContent:"flex-end" },
  heroBg:         { position:"absolute", width:"100%", height:"100%" },
  heroOverlay:    { position:"absolute", width:"100%", height:"100%" },
  heroContent:    { padding:24, paddingBottom:32 },
  heroTitle:      { color:"#fff", fontSize:28, fontWeight:"900", lineHeight:36, textShadowColor:"rgba(0,0,0,0.8)", textShadowOffset:{width:0,height:2}, textShadowRadius:8 },
  heroSub:        { color:"#ddd", fontSize:14, marginTop:8 },
  reelSection:    { padding:24, alignItems:"center" },
  reelLabel:      { color:"#aaa", fontSize:11, fontWeight:"800", letterSpacing:2, marginBottom:16 },
  reelImg:        { width:width-80, height:200, borderRadius:16, marginBottom:14 },
  reelName:       { color:"#fff", fontWeight:"900", fontSize:20 },
  reelPrice:      { color:gold, fontSize:16, fontWeight:"700", marginTop:4 },
  reelOrders:     { color:"#888", fontSize:12, marginTop:4 },
  reelSignup:     { marginTop:24, backgroundColor:"rgba(255,255,255,0.08)", borderRadius:12, padding:18, width:"100%", borderWidth:1, borderColor:"rgba(255,255,255,0.1)" },
  reelSignupTitle:{ color:"#fff", fontWeight:"700", fontSize:14, marginBottom:6 },
  reelSignupSub:  { color:"#aaa", fontSize:12 },
  section:        { padding:20 },
  secTitle:       { fontWeight:"900", fontSize:18, marginBottom:4 },
  secSub:         { fontSize:13, marginBottom:16 },
  sectionBg:      { backgroundColor:"#f9fafb" },
  signupBanner:   { padding:28, alignItems:"center" },
  signupTitle:    { color:"#fff", fontWeight:"900", fontSize:20, textAlign:"center", marginBottom:8 },
  signupSub:      { color:"#aaa", fontSize:13, textAlign:"center" },
  menuImg:        { width:100, height:100 },
  menuName:       { fontWeight:"800", fontSize:14 },
  menuCat:        { fontSize:12, marginTop:2 },
  menuPrice:      { color:gold, fontWeight:"800", fontSize:15 },
  badge:          { backgroundColor:gold, borderRadius:12, paddingHorizontal:8, paddingVertical:2, alignSelf:"flex-start", marginBottom:6 },
  badgeTxt:       { color:"#fff", fontSize:9, fontWeight:"800" },
  chip:           { borderRadius:20, paddingHorizontal:14, paddingVertical:8, marginRight:8 },
  demoRow:        { flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderRadius:7, padding:10, marginBottom:6, borderWidth:1 },
  roleBadge:      { borderRadius:20, paddingHorizontal:7, paddingVertical:2, marginTop:4, alignSelf:"flex-start" },
  roleBadgeTxt:   { color:"#fff", fontSize:9, fontWeight:"800" },
  overlay:        { flex:1, backgroundColor:"rgba(0,0,0,0.75)", justifyContent:"center", alignItems:"center", padding:20 },
  modalBox:       { borderRadius:16, padding:24, width:"100%" },
  modalTitle:     { fontWeight:"900", fontSize:18, textAlign:"center", marginTop:8 },
  modalSub:       { fontSize:12, textAlign:"center", marginTop:4, marginBottom:16 },
  dashed:         { borderTopWidth:2, borderStyle:"dashed", marginVertical:12 },
  row:            { flexDirection:"row", justifyContent:"space-between", paddingVertical:4 },
  pointsBadge:    { borderRadius:8, padding:10, marginTop:12 },
  lastOrderBanner:{ padding:12, flexDirection:"row", alignItems:"center", gap:10 },
  miniBtn:        { backgroundColor:"rgba(255,255,255,0.15)", borderRadius:6, paddingHorizontal:10, paddingVertical:5 },
  subTabBar:      { borderBottomWidth:1, maxHeight:44 },
  subTab:         { paddingHorizontal:14, paddingVertical:10 },
  cartFab:        { position:"absolute", bottom:90, right:16, backgroundColor:gold, borderRadius:30, paddingHorizontal:20, paddingVertical:14, shadowColor:gold, shadowOpacity:0.5, shadowRadius:10, elevation:8 },
  logoutBtn:      { borderWidth:1, borderRadius:6, paddingHorizontal:10, paddingVertical:6 },
  tableGrid:      { flexDirection:"row", flexWrap:"wrap", gap:10 },
  tableBtn:       { width:(width-72)/4, aspectRatio:1, borderRadius:12, alignItems:"center", justifyContent:"center" },
  tableBtnTxt:    { fontWeight:"800", fontSize:14 },
  successBox:     { borderRadius:10, padding:14, marginTop:16 },
  trackRow:       { flexDirection:"row", alignItems:"center", gap:14, paddingVertical:14, borderBottomWidth:1 },
  trackDot:       { width:36, height:36, borderRadius:18, alignItems:"center", justifyContent:"center" },
  rewardsCard:    { borderRadius:16, padding:24, marginBottom:16 },
  progressBg:     { backgroundColor:"rgba(255,255,255,0.2)", borderRadius:4, height:8, marginTop:12 },
  progressFill:   { backgroundColor:gold, height:8, borderRadius:4 },
  redeemBtn:      { borderRadius:8, paddingHorizontal:14, paddingVertical:8 },
  locName:        { fontWeight:"900", fontSize:16, marginBottom:4 },
  locAddr:        { fontSize:13 },
  locInfo:        { fontSize:12, marginTop:4 },
  statusBadge:    { borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  statusBadgeTxt: { color:"#fff", fontWeight:"800", fontSize:11 },
  advanceBtn:     { backgroundColor:"#2563eb", borderRadius:8, paddingHorizontal:12, paddingVertical:7 },
  statsGrid:      { flexDirection:"row", flexWrap:"wrap", gap:10, marginBottom:14 },
  statCard:       { width:(width-52)/2, padding:16 },
  statVal:        { fontWeight:"900", fontSize:22 },
  statLbl:        { fontSize:12 },
  popBtn:         { borderRadius:8, paddingHorizontal:10, paddingVertical:6 },
  settingsRow:    { flexDirection:"row", justifyContent:"space-between", alignItems:"center" },
  settingsItem:   { flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:12, borderRadius:10 },
  outlineBtnSm:   { borderWidth:2, borderRadius:8, paddingVertical:10, alignItems:"center", justifyContent:"center" },
});