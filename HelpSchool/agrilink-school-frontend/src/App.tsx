import React, { useMemo, useState } from "react";
import { ShoppingCart, QrCode, Leaf, Egg, Fish, Chicken, Sprout, LineChart as LineChartIcon, Users, School, Handshake, MapPin, Phone, Mail, CheckCircle2, Menu, X } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

// ------------------------------------------------------------
// AgriLink School Model – Single-file React MVP
// ------------------------------------------------------------
// ✅ Mobile-first, Tailwind CSS styling
// ✅ Sections: Hero, About, How It Works, Marketplace, Dashboard, Impact, Join, Contact
// ✅ Cart with pre-order flow + lightweight inline QR (SVG)
// ✅ Recharts used for live-style dashboard visuals
// ------------------------------------------------------------
// Notes:
// - This is a front-end MVP with mock data/state. You can wire it to a real backend later.
// - To use in a Vite app: replace the default App.tsx/tsx with this file content.
// - Tailwind: ensure tailwind is configured; classes are embedded below.
// ------------------------------------------------------------

// ---------- Mock Data ----------
const CATEGORIES = [
  { key: "vegetables", label: "Vegetables", icon: <Sprout className="h-4 w-4"/> },
  { key: "eggs", label: "Eggs", icon: <Egg className="h-4 w-4"/> },
  { key: "mushrooms", label: "Mushrooms", icon: <Leaf className="h-4 w-4"/> },
  { key: "chicken", label: "Chicken", icon: <Chicken className="h-4 w-4"/> },
  { key: "fish", label: "Fish", icon: <Fish className="h-4 w-4"/> },
] as const;

const INVENTORY = [
  { id: "v1", name: "Kale (Organic)", category: "vegetables", unit: "bunch", price: 25, stock: 28 },
  { id: "v2", name: "Cucumber", category: "vegetables", unit: "kg", price: 30, stock: 14 },
  { id: "v3", name: "Tomato (Cherry)", category: "vegetables", unit: "box", price: 45, stock: 10 },
  { id: "e1", name: "Free-range Eggs", category: "eggs", unit: "dozen", price: 65, stock: 22 },
  { id: "m1", name: "Oyster Mushroom", category: "mushrooms", unit: "kg", price: 90, stock: 7 },
  { id: "c1", name: "Chicken (Cut)", category: "chicken", unit: "kg", price: 120, stock: 5 },
  { id: "f1", name: "Tilapia", category: "fish", unit: "kg", price: 95, stock: 9 },
];

// Dashboard mock data (per week)
const HARVEST_SERIES = [
  { week: "W1", vegetables: 42, eggs: 16, mushrooms: 7 },
  { week: "W2", vegetables: 38, eggs: 18, mushrooms: 9 },
  { week: "W3", vegetables: 54, eggs: 20, mushrooms: 8 },
  { week: "W4", vegetables: 49, eggs: 22, mushrooms: 10 },
];

const REVENUE_SERIES = [
  { week: "W1", surplusRevenue: 2150, subscriptions: 900 },
  { week: "W2", surplusRevenue: 1880, subscriptions: 980 },
  { week: "W3", surplusRevenue: 2670, subscriptions: 1100 },
  { week: "W4", surplusRevenue: 2390, subscriptions: 1150 },
];

// ---------- Helpers ----------
function formatCurrency(n: number) {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(n);
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Tiny inline QR svg generator (placeholder for traceability / order token)
function MiniQR({ payload }: { payload: string }) {
  // Produce deterministic pseudo-bits from string
  const bits = React.useMemo(() => {
    let h = 0;
    for (let i = 0; i < payload.length; i++) h = (h * 31 + payload.charCodeAt(i)) >>> 0;
    const arr: number[] = [];
    for (let i = 0; i < 25; i++) { // 5x5 grid
      h = (h ^ (h << 13)) >>> 0; h = (h ^ (h >>> 17)) >>> 0; h = (h ^ (h << 5)) >>> 0;
      arr.push(h & 1);
    }
    return arr;
  }, [payload]);
  return (
    <svg viewBox="0 0 5 5" className="h-16 w-16 rounded bg-white shadow">
      {bits.map((b, i) => (
        <rect key={i} x={i % 5} y={Math.floor(i / 5)} width={1} height={1} fill={b ? "black" : "white"} />
      ))}
    </svg>
  );
}

// ---------- Components ----------
function StatCard({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-2">{icon}</div>
        <div>
          <div className="text-sm text-neutral-500">{label}</div>
          <div className="text-xl font-semibold text-neutral-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">{children}</span>;
}

function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a href="#home" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">AL</span>
          AgriLink School Model
        </a>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <a className="hover:text-emerald-700" href="#about">About</a>
          <a className="hover:text-emerald-700" href="#how">How It Works</a>
          <a className="hover:text-emerald-700" href="#market">Marketplace</a>
          <a className="hover:text-emerald-700" href="#dash">Dashboard</a>
          <a className="hover:text-emerald-700" href="#impact">Impact</a>
          <a className="hover:text-emerald-700" href="#join">Join Us</a>
          <button onClick={onOpenCart} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">
            <ShoppingCart className="h-4 w-4"/> Cart
          </button>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
      </div>
      {open && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-4 py-3 text-sm">
            {[["About","#about"],["How It Works","#how"],["Marketplace","#market"],["Dashboard","#dash"],["Impact","#impact"],["Join Us","#join"]].map(([t, href]) => (
              <a key={t} href={href} className="rounded-lg border border-neutral-200 px-3 py-2 hover:bg-neutral-50" onClick={() => setOpen(false)}>{t}</a>
            ))}
            <button onClick={() => { onOpenCart(); setOpen(false); }} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white">
              <ShoppingCart className="h-4 w-4"/> Open Cart
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5"/> Transparent • Sustainable • Community
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
            From School Farm to <span className="text-emerald-600">Community Table</span>
          </h1>
          <p className="mt-3 text-neutral-600">
            A digital marketplace and transparency hub turning school-farm harvests into healthy meals for students—and selling the surplus to support the school budget.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#market" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700">Support Now</a>
            <a href="#dash" className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-4 py-2.5 font-medium text-neutral-800 hover:bg-neutral-50">See Transparency</a>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-neutral-500">
            <Users className="h-4 w-4"/> Parents & community pre-order via QR | <School className="h-4 w-4"/> Real-world learning for students
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
            <div className="grid h-full grid-cols-3 grid-rows-3 p-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="m-2 rounded-xl bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-100"></div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <LineChartIcon className="h-5 w-5 text-emerald-600"/>
              <div>
                <div className="text-xs text-neutral-500">This month</div>
                <div className="text-sm font-semibold text-neutral-900">1,240 meals served</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Why this matters</h2>
            <p className="mt-3 text-neutral-700">
              Many small schools operate on limited budgets (~100,000 THB/year), with a large share going to utilities. Yet children need safe, nutritious food and meaningful learning. The school farm already grows vegetables, mushrooms, chicken, and fish.
            </p>
            <p className="mt-3 text-neutral-700">
              AgriLink School Model turns harvests into student meals first. Surplus is sold to parents and neighbors via a simple digital marketplace, and the revenue flows back to the school fund—fully transparent.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">Baan Mae Hoi Ngern: our pilot story</h3>
            <ul className="mt-3 space-y-2 text-neutral-700">
              <li>• Small primary school, <em>&lt;100 students</em>, embedded in the community.</li>
              <li>• Existing smart-farm basics (auto sprinklers on low moisture).</li>
              <li>• Harvest prioritizes student meals; surplus offered to parents/community.</li>
            </ul>
            <div className="mt-4 inline-flex flex-wrap gap-2">
              <Tag>Transparency</Tag>
              <Tag>Food Security</Tag>
              <Tag>Community Hub</Tag>
              <Tag>Real Skills</Tag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Farm", desc: "Grow vegetables, mushrooms, chickens, and fish with student help.", icon: <Leaf className="h-5 w-5"/> },
    { title: "Student Meal", desc: "Harvest goes to school kitchen; students eat first.", icon: <Users className="h-5 w-5"/> },
    { title: "Surplus Sale", desc: "Extra produce listed online for parents/community.", icon: <Handshake className="h-5 w-5"/> },
  ];
  return (
    <section id="how" className="border-t border-neutral-200 bg-gradient-to-b from-white to-emerald-50/50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-neutral-900">How it works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700">{s.icon} <span className="font-semibold">{s.title}</span></div>
              <p className="mt-2 text-neutral-700">{s.desc}</p>
              <div className="mt-4 h-24 rounded-xl bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-100"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Cart line item type
type Item = { id: string; name: string; price: number; qty: number; unit: string };

function Marketplace({ onOpenCart, addToCart }: { onOpenCart: () => void; addToCart: (i: Item) => void }) {
  const [active, setActive] = useState<("vegetables"|"eggs"|"mushrooms"|"chicken"|"fish") | "all">("all");
  const products = React.useMemo(() => INVENTORY.filter(p => active === "all" ? true : p.category === active), [active]);
  return (
    <section id="market" className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-neutral-900">Marketplace</h2>
          <div className="flex items-center gap-2 overflow-auto rounded-xl border border-neutral-200 bg-neutral-50 p-1 text-sm">
            <button onClick={() => setActive("all")} className={classNames("rounded-lg px-3 py-1.5", active === "all" && "bg-white shadow")}>All</button>
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setActive(c.key as any)} className={classNames("inline-flex items-center gap-1 rounded-lg px-3 py-1.5", active === c.key && "bg-white shadow")}>{c.icon}{c.label}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map(p => (
            <div key={p.id} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-100"/>
              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-neutral-900">{p.name}</div>
                  <div className="text-sm text-neutral-500">{formatCurrency(p.price)} / {p.unit}</div>
                </div>
                <Tag>Stock: {p.stock}</Tag>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, qty: 1, unit: p.unit })} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Add to Cart
                </button>
                <button onClick={onOpenCart} className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50" aria-label="Open cart"><ShoppingCart className="h-4 w-4"/></button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
          <div className="font-medium text-neutral-800">How pre-order works</div>
          1) Add items → 2) Open Cart → 3) Confirm Pre-order → 4) Show QR at pickup / LINE delivery point.
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  const totalMeals = 1240; // mock
  const surplusTHB = REVENUE_SERIES.reduce((s, r) => s + r.surplusRevenue, 0);
  const subsTHB = REVENUE_SERIES.reduce((s, r) => s + r.subscriptions, 0);
  const contribution = Math.round((surplusTHB + subsTHB) * 0.8); // e.g., 80% to school fund
  return (
    <section id="dash" className="border-t border-neutral-200 bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex items-center gap-2">
          <LineChartIcon className="h-5 w-5 text-emerald-600"/>
          <h2 className="text-2xl font-bold text-neutral-900">Transparency Dashboard</h2>
        </div>
        <p className="mt-2 text-neutral-600">Live overview of harvests, student meals, surplus sales, and contributions back to the school.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Meals served (this month)" value={`${totalMeals.toLocaleString()}`}/>
          <StatCard label="Surplus revenue (month)" value={formatCurrency(surplusTHB)}/>
          <StatCard label="Subscriptions (month)" value={formatCurrency(subsTHB)}/>
          <StatCard label="Contribution to school" value={formatCurrency(contribution)}/>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-neutral-800">Weekly harvest by category</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HARVEST_SERIES}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vegetables" name="Vegetables" />
                  <Bar dataKey="eggs" name="Eggs" />
                  <Bar dataKey="mushrooms" name="Mushrooms" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-neutral-800">Revenue streams (weekly)</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_SERIES}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="surplusRevenue" name="Surplus sales" />
                  <Line type="monotone" dataKey="subscriptions" name="Subscription boxes" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">Data updates hourly from farm logs, kitchen records, and marketplace orders.</div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section id="impact" className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-neutral-900">Impact & Community</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Student stories: learning by doing.", "Parents: safe, fresh food from school.", "Community: sell together, reduce waste."].map((t, i) => (
            <div key={i} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <div className="h-28 rounded-xl bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-100"/>
              <div className="mt-3 font-semibold text-neutral-900">{t}</div>
              <p className="mt-1 text-sm text-neutral-600">Transparent process builds trust and creates a local food loop that benefits the school and community.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinUs() {
  return (
    <section id="join" className="border-t border-neutral-200 bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-neutral-900">Join Us</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="font-semibold">Parents</div>
            <p className="mt-1 text-sm text-neutral-600">Subscribe to a weekly box; pick up at school or LINE delivery points.</p>
            <a href="#market" className="mt-3 inline-flex rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">Subscribe</a>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="font-semibold">Local Farmers</div>
            <p className="mt-1 text-sm text-neutral-600">Join as supply partner; we prioritize school meals and share surplus.</p>
            <a href="#contact" className="mt-3 inline-flex rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50">Become a partner</a>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="font-semibold">Donors / CSR</div>
            <p className="mt-1 text-sm text-neutral-600">Support solar, smart-farm gear, or student kitchen upgrades with transparent reporting.</p>
            <a href="#contact" className="mt-3 inline-flex rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50">Donate / Sponsor</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-neutral-900">Contact</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-neutral-700"><MapPin className="h-4 w-4"/> Baan Mae Hoi Ngern School, Chiang Mai</div>
            <div className="mt-2 flex items-center gap-2 text-neutral-700"><Phone className="h-4 w-4"/> 0x-xxx-xxxx</div>
            <div className="mt-2 flex items-center gap-2 text-neutral-700"><Mail className="h-4 w-4"/> school@example.ac.th</div>
            <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-100"/>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-neutral-800">Quick message</div>
            <form className="mt-3 grid gap-3 text-sm">
              <input className="rounded-lg border border-neutral-300 px-3 py-2" placeholder="Your name"/>
              <input className="rounded-lg border border-neutral-300 px-3 py-2" placeholder="Email or LINE"/>
              <textarea className="min-h-[96px] rounded-lg border border-neutral-300 px-3 py-2" placeholder="Message"/>
              <button className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700" type="button">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function CartDrawer({ open, onClose, items, setItems }: { open: boolean; onClose: () => void; items: Item[]; setItems: (f: (xs: Item[]) => Item[]) => void }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const orderToken = React.useMemo(() => (items.length ? `AGR-${items.map(i => `${i.id}:${i.qty}`).join("|")}` : ""), [items]);

  function updateQty(id: string, d: number) {
    setItems(xs => xs.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x));
  }
  function removeItem(id: string) {
    setItems(xs => xs.filter(x => x.id !== id));
  }

  return (
    <div className={classNames("fixed inset-0 z-50 transition", open ? "pointer-events-auto" : "pointer-events-none")}
         aria-hidden={!open}>
      <div className={classNames("absolute inset-0 bg-black/30", open ? "opacity-100" : "opacity-0")} onClick={onClose}/>
      <aside className={classNames(
        "absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-xl transition",
        open ? "translate-x-0" : "translate-x-full"
      )} aria-label="Cart drawer">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <div className="flex items-center gap-2 font-semibold"><ShoppingCart className="h-4 w-4"/> Cart</div>
          <button onClick={onClose} aria-label="Close cart"><X/></button>
        </div>

        <div className="grid gap-3 p-4">
          {items.length === 0 && <div className="text-sm text-neutral-500">Your cart is empty.</div>}
          {items.map(i => (
            <div key={i.id} className="rounded-xl border border-neutral-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-neutral-900">{i.name}</div>
                  <div className="text-xs text-neutral-500">{formatCurrency(i.price)} / {i.unit}</div>
                </div>
                <button onClick={() => removeItem(i.id)} className="text-xs text-neutral-500 hover:text-neutral-700">Remove</button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <button onClick={() => updateQty(i.id, -1)} className="rounded-lg border px-2 py-1">-</button>
                  <div className="w-8 text-center">{i.qty}</div>
                  <button onClick={() => updateQty(i.id, +1)} className="rounded-lg border px-2 py-1">+</button>
                </div>
                <div className="text-sm font-semibold">{formatCurrency(i.qty * i.price)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-neutral-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-neutral-600">Subtotal</div>
            <div className="font-semibold">{formatCurrency(total)}</div>
          </div>
          <button disabled={!items.length} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white enabled:hover:bg-emerald-700 disabled:opacity-50">
            <QrCode className="h-4 w-4"/> Confirm Pre-order & Generate QR
          </button>
          {orderToken && (
            <div className="mt-4 rounded-xl border border-neutral-200 p-3">
              <div className="text-xs text-neutral-500">Show this QR at pickup / LINE point</div>
              <div className="mt-2 flex items-center gap-3">
                <MiniQR payload={orderToken}/>
                <div className="text-xs text-neutral-600 break-all">Token: {orderToken}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-neutral-500 md:flex-row">
        <div>© {new Date().getFullYear()} AgriLink School Model. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="#about" className="hover:text-neutral-700">About</a>
          <a href="#market" className="hover:text-neutral-700">Marketplace</a>
          <a href="#dash" className="hover:text-neutral-700">Dashboard</a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  function addToCart(i: Item) {
    setItems(xs => {
      const idx = xs.findIndex(x => x.id === i.id);
      if (idx >= 0) {
        const copy = [...xs];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + i.qty };
        return copy;
      }
      return [...xs, i];
    });
    setCartOpen(true);
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header onOpenCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Marketplace onOpenCart={() => setCartOpen(true)} addToCart={addToCart} />
        <Dashboard />
        <Impact />
        <JoinUs />
        <Contact />
      </main>
      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} setItems={setItems} />
    </div>
  );
}
