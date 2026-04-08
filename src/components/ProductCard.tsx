import { CheckCircle2, ChevronRight } from "lucide-react";
import ProductIcon from "@/components/ProductIcon";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
  badgeClass: string;
  currency: string;
  onClick: () => void;
}

export default function ProductCard({ product, badgeClass, currency, onClick }: Props) {
  const lowestPrice = Math.min(...product.plans.map((pl) => pl.price));
  const planCount   = product.plans.length;

  return (
    <article
      className="product-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`${product.name} — from ${currency}${lowestPrice}`}
    >
      <ProductIcon
        name={product.icon}
        bg={product.iconBg}
        color={product.iconColor}
        size={44}
        className="xs:w-[38px] xs:h-[38px]" /* Responsive scaling in CSS */
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[var(--text-primary)] text-[0.95rem] leading-tight font-[family-name:var(--font-space)] truncate">
            {product.name}
          </span>
          {product.badge && (
            <span className={`badge ${badgeClass} text-[0.6rem] sm:text-xs`}>
              {product.badge}
            </span>
          )}
        </div>
        <p className="text-[var(--text-secondary)] text-[10px] sm:text-xs mt-0.5 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          <CheckCircle2 size={11} className="text-pink-500 flex-shrink-0" />
          <span className="text-pink-500 text-[0.68rem] font-semibold">
            {planCount} {planCount === 1 ? "Plan" : "Plans"} Available
          </span>
        </div>
      </div>

      <div className="price-from ml-auto">
        <div className="price-label !text-[0.6rem]">FROM</div>
        <div className="price-value !text-lg sm:!text-xl">{currency}{lowestPrice}</div>
      </div>

      <ChevronRight size={16} className="text-[var(--brand-primary)] opacity-50 flex-shrink-0" />
    </article>
  );
}
