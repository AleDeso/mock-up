import { useState } from "react";
import {
  BarChart2, FileText, TrendingUp, Bell, Search, ChevronDown,
  Plus, Eye, ArrowUpRight, ArrowDownRight, Minus, Package,
  Building2, Users, Settings, LogOut, Menu, X, Filter,
  ShoppingCart, Hotel, ChevronRight, Home, Download, RefreshCw
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

const suppliersData = [
  "Tutti i Fornitori", "Metro Italia S.p.A.", "Makro Cash & Carry", "Olitalia S.r.l.",
  "Surgital S.p.A.", "Ferrarini Group", "Bidfood Italia", "Levoni S.p.A.", "Citterio S.p.A."
];
const structuresData = [
  "Tutte le Strutture", "Grand Hotel Baglioni – Firenze", "Hotel Excelsior – Roma",
  "Boscolo Grand Hotel – Venezia", "Grand Hotel Quisisana – Capri",
  "Hotel de Russie – Roma", "Belmond Hotel Caruso – Ravello"
];
const categoriesData = [
  "Tutte le Categorie", "Bevande", "Carni", "Pesce & Frutti di Mare",
  "Latticini & Formaggi", "Salumi & Affettati", "Pasta & Cereali",
  "Oli & Condimenti", "Dolci & Pasticceria", "Verdure & Ortaggi"
];
const subcategoriesData = [
  "Tutte le Sottocategorie", "Vini DOC", "Spirits & Liquori", "Acque Minerali",
  "Birre Artigianali", "Carni Rosse", "Pollame", "Pesce Fresco",
  "Formaggi DOP", "Pasta Fresca", "Olio EVO"
];

const priceTrackerData = [
  {
    id: 1, supplier: "Metro Italia S.p.A.", product: "Olio Extra Vergine Oliva DOP",
    description: "5L – Bottiglia in vetro, Frantoio Toscano",
    subcategory: "Olio EVO", subcategoryColor: "bg-amber-100 text-amber-700",
    prevPrice: 28.50, prevDate: "15/01/2025",
    lastPrice: 31.20, lastDate: "12/03/2025",
  },
  {
    id: 2, supplier: "Surgital S.p.A.", product: "Tortellini Ricotta & Spinaci",
    description: "3kg – Pasta fresca surgelata, formato classico",
    subcategory: "Pasta Fresca", subcategoryColor: "bg-yellow-100 text-yellow-700",
    prevPrice: 18.90, prevDate: "10/01/2025",
    lastPrice: 17.40, lastDate: "08/03/2025",
  },
  {
    id: 3, supplier: "Ferrarini Group", product: "Prosciutto di Parma DOP 18 mesi",
    description: "Coscia intera – circa 8–9 kg, con osso",
    subcategory: "Salumi & Affettati", subcategoryColor: "bg-rose-100 text-rose-700",
    prevPrice: 142.00, prevDate: "05/02/2025",
    lastPrice: 158.50, lastDate: "14/03/2025",
  },
  {
    id: 4, supplier: "Bidfood Italia", product: "Salmone Atlantico Affumicato",
    description: "1kg – Filetto, affumicatura a freddo, Norvegia",
    subcategory: "Pesce Fresco", subcategoryColor: "bg-blue-100 text-blue-700",
    prevPrice: 34.00, prevDate: "20/01/2025",
    lastPrice: 34.00, lastDate: "01/03/2025",
  },
  {
    id: 5, supplier: "Olitalia S.r.l.", product: "Aceto Balsamico di Modena IGP",
    description: "250ml – Invecchiato 3 anni, bottiglia tradizionale",
    subcategory: "Oli & Condimenti", subcategoryColor: "bg-purple-100 text-purple-700",
    prevPrice: 12.80, prevDate: "08/02/2025",
    lastPrice: 11.90, lastDate: "10/03/2025",
  },
  {
    id: 6, supplier: "Makro Cash & Carry", product: "Parmigiano Reggiano DOP 24 mesi",
    description: "Forma intera – circa 38–40 kg, stagionato",
    subcategory: "Formaggi DOP", subcategoryColor: "bg-orange-100 text-orange-700",
    prevPrice: 520.00, prevDate: "12/01/2025",
    lastPrice: 598.00, lastDate: "15/03/2025",
  },
  {
    id: 7, supplier: "Levoni S.p.A.", product: "Mortadella Bologna IGP",
    description: "Intera – circa 10 kg, con pistacchi",
    subcategory: "Salumi & Affettati", subcategoryColor: "bg-rose-100 text-rose-700",
    prevPrice: 68.00, prevDate: "03/02/2025",
    lastPrice: 64.50, lastDate: "11/03/2025",
  },
  {
    id: 8, supplier: "Metro Italia S.p.A.", product: "Champagne Moët & Chandon Brut",
    description: "Cassa 6 bottiglie – 0.75L, Blanc de Blanc",
    subcategory: "Vini DOC", subcategoryColor: "bg-green-100 text-green-700",
    prevPrice: 198.00, prevDate: "22/01/2025",
    lastPrice: 231.00, lastDate: "16/03/2025",
  },
];

const invoicesData = [
  {
    id: 1, date: "16/03/2025", invoiceNum: "FT-2025-0412", supplier: "Metro Italia S.p.A.",
    location: "Grand Hotel Baglioni – Firenze", products: 24, cost: 3842.50,
    vat: 768.50, category: "Varie"
  },
  {
    id: 2, date: "15/03/2025", invoiceNum: "FT-2025-0411", supplier: "Ferrarini Group",
    location: "Hotel Excelsior – Roma", products: 8, cost: 1265.00,
    vat: 151.80, category: "Salumi & Affettati"
  },
  {
    id: 3, date: "14/03/2025", invoiceNum: "FT-2025-0409", supplier: "Surgital S.p.A.",
    location: "Boscolo Grand Hotel – Venezia", products: 15, cost: 892.40,
    vat: 178.48, category: "Pasta & Cereali"
  },
  {
    id: 4, date: "12/03/2025", invoiceNum: "FT-2025-0405", supplier: "Bidfood Italia",
    location: "Grand Hotel Quisisana – Capri", products: 11, cost: 2341.00,
    vat: 468.20, category: "Pesce & Frutti di Mare"
  },
  {
    id: 5, date: "11/03/2025", invoiceNum: "FT-2025-0403", supplier: "Olitalia S.r.l.",
    location: "Hotel de Russie – Roma", products: 6, cost: 534.80,
    vat: 53.48, category: "Oli & Condimenti"
  },
  {
    id: 6, date: "10/03/2025", invoiceNum: "FT-2025-0401", supplier: "Makro Cash & Carry",
    location: "Belmond Hotel Caruso – Ravello", products: 32, cost: 5120.00,
    vat: 1024.00, category: "Varie"
  },
  {
    id: 7, date: "08/03/2025", invoiceNum: "FT-2025-0398", supplier: "Levoni S.p.A.",
    location: "Grand Hotel Baglioni – Firenze", products: 5, cost: 645.00,
    vat: 77.40, category: "Salumi & Affettati"
  },
  {
    id: 8, date: "07/03/2025", invoiceNum: "FT-2025-0395", supplier: "Citterio S.p.A.",
    location: "Hotel Excelsior – Roma", products: 9, cost: 780.20,
    vat: 93.62, category: "Salumi & Affettati"
  },
  {
    id: 9, date: "05/03/2025", invoiceNum: "FT-2025-0390", supplier: "Metro Italia S.p.A.",
    location: "Grand Hotel Quisisana – Capri", products: 41, cost: 6200.00,
    vat: 1240.00, category: "Varie"
  },
];

const volumeOrdersData = [
  { month: "Set '24", ordini: 142 }, { month: "Ott '24", ordini: 168 },
  { month: "Nov '24", ordini: 195 }, { month: "Dic '24", ordini: 223 },
  { month: "Gen '25", ordini: 148 }, { month: "Feb '25", ordini: 162 },
  { month: "Mar '25", ordini: 189 },
];

const spesaTotaleData = [
  { month: "Set '24", spesa: 42300 }, { month: "Ott '24", spesa: 51200 },
  { month: "Nov '24", spesa: 61800 }, { month: "Dic '24", spesa: 78400 },
  { month: "Gen '25", spesa: 44100 }, { month: "Feb '25", spesa: 49700 },
  { month: "Mar '25", spesa: 58300 },
];

const spesaCategorieData = [
  { name: "Carni", value: 28 },
  { name: "Bevande", value: 22 },
  { name: "Pesce & Frutti di Mare", value: 18 },
  { name: "Latticini & Formaggi", value: 12 },
  { name: "Salumi & Affettati", value: 10 },
  { name: "Pasta & Cereali", value: 6 },
  { name: "Altro", value: 4 },
];

const PIE_COLORS = ["#1B1B9E", "#E87B35", "#22A352", "#D49A1A", "#D43B3B", "#7C3AED", "#64748B"];

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function PriceChange({ prev, last }) {
  const diff = last - prev;
  const pct = ((diff / prev) * 100).toFixed(1);
  if (diff === 0) {
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-600">€ {last.toFixed(2)}</span>
        <span className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
          <Minus size={10} /> 0,0%
        </span>
      </div>
    );
  }
  if (diff < 0) {
    return (
      <div className="flex flex-col">
        <span className="font-bold" style={{ color: "#22A352" }}>€ {last.toFixed(2)}</span>
        <span className="text-xs flex items-center gap-0.5 mt-0.5" style={{ color: "#22A352" }}>
          <ArrowDownRight size={11} /> {Math.abs(pct)}%
        </span>
      </div>
    );
  }
  if (pct <= 5) {
    return (
      <div className="flex flex-col">
        <span className="font-bold" style={{ color: "#D49A1A" }}>€ {last.toFixed(2)}</span>
        <span className="text-xs flex items-center gap-0.5 mt-0.5" style={{ color: "#D49A1A" }}>
          <ArrowUpRight size={11} /> +{pct}%
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <span className="font-bold" style={{ color: "#D43B3B" }}>€ {last.toFixed(2)}</span>
      <span className="text-xs flex items-center gap-0.5 mt-0.5" style={{ color: "#D43B3B" }}>
        <ArrowUpRight size={11} /> +{pct}%
      </span>
    </div>
  );
}

function FilterSelect({ label, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <select
          className="appearance-none w-full bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 shadow-sm cursor-pointer"
          style={{ focusRingColor: "#1B1B9E" }}
        >
          {options.map((o, i) => <option key={i}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function Badge({ text, colorClass }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {text}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + "18" }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── PAGE: PRICE TRACKER ──────────────────────────────────────────────────────

function PriceTrackerPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Price Tracker</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitora l'andamento dei prezzi per fornitore e prodotto</p>
        </div>
        <button
          onClick={() => alert("Apertura modulo: Aggiungi Listino")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm transition-all"
          style={{ backgroundColor: "#E87B35" }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#C45E1E"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#E87B35"}
        >
          <Plus size={15} /> Aggiungi Listino
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filtri</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FilterSelect label="Fornitore" options={suppliersData} />
          <FilterSelect label="Prodotto" options={["Tutti i Prodotti", "Olio EVO", "Pasta Fresca", "Prosciutto DOP", "Parmigiano Reggiano"]} />
          <FilterSelect label="Sottocategoria" options={subcategoriesData} />
          <FilterSelect label="Data" options={["Tutte le Date", "Ultimo mese", "Ultimi 3 mesi", "Ultimi 6 mesi", "Anno corrente"]} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">{priceTrackerData.length} prodotti trovati</span>
          <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
            <RefreshCw size={12} /> Aggiorna prezzi
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fornitore</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prodotto + Descrizione</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sottocategoria</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prezzo Precedente</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Prezzo Ultimo</th>
              </tr>
            </thead>
            <tbody>
              {priceTrackerData.map((item, idx) => (
                <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${idx % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{item.supplier}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{item.product}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge text={item.subcategory} colorClass={item.subcategoryColor} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-600">€ {item.prevPrice.toFixed(2)}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{item.prevDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <PriceChange prev={item.prevPrice} last={item.lastPrice} />
                      <span className="text-xs text-slate-400 mt-0.5">{item.lastDate}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: LISTA FATTURE ──────────────────────────────────────────────────────

function ListaFatturePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lista Fatture</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestione e consultazione di tutte le fatture ricevute</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-600 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} /> Esporta
          </button>
          <button
            onClick={() => alert("Apertura modulo: Aggiungi Fattura")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm transition-all"
            style={{ backgroundColor: "#E87B35" }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#C45E1E"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#E87B35"}
          >
            <Plus size={15} /> Aggiungi Fattura
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Fatture Totali" value="9" sub="Marzo 2025" icon={FileText} color="#1B1B9E" />
        <StatCard label="Importo Netto" value="€ 21.621" sub="+12% vs feb" icon={TrendingUp} color="#22A352" />
        <StatCard label="IVA Totale" value="€ 4.055" sub="Media 22%" icon={BarChart2} color="#D49A1A" />
        <StatCard label="Fornitori Attivi" value="8" sub="Questo mese" icon={Building2} color="#E87B35" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filtri</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FilterSelect label="Data" options={["Tutte le Date", "Oggi", "Questa settimana", "Questo mese", "Ultimi 3 mesi"]} />
          <FilterSelect label="Fornitore" options={suppliersData} />
          <FilterSelect label="Struttura (Hotel)" options={structuresData} />
          <FilterSelect label="Categoria" options={categoriesData} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">{invoicesData.length} fatture trovate</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cerca fattura..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 w-48"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Data</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">N° Fattura</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fornitore</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Luogo Consegna</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">N° Prodotti</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Costo (€)</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">IVA (€)</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Categoria</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {invoicesData.map((inv, idx) => (
                <tr key={inv.id} className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${idx % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{inv.date}</td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">{inv.invoiceNum}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800 whitespace-nowrap">{inv.supplier}</td>
                  <td className="px-5 py-4 text-slate-600 text-xs">{inv.location}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-xs font-bold" style={{ color: "#1B1B9E" }}>{inv.products}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-800">€ {inv.cost.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-4 text-right text-slate-500">€ {inv.vat.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-4">
                    <Badge
                      text={inv.category}
                      colorClass={
                        inv.category === "Salumi & Affettati" ? "bg-rose-100 text-rose-700" :
                        inv.category === "Pesce & Frutti di Mare" ? "bg-blue-100 text-blue-700" :
                        inv.category === "Pasta & Cereali" ? "bg-yellow-100 text-yellow-700" :
                        inv.category === "Oli & Condimenti" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-600"
                      }
                    />
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => alert(`Visualizza fattura: ${inv.invoiceNum}`)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <Eye size={15} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">Mostrando 1–9 di 9 risultati</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === 1 ? "text-white" : "text-slate-600 hover:bg-slate-100"}`}
                style={p === 1 ? { backgroundColor: "#1B1B9E" } : {}}
              >{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: STATISTICHE ────────────────────────────────────────────────────────

const CustomTooltipLine = ({ active, payload, label, prefix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-base font-bold" style={{ color: payload[0].color }}>
          {prefix}{typeof payload[0].value === "number" ? payload[0].value.toLocaleString("it-IT") : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function StatistichePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Statistiche Acquisti</h1>
          <p className="text-sm text-slate-500 mt-0.5">Dashboard analitica per il Consiglio Acquisti</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-600 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={14} /> Esporta Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filtri & Ricerca</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cerca Prodotto</label>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Es. Parmigiano..." className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 text-slate-700" />
            </div>
          </div>
          <FilterSelect label="Data" options={["Ultimi 6 mesi", "Ultimo anno", "Anno corrente", "Personalizzato"]} />
          <FilterSelect label="Fornitore" options={suppliersData} />
          <FilterSelect label="Struttura" options={structuresData} />
          <FilterSelect label="Categoria" options={categoriesData} />
          <FilterSelect label="Sottocategoria" options={subcategoriesData} />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Ordini Totali" value="1.227" sub="Set '24 – Mar '25" icon={ShoppingCart} color="#1B1B9E" />
        <StatCard label="Spesa Totale" value="€ 385.800" sub="+8,4% vs periodo prec." icon={TrendingUp} color="#22A352" />
        <StatCard label="Spesa Media/Ordine" value="€ 314,4" sub="−2,1% vs periodo prec." icon={BarChart2} color="#D49A1A" />
        <StatCard label="Fornitori" value="8 attivi" sub="su 12 contratti" icon={Building2} color="#E87B35" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Volume Ordini */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Volume Ordini nel Tempo</h3>
              <p className="text-xs text-slate-400 mt-0.5">N° ordini per mese</p>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1B1B9E18" }}>
              <ShoppingCart size={15} style={{ color: "#1B1B9E" }} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={volumeOrdersData} margin={{ top: 4, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltipLine prefix="" />} />
              <Line
                type="monotone" dataKey="ordini" stroke="#1B1B9E"
                strokeWidth={2.5} dot={{ r: 4, fill: "#1B1B9E", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#1B1B9E", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spesa Totale */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Spesa Totale in € nel Tempo</h3>
              <p className="text-xs text-slate-400 mt-0.5">Importo mensile (€)</p>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E87B3518" }}>
              <TrendingUp size={15} style={{ color: "#E87B35" }} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={spesaTotaleData} margin={{ top: 4, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltipLine prefix="€ " />} />
              <Line
                type="monotone" dataKey="spesa" stroke="#E87B35"
                strokeWidth={2.5} dot={{ r: 4, fill: "#E87B35", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#E87B35", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm col-span-1">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Spesa per Categoria</h3>
              <p className="text-xs text-slate-400 mt-0.5">% sul totale</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={spesaCategorieData} cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value"
              >
                {spesaCategorieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-col gap-1.5">
            {spesaCategorieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Fornitori */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Top Fornitori per Spesa</h3>
              <p className="text-xs text-slate-400 mt-0.5">Classifica Set '24 – Mar '25</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {[
              { name: "Metro Italia S.p.A.", total: 98400, pct: 100 },
              { name: "Makro Cash & Carry", total: 74200, pct: 75 },
              { name: "Ferrarini Group", total: 62800, pct: 64 },
              { name: "Bidfood Italia", total: 51300, pct: 52 },
              { name: "Surgital S.p.A.", total: 38600, pct: 39 },
              { name: "Olitalia S.r.l.", total: 29100, pct: 30 },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 font-medium">{item.name}</span>
                  <span className="text-sm font-semibold text-slate-800">€ {item.total.toLocaleString("it-IT")}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: i === 0 ? "#1B1B9E" : i === 1 ? "#E87B35" : i === 2 ? "#22A352" : "#94a3b8"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "price-tracker", label: "Price Tracker", icon: TrendingUp },
  { id: "fatture", label: "Lista Fatture", icon: FileText },
  { id: "statistiche", label: "Statistiche Acquisti", icon: BarChart2 },
  { id: "fornitori", label: "Fornitori", icon: Building2 },
  { id: "prodotti", label: "Prodotti", icon: Package },
  { id: "strutture", label: "Strutture", icon: Hotel },
  { id: "utenti", label: "Utenti", icon: Users },
];

function Sidebar({ active, onNav, collapsed, onToggle }) {
  return (
    <aside
      className={`flex flex-col h-full border-r border-slate-200 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
      style={{ backgroundColor: "#fff" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#1B1B9E" }}>
          <span className="text-white text-xs font-black">dH</span>
        </div>
        {!collapsed && (
          <div>
            <span className="text-base font-black tracking-tight" style={{ color: "#1B1B9E" }}>digi</span>
            <span className="text-base font-black tracking-tight" style={{ color: "#E87B35" }}>HORECA</span>
          </div>
        )}
        <button onClick={onToggle} className="ml-auto text-slate-400 hover:text-slate-600 transition-colors">
          <Menu size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-2">
          {!collapsed && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Menu</span>}
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 mx-0 my-0.5 rounded-lg text-sm font-medium transition-all duration-150 ${collapsed ? "justify-center" : ""}`}
              style={isActive
                ? { backgroundColor: "#E87B3518", color: "#E87B35" }
                : { color: "#64748b" }
              }
              onMouseOver={e => { if (!isActive) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
              onMouseOut={e => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && (
                <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
              )}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#E87B35" }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-3">
        <button className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <Settings size={16} />
          {!collapsed && <span>Impostazioni</span>}
        </button>
        <button className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <LogOut size={16} />
          {!collapsed && <span>Esci</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header({ activePage }) {
  const pageLabels = {
    "dashboard": "Dashboard",
    "price-tracker": "Price Tracker",
    "fatture": "Lista Fatture",
    "statistiche": "Statistiche Acquisti",
    "fornitori": "Fornitori",
    "prodotti": "Prodotti",
    "strutture": "Strutture",
    "utenti": "Utenti",
  };
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>digiHORECA</span>
        <ChevronRight size={13} className="text-slate-300" />
        <span className="font-semibold text-slate-800">{pageLabels[activePage] || activePage}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 w-56"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell size={17} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#D43B3B" }} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #1B1B9E, #E87B35)" }}>
            CA
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">Consiglio Acquisti</p>
            <p className="text-xs text-slate-400 mt-0.5">Grand Hotel Group</p>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}

// ─── PLACEHOLDER PAGE ─────────────────────────────────────────────────────────

function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#1B1B9E10" }}>
        <Package size={28} style={{ color: "#1B1B9E" }} />
      </div>
      <h2 className="text-xl font-bold text-slate-700">{title}</h2>
      <p className="text-sm text-slate-400">Questa sezione è in sviluppo.</p>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function DigiHORECA() {
  const [activePage, setActivePage] = useState("price-tracker");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "price-tracker": return <PriceTrackerPage />;
      case "fatture": return <ListaFatturePage />;
      case "statistiche": return <StatistichePage />;
      default: return <PlaceholderPage title={activePage.charAt(0).toUpperCase() + activePage.slice(1)} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#FDFBF9", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar active={activePage} onNav={setActivePage} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header activePage={activePage} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
