import { useState, useEffect } from "react";

// ─── Palette & Tokens ────────────────────────────────────────────────────────
const C = {
  emerald: "#00C896",
  emeraldDark: "#009F78",
  emeraldDim: "#00C89620",
  navy: "#0A1628",
  navyMid: "#0F2040",
  navyLight: "#152B52",
  slate: "#1E3A5F",
  muted: "#8BA3C0",
  mutedDim: "#8BA3C015",
  white: "#F0F8FF",
  danger: "#FF4D6D",
  warning: "#FFB347",
  info: "#4DB8FF",
  gold: "#FFD166",
};

// ─── Sample Data ─────────────────────────────────────────────────────────────
const MEDICINES = [
  { id: 1, name: "Panadol 500mg", generic: "Paracetamol", company: "GSK", category: "Analgesic", batch: "BT-2401", expiry: "2026-06", stock: 240, unit: "Strips", purchase: 45, sale: 65, rack: "A-12", barcode: "5010119035024", status: "active" },
  { id: 2, name: "Augmentin 625mg", generic: "Amoxicillin+Clavulanate", company: "GSK", category: "Antibiotic", batch: "BT-2312", expiry: "2025-03", stock: 8, unit: "Strips", purchase: 280, sale: 350, rack: "B-04", barcode: "5010119078243", status: "low" },
  { id: 3, name: "Brufen 400mg", generic: "Ibuprofen", company: "Abbott", category: "NSAID", batch: "BT-2402", expiry: "2026-09", stock: 180, unit: "Strips", purchase: 38, sale: 55, rack: "A-08", barcode: "5010119021874", status: "active" },
  { id: 4, name: "Glucophage 500mg", generic: "Metformin", company: "Merck", category: "Antidiabetic", batch: "BT-2311", expiry: "2024-12", stock: 12, unit: "Strips", purchase: 95, sale: 130, rack: "C-02", barcode: "5010119043218", status: "expiring" },
  { id: 5, name: "Nexium 20mg", generic: "Esomeprazole", company: "AstraZeneca", category: "PPI", batch: "BT-2403", expiry: "2026-11", stock: 96, unit: "Capsules", purchase: 210, sale: 280, rack: "B-11", barcode: "5010119067431", status: "active" },
  { id: 6, name: "Lipitor 10mg", generic: "Atorvastatin", company: "Pfizer", category: "Statin", batch: "BT-2401", expiry: "2026-05", stock: 3, unit: "Strips", purchase: 320, sale: 420, rack: "C-07", barcode: "5010119091234", status: "low" },
];

const SALES_DAILY = [42000, 38000, 55000, 48000, 61000, 53000, 67000];
const SALES_MONTHLY = [820000, 940000, 875000, 1050000, 1120000, 980000, 1200000, 1090000, 1340000, 1250000, 1180000, 1420000];
const CATEGORIES_DATA = [
  { name: "Antibiotics", value: 28 },
  { name: "Analgesics", value: 22 },
  { name: "Antidiabetics", value: 18 },
  { name: "PPIs", value: 12 },
  { name: "Statins", value: 10 },
  { name: "Others", value: 10 },
];

const CUSTOMERS = [
  { id: 1, name: "Ali Hassan", phone: "0300-1234567", credit: 2800, total: 45000, visits: 23 },
  { id: 2, name: "Fatima Malik", phone: "0321-7654321", credit: 0, total: 28500, visits: 15 },
  { id: 3, name: "Dr. Kamran Ahmed", phone: "0333-9876543", credit: 8500, total: 120000, visits: 67 },
  { id: 4, name: "Zainab Siddiqui", phone: "0311-4567890", credit: 1200, total: 18700, visits: 9 },
];

const SUPPLIERS = [
  { id: 1, name: "MedCo Distributors", contact: "Rashid Ali", phone: "021-35678901", due: 125000, total: 850000 },
  { id: 2, name: "PharmaPak Ltd", contact: "Saad Khan", phone: "042-36789012", due: 0, total: 420000 },
  { id: 3, name: "HealthDist Pvt", contact: "Nadia Butt", phone: "021-37890123", due: 45000, total: 290000 },
];

const POS_CART_INIT = [
  { id: 1, name: "Panadol 500mg", qty: 2, price: 65, discount: 0 },
  { id: 3, name: "Brufen 400mg", qty: 1, price: 55, discount: 5 },
];

// ─── Utility Components ───────────────────────────────────────────────────────
const Badge = ({ children, color = "emerald" }) => {
  const colors = {
    emerald: { bg: C.emeraldDim, text: C.emerald, border: C.emerald + "40" },
    danger: { bg: "#FF4D6D15", text: C.danger, border: C.danger + "40" },
    warning: { bg: "#FFB34715", text: C.warning, border: C.warning + "40" },
    info: { bg: "#4DB8FF15", text: C.info, border: C.info + "40" },
    gold: { bg: "#FFD16615", text: C.gold, border: C.gold + "40" },
  };
  const s = colors[color] || colors.emerald;
  return (
    <span style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase" }}>
      {children}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, color = C.emerald, trend }) => (
  <div style={{ background: `linear-gradient(135deg, ${C.navyMid} 0%, ${C.navyLight} 100%)`, border: `1px solid ${color}25`, borderRadius: 16, padding: "20px 24px", position: "relative", overflow: "hidden", flex: 1, minWidth: 180 }}>
    <div style={{ position: "absolute", right: -20, top: -20, width: 80, height: 80, borderRadius: "50%", background: `${color}12` }} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
      <span style={{ color: C.muted, fontSize: 12, fontWeight: 500, letterSpacing: ".5px", textTransform: "uppercase" }}>{label}</span>
    </div>
    <div style={{ color: C.white, fontSize: 26, fontWeight: 700, fontFamily: "'DM Mono', monospace", letterSpacing: -1 }}>{value}</div>
    {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    {trend && <div style={{ color: trend > 0 ? C.emerald : C.danger, fontSize: 12, marginTop: 4, fontWeight: 600 }}>{trend > 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last week</div>}
  </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const BarChart = ({ data, labels, color = C.emerald, height = 120 }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, padding: "8px 0 0" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: "100%", height: `${(v / max) * (height - 24)}px`, background: `linear-gradient(180deg, ${color} 0%, ${color}55 100%)`, borderRadius: "4px 4px 0 0", transition: "height .4s ease", position: "relative" }}>
            <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: C.muted, whiteSpace: "nowrap" }}>
              {v >= 1000 ? (v / 1000).toFixed(0) + "K" : v}
            </div>
          </div>
          {labels && <span style={{ fontSize: 9, color: C.muted, textAlign: "center" }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

// ─── Donut Chart ─────────────────────────────────────────────────────────────
const DonutChart = ({ data }) => {
  const colors = [C.emerald, C.info, C.warning, C.gold, C.danger, C.muted];
  const total = data.reduce((s, d) => s + d.value, 0);
  let cum = 0;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const start = cum;
    cum += pct;
    return { ...d, start, pct, color: colors[i % colors.length] };
  });
  const r = 52, cx = 64, cy = 64, stroke = 18;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={128} height={128} style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.navyLight} strokeWidth={stroke} />
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${s.pct * circ} ${circ}`}
            strokeDashoffset={-s.start * circ}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dasharray .5s" }} />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill={C.white} fontSize={13} fontWeight={700}>{total}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill={C.muted} fontSize={9}>Coverage</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: C.muted }}>{s.name}</span>
            <span style={{ fontSize: 11, color: C.white, fontWeight: 600, marginLeft: "auto" }}>{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "pos", icon: "⊞", label: "POS / Billing" },
  { id: "medicines", icon: "⬡", label: "Medicines" },
  { id: "inventory", icon: "⊟", label: "Inventory" },
  { id: "purchases", icon: "⊕", label: "Purchases" },
  { id: "customers", icon: "◎", label: "Customers" },
  { id: "suppliers", icon: "◈", label: "Suppliers" },
  { id: "reports", icon: "⊞", label: "Reports" },
  { id: "accounts", icon: "◉", label: "Accounts" },
  { id: "settings", icon: "⊙", label: "Settings" },
];

const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => (
  <div style={{ width: collapsed ? 64 : 220, background: C.navy, borderRight: `1px solid ${C.slate}40`, display: "flex", flexDirection: "column", transition: "width .3s ease", flexShrink: 0, position: "relative", zIndex: 10 }}>
    {/* Logo */}
    <div style={{ padding: collapsed ? "20px 0" : "20px 20px", borderBottom: `1px solid ${C.slate}40`, display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.emerald}, ${C.emeraldDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚕</div>
      {!collapsed && <div>
        <div style={{ color: C.white, fontWeight: 700, fontSize: 14, letterSpacing: -.3 }}>PharmaCloud</div>
        <div style={{ color: C.emerald, fontSize: 10, fontWeight: 500 }}>Pakistan</div>
      </div>}
    </div>
    {/* Nav */}
    <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
      {NAV_ITEMS.map(item => (
        <button key={item.id} onClick={() => setActive(item.id)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "10px 0" : "10px 16px", justifyContent: collapsed ? "center" : "flex-start", background: active === item.id ? `linear-gradient(90deg, ${C.emerald}20, transparent)` : "transparent", border: "none", borderLeft: `3px solid ${active === item.id ? C.emerald : "transparent"}`, color: active === item.id ? C.emerald : C.muted, cursor: "pointer", transition: "all .2s", fontSize: 13, fontWeight: active === item.id ? 600 : 400, borderRadius: "0 8px 8px 0", marginBottom: 2 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
    {/* Collapse btn */}
    <button onClick={() => setCollapsed(!collapsed)}
      style={{ margin: 12, padding: 10, background: C.navyMid, border: `1px solid ${C.slate}60`, borderRadius: 8, color: C.muted, cursor: "pointer", fontSize: 12, transition: "all .2s" }}>
      {collapsed ? "→" : "← Collapse"}
    </button>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const alerts = MEDICINES.filter(m => m.status !== "active");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: C.white, fontSize: 22, fontWeight: 700, margin: 0 }}>Business Dashboard</h1>
          <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>Sunday, 25 May 2026 · Main Branch</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {["Today", "Week", "Month"].map(t => (
            <button key={t} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${C.slate}60`, background: t === "Today" ? C.emerald : C.navyMid, color: t === "Today" ? C.navy : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <StatCard icon="₨" label="Today's Sales" value="₨ 67,450" sub="128 invoices" color={C.emerald} trend={12.4} />
        <StatCard icon="📦" label="Items Sold" value="843" sub="32 products" color={C.info} trend={8.1} />
        <StatCard icon="💰" label="Gross Profit" value="₨ 24,200" sub="35.9% margin" color={C.gold} trend={5.2} />
        <StatCard icon="⚠" label="Low Stock" value="6 items" sub="Needs reorder" color={C.danger} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Weekly Sales Chart */}
        <div style={{ flex: 2, minWidth: 300, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ color: C.white, fontWeight: 600, fontSize: 14 }}>Weekly Sales</div>
              <div style={{ color: C.muted, fontSize: 12 }}>Last 7 days performance</div>
            </div>
            <Badge color="emerald">Live</Badge>
          </div>
          <BarChart data={SALES_DAILY} labels={days} color={C.emerald} height={140} />
        </div>

        {/* Category Donut */}
        <div style={{ flex: 1, minWidth: 240, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Sales by Category</div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>This month</div>
          <DonutChart data={CATEGORIES_DATA} />
        </div>

        {/* Monthly Trend */}
        <div style={{ flex: 2, minWidth: 300, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Monthly Revenue</div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Full year 2026</div>
          <BarChart data={SALES_MONTHLY} labels={months} color={C.info} height={140} />
        </div>
      </div>

      {/* Alerts + Top Medicines */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Alerts */}
        <div style={{ flex: 1, minWidth: 280, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            ⚠ Active Alerts
            <Badge color="danger">{alerts.length}</Badge>
          </div>
          {alerts.map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.slate}30` }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: m.status === "low" ? "#FF4D6D15" : "#FFB34715", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                {m.status === "low" ? "📉" : "⏰"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.white, fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                <div style={{ color: C.muted, fontSize: 11 }}>{m.status === "low" ? `Only ${m.stock} units left` : `Expires ${m.expiry}`}</div>
              </div>
              <Badge color={m.status === "low" ? "danger" : "warning"}>{m.status === "low" ? "Low Stock" : "Expiring"}</Badge>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ flex: 1, minWidth: 240, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🧾", label: "New Sale", color: C.emerald },
              { icon: "📥", label: "Purchase", color: C.info },
              { icon: "💊", label: "Add Medicine", color: C.warning },
              { icon: "📊", label: "Reports", color: C.gold },
              { icon: "🔄", label: "Stock Transfer", color: C.muted },
              { icon: "💳", label: "Customer Pay", color: C.danger },
            ].map(a => (
              <button key={a.label} style={{ background: `${a.color}15`, border: `1px solid ${a.color}30`, borderRadius: 10, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", transition: "all .2s" }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <span style={{ color: C.white, fontSize: 11, fontWeight: 500, textAlign: "center" }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div style={{ flex: 1, minWidth: 260, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Top Customers</div>
          {CUSTOMERS.slice(0, 4).map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: `1px solid ${C.slate}20` }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${[C.emerald, C.info, C.gold, C.warning][i]}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: [C.emerald, C.info, C.gold, C.warning][i] }}>
                {c.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.white, fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                <div style={{ color: C.muted, fontSize: 11 }}>{c.visits} visits</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.emerald, fontSize: 12, fontWeight: 600 }}>₨{(c.total / 1000).toFixed(0)}K</div>
                {c.credit > 0 && <div style={{ color: C.danger, fontSize: 10 }}>Due: ₨{c.credit}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── POS Module ───────────────────────────────────────────────────────────────
const POS = () => {
  const [cart, setCart] = useState(POS_CART_INIT);
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [invoiceDone, setInvoiceDone] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.qty * i.price - i.discount, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax - discount;

  const addItem = (med) => {
    const ex = cart.find(c => c.id === med.id);
    if (ex) setCart(cart.map(c => c.id === med.id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { id: med.id, name: med.name, qty: 1, price: med.sale, discount: 0 }]);
    setSearch("");
  };

  const removeItem = (id) => setCart(cart.filter(c => c.id !== id));
  const updateQty = (id, q) => { if (q < 1) return; setCart(cart.map(c => c.id === id ? { ...c, qty: q } : c)); };

  const filtered = MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.generic.toLowerCase().includes(search.toLowerCase()));

  if (invoiceDone) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 20 }}>
      <div style={{ fontSize: 60 }}>✅</div>
      <div style={{ color: C.white, fontSize: 22, fontWeight: 700 }}>Invoice Saved!</div>
      <div style={{ color: C.muted }}>Invoice #INV-2026-00128 · ₨{total.toLocaleString()}</div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => { setCart([]); setInvoiceDone(false); }} style={{ padding: "10px 24px", background: C.emerald, borderRadius: 10, border: "none", color: C.navy, fontWeight: 700, cursor: "pointer" }}>New Sale</button>
        <button style={{ padding: "10px 24px", background: C.navyMid, borderRadius: 10, border: `1px solid ${C.slate}60`, color: C.muted, cursor: "pointer" }}>Print Invoice</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 20, height: "100%" }}>
      {/* Left: Search + Products */}
      <div style={{ flex: 1.2, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>Point of Sale</h2>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search medicine by name or generic..."
            style={{ width: "100%", padding: "12px 16px", background: C.navyMid, border: `1px solid ${search ? C.emerald : C.slate + "60"}`, borderRadius: 10, color: C.white, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>

        {search && (
          <div style={{ background: C.navyMid, border: `1px solid ${C.slate}60`, borderRadius: 12, overflow: "hidden", maxHeight: 300, overflowY: "auto" }}>
            {filtered.map(m => (
              <button key={m.id} onClick={() => addItem(m)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "transparent", border: "none", borderBottom: `1px solid ${C.slate}30`, cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.emeraldDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💊</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.white, fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ color: C.muted, fontSize: 11 }}>{m.generic} · Stock: {m.stock}</div>
                </div>
                <div style={{ color: C.emerald, fontWeight: 700, fontSize: 14 }}>₨{m.sale}</div>
              </button>
            ))}
          </div>
        )}

        {/* Recent/Quick Medicines */}
        {!search && (
          <div>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Quick Add</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
              {MEDICINES.slice(0, 6).map(m => (
                <button key={m.id} onClick={() => addItem(m)}
                  style={{ background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 12, padding: "14px 12px", cursor: "pointer", textAlign: "left", transition: "all .2s" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>💊</div>
                  <div style={{ color: C.white, fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{m.name}</div>
                  <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>Stock: {m.stock}</div>
                  <div style={{ color: C.emerald, fontSize: 13, fontWeight: 700 }}>₨{m.sale}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Cart + Checkout */}
      <div style={{ width: 340, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 15 }}>Current Bill</div>
          <Badge color="info">{cart.length} items</Badge>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, minHeight: 0, maxHeight: 280 }}>
          {cart.length === 0 && <div style={{ color: C.muted, textAlign: "center", padding: "40px 0", fontSize: 13 }}>Cart is empty</div>}
          {cart.map(item => (
            <div key={item.id} style={{ background: C.navy, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.white, fontSize: 12, fontWeight: 500 }}>{item.name}</span>
                <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 12 }}>✕</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 24, height: 24, borderRadius: 6, background: C.navyLight, border: "none", color: C.white, cursor: "pointer" }}>-</button>
                <span style={{ color: C.white, fontSize: 13, fontWeight: 600, width: 24, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 24, height: 24, borderRadius: 6, background: C.navyLight, border: "none", color: C.white, cursor: "pointer" }}>+</button>
                <span style={{ color: C.muted, fontSize: 11, marginLeft: 4 }}>× ₨{item.price}</span>
                <span style={{ color: C.emerald, fontWeight: 700, fontSize: 13, marginLeft: "auto" }}>₨{item.qty * item.price - item.discount}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.slate}40`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: C.muted, fontSize: 12 }}>
            <span>Subtotal</span><span style={{ color: C.white }}>₨{subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: C.muted, fontSize: 12 }}>
            <span>Tax (5% GST)</span><span style={{ color: C.white }}>₨{tax.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: C.muted, fontSize: 12 }}>Discount</span>
            <input value={discount} onChange={e => setDiscount(+e.target.value || 0)} type="number"
              style={{ width: 70, padding: "4px 8px", background: C.navy, border: `1px solid ${C.slate}60`, borderRadius: 6, color: C.white, fontSize: 12, textAlign: "right" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: C.white, fontWeight: 700, fontSize: 16, paddingTop: 6, borderTop: `1px solid ${C.slate}40` }}>
            <span>Total</span><span style={{ color: C.emerald }}>₨{total.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Payment Method</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {["Cash", "Bank", "Easypaisa", "JazzCash"].map(p => (
              <button key={p} onClick={() => setPayment(p)}
                style={{ padding: "8px 4px", borderRadius: 8, border: `1px solid ${payment === p ? C.emerald : C.slate + "60"}`, background: payment === p ? C.emeraldDim : C.navy, color: payment === p ? C.emerald : C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => cart.length > 0 && setInvoiceDone(true)} disabled={cart.length === 0}
          style={{ padding: "14px", background: cart.length > 0 ? `linear-gradient(135deg, ${C.emerald}, ${C.emeraldDark})` : C.navyLight, border: "none", borderRadius: 12, color: cart.length > 0 ? C.navy : C.muted, fontWeight: 700, fontSize: 14, cursor: cart.length > 0 ? "pointer" : "not-allowed", letterSpacing: .5 }}>
          ✓ Complete Sale · ₨{total.toLocaleString()}
        </button>
      </div>
    </div>
  );
};

// ─── Medicines Module ─────────────────────────────────────────────────────────
const Medicines = () => {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", generic: "", company: "", category: "", purchase: "", sale: "", stock: "", expiry: "", rack: "", batch: "" });

  const filtered = MEDICINES.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.generic.toLowerCase().includes(search.toLowerCase()) ||
    m.company.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = { active: "emerald", low: "danger", expiring: "warning" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: 0 }}>Medicine Management</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>{MEDICINES.length} medicines registered</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "9px 16px", background: C.navyMid, border: `1px solid ${C.slate}60`, borderRadius: 10, color: C.muted, fontSize: 12, cursor: "pointer" }}>⬆ Import</button>
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: "9px 16px", background: C.emerald, border: "none", borderRadius: 10, color: C.navy, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Add Medicine</button>
        </div>
      </div>

      {showAdd && (
        <div style={{ background: C.navyMid, border: `1px solid ${C.emerald}40`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Add New Medicine</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              ["name", "Medicine Name *"], ["generic", "Generic Name"], ["company", "Company/Manufacturer"],
              ["category", "Category"], ["batch", "Batch Number"], ["expiry", "Expiry Date"],
              ["purchase", "Purchase Price (₨)"], ["sale", "Sale Price (₨)"], ["stock", "Opening Stock"],
              ["rack", "Rack/Shelf Location"]
            ].map(([key, lbl]) => (
              <div key={key}>
                <label style={{ color: C.muted, fontSize: 11, display: "block", marginBottom: 4 }}>{lbl}</label>
                <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", background: C.navy, border: `1px solid ${C.slate}60`, borderRadius: 8, color: C.white, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ padding: "10px 24px", background: C.emerald, border: "none", borderRadius: 8, color: C.navy, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Save Medicine</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "10px 24px", background: "transparent", border: `1px solid ${C.slate}60`, borderRadius: 8, color: C.muted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by name, generic, or company..."
        style={{ padding: "12px 16px", background: C.navyMid, border: `1px solid ${C.slate}60`, borderRadius: 10, color: C.white, fontSize: 13, outline: "none" }} />

      <div style={{ background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 80px", gap: 0, padding: "12px 20px", borderBottom: `1px solid ${C.slate}40`, background: C.navy }}>
          {["Medicine", "Generic / Company", "Category", "Stock", "Purchase", "Sale", "Expiry", "Status"].map(h => (
            <div key={h} style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: .5, textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {filtered.map((m, i) => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 80px", gap: 0, padding: "14px 20px", borderBottom: `1px solid ${C.slate}20`, background: i % 2 === 0 ? "transparent" : C.navy + "40", alignItems: "center" }}>
            <div>
              <div style={{ color: C.white, fontSize: 13, fontWeight: 500 }}>{m.name}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Batch: {m.batch} · Rack: {m.rack}</div>
            </div>
            <div>
              <div style={{ color: C.white, fontSize: 12 }}>{m.generic}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{m.company}</div>
            </div>
            <div style={{ color: C.muted, fontSize: 12 }}>{m.category}</div>
            <div style={{ color: m.stock < 10 ? C.danger : C.white, fontSize: 13, fontWeight: 600 }}>{m.stock} <span style={{ color: C.muted, fontSize: 11, fontWeight: 400 }}>{m.unit}</span></div>
            <div style={{ color: C.muted, fontSize: 12 }}>₨{m.purchase}</div>
            <div style={{ color: C.emerald, fontSize: 13, fontWeight: 600 }}>₨{m.sale}</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{m.expiry}</div>
            <Badge color={statusColor[m.status]}>{m.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Customers Module ─────────────────────────────────────────────────────────
const Customers = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: 0 }}>Customer Management</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>{CUSTOMERS.length} registered customers</p>
      </div>
      <button style={{ padding: "9px 16px", background: C.emerald, border: "none", borderRadius: 10, color: C.navy, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Add Customer</button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {CUSTOMERS.map(c => (
        <div key={c.id} style={{ background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.emeraldDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: C.emerald }}>{c.name.charAt(0)}</div>
            <div>
              <div style={{ color: C.white, fontWeight: 600, fontSize: 14 }}>{c.name}</div>
              <div style={{ color: C.muted, fontSize: 12 }}>{c.phone}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { l: "Total Sales", v: `₨${(c.total / 1000).toFixed(0)}K`, c: C.emerald },
              { l: "Due Credit", v: c.credit > 0 ? `₨${c.credit}` : "Clear", c: c.credit > 0 ? C.danger : C.emerald },
              { l: "Visits", v: c.visits, c: C.info },
            ].map(s => (
              <div key={s.l} style={{ background: C.navy, borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ color: s.c, fontSize: 14, fontWeight: 700 }}>{s.v}</div>
                <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button style={{ flex: 1, padding: "8px", background: C.emeraldDim, border: `1px solid ${C.emerald}40`, borderRadius: 8, color: C.emerald, fontSize: 11, cursor: "pointer" }}>View Ledger</button>
            <button style={{ flex: 1, padding: "8px", background: C.navyLight, border: `1px solid ${C.slate}60`, borderRadius: 8, color: C.muted, fontSize: 11, cursor: "pointer" }}>Send SMS</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Reports Module ───────────────────────────────────────────────────────────
const Reports = () => {
  const [selected, setSelected] = useState("sales");
  const reportTypes = [
    { id: "sales", label: "Sales Report", icon: "📊" },
    { id: "purchase", label: "Purchase Report", icon: "📥" },
    { id: "profit", label: "Profit Report", icon: "💰" },
    { id: "stock", label: "Stock Report", icon: "📦" },
    { id: "expiry", label: "Expiry Report", icon: "⏰" },
    { id: "customer", label: "Customer Ledger", icon: "👥" },
    { id: "supplier", label: "Supplier Ledger", icon: "🏭" },
    { id: "tax", label: "Tax / GST Report", icon: "🧾" },
  ];

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 220, flexShrink: 0 }}>
        <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>Reports</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {reportTypes.map(r => (
            <button key={r.id} onClick={() => setSelected(r.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: `1px solid ${selected === r.id ? C.emerald + "40" : C.slate + "40"}`, background: selected === r.id ? C.emeraldDim : C.navyMid, color: selected === r.id ? C.emerald : C.muted, cursor: "pointer", fontSize: 13, fontWeight: selected === r.id ? 600 : 400, textAlign: "left" }}>
              <span>{r.icon}</span><span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ color: C.white, fontSize: 16, fontWeight: 700 }}>{reportTypes.find(r => r.id === selected)?.label}</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>May 2026 · Main Branch</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["PDF", "Excel", "CSV"].map(f => (
              <button key={f} style={{ padding: "7px 14px", background: C.navy, border: `1px solid ${C.slate}60`, borderRadius: 8, color: C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>⬇ {f}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[
            { l: "Total Sales", v: "₨ 12,40,000" },
            { l: "Transactions", v: "1,842" },
            { l: "Avg. Bill", v: "₨ 673" },
            { l: "Profit", v: "₨ 4,20,000" },
          ].map(s => (
            <div key={s.l} style={{ flex: 1, background: C.navy, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ color: C.emerald, fontSize: 16, fontWeight: 700 }}>{s.v}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <BarChart data={SALES_MONTHLY} labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]} color={C.emerald} height={160} />
        <div style={{ marginTop: 20, borderTop: `1px solid ${C.slate}40`, paddingTop: 16 }}>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Recent Transactions</div>
          {[
            { inv: "INV-2026-00128", customer: "Walk-in", amount: 1250, items: 3, method: "Cash", time: "11:42 AM" },
            { inv: "INV-2026-00127", customer: "Ali Hassan", amount: 3800, items: 7, method: "Easypaisa", time: "11:18 AM" },
            { inv: "INV-2026-00126", customer: "Dr. Kamran Ahmed", amount: 8500, items: 12, method: "Bank", time: "10:55 AM" },
            { inv: "INV-2026-00125", customer: "Walk-in", amount: 650, items: 2, method: "Cash", time: "10:32 AM" },
          ].map(t => (
            <div key={t.inv} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.slate}20` }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.white, fontSize: 12, fontWeight: 500 }}>{t.inv}</div>
                <div style={{ color: C.muted, fontSize: 11 }}>{t.customer} · {t.items} items · {t.time}</div>
              </div>
              <Badge color="info">{t.method}</Badge>
              <div style={{ color: C.emerald, fontWeight: 700, fontSize: 13 }}>₨{t.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Suppliers Module ─────────────────────────────────────────────────────────
const Suppliers = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: 0 }}>Supplier Management</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>{SUPPLIERS.length} suppliers registered</p>
      </div>
      <button style={{ padding: "9px 16px", background: C.emerald, border: "none", borderRadius: 10, color: C.navy, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Add Supplier</button>
    </div>
    {SUPPLIERS.map(s => (
      <div key={s.id} style={{ background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: C.emeraldDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏭</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontSize: 15, fontWeight: 600 }}>{s.name}</div>
          <div style={{ color: C.muted, fontSize: 12 }}>{s.contact} · {s.phone}</div>
        </div>
        <div style={{ textAlign: "center", padding: "0 20px" }}>
          <div style={{ color: C.emerald, fontSize: 16, fontWeight: 700 }}>₨{(s.total / 1000).toFixed(0)}K</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Total Purchased</div>
        </div>
        <div style={{ textAlign: "center", padding: "0 20px" }}>
          <div style={{ color: s.due > 0 ? C.danger : C.emerald, fontSize: 16, fontWeight: 700 }}>
            {s.due > 0 ? `₨${(s.due / 1000).toFixed(0)}K` : "Clear"}
          </div>
          <div style={{ color: C.muted, fontSize: 11 }}>Due Amount</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "8px 14px", background: C.emeraldDim, border: `1px solid ${C.emerald}40`, borderRadius: 8, color: C.emerald, fontSize: 11, cursor: "pointer" }}>View Ledger</button>
          <button style={{ padding: "8px 14px", background: C.navyLight, border: `1px solid ${C.slate}60`, borderRadius: 8, color: C.muted, fontSize: 11, cursor: "pointer" }}>New Purchase</button>
        </div>
      </div>
    ))}
  </div>
);

// ─── Inventory Module ─────────────────────────────────────────────────────────
const Inventory = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: 0 }}>Inventory Management</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>Real-time stock tracking</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button style={{ padding: "9px 14px", background: C.navyMid, border: `1px solid ${C.slate}60`, borderRadius: 10, color: C.muted, fontSize: 12, cursor: "pointer" }}>Stock Audit</button>
        <button style={{ padding: "9px 14px", background: C.navyMid, border: `1px solid ${C.slate}60`, borderRadius: 10, color: C.muted, fontSize: 12, cursor: "pointer" }}>Transfer Stock</button>
        <button style={{ padding: "9px 14px", background: C.warning + "20", border: `1px solid ${C.warning}40`, borderRadius: 10, color: C.warning, fontSize: 12, cursor: "pointer" }}>⚠ Damage Entry</button>
      </div>
    </div>
    <div style={{ display: "flex", gap: 16 }}>
      {[
        { l: "Total SKUs", v: MEDICINES.length, icon: "💊", color: C.emerald },
        { l: "Low Stock Items", v: MEDICINES.filter(m => m.status === "low").length, icon: "📉", color: C.danger },
        { l: "Near Expiry", v: MEDICINES.filter(m => m.status === "expiring").length, icon: "⏰", color: C.warning },
        { l: "Total Stock Value", v: "₨ 8.4L", icon: "💰", color: C.gold },
      ].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.color} />)}
    </div>
    <div style={{ background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.slate}40`, color: C.white, fontWeight: 600, fontSize: 14 }}>Stock Ledger</div>
      {MEDICINES.map((m, i) => (
        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: `1px solid ${C.slate}20`, background: i % 2 === 0 ? "transparent" : C.navy + "30" }}>
          <div style={{ flex: 2 }}>
            <div style={{ color: C.white, fontSize: 13, fontWeight: 500 }}>{m.name}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{m.rack} · {m.batch}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 2 }}>Current Stock</div>
            <div style={{ color: m.stock < 10 ? C.danger : C.white, fontSize: 14, fontWeight: 700 }}>{m.stock}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 2 }}>Unit</div>
            <div style={{ color: C.white, fontSize: 12 }}>{m.unit}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 2 }}>Stock Value</div>
            <div style={{ color: C.emerald, fontSize: 12, fontWeight: 600 }}>₨{(m.stock * m.sale).toLocaleString()}</div>
          </div>
          <div style={{ width: 120, background: C.navy, borderRadius: 6, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${Math.min((m.stock / 250) * 100, 100)}%`, height: "100%", background: m.stock < 10 ? C.danger : m.stock < 30 ? C.warning : C.emerald, borderRadius: 6, transition: "width .3s" }} />
          </div>
          <Badge color={statusColor[m.status] || "emerald"}>{m.status}</Badge>
        </div>
      ))}
    </div>
  </div>
);
const statusColor = { active: "emerald", low: "danger", expiring: "warning" };

// ─── Accounts Module ─────────────────────────────────────────────────────────
const Accounts = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: 0 }}>Accounts & Finance</h2>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <StatCard icon="💵" label="Cash in Hand" value="₨ 42,500" color={C.emerald} />
      <StatCard icon="🏦" label="Bank Balance" value="₨ 3,85,000" color={C.info} />
      <StatCard icon="📤" label="Receivables" value="₨ 12,500" color={C.gold} />
      <StatCard icon="📥" label="Payables" value="₨ 1,70,000" color={C.danger} />
    </div>
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
        <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Cash Book — Today</div>
        {[
          { desc: "Opening Balance", type: "in", amount: 18000 },
          { desc: "Sales Collections", type: "in", amount: 48200 },
          { desc: "Supplier Payment (MedCo)", type: "out", amount: 25000 },
          { desc: "Expense — Electricity", type: "out", amount: 3500 },
          { desc: "Sales (Evening)", type: "in", amount: 19250 },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.slate}20` }}>
            <span style={{ color: C.white, fontSize: 12 }}>{t.desc}</span>
            <span style={{ color: t.type === "in" ? C.emerald : C.danger, fontWeight: 600, fontSize: 13 }}>
              {t.type === "in" ? "+" : "-"}₨{t.amount.toLocaleString()}
            </span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", color: C.white, fontWeight: 700 }}>
          <span>Closing Balance</span>
          <span style={{ color: C.emerald, fontSize: 16 }}>₨ 56,950</span>
        </div>
      </div>
      <div style={{ flex: 1, background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, padding: 24 }}>
        <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Expense Categories</div>
        <BarChart data={[12000, 8500, 3500, 25000, 4200, 6800]} labels={["Rent", "Salaries", "Utility", "Purchase", "Transport", "Other"]} color={C.warning} height={140} />
      </div>
    </div>
  </div>
);

// ─── Settings Module ──────────────────────────────────────────────────────────
const Settings = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: 0 }}>Settings & Administration</h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {[
        { icon: "🏪", title: "Pharmacy Profile", desc: "Name, address, license, contact" },
        { icon: "👥", title: "User Management", desc: "Roles, permissions, staff accounts" },
        { icon: "🖨", title: "Printer Settings", desc: "Thermal printer, invoice template" },
        { icon: "📱", title: "SMS / WhatsApp", desc: "Notification templates, API setup" },
        { icon: "🏦", title: "Bank Accounts", desc: "Manage bank & digital payment accounts" },
        { icon: "🔒", title: "Security", desc: "Password policy, OTP, backup & restore" },
        { icon: "🏬", title: "Branch Management", desc: "Add/manage pharmacy branches" },
        { icon: "📄", title: "Drug License", desc: "License tracking, expiry alerts" },
        { icon: "🌙", title: "Appearance", desc: "Dark mode, theme, language" },
      ].map(s => (
        <button key={s.title} style={{ background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 14, padding: "18px 20px", textAlign: "left", cursor: "pointer", transition: "all .2s" }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
          <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
          <div style={{ color: C.muted, fontSize: 12 }}>{s.desc}</div>
        </button>
      ))}
    </div>
  </div>
);

// ─── Purchases Module ────────────────────────────────────────────────────────
const Purchases = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h2 style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: 0 }}>Purchase Module</h2>
        <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>Manage supplier invoices & stock intake</p>
      </div>
      <button style={{ padding: "9px 16px", background: C.emerald, border: "none", borderRadius: 10, color: C.navy, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ New Purchase</button>
    </div>
    <div style={{ display: "flex", gap: 16 }}>
      <StatCard icon="📥" label="This Month" value="₨ 4,85,000" color={C.info} />
      <StatCard icon="🏭" label="Suppliers" value={SUPPLIERS.length} color={C.emerald} />
      <StatCard icon="⏳" label="Pending Dues" value="₨ 1,70,000" color={C.danger} />
    </div>
    <div style={{ background: C.navyMid, border: `1px solid ${C.slate}40`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.slate}40`, color: C.white, fontWeight: 600, fontSize: 14 }}>Recent Purchase Invoices</div>
      {[
        { inv: "PUR-2026-00045", supplier: "MedCo Distributors", date: "24 May 2026", items: 18, amount: 84500, status: "paid" },
        { inv: "PUR-2026-00044", supplier: "PharmaPak Ltd", date: "23 May 2026", items: 12, amount: 52000, status: "paid" },
        { inv: "PUR-2026-00043", supplier: "HealthDist Pvt", date: "22 May 2026", items: 9, amount: 38200, status: "pending" },
        { inv: "PUR-2026-00042", supplier: "MedCo Distributors", date: "20 May 2026", items: 24, amount: 125000, status: "partial" },
      ].map(p => (
        <div key={p.inv} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: `1px solid ${C.slate}20` }}>
          <div style={{ flex: 2 }}>
            <div style={{ color: C.white, fontSize: 13, fontWeight: 500 }}>{p.inv}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{p.supplier} · {p.date}</div>
          </div>
          <div style={{ color: C.muted, fontSize: 12, flex: 1, textAlign: "center" }}>{p.items} items</div>
          <div style={{ color: C.emerald, fontWeight: 700, fontSize: 14, flex: 1, textAlign: "right" }}>₨{p.amount.toLocaleString()}</div>
          <div style={{ width: 80, textAlign: "right" }}>
            <Badge color={p.status === "paid" ? "emerald" : p.status === "partial" ? "warning" : "danger"}>{p.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const MODULES = { dashboard: Dashboard, pos: POS, medicines: Medicines, inventory: Inventory, purchases: Purchases, customers: Customers, suppliers: Suppliers, reports: Reports, accounts: Accounts, settings: Settings };
  const Module = MODULES[active] || Dashboard;

  return (
    <div style={{ display: "flex", height: "100vh", background: C.navy, fontFamily: "'DM Sans', -apple-system, sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 4px; }
        button { font-family: inherit; }
        input { font-family: inherit; }
      `}</style>

      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ padding: "12px 24px", borderBottom: `1px solid ${C.slate}40`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.navyMid, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: C.muted, fontSize: 12 }}>
              🕐 {time.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div style={{ width: 1, height: 16, background: C.slate }} />
            <div style={{ background: C.emeraldDim, border: `1px solid ${C.emerald}30`, borderRadius: 6, padding: "3px 10px", color: C.emerald, fontSize: 11, fontWeight: 600 }}>● Main Branch · Online</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
              🔔
              <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: C.danger, borderRadius: "50%", border: `2px solid ${C.navyMid}` }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: C.navy, borderRadius: 10, border: `1px solid ${C.slate}60` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.emeraldDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.emerald }}>A</div>
              <div>
                <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>Admin User</div>
                <div style={{ color: C.emerald, fontSize: 10 }}>Administrator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <Module />
        </div>
      </div>
    </div>
  );
}
