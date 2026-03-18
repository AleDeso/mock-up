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

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function generatePriceHistory(prevPrice, lastPrice) {
  const points = 30;
  const history = [];
  const today = new Date(2025, 2, 16); // 16 marzo 2025
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const t = (points - 1 - i) / (points - 1);
    const base = prevPrice + (lastPrice - prevPrice) * t;
    const noise = (Math.random() - 0.5) * (Math.abs(lastPrice - prevPrice) * 0.15 + prevPrice * 0.01);
    const price = Math.max(0, parseFloat((base + noise).toFixed(2)));
    history.push({ date: label, price });
  }
  history[0].price = prevPrice;
  history[history.length - 1].price = lastPrice;
  return history;
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

const suppliersData = [
  "Tutti i Fornitori", "Aldoro S.p.A.", "Primavera Cash & Carry", "Verano S.r.l.",
  "Pastello S.p.A.", "Castellani Group", "Nordpack Italia", "Salumini S.p.A.", "Montini S.p.A."
];
const structuresData = [
  "Tutte le Strutture", "Grand Hotel Baglioni – Firenze", "Hotel Excelsior – Roma",
  "Boscolo Grand Hotel – Venezia", "Grand Hotel Quisisana – Capri",
  "Hotel de Russie – Roma", "Belmond Hotel Caruso – Ravello"
];
const categoriesData = [
  "Tutte le Categorie", "Bevande", "Carni", "Pesce & Frutti di Mare",
  "Latticini & Formaggi", "Salumi", "Pasta & Cereali",
  "Oli e Condimenti", "Dolci & Pasticceria", "Verdure & Ortaggi"
];
const subcategoriesData = [
  "Tutte le Sottocategorie", "Vini e Bevande", "Alcolici", "Acqua e Soft Drink",
  "Birre", "Carne", "Pollame e Uova", "Pesce e Frutti di Mare",
  "Latticini e Formaggi", "Pasta e Cereali", "Oli e Condimenti"
];

const priceTrackerData = [
  { id: 1,  supplier: "Aldoro S.p.A.",           product: "Olio Extra Vergine Oliva DOP",       description: "5L – Bottiglia in vetro, Frantoio Toscano",           subcategory: "Oli e Condimenti",       subcategoryColor: "bg-amber-100 text-amber-700",  prevPrice: 28.50,  prevDate: "15/01/2025", lastPrice: 31.20,  lastDate: "12/03/2025" },
  { id: 2,  supplier: "Pastello S.p.A.",          product: "Tortellini Ricotta & Spinaci",       description: "3kg – Pasta fresca surgelata, formato classico",      subcategory: "Pasta e Cereali",        subcategoryColor: "bg-yellow-100 text-yellow-700",prevPrice: 18.90,  prevDate: "10/01/2025", lastPrice: 17.40,  lastDate: "08/03/2025" },
  { id: 3,  supplier: "Castellani Group",         product: "Prosciutto di Parma DOP 18 mesi",   description: "Coscia intera – circa 8–9 kg, con osso",              subcategory: "Salumi",                 subcategoryColor: "bg-rose-100 text-rose-700",    prevPrice: 142.00, prevDate: "05/02/2025", lastPrice: 158.50, lastDate: "14/03/2025" },
  { id: 4,  supplier: "Nordpack Italia",          product: "Salmone Atlantico Affumicato",       description: "1kg – Filetto, affumicatura a freddo, Norvegia",      subcategory: "Pesce e Frutti di Mare", subcategoryColor: "bg-blue-100 text-blue-700",    prevPrice: 34.00,  prevDate: "20/01/2025", lastPrice: 34.00,  lastDate: "01/03/2025" },
  { id: 5,  supplier: "Verano S.r.l.",            product: "Aceto Balsamico di Modena IGP",     description: "250ml – Invecchiato 3 anni, bottiglia tradizionale",  subcategory: "Oli e Condimenti",       subcategoryColor: "bg-amber-100 text-amber-700",  prevPrice: 12.80,  prevDate: "08/02/2025", lastPrice: 11.90,  lastDate: "10/03/2025" },
  { id: 6,  supplier: "Primavera Cash & Carry",   product: "Parmigiano Reggiano DOP 24 mesi",   description: "Forma intera – circa 38–40 kg, stagionato",           subcategory: "Latticini e Formaggi",   subcategoryColor: "bg-orange-100 text-orange-700",prevPrice: 520.00, prevDate: "12/01/2025", lastPrice: 598.00, lastDate: "15/03/2025" },
  { id: 7,  supplier: "Salumini S.p.A.",          product: "Mortadella Bologna IGP",             description: "Intera – circa 10 kg, con pistacchi",                subcategory: "Salumi",                 subcategoryColor: "bg-rose-100 text-rose-700",    prevPrice: 68.00,  prevDate: "03/02/2025", lastPrice: 64.50,  lastDate: "11/03/2025" },
  { id: 8,  supplier: "Aldoro S.p.A.",            product: "Champagne Brut Riserva",             description: "Cassa 6 bottiglie – 0.75L, Blanc de Blanc",           subcategory: "Vini e Bevande",         subcategoryColor: "bg-green-100 text-green-700",  prevPrice: 198.00, prevDate: "22/01/2025", lastPrice: 231.00, lastDate: "16/03/2025" },
  { id: 9,  supplier: "Nordpack Italia",          product: "Branzino Intero Fresco",             description: "2–3 kg cad – Allevamento mediterraneo, fresco",      subcategory: "Pesce e Frutti di Mare", subcategoryColor: "bg-blue-100 text-blue-700",    prevPrice: 22.00,  prevDate: "18/01/2025", lastPrice: 24.80,  lastDate: "13/03/2025" },
  { id: 10, supplier: "Primavera Cash & Carry",   product: "Burro di Panna Fresca",              description: "500g – Burro artigianale, alta qualità",              subcategory: "Latticini e Formaggi",   subcategoryColor: "bg-orange-100 text-orange-700",prevPrice: 4.20,   prevDate: "25/01/2025", lastPrice: 4.80,   lastDate: "09/03/2025" },
  { id: 11, supplier: "Castellani Group",         product: "Bresaola della Valtellina IGP",      description: "1kg – Fettine sottili, maturazione 60 giorni",        subcategory: "Salumi",                 subcategoryColor: "bg-rose-100 text-rose-700",    prevPrice: 28.90,  prevDate: "14/01/2025", lastPrice: 27.50,  lastDate: "07/03/2025" },
  { id: 12, supplier: "Pastello S.p.A.",          product: "Risotto ai Funghi Porcini",          description: "1kg – Riso Carnaroli, porcini secchi 15%",            subcategory: "Pasta e Cereali",        subcategoryColor: "bg-yellow-100 text-yellow-700",prevPrice: 9.40,   prevDate: "05/01/2025", lastPrice: 9.40,   lastDate: "02/03/2025" },
  { id: 13, supplier: "Verano S.r.l.",            product: "Tartufo Nero Pregiato",              description: "100g – Tuber melanosporum, stagione invernale",       subcategory: "Oli e Condimenti",       subcategoryColor: "bg-amber-100 text-amber-700",  prevPrice: 85.00,  prevDate: "10/02/2025", lastPrice: 92.00,  lastDate: "14/03/2025" },
  { id: 14, supplier: "Salumini S.p.A.",          product: "Salame Felino IGP",                  description: "600g – Insaccato artigianale, macinatura grossa",     subcategory: "Salumi",                 subcategoryColor: "bg-rose-100 text-rose-700",    prevPrice: 14.50,  prevDate: "20/02/2025", lastPrice: 13.80,  lastDate: "10/03/2025" },
  { id: 15, supplier: "Nordpack Italia",          product: "Gamberi Rossi di Mazara",            description: "500g – Crudi, pesca mediterranea, taglia XL",        subcategory: "Pesce e Frutti di Mare", subcategoryColor: "bg-blue-100 text-blue-700",    prevPrice: 38.00,  prevDate: "01/02/2025", lastPrice: 42.50,  lastDate: "15/03/2025" },
  { id: 16, supplier: "Aldoro S.p.A.",            product: "Acqua Minerale Naturale",            description: "Cassa 6x1.5L – Sorgente alpina, bassa mineralizzazione",subcategory: "Acqua e Soft Drink",    subcategoryColor: "bg-sky-100 text-sky-700",      prevPrice: 3.80,   prevDate: "15/02/2025", lastPrice: 3.80,   lastDate: "01/03/2025" },
  { id: 17, supplier: "Primavera Cash & Carry",   product: "Mozzarella di Bufala DOP",           description: "250g – Latte di bufala campana, fresca",              subcategory: "Latticini e Formaggi",   subcategoryColor: "bg-orange-100 text-orange-700",prevPrice: 6.90,   prevDate: "28/01/2025", lastPrice: 7.40,   lastDate: "11/03/2025" },
  { id: 18, supplier: "Pastello S.p.A.",          product: "Farina 00 Tipo Manitoba",            description: "25kg – Sacco professionale, forza W380",              subcategory: "Pasta e Cereali",        subcategoryColor: "bg-yellow-100 text-yellow-700",prevPrice: 32.00,  prevDate: "08/02/2025", lastPrice: 29.50,  lastDate: "05/03/2025" },
  { id: 19, supplier: "Castellani Group",         product: "Culatello di Zibello DOP",           description: "3kg cad – Stagionato 18 mesi, produzione limitata",  subcategory: "Salumi",                 subcategoryColor: "bg-rose-100 text-rose-700",    prevPrice: 210.00, prevDate: "10/01/2025", lastPrice: 235.00, lastDate: "16/03/2025" },
  { id: 20, supplier: "Verano S.r.l.",            product: "Olio di Semi di Girasole HO",        description: "10L – Alta oleicità, resistente alle alte temperature",subcategory: "Oli e Condimenti",       subcategoryColor: "bg-amber-100 text-amber-700",  prevPrice: 18.50,  prevDate: "12/02/2025", lastPrice: 17.90,  lastDate: "08/03/2025" },
  { id: 21, supplier: "Nordpack Italia",          product: "Tonno Rosso del Mediterraneo",       description: "1kg – Trancio, pesca sostenibile certificata",        subcategory: "Pesce e Frutti di Mare", subcategoryColor: "bg-blue-100 text-blue-700",    prevPrice: 48.00,  prevDate: "18/02/2025", lastPrice: 52.00,  lastDate: "14/03/2025" },
  { id: 22, supplier: "Aldoro S.p.A.",            product: "Prosecco DOC Treviso Extra Dry",     description: "Cassa 12 bottiglie – 0.75L, millesimato 2024",        subcategory: "Vini e Bevande",         subcategoryColor: "bg-green-100 text-green-700",  prevPrice: 72.00,  prevDate: "05/02/2025", lastPrice: 68.00,  lastDate: "09/03/2025" },
  { id: 23, supplier: "Salumini S.p.A.",          product: "Pancetta Tesa Arrotolata",           description: "1kg – Speziata, stagionatura 30 giorni",              subcategory: "Salumi",                 subcategoryColor: "bg-rose-100 text-rose-700",    prevPrice: 16.20,  prevDate: "22/01/2025", lastPrice: 16.20,  lastDate: "04/03/2025" },
  { id: 24, supplier: "Primavera Cash & Carry",   product: "Grana Padano DOP 16 mesi",           description: "Pezzo da 5kg – Stagionato, grattugiabile",            subcategory: "Latticini e Formaggi",   subcategoryColor: "bg-orange-100 text-orange-700",prevPrice: 58.00,  prevDate: "15/01/2025", lastPrice: 63.00,  lastDate: "13/03/2025" },
  { id: 25, supplier: "Montini S.p.A.",           product: "Pollame Ruspante Bio",               description: "Pollo intero ~1.8kg – Allevamento biologico certificato",subcategory: "Pollame e Uova",       subcategoryColor: "bg-lime-100 text-lime-700",    prevPrice: 12.50,  prevDate: "14/02/2025", lastPrice: 13.90,  lastDate: "15/03/2025" },
  { id: 26, supplier: "Montini S.p.A.",           product: "Uova Fresche Cat. A XL",             description: "Cassetta 30 uova – Galline allevate a terra, bio",    subcategory: "Pollame e Uova",         subcategoryColor: "bg-lime-100 text-lime-700",    prevPrice: 8.40,   prevDate: "10/02/2025", lastPrice: 8.90,   lastDate: "12/03/2025" },
  { id: 27, supplier: "Verano S.r.l.",            product: "Sale Marino Integrale Siciliano",    description: "1kg – Raccolta manuale, non raffinato",               subcategory: "Oli e Condimenti",       subcategoryColor: "bg-amber-100 text-amber-700",  prevPrice: 3.20,   prevDate: "05/03/2025", lastPrice: 3.20,   lastDate: "05/03/2025" },
  { id: 28, supplier: "Pastello S.p.A.",          product: "Penne Rigate Grano Duro",            description: "5kg – Pasta secca, trafilata al bronzo",              subcategory: "Pasta e Cereali",        subcategoryColor: "bg-yellow-100 text-yellow-700",prevPrice: 11.80,  prevDate: "20/01/2025", lastPrice: 10.90,  lastDate: "06/03/2025" },
  { id: 29, supplier: "Nordpack Italia",          product: "Merluzzo Baccalà Dissalato",         description: "800g – Filetto, pre-ammollato 48h",                   subcategory: "Pesce e Frutti di Mare", subcategoryColor: "bg-blue-100 text-blue-700",    prevPrice: 19.50,  prevDate: "28/01/2025", lastPrice: 21.00,  lastDate: "11/03/2025" },
  { id: 30, supplier: "Aldoro S.p.A.",            product: "Birra Artigianale IPA",              description: "Cassa 24x33cl – Luppolo Cascade, 6.2% Vol",           subcategory: "Birre",                  subcategoryColor: "bg-indigo-100 text-indigo-700",prevPrice: 36.00,  prevDate: "01/03/2025", lastPrice: 36.00,  lastDate: "01/03/2025" },
];

const invoicesData = [
  { id:  1, date: "16/03/2025", invoiceNum: "FT-2025-0412", supplier: "Aldoro S.p.A.",           location: "Grand Hotel Baglioni – Firenze",      products: 24, cost: 3842.50, vat: 768.50,  category: "Materie Prime" },
  { id:  2, date: "15/03/2025", invoiceNum: "FT-2025-0411", supplier: "Castellani Group",         location: "Hotel Excelsior – Roma",              products:  8, cost: 1265.00, vat: 151.80,  category: "Materie Prime" },
  { id:  3, date: "14/03/2025", invoiceNum: "FT-2025-0409", supplier: "Pastello S.p.A.",          location: "Boscolo Grand Hotel – Venezia",       products: 15, cost:  892.40, vat: 178.48,  category: "Manutenzione"  },
  { id:  4, date: "12/03/2025", invoiceNum: "FT-2025-0405", supplier: "Nordpack Italia",          location: "Grand Hotel Quisisana – Capri",       products: 11, cost: 2341.00, vat: 468.20,  category: "Servizi"       },
  { id:  5, date: "11/03/2025", invoiceNum: "FT-2025-0403", supplier: "Verano S.r.l.",            location: "Hotel de Russie – Roma",              products:  6, cost:  534.80, vat:  53.48,  category: "Spese Fisse"   },
  { id:  6, date: "10/03/2025", invoiceNum: "FT-2025-0401", supplier: "Primavera Cash & Carry",   location: "Belmond Hotel Caruso – Ravello",      products: 32, cost: 5120.00, vat:1024.00,  category: "Spese Fisse"   },
  { id:  7, date: "08/03/2025", invoiceNum: "FT-2025-0398", supplier: "Salumini S.p.A.",          location: "Grand Hotel Baglioni – Firenze",      products:  5, cost:  645.00, vat:  77.40,  category: "Materie Prime" },
  { id:  8, date: "07/03/2025", invoiceNum: "FT-2025-0395", supplier: "Montini S.p.A.",           location: "Hotel Excelsior – Roma",              products:  9, cost:  780.20, vat:  93.62,  category: "Servizi"       },
  { id:  9, date: "05/03/2025", invoiceNum: "FT-2025-0390", supplier: "Aldoro S.p.A.",            location: "Grand Hotel Quisisana – Capri",       products: 41, cost: 6200.00, vat:1240.00,  category: "Manutenzione"  },
  { id: 10, date: "04/03/2025", invoiceNum: "FT-2025-0388", supplier: "Primavera Cash & Carry",   location: "Hotel de Russie – Roma",              products: 18, cost: 2870.00, vat: 574.00,  category: "Materie Prime" },
  { id: 11, date: "03/03/2025", invoiceNum: "FT-2025-0385", supplier: "Nordpack Italia",          location: "Belmond Hotel Caruso – Ravello",      products: 12, cost: 1890.00, vat: 378.00,  category: "Materie Prime" },
  { id: 12, date: "01/03/2025", invoiceNum: "FT-2025-0381", supplier: "Verano S.r.l.",            location: "Grand Hotel Baglioni – Firenze",      products:  4, cost:  320.00, vat:  64.00,  category: "Manutenzione"  },
  { id: 13, date: "28/02/2025", invoiceNum: "FT-2025-0374", supplier: "Castellani Group",         location: "Boscolo Grand Hotel – Venezia",       products:  7, cost: 1480.00, vat: 296.00,  category: "Materie Prime" },
  { id: 14, date: "26/02/2025", invoiceNum: "FT-2025-0369", supplier: "Salumini S.p.A.",          location: "Hotel Excelsior – Roma",              products:  6, cost:  720.00, vat: 144.00,  category: "Materie Prime" },
  { id: 15, date: "25/02/2025", invoiceNum: "FT-2025-0365", supplier: "Montini S.p.A.",           location: "Grand Hotel Quisisana – Capri",       products: 22, cost: 3100.00, vat: 620.00,  category: "Servizi"       },
  { id: 16, date: "24/02/2025", invoiceNum: "FT-2025-0361", supplier: "Pastello S.p.A.",          location: "Grand Hotel Baglioni – Firenze",      products: 10, cost:  950.00, vat: 190.00,  category: "Materie Prime" },
  { id: 17, date: "22/02/2025", invoiceNum: "FT-2025-0358", supplier: "Aldoro S.p.A.",            location: "Hotel de Russie – Roma",              products: 28, cost: 4200.00, vat: 840.00,  category: "Spese Fisse"   },
  { id: 18, date: "20/02/2025", invoiceNum: "FT-2025-0352", supplier: "Primavera Cash & Carry",   location: "Belmond Hotel Caruso – Ravello",      products: 14, cost: 2250.00, vat: 450.00,  category: "Manutenzione"  },
  { id: 19, date: "19/02/2025", invoiceNum: "FT-2025-0348", supplier: "Nordpack Italia",          location: "Grand Hotel Baglioni – Firenze",      products:  9, cost: 1620.00, vat: 324.00,  category: "Materie Prime" },
  { id: 20, date: "18/02/2025", invoiceNum: "FT-2025-0344", supplier: "Verano S.r.l.",            location: "Hotel Excelsior – Roma",              products:  3, cost:  280.00, vat:  56.00,  category: "Spese Fisse"   },
  { id: 21, date: "15/02/2025", invoiceNum: "FT-2025-0338", supplier: "Castellani Group",         location: "Boscolo Grand Hotel – Venezia",       products: 11, cost: 2100.00, vat: 420.00,  category: "Materie Prime" },
  { id: 22, date: "14/02/2025", invoiceNum: "FT-2025-0334", supplier: "Salumini S.p.A.",          location: "Grand Hotel Quisisana – Capri",       products:  8, cost:  880.00, vat: 176.00,  category: "Materie Prime" },
  { id: 23, date: "12/02/2025", invoiceNum: "FT-2025-0329", supplier: "Montini S.p.A.",           location: "Hotel de Russie – Roma",              products: 16, cost: 2400.00, vat: 480.00,  category: "Servizi"       },
  { id: 24, date: "10/02/2025", invoiceNum: "FT-2025-0322", supplier: "Pastello S.p.A.",          location: "Grand Hotel Baglioni – Firenze",      products: 20, cost: 1740.00, vat: 348.00,  category: "Materie Prime" },
  { id: 25, date: "08/02/2025", invoiceNum: "FT-2025-0318", supplier: "Aldoro S.p.A.",            location: "Belmond Hotel Caruso – Ravello",      products: 35, cost: 5800.00, vat:1160.00,  category: "Spese Fisse"   },
  { id: 26, date: "06/02/2025", invoiceNum: "FT-2025-0312", supplier: "Primavera Cash & Carry",   location: "Hotel Excelsior – Roma",              products: 19, cost: 3100.00, vat: 620.00,  category: "Materie Prime" },
  { id: 27, date: "04/02/2025", invoiceNum: "FT-2025-0308", supplier: "Nordpack Italia",          location: "Grand Hotel Quisisana – Capri",       products:  7, cost: 1280.00, vat: 256.00,  category: "Materie Prime" },
  { id: 28, date: "02/02/2025", invoiceNum: "FT-2025-0301", supplier: "Verano S.r.l.",            location: "Boscolo Grand Hotel – Venezia",       products:  5, cost:  410.00, vat:  82.00,  category: "Manutenzione"  },
  { id: 29, date: "31/01/2025", invoiceNum: "FT-2025-0295", supplier: "Castellani Group",         location: "Grand Hotel Baglioni – Firenze",      products: 13, cost: 2680.00, vat: 536.00,  category: "Materie Prime" },
  { id: 30, date: "29/01/2025", invoiceNum: "FT-2025-0289", supplier: "Montini S.p.A.",           location: "Hotel de Russie – Roma",              products: 25, cost: 3900.00, vat: 780.00,  category: "Servizi"       },
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
  { name: "Salumi", value: 10 },
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

function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const visiblePages = Array.from({ length: pages }, (_, i) => i + 1).filter(p =>
    p === 1 || p === pages || (p >= page - 1 && p <= page + 1)
  );
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <span className="text-xs text-slate-500">
        Mostrando <span className="font-medium text-slate-700">{from}–{to}</span> di <span className="font-medium text-slate-700">{total}</span> risultati
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)} disabled={page === 1}
          className="w-8 h-8 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >‹</button>
        {visiblePages.map((p, i) => {
          const prev = visiblePages[i - 1];
          return (
            <span key={p} className="flex items-center gap-1">
              {prev && p - prev > 1 && <span className="text-slate-300 text-xs px-1">…</span>}
              <button
                onClick={() => onChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? "text-white" : "text-slate-600 hover:bg-slate-100"}`}
                style={p === page ? { backgroundColor: "#1B1B9E" } : {}}
              >{p}</button>
            </span>
          );
        })}
        <button
          onClick={() => onChange(page + 1)} disabled={page === pages}
          className="w-8 h-8 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >›</button>
      </div>
    </div>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  const active = value && value !== options[0];
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`appearance-none w-full border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 shadow-sm cursor-pointer transition-colors ${active ? "bg-orange-50 border-orange-300 text-orange-700 font-medium" : "bg-white border-slate-200 text-slate-700"}`}
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

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────

function UploadModal({ title, onClose }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const mockFiles = files.length === 0 ? [] : files;

  const handleDrop = e => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped.map(f => ({ name: f.name, size: f.size, status: "pronto" }))]);
  };

  const handleInput = e => {
    const picked = Array.from(e.target.files);
    setFiles(prev => [...prev, ...picked.map(f => ({ name: f.name, size: f.size, status: "pronto" }))]);
  };

  const removeFile = idx => setFiles(prev => prev.filter((_, i) => i !== idx));

  const formatSize = b => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Carica uno o più file PDF, Excel o CSV</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Drop zone */}
        <div className="px-6 pt-5 pb-2">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-all cursor-pointer ${dragging ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/40"}`}
            onClick={() => document.getElementById("upload-input").click()}
          >
            <input id="upload-input" type="file" multiple className="hidden" onChange={handleInput} accept=".pdf,.xlsx,.xls,.csv" />
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? "bg-orange-100" : "bg-slate-100"}`}>
              <Download size={22} className={dragging ? "text-orange-500" : "text-slate-400"} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                {dragging ? "Rilascia i file qui" : "Trascina i file qui"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">oppure <span className="text-orange-500 font-medium">sfoglia dal computer</span></p>
            </div>
            <p className="text-xs text-slate-400">PDF, Excel, CSV · max 20 MB per file</p>
          </div>
        </div>

        {/* File list */}
        {mockFiles.length > 0 && (
          <div className="px-6 py-3 flex flex-col gap-2 max-h-44 overflow-y-auto">
            {mockFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2.5">
                <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={15} className="text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{f.name}</p>
                  <p className="text-xs text-slate-400">{formatSize(f.size)}</p>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Pronto</span>
                <button onClick={() => removeFile(i)} className="text-slate-300 hover:text-red-400 transition-colors ml-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 mt-2">
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Annulla</button>
          <button
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all ${mockFiles.length > 0 ? "opacity-100" : "opacity-40 cursor-not-allowed"}`}
            style={{ backgroundColor: "#E87B35" }}
            onMouseOver={e => { if (mockFiles.length > 0) e.currentTarget.style.backgroundColor = "#C45E1E"; }}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#E87B35"}
          >
            <Plus size={15} /> Carica {mockFiles.length > 0 ? `(${mockFiles.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: PRICE TRACKER ──────────────────────────────────────────────────────

function PriceDetailModal({ item, onClose }) {
  const history = generatePriceHistory(item.prevPrice, item.lastPrice);
  const isUp = item.lastPrice > item.prevPrice;
  const isDown = item.lastPrice < item.prevPrice;
  const pct = item.prevPrice > 0 ? ((item.lastPrice - item.prevPrice) / item.prevPrice * 100).toFixed(1) : "0.0";
  const lineColor = isUp ? "#E53E3E" : isDown ? "#38A169" : "#718096";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">{item.supplier}</p>
            <h2 className="text-lg font-bold text-slate-800">{item.product}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors ml-4 mt-0.5">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center gap-6 px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Prezzo precedente</p>
            <p className="text-lg font-semibold text-slate-600">€ {item.prevPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{item.prevDate}</p>
          </div>
          <ArrowUpRight size={20} className="text-slate-300" />
          <div>
            <p className="text-xs text-slate-400">Prezzo attuale</p>
            <p className="text-lg font-bold text-slate-800">€ {item.lastPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-400">{item.lastDate}</p>
          </div>
          <div className="ml-auto">
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${isUp ? "bg-red-50 text-red-600" : isDown ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}>
              {isUp ? "+" : ""}{pct}%
            </span>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Andamento ultimi 30 giorni</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={6} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={v => `€${v}`} width={48} />
              <Tooltip
                formatter={v => [`€ ${v.toFixed(2)}`, "Prezzo"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Line type="monotone" dataKey="price" stroke={lineColor} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function PriceTrackerPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSupplier, setFilterSupplier] = useState(suppliersData[0]);
  const [filterSubcat, setFilterSubcat] = useState(subcategoriesData[0]);
  const [filterVariation, setFilterVariation] = useState("Tutte le Variazioni");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const variationOptions = ["Tutte le Variazioni", "In aumento", "In calo", "Stabile"];

  const filtered = priceTrackerData.filter(item => {
    if (filterSupplier !== suppliersData[0] && item.supplier !== filterSupplier) return false;
    if (filterSubcat !== subcategoriesData[0] && item.subcategory !== filterSubcat) return false;
    if (filterVariation === "In aumento" && item.lastPrice <= item.prevPrice) return false;
    if (filterVariation === "In calo" && item.lastPrice >= item.prevPrice) return false;
    if (filterVariation === "Stabile" && item.lastPrice !== item.prevPrice) return false;
    if (search && !item.product.toLowerCase().includes(search.toLowerCase()) && !item.supplier.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hasActiveFilters = filterSupplier !== suppliersData[0] || filterSubcat !== subcategoriesData[0] || filterVariation !== "Tutte le Variazioni" || search;

  const resetFilters = () => {
    setFilterSupplier(suppliersData[0]);
    setFilterSubcat(subcategoriesData[0]);
    setFilterVariation("Tutte le Variazioni");
    setSearch("");
    setPage(1);
  };

  const handleFilter = (setter) => (val) => { setter(val); setPage(1); };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Price Tracker</h1>
          <p className="text-sm text-slate-500 mt-0.5">Monitora l'andamento dei prezzi per fornitore e prodotto</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filtri</span>
            {hasActiveFilters && (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: "#E87B35" }}>
                {[filterSupplier !== suppliersData[0], filterSubcat !== subcategoriesData[0], filterVariation !== "Tutte le Variazioni", !!search].filter(Boolean).length}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <X size={11} /> Azzera filtri
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cerca prodotto</label>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Nome o fornitore..."
                className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 shadow-sm ${search ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-white border-slate-200 text-slate-700"}`}
              />
            </div>
          </div>
          <FilterSelect label="Fornitore" options={suppliersData} value={filterSupplier} onChange={handleFilter(setFilterSupplier)} />
          <FilterSelect label="Sottocategoria" options={subcategoriesData} value={filterSubcat} onChange={handleFilter(setFilterSubcat)} />
          <FilterSelect label="Variazione prezzo" options={variationOptions} value={filterVariation} onChange={handleFilter(setFilterVariation)} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">
            {filtered.length} {filtered.length === 1 ? "prodotto trovato" : "prodotti trovati"}
            {hasActiveFilters && <span className="text-slate-400 font-normal"> (su {priceTrackerData.length})</span>}
          </span>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Search size={28} className="opacity-30" />
                      <p className="text-sm font-medium">Nessun prodotto trovato</p>
                      <button onClick={resetFilters} className="text-xs mt-1 underline hover:text-slate-600 transition-colors">Azzera i filtri</button>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((item, idx) => (
                <tr key={item.id} onClick={() => setSelectedItem(item)} className={`border-b border-slate-50 hover:bg-orange-50/50 cursor-pointer transition-colors ${idx % 2 === 1 ? "bg-slate-50/30" : ""}`}>
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
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>
      {selectedItem && <PriceDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showUpload && <UploadModal title="Aggiungi Listino" onClose={() => setShowUpload(false)} />}
    </div>
  );
}

// ─── PAGE: LISTA FATTURE ──────────────────────────────────────────────────────

const catColorClass = cat =>
  cat === "Spese Fisse" ? "bg-slate-100 text-slate-700" :
  cat === "Servizi" ? "bg-blue-100 text-blue-700" :
  cat === "Manutenzione" ? "bg-amber-100 text-amber-700" :
  cat === "Materie Prime" ? "bg-green-100 text-green-700" :
  "bg-slate-100 text-slate-600";

function ListaFatturePage() {
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSupplier, setFilterSupplier] = useState(suppliersData[0]);
  const [filterLocation, setFilterLocation] = useState(structuresData[0]);
  const [filterCategory, setFilterCategory] = useState("Tutte le Categorie");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const categoryOptions = ["Tutte le Categorie", "Spese Fisse", "Servizi", "Manutenzione", "Materie Prime"];

  const filtered = invoicesData.filter(inv => {
    if (filterSupplier !== suppliersData[0] && inv.supplier !== filterSupplier) return false;
    if (filterLocation !== structuresData[0] && inv.location !== filterLocation) return false;
    if (filterCategory !== "Tutte le Categorie" && inv.category !== filterCategory) return false;
    if (search && !inv.invoiceNum.toLowerCase().includes(search.toLowerCase()) && !inv.supplier.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hasActiveFilters = filterSupplier !== suppliersData[0] || filterLocation !== structuresData[0] || filterCategory !== "Tutte le Categorie" || search;

  const resetFilters = () => {
    setFilterSupplier(suppliersData[0]);
    setFilterLocation(structuresData[0]);
    setFilterCategory("Tutte le Categorie");
    setSearch("");
    setPage(1);
  };

  const handleFilter = (setter) => (val) => { setter(val); setPage(1); };

  const totalCost = filtered.reduce((s, i) => s + i.cost, 0);
  const totalVat = filtered.reduce((s, i) => s + i.vat, 0);
  const activeSuppliers = new Set(filtered.map(i => i.supplier)).size;

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
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm transition-all"
            style={{ backgroundColor: "#E87B35" }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#C45E1E"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#E87B35"}
          >
            <Plus size={15} /> Aggiungi Fattura
          </button>
        </div>
      </div>

      {/* Summary cards — aggiornate dinamicamente */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Fatture Trovate" value={String(filtered.length)} sub={hasActiveFilters ? `su ${invoicesData.length} totali` : "Marzo 2025"} icon={FileText} color="#1B1B9E" />
        <StatCard label="Importo Netto" value={`€ ${totalCost.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} sub={hasActiveFilters ? "selezione corrente" : "+12% vs feb"} icon={TrendingUp} color="#22A352" />
        <StatCard label="IVA Totale" value={`€ ${totalVat.toLocaleString("it-IT", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} sub="Media 22%" icon={BarChart2} color="#D49A1A" />
        <StatCard label="Fornitori" value={String(activeSuppliers)} sub="nella selezione" icon={Building2} color="#E87B35" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Filtri</span>
            {hasActiveFilters && (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: "#E87B35" }}>
                {[filterSupplier !== suppliersData[0], filterLocation !== structuresData[0], filterCategory !== "Tutte le Categorie", !!search].filter(Boolean).length}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <X size={11} /> Azzera filtri
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cerca fattura</label>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="N° fattura o fornitore..."
                className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 shadow-sm ${search ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-white border-slate-200 text-slate-700"}`}
              />
            </div>
          </div>
          <FilterSelect label="Fornitore" options={suppliersData} value={filterSupplier} onChange={handleFilter(setFilterSupplier)} />
          <FilterSelect label="Struttura" options={structuresData} value={filterLocation} onChange={handleFilter(setFilterLocation)} />
          <FilterSelect label="Categoria" options={categoryOptions} value={filterCategory} onChange={handleFilter(setFilterCategory)} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">
            {filtered.length} {filtered.length === 1 ? "fattura trovata" : "fatture trovate"}
            {hasActiveFilters && <span className="text-slate-400 font-normal"> (su {invoicesData.length})</span>}
          </span>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Search size={28} className="opacity-30" />
                      <p className="text-sm font-medium">Nessuna fattura trovata</p>
                      <button onClick={resetFilters} className="text-xs mt-1 underline hover:text-slate-600 transition-colors">Azzera i filtri</button>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((inv, idx) => (
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
                    <Badge text={inv.category} colorClass={catColorClass(inv.category)} />
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
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>
      {showUpload && <UploadModal title="Aggiungi Fattura" onClose={() => setShowUpload(false)} />}
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
              { name: "Aldoro S.p.A.", total: 98400, pct: 100 },
              { name: "Primavera Cash & Carry", total: 74200, pct: 75 },
              { name: "Castellani Group", total: 62800, pct: 64 },
              { name: "Nordpack Italia", total: 51300, pct: 52 },
              { name: "Pastello S.p.A.", total: 38600, pct: 39 },
              { name: "Verano S.r.l.", total: 29100, pct: 30 },
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
  { id: "price-tracker", label: "Price Tracker", icon: TrendingUp },
  { id: "fatture", label: "Lista Fatture", icon: FileText },
  { id: "statistiche", label: "Statistiche Acquisti", icon: BarChart2 },
];

function Sidebar({ active, onNav, collapsed, onToggle }) {
  return (
    <aside
      className={`flex flex-col h-full border-r border-slate-200 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}
      style={{ backgroundColor: "#fff" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="w-8 h-8 flex-shrink-0">
          <img src="/Digihoreca_loghi-15.png" alt="digiHORECA" className="w-full h-full object-contain" />
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
            HG
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">Horeca Group</p>
            <p className="text-xs text-slate-400 mt-0.5">Grand Hotel</p>
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
