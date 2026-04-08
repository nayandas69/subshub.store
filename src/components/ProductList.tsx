"use client";

import { useEffect, useState, useCallback } from "react";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import ProductIcon from "@/components/ProductIcon";
import { Product, Category } from "@/lib/types";

export default function ProductList() {
  const [products,  setProducts]  = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [badgeMap, setBadgeMap] = useState<Record<string, string>>({});
  const [loading,     setLoading]     = useState(true);
  const [active,      setActive]      = useState<string>("Streaming");
  const [selected,    setSelected]    = useState<Product | null>(null);
  const [currency,    setCurrency]    = useState<string>("$");

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/badges").then(r => r.json()),
      fetch("/api/settings").then(r => r.json())
    ]).then(([prodRes, catRes, badgeRes, setRes]) => {
      setProducts(Array.isArray(prodRes) ? prodRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
      if (setRes && !setRes.error && setRes.currency) {
        setCurrency(setRes.currency);
      }
      
      const bMap: Record<string, string> = {};
      if (Array.isArray(badgeRes)) {
        badgeRes.forEach(b => {
          bMap[b.name] = b.colorClass;
        });
      }
      setBadgeMap(bMap);
      
      if (Array.isArray(catRes) && catRes.length > 0 && !catRes.find((c: Category) => c.name === active)) {
        setActive(catRes[0].name);
      }
      setLoading(false);
    });
  }, [active]);

  const handleClose = useCallback(() => setSelected(null), []);

  const visible = products.filter((p) => p.category === active);
  const activeCategoryObj = categories.find((c) => c.name === active);

  return (
    <>
      <div className="mb-6">
        {!loading && categories.length > 0 && (
          <CategoryTabs active={active} categories={categories} onChange={setActive} />
        )}
      </div>

      {!loading && activeCategoryObj && (
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <ProductIcon name={activeCategoryObj.icon} bg="transparent" color="var(--brand-primary)" size={24} />
            <h2 className="text-xl font-bold font-[family-name:var(--font-space)]">
              {active}
            </h2>
          </div>
          <span className="text-[var(--brand-primary)] text-xs bg-pink-50 border border-pink-100 px-3 py-1 rounded-full font-bold">
            {visible.length} {visible.length === 1 ? "Offer" : "Offers"}
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              badgeClass={badgeMap[product.badge || ""] || "badge-green"}
              currency={currency}
              onClick={() => setSelected(product)}
            />
          ))}
          {visible.length === 0 && (
            <div className="w-full">
              <p className="text-center text-[var(--text-muted)] py-20 text-sm font-medium border border-dashed border-[var(--border)] rounded-[2rem]">
                No active offers found in {active}.
              </p>
            </div>
          )}
        </div>
      )}

      {selected && (
        <ProductModal product={selected} currency={currency} onClose={handleClose} />
      )}
    </>
  );
}
