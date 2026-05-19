
"use client";

import { useState, memo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import {
  US_JURISDICTIONS,
  US_TERRITORIES,
  CA_JURISDICTIONS,
  type JurisdictionData,
  type ActivityLevel,
} from "@/lib/research-data";

/* ── Topology URL ─────────────────────────────────────────── */
const US_TOPO = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

/* ── Color palette (dark forest-green theme) ──────────────── */
const FILL: Record<ActivityLevel, string> = {
  hottest: "#C4883A",   // tea-amber — bright gold
  high: "#8B5E3C",      // clay-warm — warm brown
  standard: "#3d6b5e",  // muted sage — blends with bg
};
const FILL_HOVER: Record<ActivityLevel, string> = {
  hottest: "#D4A04A",   // lighter amber
  high: "#A07048",      // lighter clay
  standard: "#4E8070",  // lighter sage
};
const STROKE_DEFAULT = "#1a2f2a";   // matches page bg
const STROKE_HOVER = "#C4883A";     // amber highlight

/* ── Name → data lookup ──────────────────────────────────── */
const usLookupByName = new Map<string, JurisdictionData>();
US_JURISDICTIONS.forEach((j) => usLookupByName.set(j.name, j));

/* ── Tooltip State ────────────────────────────────────────── */
interface TooltipState {
  x: number;
  y: number;
  name: string;
  note: string;
  level: ActivityLevel;
}

/* ── Legend ────────────────────────────────────────────────── */
function Legend() {
  return (
    <div className="flex justify-center gap-6 mb-6 flex-wrap">
      {(
        [
          ["hottest", "Deep / Recurring Work"],
          ["high", "Significant Projects"],
          ["standard", "Researched & Monitored"],
        ] as [ActivityLevel, string][]
      ).map(([level, label]) => (
        <div
          key={level}
          className="flex items-center gap-2 text-xs text-[#D4C9A8]/80"
        >
          <div
            className="w-4 h-4 rounded-sm border border-white/10"
            style={{ backgroundColor: FILL[level] }}
          />
          {label}
        </div>
      ))}
    </div>
  );
}

/* ── Badge Row (reusable for territories + Canada) ────────── */
function BadgeRow({
  items,
  label,
}: {
  items: JurisdictionData[];
  label: string;
}) {
  const [hovered, setHovered] = useState<JurisdictionData | null>(null);

  return (
    <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-widest text-[#C4883A] mb-3 text-center">
        {label}
      </p>
      <div className="flex justify-center gap-2.5 flex-wrap">
        {items.map((t) => (
          <div
            key={t.abbr}
            className="relative"
            onMouseEnter={() => setHovered(t)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide cursor-pointer
                          transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: FILL[t.level],
                color: t.level === "standard" ? "#D4C9A8" : "#FAF7F2",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {t.abbr}
            </div>
            <AnimatePresence>
              {hovered?.abbr === t.abbr && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
                              w-60 p-3 rounded-lg shadow-xl
                              bg-[#0f1f1b] border border-[#C4883A]/30
                              text-[#FAF7F2] text-xs leading-relaxed pointer-events-none"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: FILL[t.level] }}
                    />
                    <p className="font-display font-bold text-sm">{t.name}</p>
                  </div>
                  <p className="text-[#D4C9A8]/90">{t.note}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN MAP COMPONENT
   ═══════════════════════════════════════════════════════════ */
function JurisdictionMap() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleMouseEnter = useCallback(
    (geo: any, evt?: React.MouseEvent) => {
      const rawName: string = geo.properties.name || geo.properties.NAME || "";
      const data = usLookupByName.get(rawName);
      if (data && evt) {
        const rect = (evt.currentTarget as HTMLElement)
          .closest("svg")
          ?.getBoundingClientRect();
        setTooltip({
          x: evt.clientX - (rect?.left || 0),
          y: evt.clientY - (rect?.top || 0) - 12,
          name: data.name,
          note: data.note,
          level: data.level,
        });
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return (
    <div>
      <Legend />

      {/* ── US Map ──────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#C4883A] mb-3 text-center">
          United States
        </p>
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 1000 }}
            width={800}
            height={500}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={US_TOPO}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo) => {
                  const rawName: string =
                    geo.properties.name || geo.properties.NAME || "";
                  const data = usLookupByName.get(rawName);
                  const level: ActivityLevel = data?.level || "standard";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(evt: any) =>
                        handleMouseEnter(geo, evt)
                      }
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: FILL[level],
                          stroke: STROKE_DEFAULT,
                          strokeWidth: 0.75,
                          outline: "none",
                          transition: "fill 0.2s ease, stroke 0.2s ease",
                        },
                        hover: {
                          fill: FILL_HOVER[level],
                          stroke: STROKE_HOVER,
                          strokeWidth: 1.5,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: FILL_HOVER[level],
                          stroke: STROKE_HOVER,
                          strokeWidth: 1.5,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Tooltip overlay */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute z-50 w-64 p-3 rounded-lg shadow-xl
                            bg-[#0f1f1b] border border-[#C4883A]/30
                            text-[#FAF7F2] text-xs leading-relaxed pointer-events-none"
                style={{ left: tooltip.x - 128, top: tooltip.y - 70 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: FILL[tooltip.level] }}
                  />
                  <p className="font-display font-bold text-sm">{tooltip.name}</p>
                </div>
                <p className="text-[#D4C9A8]/90">{tooltip.note}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Territory Badges ────────────────────────────── */}
      <BadgeRow items={US_TERRITORIES} label="U.S. Territories" />

      {/* ── Canada Province Badges ──────────────────────── */}
      <BadgeRow items={CA_JURISDICTIONS} label={"\uD83C\uDDE8\uD83C\uDDE6 Canada \u2014 Provinces & Territories"} />
    </div>
  );
}

export default memo(JurisdictionMap);
