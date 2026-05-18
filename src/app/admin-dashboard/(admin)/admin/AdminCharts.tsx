// src/app/admin-dashboard/(admin)/admin/AdminCharts.tsx
"use client";

import { formatPrice } from "@/lib/format";
import { useState } from "react";

interface Props {
  topMovies:      { title: string; quantity: number; revenue: number }[];
  revenueByMonth: { label: string; revenue: number }[];
  avgOrderValue:  number;
  avgSalePrice:   number;
  totalRevenue:   number;
  orderCount:     number;
  customerCount:  number;
}

// ── Tiny SVG bar chart ────────────────────────────────────────────
function BarChart({
  data,
  valueKey,
  labelKey,
  color = "var(--gold)",
  formatValue = (v: number) => String(v),
}: {
  data: Record<string, unknown>[];
  valueKey: string;
  labelKey: string;
  color?: string;
  formatValue?: (v: number) => string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const values = data.map((d) => Number(d[valueKey]));
  const max    = Math.max(...values, 1);
  const W = 600; const H = 200; const PAD = 40; const GAP = 8;
  const barW   = (W - PAD * 2 - GAP * (data.length - 1)) / data.length;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H + 40}`} style={{ width: "100%", minWidth: "320px" }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = PAD + (1 - frac) * H;
          return (
            <g key={frac}>
              <line x1={PAD} y1={y} x2={W - PAD} y2={y}
                stroke="rgba(232,160,48,0.08)" strokeWidth="1" />
              <text x={PAD - 6} y={y + 4} textAnchor="end"
                fill="var(--text-dim)" fontSize="10">
                {formatValue(Math.round(frac * max))}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const val    = Number(d[valueKey]);
          const label  = String(d[labelKey]);
          const barH   = (val / max) * H;
          const x      = PAD + i * (barW + GAP);
          const y      = PAD + H - barH;
          const isHov  = hovered === i;

          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x} y={y} width={barW} height={barH}
                fill={isHov ? "var(--gold-light)" : color}
                rx={4}
                style={{ transition: "fill 0.15s" }}
                opacity={isHov ? 1 : 0.85}
              />

              {/* Tooltip on hover — full title + value */}
              {isHov && (
                <g>
                  <rect
                    x={x - 4} y={y - 46} width={barW + 8} height={40} rx={4}
                    fill="var(--surface2)"
                  />
                  <text x={x + barW / 2} y={y - 30} textAnchor="middle"
                    fill="var(--text-muted)" fontSize="9">
                    {label}
                  </text>
                  <text x={x + barW / 2} y={y - 13} textAnchor="middle"
                    fill="var(--gold)" fontSize="11" fontWeight="600">
                    {formatValue(val)}
                  </text>
                </g>
              )}

              {/* X-axis label — truncated for space */}
              <text
                x={x + barW / 2} y={PAD + H + 16}
                textAnchor="middle" fill="var(--text-muted)" fontSize="10"
              >
                {label.length > 12 ? label.slice(0, 11) + "…" : label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Donut / gauge chart ───────────────────────────────────────────
function DonutStat({
  value, max, label, sublabel, color = "var(--gold)",
}: { value: number; max: number; label: string; sublabel: string; color?: string }) {
  const R = 52; const cx = 70; const cy = 70;
  const circ = 2 * Math.PI * R;
  const frac = Math.min(value / Math.max(max, 1), 1);
  const dash = frac * circ;

  return (
    <div  style={{ textAlign: "center" }}>
      <svg width={140} height={140} style={{ display: "block", margin: "0 auto" }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke="rgba(232,160,48,0.1)" strokeWidth="12" />
        {/* Fill */}
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        {/* Centre text */}
        <text x={cx} y={cy - 6} textAnchor="middle"
          fill={color} fontSize="18" fontFamily="var(--font-display)" fontWeight="700">
          {label}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle"
          fill="var(--text-muted)" fontSize="10">
          {sublabel}
        </text>
      </svg>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export function AdminCharts({
  topMovies,
  revenueByMonth,
  avgOrderValue,
  avgSalePrice,
  totalRevenue,
  orderCount,
  customerCount,
}: Props) {

  const cardStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "20px",
  };
  const titleStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "1rem",
    letterSpacing: "0.12em",
    color: "var(--gold)",
    marginBottom: "16px",
    textTransform: "uppercase",
  };

  return (
    <div style={{ display: "grid", gap: "16px" }}>

      {/* Row 1: Revenue chart + KPI donuts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>

        {/* Revenue by month */}
        <div className='border border-(--gold)/40! bg-sidebar-accent/30!'style={cardStyle}>
          <div style={titleStyle}>Revenue by Month (kr)</div>
          {revenueByMonth.every((m) => m.revenue === 0) ? (
            <p style={{ color: "var(--text-dim)", fontStyle: "italic", fontSize: "13px", padding: "40px 0", textAlign: "center" }}>
              No orders yet — revenue will appear here
            </p>
          ) : (
            <BarChart
              data={revenueByMonth}
              valueKey="revenue"
              labelKey="label"
              color="var(--gold)"
              formatValue={(v) => v === 0 ? "0" : v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`}
            />
          )}
        </div>

        {/* KPI donuts */}
        <div className='border border-(--gold)/40! bg-sidebar-accent/30!' style={cardStyle}>
          <div style={titleStyle}>Key Metrics</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <DonutStat
              value={avgOrderValue}
              max={Math.max(avgOrderValue * 2, 500)}
              label={formatPrice(avgOrderValue)}
              sublabel="avg order"
              color="var(--gold)"
            />
            <DonutStat
              value={avgSalePrice}
              max={Math.max(avgSalePrice * 2, 200)}
              label={formatPrice(avgSalePrice)}
              sublabel="avg price"
              color="#a78bfa"
            />
            <DonutStat
              value={orderCount}
              max={Math.max(orderCount, 10)}
              label={String(orderCount)}
              sublabel="orders"
              color="#4ade80"
            />
            <DonutStat
              value={customerCount}
              max={Math.max(customerCount, 10)}
              label={String(customerCount)}
              sublabel="customers"
              color="#60a5fa"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Top movies by quantity + by revenue */}
      {topMovies.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          {/* Top movies by quantity */}
          <div className='border border-(--gold)/40! bg-sidebar-accent/30!' style={cardStyle}>
            <div style={titleStyle}>Most Popular Movies (units sold)</div>
            <BarChart
              data={topMovies}
              valueKey="quantity"
              labelKey="title"
              color="#4ade80"
              formatValue={(v) => `${v} sold`}
            />
          </div>

          {/* Top movies by revenue */}
          <div className="border border-(--gold)/40! bg-sidebar-accent/30!" style={cardStyle}>
            <div style={titleStyle}>Top Movies by Revenue (kr)</div>
            <BarChart
              data={topMovies}
              valueKey="revenue"
              labelKey="title"
              color="#a78bfa"
              formatValue={(v) => `${formatPrice(v)}`}
            />
          </div>
        </div>
      )}

      {/* Row 3: Revenue breakdown text summary */}
      <div className="border border-(--gold)/40! bg-sidebar-accent/30!" style={{ ...cardStyle, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        <div style={titleStyle}>Summary</div>
        {[
          { label: "Total Revenue",       value: `${formatPrice(totalRevenue)}`, color: "var(--gold)" },
          { label: "Average Order Value", value: `${formatPrice(avgOrderValue)}`, color: "#4ade80" },
          { label: "Average Sale Price",  value: `${formatPrice(avgSalePrice)}`,                         color: "#a78bfa" },
          { label: "Orders per Customer", value: customerCount > 0 ? (orderCount / customerCount).toFixed(1) : "—", color: "#60a5fa" },
          { label: "Revenue per Customer", value: customerCount > 0 ? `${formatPrice(totalRevenue / customerCount)}` : "—", color: "#f472b6" },
        ].map((item) => (
          <div key={item.label} style={{ borderLeft: `3px solid ${item.color}`, paddingLeft: "12px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: item.color, letterSpacing: "0.04em" }}>
              {item.value}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
