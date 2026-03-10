import { useState } from "react";

const GOLD = "#fcd34d";
const GREEN = "#0d3d1f";
const GREEN2 = "#1a5c32";

interface MenuItem { id: number; name: string; price: number; cat: string; desc: string; popular?: boolean; emoji: string; }
interface Table { id: number; seats: number; available: boolean; }
interface CartItem extends MenuItem { qty: number; }
interface User { name: string; email: string; }
type Page = "login" | "signup" | "home" | "orderType" | "menu" | "cart" | "tableConfirm" | "tracking";

const menuData: MenuItem[] = [
    { id: 1, name: "Classic Latte", price: 4.50, cat: "Hot Coffee", desc: "Espresso with steamed milk and light foam", popular: true, emoji: "☕" },
    { id: 2, name: "Cappuccino", price: 4.75, cat: "Hot Coffee", desc: "Espresso with equal parts steamed milk and foam", emoji: "☕" },
    { id: 3, name: "Americano", price: 3.50, cat: "Hot Coffee", desc: "Espresso shots with hot water", emoji: "☕" },
    { id: 4, name: "Iced Latte", price: 5.00, cat: "Iced Coffee", desc: "Espresso over ice with cold milk", popular: true, emoji: "🧊" },
    { id: 5, name: "Cold Brew", price: 4.50, cat: "Iced Coffee", desc: "Slow-steeped for 12 hours", emoji: "🧊" },
    { id: 6, name: "Iced Cappuccino", price: 5.25, cat: "Iced Coffee", desc: "Chilled espresso with cold foam", emoji: "🧊" },
    { id: 7, name: "Matcha Latte", price: 4.75, cat: "Tea", desc: "Premium matcha with steamed milk", emoji: "🍵" },
    { id: 8, name: "Chai Latte", price: 4.50, cat: "Tea", desc: "Spiced chai blend with steamed milk", emoji: "🍵" },
    { id: 9, name: "Croissant", price: 3.25, cat: "Food", desc: "Buttery, flaky, freshly baked", emoji: "🥐" },
    { id: 10, name: "Avocado Toast", price: 7.50, cat: "Food", desc: "Sourdough with fresh avocado and seasoning", emoji: "🥑" },
    { id: 11, name: "Vanilla Bean Frappé", price: 5.50, cat: "Specialty", desc: "Blended vanilla with cold foam", popular: true, emoji: "🥤" },
    { id: 12, name: "Caramel Macchiato", price: 5.25, cat: "Specialty", desc: "Espresso with vanilla and caramel drizzle", emoji: "☕" },
];

const tableData: Record<string, Table[]> = {
    "Window Seating": [{ id: 1, seats: 2, available: true }, { id: 2, seats: 2, available: true }, { id: 3, seats: 4, available: false }],
    "Main Dining": [{ id: 4, seats: 4, available: true }, { id: 5, seats: 4, available: true }, { id: 6, seats: 6, available: true }],
    "Outdoor Patio": [{ id: 7, seats: 2, available: false }, { id: 8, seats: 4, available: true }],
    "Private Booths": [{ id: 9, seats: 4, available: true }, { id: 10, seats: 6, available: true }],
};

const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", backgroundColor: "#f9fafb" },
    center: { maxWidth: 1100, margin: "0 auto", padding: "0 32px" },
    centerSm: { maxWidth: 580, margin: "0 auto", padding: "0 24px" },
    row: { display: "flex", alignItems: "center" },
    between: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 },
    grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 },
    grid2: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 },
    nav: { padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", alignItems: "center", gap: 10 },
    logoBox: { width: 38, height: 38, borderRadius: 10, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
    logoTxt: { fontWeight: 700, fontSize: 18, color: "white" },
    logoTxtDk: { fontWeight: 700, fontSize: 18, color: "#111" },
    navLinks: { display: "flex", alignItems: "center", gap: 28 },
    navLink: { background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: 0 },
    navLinkDk: { background: "none", border: "none", color: "#555", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: 0 },
    btnGold: { background: GOLD, color: "#111", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer" },
    btnGoldFull: { background: GOLD, color: "#111", border: "none", borderRadius: 12, padding: "16px", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" },
    btnOutline: { background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.6)", borderRadius: 10, padding: "11px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer" },
    btnDark: { background: "#111", color: "white", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 13, cursor: "pointer", width: "100%" },
    btnDarkFull: { background: "#111", color: "white", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", width: "100%" },
    btnGhost: { background: "#f3f4f6", color: "#555", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px", fontWeight: 600, fontSize: 14, cursor: "pointer", width: "100%" },
    card: { background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    menuCard: { background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    iconBox: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 },
    badge: { background: GOLD, color: "#111", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, display: "inline-block" },
    pill: { borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, display: "inline-block" },
    tag: { background: "#f3f4f6", border: "none", borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#555" },
    tagActive: { background: "#111", border: "none", borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "white" },
    input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" },
    label: { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" },
    errBox: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 },
    infoBox: { background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#92400e", marginBottom: 16 },
};

const Logo = ({ light = false }) => (
    <div style={s.logo}>
        <div style={s.logoBox}>🦁</div>
        <span style={light ? s.logoTxt : s.logoTxtDk}>Caffeinated Lions</span>
    </div>
);

const NavBar = ({ onOrder, light = false, user, onLogout }: { onOrder: () => void; light?: boolean; user: User | null; onLogout: () => void }) => (
    <nav style={s.nav}>
        <Logo light={light} />
        <div style={s.navLinks}>
            <button style={light ? s.navLink : s.navLinkDk}>Locations</button>
            <button style={light ? s.navLink : s.navLinkDk}>About</button>
            {user && <span style={{ fontSize: 13, color: light ? "rgba(255,255,255,0.8)" : "#555", fontWeight: 500 }}>👋 {user.name.split(" ")[0]}</span>}
            {user && <button onClick={onLogout} style={{ ...s.btnGold, background: "transparent", color: light ? "white" : "#111", border: `2px solid ${light ? "rgba(255,255,255,0.5)" : "#e5e7eb"}`, padding: "10px 18px" }}>Sign Out</button>}
            <button onClick={onOrder} style={s.btnGold}>Order Now</button>
        </div>
    </nav>
);

const BackBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 14, marginBottom: 20, padding: 0, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
);

export default function App() {
    const [page, setPage] = useState<Page>("login");
    const [user, setUser] = useState<User | null>(null);
    const [orderType, setOrderType] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cat, setCat] = useState("All");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPass, setLoginPass] = useState("");
    const [loginErr, setLoginErr] = useState("");
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPass, setSignupPass] = useState("");
    const [signupPass2, setSignupPass2] = useState("");
    const [signupErr, setSignupErr] = useState("");
    const [showPass, setShowPass] = useState(false);

    const handleLogin = () => {
        if (!loginEmail || !loginPass) { setLoginErr("Please fill in all fields."); return; }
        if (!loginEmail.includes("@")) { setLoginErr("Please enter a valid email."); return; }
        if (loginPass.length < 6) { setLoginErr("Password must be at least 6 characters."); return; }
        setUser({ name: loginEmail.split("@")[0], email: loginEmail });
        setPage("home"); setLoginErr("");
    };

    const handleSignup = () => {
        if (!signupName || !signupEmail || !signupPass || !signupPass2) { setSignupErr("Please fill in all fields."); return; }
        if (!signupEmail.includes("@")) { setSignupErr("Please enter a valid email."); return; }
        if (signupPass.length < 6) { setSignupErr("Password must be at least 6 characters."); return; }
        if (signupPass !== signupPass2) { setSignupErr("Passwords do not match."); return; }
        setUser({ name: signupName, email: signupEmail });
        setPage("home"); setSignupErr("");
    };

    const handleLogout = () => { setUser(null); setPage("login"); setCart([]); setSelectedTable(null); setOrderType(null); };

    const addToCart = (item: MenuItem) => setCart(p => {
        const ex = p.find(i => i.id === item.id);
        return ex ? p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...p, { ...item, qty: 1 }];
    });
    const updateQty = (id: number, d: number) => setCart(p => p.map(i => i.id === id ? { ...i, qty: i.qty + d } : i).filter(i => i.qty > 0));
    const removeItem = (id: number) => setCart(p => p.filter(i => i.id !== id));

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);
    const categories = ["All", "Hot Coffee", "Iced Coffee", "Tea", "Food", "Specialty"];
    const filtered = cat === "All" ? menuData : menuData.filter(i => i.cat === cat);
    const goHome = () => { setPage("home"); setCart([]); setSelectedTable(null); setOrderType(null); };

    const authSide = (
        <div style={{ flex: 1, background: `linear-gradient(135deg,${GREEN} 0%,${GREEN2} 60%,${GREEN} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, minHeight: "100vh" }}>
            <div style={s.logoBox}>🦁</div>
            <h1 style={{ color: "white", fontSize: 32, fontWeight: 800, marginTop: 16, marginBottom: 8, textAlign: "center" }}>Caffeinated Lions</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 280, lineHeight: 1.6, fontSize: 15 }}>Premium coffee, zero wait. Order from your table, reserve your seat, or grab and go.</p>
            <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 260 }}>
                {[{ icon: "☕", text: "Order from your table" }, { icon: "🚗", text: "Drive-thru & pickup support" }, { icon: "📍", text: "Reserve your seat in advance" }, { icon: "⚡", text: "Frictionless, fast service" }].map(f => (
                    <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{f.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    if (page === "login") return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            {authSide}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48, background: "white" }}>
                <div style={{ width: "100%", maxWidth: 380 }}>
                    <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Welcome back</h2>
                    <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>Sign in to your Caffeinated Lions account</p>
                    {loginErr && <div style={s.errBox}>{loginErr}</div>}
                    <div style={{ marginBottom: 16 }}>
                        <label style={s.label}>Email address</label>
                        <input style={s.input} type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <label style={s.label}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input style={s.input} type={showPass ? "text" : "password"} placeholder="••••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12, padding: 0 }}>{showPass ? "Hide" : "Show"}</button>
                        </div>
                    </div>
                    <div style={{ textAlign: "right", marginBottom: 24 }}>
                        <button style={{ background: "none", border: "none", color: GREEN2, fontSize: 13, cursor: "pointer", fontWeight: 600, padding: 0 }}>Forgot password?</button>
                    </div>
                    <button onClick={handleLogin} style={s.btnGoldFull}>Sign In</button>
                    <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6b7280" }}>
                        Don't have an account?{" "}
                        <button onClick={() => { setLoginErr(""); setPage("signup"); }} style={{ background: "none", border: "none", color: GREEN2, fontWeight: 700, cursor: "pointer", fontSize: 13, padding: 0 }}>Create one</button>
                    </div>
                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
                        <button onClick={() => { setUser({ name: "Guest", email: "guest@caffeinatedlions.com" }); setPage("home"); }} style={s.btnGhost}>Continue as Guest</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // ── SIGNUP ────────────────────────────────────────────────────────────────
    if (page === "signup") return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
            {authSide}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48, background: "white" }}>
                <div style={{ width: "100%", maxWidth: 380 }}>
                    <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create an account</h2>
                    <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>Join Caffeinated Lions today</p>
                    {signupErr && <div style={s.errBox}>{signupErr}</div>}
                    <div style={{ marginBottom: 16 }}><label style={s.label}>Full name</label><input style={s.input} type="text" placeholder="John Doe" value={signupName} onChange={e => setSignupName(e.target.value)} /></div>
                    <div style={{ marginBottom: 16 }}><label style={s.label}>Email address</label><input style={s.input} type="email" placeholder="you@example.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} /></div>
                    <div style={{ marginBottom: 16 }}><label style={s.label}>Password</label><input style={s.input} type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={signupPass} onChange={e => setSignupPass(e.target.value)} /></div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={s.label}>Confirm password</label>
                        <div style={{ position: "relative" }}>
                            <input style={s.input} type={showPass ? "text" : "password"} placeholder="Re-enter password" value={signupPass2} onChange={e => setSignupPass2(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignup()} />
                            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12, padding: 0 }}>{showPass ? "Hide" : "Show"}</button>
                        </div>
                    </div>
                    <button onClick={handleSignup} style={s.btnGoldFull}>Create Account</button>
                    <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#6b7280" }}>
                        Already have an account?{" "}
                        <button onClick={() => { setSignupErr(""); setPage("login"); }} style={{ background: "none", border: "none", color: GREEN2, fontWeight: 700, cursor: "pointer", fontSize: 13, padding: 0 }}>Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // ── HOME ──────────────────────────────────────────────────────────────────
    if (page === "home") return (
        <div style={{ ...s.page, backgroundColor: "white" }}>
            <div style={{ background: `linear-gradient(135deg,${GREEN} 0%,${GREEN2} 50%,${GREEN} 100%)` }}>
                <NavBar onOrder={() => setPage("orderType")} light user={user} onLogout={handleLogout} />
                <div style={{ ...s.center, padding: "48px 48px 72px" }}>
                    <div style={s.badge}>Opening Soon • Multiple Locations</div>
                    <h1 style={{ fontSize: 58, fontWeight: 800, color: "white", margin: "20px 0 4px", lineHeight: 1.1 }}>Premium Coffee,</h1>
                    <h1 style={{ fontSize: 58, fontWeight: 800, color: GOLD, margin: "0 0 20px", lineHeight: 1.1 }}>Zero Wait</h1>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, maxWidth: 500, marginBottom: 32, lineHeight: 1.6 }}>Skip the line. Order from your phone, reserve your table, or grab and go.</p>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => setPage("orderType")} style={s.btnGold}>Start Ordering</button>
                        <button onClick={() => { setOrderType("Dine In"); setPage("orderType"); }} style={s.btnOutline}>Reserve a Table</button>
                    </div>
                </div>
            </div>
            <div style={{ background: "#f9fafb", padding: "64px 48px" }}>
                <div style={s.center}>
                    <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Order Your Way</h2>
                    <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 40, fontSize: 15 }}>Choose the option that works best for you</p>
                    <div style={s.grid4}>
                        {[
                            { icon: "☕", title: "Dine In", desc: "Browse the menu, order, then claim your table", bg: "#d1fae5", action: () => { setOrderType("Dine In"); setPage("menu"); } },
                            { icon: "🛍️", title: "Quick Pickup", desc: "Pre-order and collect at your convenience", bg: "#dbeafe", action: () => { setOrderType("Pickup"); setPage("menu"); } },
                            { icon: "🚗", title: "Drive-Thru", desc: "Express service for customers on the go", bg: "#ede9fe", action: () => { setOrderType("Drive-Thru"); setPage("menu"); } },
                            { icon: "📍", title: "Table Reservations", desc: "Secure your preferred seating in advance", bg: "#fef9c3", action: () => { setOrderType("Dine In"); setPage("menu"); } },
                        ].map(o => (
                            <button key={o.title} onClick={o.action} style={{ ...s.card, textAlign: "left", cursor: "pointer" }}>
                                <div style={{ ...s.iconBox, background: o.bg }}>{o.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{o.title}</div>
                                <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.5, margin: 0 }}>{o.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ padding: "64px 48px", background: "white" }}>
                <div style={s.center}>
                    <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Why Choose Us</h2>
                    <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 48, fontSize: 15 }}>Excellence in every cup, convenience in every order</p>
                    <div style={s.grid3}>
                        {[
                            { icon: "☕", title: "Ethically Sourced", desc: "Premium beans from sustainable farms, roasted fresh daily" },
                            { icon: "⚡", title: "Frictionless Service", desc: "Order ahead, skip the line, get your coffee faster than ever" },
                            { icon: "🏆", title: "Award Winning", desc: "Recognized for excellence in coffee craftsmanship and customer experience" },
                        ].map(w => (
                            <div key={w.title} style={{ textAlign: "center" }}>
                                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>{w.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{w.title}</div>
                                <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <footer style={{ background: "#111", padding: "28px 48px", ...s.between }}>
                <Logo light />
                <span style={{ color: "#6b7280", fontSize: 13 }}>© 2026 Caffeinated Lions. All rights reserved.</span>
            </footer>
        </div>
    );

    // ── ORDER TYPE ────────────────────────────────────────────────────────────
    if (page === "orderType") return (
        <div style={s.page}>
            <div style={{ background: "white", borderBottom: "1px solid #e5e7eb" }}><NavBar onOrder={() => setPage("orderType")} user={user} onLogout={handleLogout} /></div>
            <div style={{ ...s.centerSm, paddingTop: 40, paddingBottom: 40 }}>
                <BackBtn onClick={() => setPage("home")} />
                <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Select Order Type</h1>
                <p style={{ color: "#6b7280", marginBottom: 28, fontSize: 14 }}>Choose how you'd like to receive your order</p>
                <div style={s.grid2}>
                    {[
                        { icon: "🍴", title: "Dine In", desc: "Browse the menu and order — claim your table at checkout", bg: "#d1fae5", pg: () => { setOrderType("Dine In"); setPage("menu"); } },
                        { icon: "🛍️", title: "Pickup", desc: "Order ahead and collect at the counter", bg: "#dbeafe", pg: () => { setOrderType("Pickup"); setPage("menu"); } },
                        { icon: "🚚", title: "Drive-Thru", desc: "Express service without leaving your vehicle", bg: "#ede9fe", pg: () => { setOrderType("Drive-Thru"); setPage("menu"); } },
                        { icon: "☕", title: "Delivery", desc: "Delivered directly to your location", bg: "#ffedd5", pg: () => { setOrderType("Delivery"); setPage("menu"); } },
                    ].map(o => (
                        <div key={o.title} style={s.card}>
                            <div style={{ ...s.iconBox, background: o.bg }}>{o.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{o.title}</div>
                            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{o.desc}</p>
                            <button onClick={o.pg} style={s.btnGold}>Select {o.title}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ── MENU ──────────────────────────────────────────────────────────────────
    if (page === "menu") return (
        <div style={s.page}>
            <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", ...s.between, position: "sticky", top: 0, zIndex: 10 }}>
                <div style={{ ...s.row, gap: 12 }}>
                    <button onClick={() => setPage("orderType")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#555" }}>←</button>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 18 }}>Our Menu</div>
                        <div style={{ color: "#6b7280", fontSize: 12 }}>{orderType || "Dine In"}</div>
                    </div>
                </div>
                <button onClick={() => setPage("cart")} style={{ ...s.btnGold, display: "flex", alignItems: "center", gap: 8, padding: "10px 18px" }}>
                    🛒 Cart {cartCount > 0 && <span style={{ background: "#111", color: "white", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{cartCount}</span>}
                </button>
            </div>
            <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "8px 24px", display: "flex", gap: 8, overflowX: "auto", position: "sticky", top: 57, zIndex: 9 }}>
                {categories.map(c => (
                    <button key={c} onClick={() => setCat(c)} style={cat === c ? s.tagActive : s.tag}>{c}</button>
                ))}
            </div>
            <div style={{ ...s.center, padding: "32px 24px" }}>
                <div style={s.grid3}>
                    {filtered.map(item => (
                        <div key={item.id} style={s.menuCard}>
                            <div style={{ background: "#f3f4f6", height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative" }}>
                                {item.emoji}
                                {item.popular && <span style={{ ...s.badge, position: "absolute", top: 10, left: 10, fontSize: 11 }}>⭐ Popular</span>}
                            </div>
                            <div style={{ padding: 16 }}>
                                <div style={{ ...s.between, marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</span>
                                    <span style={{ fontWeight: 700, fontSize: 14 }}>${item.price.toFixed(2)}</span>
                                </div>
                                <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 12, lineHeight: 1.4 }}>{item.desc}</p>
                                <button onClick={() => addToCart(item)} style={s.btnDark}>+ Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ── CART ──────────────────────────────────────────────────────────────────
    if (page === "cart") return (
        <div style={s.page}>
            <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", ...s.row, gap: 12 }}>
                <button onClick={() => setPage("menu")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#555" }}>←</button>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>Your Cart</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{cartCount} item{cartCount !== 1 ? "s" : ""}</div>
                </div>
            </div>
            <div style={{ ...s.centerSm, paddingTop: 28, paddingBottom: 28 }}>

                {/* Order type info */}
                <div style={{ ...s.card, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 12 }}>Order Information</div>
                    <div style={{ ...s.between, fontSize: 13, paddingBottom: 8 }}><span style={{ color: "#6b7280" }}>Order Type</span><span style={{ fontWeight: 600 }}>{orderType || "Dine In"}</span></div>
                    {orderType === "Dine In" && (
                        <div style={{ ...s.between, fontSize: 13, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
                            <span style={{ color: "#6b7280" }}>Table</span>
                            <button onClick={() => setPage("tableConfirm")} style={{ background: "none", border: "none", cursor: "pointer", color: GREEN2, fontWeight: 700, fontSize: 13, padding: 0 }}>
                                {selectedTable ? `Table ${selectedTable.id} — Change` : "⊕ Select a Table"}
                            </button>
                        </div>
                    )}
                </div>

                {/* Dine-in hint */}
                {orderType === "Dine In" && !selectedTable && (
                    <div style={s.infoBox}>
                        💡 No table selected — your name will be called when your order is ready. You can also <button onClick={() => setPage("tableConfirm")} style={{ background: "none", border: "none", cursor: "pointer", color: "#92400e", fontWeight: 700, fontSize: 13, padding: 0, textDecoration: "underline" }}>select a table</button> now.
                    </div>
                )}

                {cart.length === 0 ? (
                    <div style={{ ...s.card, textAlign: "center", padding: 48 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                        <p style={{ color: "#6b7280", marginBottom: 16 }}>Your cart is empty</p>
                        <button onClick={() => setPage("menu")} style={s.btnGold}>Browse Menu</button>
                    </div>
                ) : (
                    <>
                        <div style={{ ...s.card, marginBottom: 16 }}>
                            {cart.map((item, idx) => (
                                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: idx < cart.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                                    <div style={{ background: "#f3f4f6", width: 60, height: 60, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{item.emoji}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ ...s.between, marginBottom: 2 }}>
                                            <span style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                                            <span style={{ fontWeight: 700, fontSize: 14 }}>${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                        <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 8 }}>${item.price.toFixed(2)} each</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <button onClick={() => updateQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: 700 }}>−</button>
                                            <span style={{ fontWeight: 700, fontSize: 14, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontWeight: 700 }}>+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#ef4444" }}>🗑️</button>
                                </div>
                            ))}
                        </div>
                        <div style={{ ...s.card, marginBottom: 20 }}>
                            <div style={{ fontWeight: 700, marginBottom: 14 }}>Order Summary</div>
                            <div style={{ ...s.between, fontSize: 13, marginBottom: 8 }}><span style={{ color: "#6b7280" }}>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div style={{ ...s.between, fontSize: 13, marginBottom: 12 }}><span style={{ color: "#6b7280" }}>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, ...s.between, fontWeight: 700 }}><span>Total</span><span>${total.toFixed(2)}</span></div>
                        </div>
                        <button onClick={() => setPage("tracking")} style={s.btnGoldFull}>Place Order • ${total.toFixed(2)}</button>
                    </>
                )}
            </div>
        </div>
    );

    // ── TABLE CONFIRM (optional at checkout) ─────────────────────────────────
    if (page === "tableConfirm") return (
        <div style={s.page}>
            <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", ...s.row, gap: 12 }}>
                <button onClick={() => setPage("cart")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#555" }}>←</button>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>Select Your Table</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>Optional — skip to use name-based pickup</div>
                </div>
            </div>
            <div style={{ ...s.centerSm, paddingTop: 28, paddingBottom: 28 }}>
                <div style={s.infoBox}>
                    💡 You can skip this step — if no table is selected, your name will be called when your order is ready.
                </div>
                {Object.entries(tableData).map(([section, tables]) => (
                    <div key={section} style={{ marginBottom: 32 }}>
                        <div style={{ ...s.row, gap: 8, marginBottom: 14 }}>
                            <span>📍</span>
                            <span style={{ fontWeight: 700, fontSize: 15 }}>{section}</span>
                        </div>
                        <div style={s.grid3}>
                            {tables.map(t => (
                                <button key={t.id} disabled={!t.available} onClick={() => { setSelectedTable(t); setPage("cart"); }}
                                    style={{
                                        ...s.card, textAlign: "center", cursor: t.available ? "pointer" : "not-allowed", opacity: t.available ? 1 : 0.45,
                                        border: selectedTable?.id === t.id ? `2px solid ${GOLD}` : "1px solid #e5e7eb", padding: 16
                                    }}>
                                    <div style={{ fontSize: 30, marginBottom: 8 }}>{section === "Private Booths" ? "🛋️" : "🪑"}</div>
                                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Table {t.id}</div>
                                    <div style={{ color: "#9ca3af", fontSize: 11, marginBottom: 8 }}>👥 {t.seats} seats</div>
                                    <span style={{ ...s.pill, background: t.available ? "#d1fae5" : "#f3f4f6", color: t.available ? "#065f46" : "#6b7280" }}>
                                        {t.available ? "Available" : "Occupied"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <button onClick={() => { setSelectedTable(null); setPage("cart"); }} style={s.btnGhost}>
                    Skip — Use Name Pickup Instead
                </button>
            </div>
        </div>
    );

    // ── TRACKING ──────────────────────────────────────────────────────────────
    return (
        <div style={s.page}>
            <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", ...s.between }}>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>Order Tracking</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>ORD-1773118406574</div>
                </div>
                <button onClick={goHome} style={{ ...s.tag, display: "flex", alignItems: "center", gap: 6 }}>🏠 Home</button>
            </div>
            <div style={{ ...s.centerSm, paddingTop: 28, paddingBottom: 28 }}>
                <div style={{ ...s.card, textAlign: "center", marginBottom: 16, padding: 36 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>☕</div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Preparing</h2>
                    <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Our expert baristas are crafting your order</p>
                    <div style={{ background: "#e5e7eb", borderRadius: 20, height: 8, marginBottom: 8, overflow: "hidden" }}>
                        <div style={{ background: "#111", width: "50%", height: "100%", borderRadius: 20 }}></div>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Estimated time: 12 minutes</p>
                </div>
                <div style={{ ...s.card, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 14 }}>Order Progress</div>
                    {[
                        { label: "Order Placed", sub: "Completed", icon: "🕐", done: true },
                        { label: "Preparing", sub: "In progress...", icon: "☕", done: true },
                        { label: "Ready", sub: "Pending", icon: "📦", done: false },
                        { label: "Completed", sub: "Pending", icon: "✅", done: false },
                    ].map((step, i, arr) => (
                        <div key={step.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid #f9fafb" : "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: step.done ? "#d1fae5" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{step.icon}</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{step.label}</div>
                                    <div style={{ color: "#9ca3af", fontSize: 12 }}>{step.sub}</div>
                                </div>
                            </div>
                            {step.done && <span style={{ color: "#10b981", fontWeight: 700, fontSize: 18 }}>✓</span>}
                        </div>
                    ))}
                </div>
                <div style={{ ...s.card, marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 14 }}>Order Details</div>
                    <div style={{ ...s.between, fontSize: 13, marginBottom: 8 }}><span style={{ color: "#6b7280" }}>Order Type</span><span style={{ fontWeight: 600 }}>{orderType || "Dine In"}</span></div>
                    <div style={{ ...s.between, fontSize: 13, marginBottom: 8 }}>
                        <span style={{ color: "#6b7280" }}>Table / Pickup</span>
                        <span style={{ fontWeight: 600 }}>{selectedTable ? `Table ${selectedTable.id}` : `Name: ${user?.name || "Guest"}`}</span>
                    </div>
                    <div style={{ ...s.between, fontSize: 13 }}><span style={{ color: "#6b7280" }}>Order Time</span><span style={{ fontWeight: 600 }}>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
                </div>
                <div style={{ ...s.card, marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, marginBottom: 14 }}>Order Items ({cartCount})</div>
                    {cart.map((item, idx) => (
                        <div key={item.id} style={{ ...s.between, padding: "10px 0", borderBottom: idx < cart.length - 1 ? "1px solid #f0f0f0" : "none", fontSize: 13 }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{item.qty}x {item.name}</div>
                                <div style={{ color: "#9ca3af", fontSize: 12 }}>${item.price.toFixed(2)} each</div>
                            </div>
                            <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ ...s.between, fontWeight: 700, paddingTop: 12, borderTop: "1px solid #e5e7eb", marginTop: 4 }}>
                        <span>Total</span><span>${total.toFixed(2)}</span>
                    </div>
                </div>
                <button onClick={goHome} style={s.btnGoldFull}>Order Again</button>
            </div>
        </div>
    );
}