import * as Icons from "lucide-react";

interface Props {
  /** Key from Lucide library, e.g. "Tv" or "Gamepad" */
  name: string;
  /** Background hex colour, e.g. "#E50914" */
  bg: string;
  /** Icon fill/stroke colour, e.g. "#ffffff" */
  color: string;
  /** Rendered size in px (default 44) */
  size?: number;
  className?: string;
}

export default function ProductIcon({
  name,
  bg,
  color,
  size = 44,
  className = "",
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[name] || Icons.Star;
  const iconSize = Math.round(size * 0.48);

  return (
    <div
      className={`product-icon flex-shrink-0 flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        color,
        borderRadius: Math.round(size * 0.23),
      }}
      aria-hidden="true"
    >
      <IconComponent size={iconSize} strokeWidth={2.5} />
    </div>
  );
}
