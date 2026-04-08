"use client";

import ProductIcon from "@/components/ProductIcon";
import { Category } from "@/lib/types";

interface Props {
  active: string;
  categories: Category[];
  onChange: (c: string) => void;
}

export default function CategoryTabs({ active, categories, onChange }: Props) {
  return (
    <div className="tab-bar overflow-x-auto whitespace-nowrap hide-scrollbar flex" role="tablist" aria-label="Product categories">
      {categories.map((c) => (
        <button
          key={c._id}
          role="tab"
          aria-selected={active === c.name}
          className={`tab-item ${active === c.name ? "active" : ""}`}
          onClick={() => onChange(c.name)}
          id={`tab-${c._id}`}
        >
          <ProductIcon name={c.icon} bg="transparent" color="currentColor" size={18} className="w-[18px] h-[18px] !p-0" />
          {c.name}
        </button>
      ))}
    </div>
  );
}
