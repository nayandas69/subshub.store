"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Tag, Shield, Zap, LogOut, Plus, Trash2, Edit2, PlusCircle, MinusCircle, ChevronRight, Palette, ArrowLeft, Save } from "lucide-react";
import ProductIcon from "@/components/ProductIcon";
import IconPicker from "@/components/IconPicker";
import CurrencyPicker from "@/components/CurrencyPicker";
import { Product, Category, Badge, Settings, Plan } from "@/lib/types";

type Tab = "products" | "categories" | "badges" | "settings";
type View = "LIST" | "ADD" | "EDIT";

const ICON_SUGGESTIONS: Record<string, string> = {
  netflix: "Tv",
  prime: "Film",
  disney: "Film",
  streaming: "MonitorPlay",
  game: "Gamepad",
  playstation: "Gamepad2",
  xbox: "Gamepad",
  steam: "Dices",
  spotify: "Music",
  music: "Headphones",
  vpn: "Shield",
  shield: "Shield",
  "gpt": "Brain",
  ai: "Sparkles",
  office: "Layers",
  windows: "MonitorPlay",
};

const BRAND_COLORS = [
  { name: "Netflix", bg: "#E50914", color: "#ffffff" },
  { name: "Spotify", bg: "#1DB954", color: "#ffffff" },
  { name: "Neon Green", bg: "#22c55e", color: "#ffffff" },
  { name: "Premium Purple", bg: "#8b5cf6", color: "#ffffff" },
  { name: "HBO Max", bg: "#5822b4", color: "#ffffff" },
  { name: "Disney+", bg: "#006e99", color: "#ffffff" },
  { name: "YouTube", bg: "#ff0000", color: "#ffffff" },
  { name: "Amazon", bg: "#ff9900", color: "#000000" },
  { name: "Ghost Blue", bg: "#3b82f6", color: "#ffffff" },
  { name: "Cyber Pink", bg: "#ec4899", color: "#ffffff" },
];

export default function AdminDashboard() {
  const router = useRouter();

  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [currentView, setCurrentView] = useState<View>("LIST");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [settings, setSettings] = useState<Settings>({ 
    flashSaleEnabled: false, 
    currency: "$", 
    flashSaleEndTime: null,
    popupEnabled: false,
    popupText: "",
    popupDelay: 5
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Form State
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});

  // Fetch initial data
  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/badges").then(r => r.json()),
      fetch("/api/settings").then(r => r.json()),
    ]).then(([prodRes, catRes, badgeRes, setRes]) => {
      setProducts(Array.isArray(prodRes) ? prodRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
      setBadges(Array.isArray(badgeRes) ? badgeRes : []);
      setSettings(setRes && !setRes.error ? setRes : { 
        flashSaleEnabled: false, 
        currency: "$",
        popupEnabled: false,
        popupText: "",
        popupDelay: 5
      });
      setLoading(false);
    });
  }, []);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // --- View Actions ---
  const goToAddView = () => {
    setEditProduct({
      category: categories[0]?.name || "Streaming",
      name: "",
      description: "",
      icon: "Star",
      iconBg: "#22c55e",
      iconColor: "#ffffff",
      badge: null,
      features: [""],
      plans: [{ id: `plan-${Math.random().toString(36).slice(2, 9)}`, tier: "Premium", price: 10, duration: "1 Month" }]
    });
    setCurrentView("ADD");
  };

  const goToEditView = (p: Product) => {
    setEditProduct({ ...p });
    setCurrentView("EDIT");
  };

  const goToList = () => {
    setCurrentView("LIST");
    setEditProduct({});
  };

  // --- Smart Icon Logic ---
  const handleNameChange = (name: string) => {
    setField("name", name);
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(ICON_SUGGESTIONS)) {
        if (lower.includes(key)) {
            setField("icon", icon);
            break;
        }
    }
  };

  const applyBrandColor = (bg: string, color: string) => {
    setField("iconBg", bg);
    setField("iconColor", color);
  };

  // --- Save Logic ---
  async function handleSaveProduct() {
if (!editProduct.name || !editProduct.category) return showToast("Name and Category required", "error");

    const method = currentView === "ADD" ? "POST" : "PUT";
    const url = currentView === "ADD" ? "/api/products" : `/api/products/${editProduct.id}`;
    
    // Ensure productId matches id for new products
    const finalData = { ...editProduct };
    if (currentView === "ADD") {
       finalData.id = `p-${Date.now()}`;
    }

    const res = await fetch(url, { method, body: JSON.stringify(finalData) });
    if (res.ok) {
      const data = await res.json();
      if (currentView === "ADD") {
        setProducts([...products, { ...data.product, id: data.product.productId }]);
        showToast("Product created");
      } else {
        setProducts(products.map(p => p.id === editProduct.id ? { ...data.product, id: data.product.productId } : p));
        showToast("Product updated");
      }
      goToList();
    } else {
      showToast("Error saving product", "error");
    }
  }

  // --- Field Management ---
  const setField = (f: keyof Product, v: unknown) => setEditProduct(prev => ({ ...prev, [f]: v }));
  
  const updatePlan = (index: number, f: keyof Plan, v: unknown) => {
    const plans = [...(editProduct.plans || [])];
    plans[index] = { ...plans[index], [f]: v };
    setField("plans", plans);
  };

  const addPlan = () => {
    // eslint-disable-next-line react-hooks/purity
    const plans = [...(editProduct.plans || []), { id: `plan-${Math.random().toString(36).slice(2, 9)}`, tier: "Gold", price: 15, duration: "3 Months" }];
    setField("plans", plans);
  };

  const removePlan = (index: number) => {
    const plans = (editProduct.plans || []).filter((_, i) => i !== index);
    setField("plans", plans);
  };

  const updateFeature = (index: number, v: string) => {
    const features = [...(editProduct.features || [])];
    features[index] = v;
    setField("features", features);
  };

  const addFeature = () => setField("features", [...(editProduct.features || []), ""]);
  const removeFeature = (index: number) => setField("features", (editProduct.features || []).filter((_, i) => i !== index));

  // --- Trash Logic ---
  async function deleteProduct(id: string) {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter(p => p.id !== id));
      showToast("Product deleted", "error");
    }
  }

  // Categories/Badges Add/Delete logic remains same
  const [newCat, setNewCat] = useState({ name: "", icon: "Star" });
  async function addCategory() {
    if (!newCat.name) return;
    const res = await fetch("/api/categories", { method: "POST", body: JSON.stringify(newCat) });
    if (res.ok) {
      const { category } = await res.json();
      setCategories([...categories, category]);
      setNewCat({ name: "", icon: "Star" });
      showToast("Category added");
    }
  }
  async function deleteCategory(id: string) {
    if (!confirm("Delete category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) setCategories(categories.filter(c => c._id !== id));
  }
  const [newBadge, setNewBadge] = useState({ name: "", colorClass: "badge-green" });
  async function addBadge() {
    if (!newBadge.name) return;
    const res = await fetch("/api/badges", { method: "POST", body: JSON.stringify(newBadge) });
    if (res.ok) {
      const { badge } = await res.json();
      setBadges([...badges, badge]);
      setNewBadge({ name: "", colorClass: "badge-green" });
      showToast("Badge added");
    }
  }
  async function deleteBadge(id: string) {
    if (!confirm("Delete badge?")) return;
    const res = await fetch(`/api/badges/${id}`, { method: "DELETE" });
    if (res.ok) setBadges(badges.filter(b => b._id !== id));
  }

  // --- Settings ---
  async function toggleFlashSale() {
    const nextVal = !settings.flashSaleEnabled;
    const res = await fetch("/api/settings", { method: "PUT", body: JSON.stringify({ flashSaleEnabled: nextVal }) });
    if (res.ok) {
      setSettings({ ...settings, flashSaleEnabled: nextVal });
      showToast(nextVal ? "Flash Sale Enabled" : "Flash Sale Disabled");
    }
  }
  async function updateCurrency(c: string) {
    const res = await fetch("/api/settings", { method: "PUT", body: JSON.stringify({ currency: c }) });
    if (res.ok) {
        setSettings({ ...settings, currency: c });
        showToast(`Currency updated to ${c}`);
    }
  }
  async function updatePopupSettings(enabled: boolean, text: string, delay: number) {
    const res = await fetch("/api/settings", { 
        method: "PUT", 
        body: JSON.stringify({ 
            popupEnabled: enabled, 
            popupText: text, 
            popupDelay: delay 
        }) 
    });
    if (res.ok) {
        setSettings({ ...settings, popupEnabled: enabled, popupText: text, popupDelay: delay });
        showToast("Popup settings updated");
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) return <div className="p-12 text-center text-[var(--text-muted)]">Loading Admin Dashboard...</div>;

  return (
    <div className="flex min-h-dvh bg-[var(--bg-base)] overflow-x-hidden">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar !bg-[#0a0a0a] !border-r !border-white/5 shadow-2xl z-[100] w-72 h-screen sticky top-0 ${sidebarOpen ? 'open' : ''}`}>
        <div className="mb-12 pt-8 px-8">
          <h2 className="text-2xl font-black font-[family-name:var(--font-space)] text-white tracking-tighter flex items-center gap-2">
            SubsHub<span className="text-[var(--brand-primary)]">Admin</span>
          </h2>
          <div className="w-10 h-1 bg-[var(--brand-primary)] mt-3 rounded-full opacity-50" />
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-4">
          <NavItem active={activeTab === "products"} onClick={() => { setActiveTab("products"); goToList(); setSidebarOpen(false); }} icon={<LayoutDashboard size={20} />} label="Products" />
          <NavItem active={activeTab === "categories"} onClick={() => { setActiveTab("categories"); goToList(); setSidebarOpen(false); }} icon={<Tag size={20} />} label="Categories" />
          <NavItem active={activeTab === "badges"} onClick={() => { setActiveTab("badges"); goToList(); setSidebarOpen(false); }} icon={<Shield size={20} />} label="Badges" />
          <NavItem active={activeTab === "settings"} onClick={() => { setActiveTab("settings"); goToList(); setSidebarOpen(false); }} icon={<Zap size={20} />} label="Settings" />
        </nav>

        <div className="p-4 mt-auto">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 group">
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout Session
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT Area */}
      <main className="flex-1 min-h-screen bg-[#0f0f0f] relative overflow-hidden">
        
        {/* VIEW 1: PRODUCT LIST */}
        {activeTab === "products" && currentView === "LIST" && (
          <div className="fade-in p-12 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="p-3 bg-white/5 rounded-2xl lg:hidden text-white/40 hover:text-white">
                    <span className="flex flex-col gap-1 w-6 items-center">
                        <span className="w-6 h-0.5 bg-current rounded-full" />
                        <span className="w-6 h-0.5 bg-current rounded-full" />
                        <span className="w-4 h-0.5 bg-current rounded-full self-start" />
                    </span>
                </button>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-space)] text-white flex items-center gap-3 tracking-tighter">
                    Storefront <ChevronRight size={24} className="text-white/20 hidden sm:block" /> <span className="text-[var(--brand-primary)] sm:text-white">Products</span>
                  </h1>
                  <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mt-2">Managing {products.length} digital items</p>
                </div>
              </div>
              <button 
                onClick={goToAddView} 
                className="btn-primary !px-8 sm:!px-10 !py-4 w-full sm:w-auto shadow-2xl shadow-[var(--brand-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 rounded-full font-black uppercase text-xs tracking-widest"
              >
                <Plus size={20} strokeWidth={4} /> New Product
              </button>
            </div>
            
            <div className="bg-[#141414] border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl data-table-container">
              <table className="data-table">
                <thead className="bg-[#1a1a1a] !border-none">
                  <tr>
                    <th className="pl-10 !text-white/40 !py-6">Product Details</th>
                    <th className="!text-white/40">Category</th>
                    <th className="!text-white/40">Price Range</th>
                    <th className="!text-white/40">Status</th>
                    <th className="pr-10 text-right !text-white/40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {products.map((p) => (
                    <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="pl-10 py-6">
                        <div className="flex items-center gap-5">
                          <ProductIcon name={p.icon} bg={p.iconBg} color={p.iconColor} size={48} />
                          <div>
                            <span className="font-black text-base text-white block tracking-tight">{p.name}</span>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1 inline-block">
                                {p.plans.length} Pricing tiers
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/50 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            {p.category}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col">
                            <span className="font-black text-[var(--brand-primary)] text-sm tracking-tighter">
                                {settings.currency}{Math.min(...p.plans.map(pl => pl.price))} - {settings.currency}{Math.max(...p.plans.map(pl => pl.price))}
                            </span>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5">Global Price</span>
                        </div>
                      </td>
                      <td>
                        {p.badge ? (
                          <span className={`badge !text-[9px] !px-4 !py-1 ${badges.find(b => b.name === p.badge)?.colorClass || "badge-green"} shadow-lg shadow-current/10`}>{p.badge}</span>
                        ) : (
                          <span className="text-white/10 text-xs font-mono">—</span>
                        )}
                      </td>
                      <td className="pr-10 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <button onClick={() => goToEditView(p)} className="p-3 text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all" title="Edit Product">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all" title="Delete Product">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-24">
                         <LayoutDashboard size={64} className="mx-auto text-white/5 mb-6" />
                         <p className="text-white/30 font-black uppercase tracking-widest text-sm">Empty Catalog</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 2 & 3: FULL PAGE EDITOR (DEDICATED PAGE) */}
        {(currentView === "ADD" || currentView === "EDIT") && (
          <div className="fade-in min-h-screen flex flex-col bg-[#0d0d0d]">
            {/* Header */}
            <header className="p-6 sm:p-10 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.02] backdrop-blur-2xl sticky top-0 z-20">
               <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <button onClick={goToList} className="p-3 sm:p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                  </button>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-black text-white tracking-tighter">{currentView === "ADD" ? "Create Product" : "Modifying Item"}</h2>
                    <p className="text-[9px] text-[var(--brand-primary)] font-black uppercase tracking-[0.2em] mt-1 sm:mt-2">{currentView === "ADD" ? "Registry Mode" : `ID: ${editProduct.id}`}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <button onClick={goToList} className="flex-1 sm:flex-none px-4 sm:px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all">Cancel</button>
                  <button onClick={handleSaveProduct} className="flex-[2] sm:flex-none btn-primary !px-8 sm:!px-12 !py-4 shadow-2xl shadow-[var(--brand-primary)]/30 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                    <Save size={18} /> {currentView === "ADD" ? "Publish" : "Save Changes"}
                  </button>
               </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar">
               <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16 pb-20">
                  {/* Grid Layout for Forms */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                     {/* Left: Configuration */}
                     <div className="lg:col-span-2 space-y-12">
                        <section>
                           <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 block flex items-center gap-3">
                              <span className="w-8 h-px bg-white/20" /> PRODUCT METADATA
                           </label>
                           <div className="space-y-8">
                               <div className="group">
                                 <label className="admin-label !text-white/40 group-focus-within:!text-[var(--brand-primary)]">Product Title</label>
                                 <input className="input !bg-white/5 !border-none !text-2xl !py-5 font-black tracking-tighter focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all" placeholder="e.g. Netflix Premium" value={editProduct.name || ""} onChange={(e) => handleNameChange(e.target.value)} />
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div>
                                     <label className="admin-label !text-white/40 mb-4">Market Segment</label>
                                     <div className="flex flex-wrap gap-3">
                                        {categories.map(c => (
                                            <button
                                                key={c._id}
                                                type="button"
                                                onClick={() => setField("category", c.name)}
                                                className={`
                                                    px-6 py-3 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest
                                                    ${editProduct.category === c.name 
                                                        ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-black" 
                                                        : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"}
                                                `}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                     </div>
                                  </div>
                                  <div>
                                     <label className="admin-label !text-white/40 mb-4">Visual Signal (Badge)</label>
                                     <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setField("badge", null)}
                                            className={`
                                                px-6 py-3 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest
                                                ${!editProduct.badge 
                                                    ? "bg-white/20 border-white/40 text-white" 
                                                    : "bg-white/5 border-white/5 text-white/20 hover:border-white/10"}
                                            `}
                                        >
                                            None
                                        </button>
                                        {badges.map(b => (
                                            <button
                                                key={b._id}
                                                type="button"
                                                onClick={() => setField("badge", b.name)}
                                                className={`
                                                    px-6 py-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest
                                                    ${editProduct.badge === b.name 
                                                        ? "ring-2 ring-white ring-offset-4 ring-offset-[#0d0d0d] scale-105" 
                                                        : "opacity-40 hover:opacity-100"}
                                                    ${b.colorClass}
                                                `}
                                            >
                                                {b.name}
                                            </button>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                               <div>
                                 <label className="admin-label !text-white/40">Display Narrative</label>
                                 <textarea className="input !bg-white/5 !border-none min-h-[140px] resize-none leading-relaxed text-base font-medium" placeholder="Describe the exclusive value of this digital item..." value={editProduct.description || ""} onChange={(e) => setField("description", e.target.value)} />
                               </div>
                           </div>
                        </section>

                        <section>
                           <div className="flex items-center justify-between mb-8">
                               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 block flex items-center gap-3">
                                  <span className="w-8 h-px bg-white/20" /> CORE FEATURES
                               </label>
                               <button onClick={addFeature} className="bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase text-white/60 px-5 py-2.5 rounded-full transition-all flex items-center gap-2 border border-white/5">
                                    <PlusCircle size={14} /> Add Capability
                               </button>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               {(editProduct.features || []).map((feat, idx) => (
                                   <div key={idx} className="group flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 focus-within:border-[var(--brand-primary)] transition-all">
                                       <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)] opacity-40 ml-3" />
                                       <input className="bg-transparent border-none outline-none text-xs w-full py-3 font-black text-white/80" placeholder="e.g. 4K Ultra HD" value={feat} onChange={(e) => updateFeature(idx, e.target.value)} />
                                       <button onClick={() => removeFeature(idx)} className="text-red-500/40 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all">
                                           <MinusCircle size={18} />
                                       </button>
                                   </div>
                               ))}
                           </div>
                        </section>
                     </div>

                     {/* Right: Visual Identity */}
                     <div className="space-y-12">
                        <section>
                           <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 block flex items-center gap-3">
                              <span className="w-8 h-px bg-white/20" /> VISUAL IDENTITY
                           </label>
                           <div className="space-y-8">
                               <div className="flex flex-col items-center justify-center p-12 rounded-[3.5rem] border-4 border-dashed border-white/5 bg-white/[0.01] relative group overflow-hidden">
                                  <div className="absolute inset-0 bg-[var(--brand-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-1000" />
                                  <div className="z-10 transform group-hover:scale-110 transition-transform duration-700">
                                       <ProductIcon name={editProduct.icon || "Star"} bg={editProduct.iconBg || "#22c55e"} color={editProduct.iconColor || "#fff"} size={100} />
                                  </div>
                                  <p className="mt-8 font-black text-2xl text-white tracking-tighter z-10">{editProduct.name || "Product Name"}</p>
                                  <p className="text-[9px] font-black uppercase text-white/20 mt-2 tracking-[0.3em] z-10">Storefront Preview</p>
                               </div>
                               
                               <div className="space-y-4">
                                  <label className="admin-label !text-white/40">Dynamic Icon Engine</label>
                                  <IconPicker currentIcon={editProduct.icon || "Star"} onSelect={(name) => setField("icon", name)} />
                               </div>

                               <div className="space-y-6">
                                  <div className="flex items-center gap-3">
                                      <Palette size={16} className="text-[var(--brand-primary)]" />
                                      <label className="admin-label !mb-0 !text-white/40">Brand Palette Presets</label>
                                  </div>
                                  <div className="flex flex-wrap gap-4 p-6 bg-white/[0.03] rounded-[2.5rem] border border-white/5">
                                     {BRAND_COLORS.map(c => (
                                         <button 
                                            key={c.name}
                                            onClick={() => applyBrandColor(c.bg, c.color)}
                                            className="w-12 h-12 rounded-2xl border-4 border-white/10 hover:border-white transition-all transform hover:scale-110 shadow-2xl"
                                            style={{ backgroundColor: c.bg }}
                                         />
                                     ))}
                                     <div className="w-12 h-12 rounded-2xl bg-white/5 border-2 border-white/10 p-1 flex items-center justify-center relative">
                                        <input type="color" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={editProduct.iconBg || "#000000"} onChange={(e) => setField("iconBg", e.target.value)} />
                                        <Palette size={20} className="text-white/20" />
                                     </div>
                                  </div>
                               </div>
                           </div>
                        </section>
                     </div>
                  </div>

                  {/* Wide Section: Pricing Tiers */}
                  <section>
                    <div className="flex items-center justify-between mb-8">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 block flex items-center gap-3">
                           <span className="w-8 h-px bg-white/20" /> PRICING ARCHITECTURE
                        </label>
                        <button onClick={addPlan} className="bg-white/5 hover:bg-orange-500 hover:text-black border border-white/5 px-8 py-3 rounded-full font-black text-[10px] uppercase transition-all flex items-center gap-2">
                             <Plus size={16} strokeWidth={4} /> New Tier
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(editProduct.plans || []).map((plan, idx) => (
                            <div key={plan.id} className="p-10 bg-white/[0.03] rounded-[3rem] border border-white/5 group hover:border-[var(--brand-primary)]/30 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <Zap size={60} className="text-white" />
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-2 block">Tier Level</label>
                                            <input className="input !bg-white/5 !border-none !text-white font-black py-4" placeholder="e.g. Platinum" value={plan.tier} onChange={(e) => updatePlan(idx, "tier", e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-2 block">Price ({settings.currency})</label>
                                            <input type="number" className="input !bg-white/5 !border-none text-[var(--brand-primary)] font-black text-2xl py-4" value={plan.price} onChange={(e) => updatePlan(idx, "price", parseFloat(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-2 block">Validity/Term</label>
                                            <input className="input !bg-white/5 !border-none font-bold" placeholder="e.g. Annual" value={plan.duration} onChange={(e) => updatePlan(idx, "duration", e.target.value)} />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] mb-2 block">Market Price</label>
                                                <input type="number" className="input !bg-white/5 !border-none text-white/30 font-bold" value={plan.originalPrice || ""} onChange={(e) => updatePlan(idx, "originalPrice", e.target.value ? parseFloat(e.target.value) : undefined)} />
                                            </div>
                                            <button onClick={() => removePlan(idx)} className="h-[52px] w-[52px] mt-6 flex items-center justify-center text-red-500/30 hover:text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-2xl transition-all">
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                  </section>
               </div>
            </div>
          </div>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === "categories" && (
          <div className="fade-in p-12 max-w-2xl mx-auto">
            <h1 className="text-4xl font-black font-[family-name:var(--font-space)] text-white mb-10 tracking-tighter">Market Segments</h1>
            <div className="bg-[#141414] border border-white/5 rounded-[3rem] p-10 mb-12 shadow-2xl space-y-8">
              <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="admin-label !text-white/40">Segment Name</label>
                    <input className="input !bg-white/5 !border-none" placeholder="e.g. Subscriptions" value={newCat.name} onChange={(e) => setNewCat({...newCat, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="admin-label !text-white/40">Visual Token (Lucide)</label>
                    <input className="input !bg-white/5 !border-none" placeholder="e.g. Tv2" value={newCat.icon} onChange={(e) => setNewCat({...newCat, icon: e.target.value})} />
                  </div>
              </div>
              <button onClick={addCategory} className="btn-primary !py-5 w-full rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl">
                Register New Segment
              </button>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
              {categories.map((c) => (
                <div key={c._id} className="flex items-center justify-between p-8 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-6">
                     <span className="font-black text-lg text-white tracking-tight">{c.name}</span>
                     <span className="text-[10px] font-black text-white/20 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{c.icon} icon</span>
                  </div>
                  <button onClick={() => deleteCategory(c._id)} className="p-4 text-white/20 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- BADGES TAB --- */}
        {activeTab === "badges" && (
          <div className="fade-in p-12 max-w-3xl mx-auto">
            <h1 className="text-4xl font-black font-[family-name:var(--font-space)] text-white mb-10 tracking-tighter">Marketing Signals</h1>
            <div className="bg-[#141414] border border-white/5 rounded-[3rem] p-10 mb-12 shadow-2xl space-y-8">
              <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="admin-label !text-white/40">Badge Text</label>
                    <input className="input !bg-white/5 !border-none font-black" placeholder="e.g. HOT DEAL" value={newBadge.name} onChange={(e) => setNewBadge({...newBadge, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="admin-label !text-white/40">Visual Theme</label>
                    <select className="input !bg-white/5 !border-none font-black" value={newBadge.colorClass} onChange={(e) => setNewBadge({...newBadge, colorClass: e.target.value})}>
                        <option value="badge-green">Neon Emerald</option>
                        <option value="badge-blue">Azure Crystal</option>
                        <option value="badge-red">Burning Red</option>
                        <option value="badge-purple">Electric Violet</option>
                        <option value="badge-yellow">Cyber Lime</option>
                        <option value="badge-orange">Solar Flare</option>
                    </select>
                  </div>
              </div>
              <button onClick={addBadge} className="btn-primary !py-5 w-full rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl">
                Create Signal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((b) => (
                <div key={b._id} className="flex items-center justify-between p-8 bg-[#141414] border border-white/5 rounded-[2.5rem] shadow-2xl hover:border-white/20 transition-all group">
                    <span className={`badge !text-[10px] !px-6 !py-2 !font-black !uppercase !tracking-widest shadow-xl shadow-current/5 ${b.colorClass}`}>{b.name}</span>
                    <button onClick={() => deleteBadge(b._id)} className="p-3 text-white/10 group-hover:text-red-500 bg-white/5 rounded-2xl transition-all">
                        <Trash2 size={20} />
                    </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === "settings" && (
          <div className="fade-in p-12 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black font-[family-name:var(--font-space)] text-white mb-10 tracking-tighter">Core Configuration</h1>
            
            <div className="bg-[#141414] border border-white/5 rounded-[3.5rem] p-12 shadow-2xl space-y-16">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-2xl text-white tracking-tight">Flash Sale Campaign</h3>
                  <p className="text-[10px] text-white/30 mt-2 font-black uppercase tracking-[0.3em]">Global Site Announcement</p>
                </div>
                <button 
                  onClick={toggleFlashSale} 
                  className={`
                    px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all
                    ${settings.flashSaleEnabled 
                        ? 'bg-[var(--brand-primary)] text-black shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-105' 
                        : 'bg-white/5 text-white/20 hover:text-white hover:bg-white/10'}
                  `}
                >
                  {settings.flashSaleEnabled ? 'CAMPAIGN ACTIVE ✓' : 'CAMPAIGN OFFLINE'}
                </button>
              </div>

              <div className="pt-12 border-t border-white/5">
                 <h3 className="font-black text-2xl text-white tracking-tight mb-8">Store Global Asset Currency</h3>
                 <div className="space-y-10">
                    <CurrencyPicker current={settings.currency || "$"} onSelect={(c) => updateCurrency(c)} />
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-[9px] font-black text-white/30 leading-relaxed uppercase tracking-[0.2em]">
                            Note: Updating the currency will instantly synchronize all pricing tables across the entire storefront globally. 
                            The current active base is <span className="text-[var(--brand-primary)]">{(settings.currency || "$")}</span>.
                        </p>
                    </div>
                 </div>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-12">
                 <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-2xl text-white tracking-tight">Announcement Notice</h3>
                        <p className="text-[10px] text-white/30 mt-2 font-black uppercase tracking-[0.3em]">Timed Storefront Popup</p>
                    </div>
                    <button 
                        onClick={() => updatePopupSettings(!settings.popupEnabled, settings.popupText, settings.popupDelay)} 
                        className={`
                            px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all
                            ${settings.popupEnabled 
                                ? 'bg-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.3)] scale-105' 
                                : 'bg-white/5 text-white/20 hover:text-white hover:bg-white/10'}
                        `}
                    >
                        {settings.popupEnabled ? 'POPUP ACTIVE ✓' : 'POPUP OFFLINE'}
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3">
                        <label className="admin-label !text-white/40 mb-3 block">Notice Message</label>
                        <textarea 
                            className="input !bg-white/5 !border-none min-h-[100px] resize-none text-sm font-medium"
                            placeholder="Type the message to show in the popup..."
                            value={settings.popupText}
                            onChange={(e) => setSettings({...settings, popupText: e.target.value})}
                            onBlur={() => updatePopupSettings(settings.popupEnabled, settings.popupText, settings.popupDelay)}
                        />
                    </div>
                    <div>
                         <label className="admin-label !text-white/40 mb-3 block">Delay (Seconds)</label>
                         <input 
                            type="number"
                            className="input !bg-white/5 !border-none font-black text-xl"
                            value={settings.popupDelay}
                            onChange={(e) => setSettings({...settings, popupDelay: parseInt(e.target.value) || 0})}
                         />
                         <p className="text-[9px] text-white/20 mt-3 font-bold">Time before popup appears</p>
                    </div>
                 </div>
                 <div className="flex justify-end pt-4">
                    <button 
                        onClick={() => updatePopupSettings(settings.popupEnabled, settings.popupText, settings.popupDelay)}
                        className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2"
                    >
                        <Save size={14} /> Update Notice Configuration
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* TOAST SYSTEM */}
      {toast && (
        <div className={`toast !fixed !bottom-10 !right-10 !p-8 !rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-3xl animate-slide-up ${toast.type}`}>
          <div className="flex items-center gap-4">
             {toast.type === "success" ? <Zap size={24} className="fill-current text-green-400" /> : <Shield size={24} className="text-red-400" />}
             <div>
                <span className="font-black text-white tracking-tight block">SYSTEM UPDATE</span>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{toast.msg}</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button 
            onClick={onClick} 
            className={`
                flex items-center gap-5 px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all
                ${active 
                    ? "bg-[var(--brand-primary)] text-black shadow-2xl shadow-[var(--brand-primary)]/40 transform scale-105" 
                    : "text-white/30 hover:text-white hover:bg-white/[0.03] group"}
            `}
        >
            <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
            <span className="tracking-[0.1em]">{label}</span>
        </button>
    );
}
