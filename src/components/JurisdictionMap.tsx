
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

const US_TOPO = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const FILL: Record<ActivityLevel, string> = {
  hottest: "#C4883A",
  high: "#8B5E3C",
  standard: "#3d6b5e",
};

const FILL_HOVER: Record<ActivityLevel, string> = {
  hottest: "#D4A04A",
  high: "#A07048",
  standard: "#4E8070",
};

const STROKE_DEFAULT = "#1a2f2a";
const STROKE_HOVER = "#C4883A";

const usLookupByName = new Map<string, JurisdictionData>();
US_JURISDICTIONS.forEach((j) => usLookupByName.set(j.name, j));

interface TooltipState {
  x: number;
  y: number;
  name: string;
  note: string;
  tooltipLines?: string[];
  level: ActivityLevel;
}

interface GeographyFeature {
  rsmKey: string;
  properties: {
    name?: string;
    NAME?: string;
  };
}

interface GeographiesRenderArgs {
  geographies: GeographyFeature[];
}

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
        {items.map((item) => (
          <div
            key={item.abbr}
            className="relative"
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: FILL[item.level],
                color: item.level === "standard" ? "#D4C9A8" : "#FAF7F2",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {item.abbr}
            </div>

            <AnimatePresence>
              {hovered?.abbr === item.abbr && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 rounded-lg shadow-xl bg-[#0f1f1b] border border-[#C4883A]/30 text-[#FAF7F2] text-xs leading-relaxed pointer-events-none"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: FILL[item.level] }}
                    />
                    <p className="font-display font-bold text-sm">{item.name}</p>
                  </div>

                  <p className="text-[#D4C9A8]/90 mb-2">{item.note}</p>

                  {Array.isArray(item.tooltipLines) && item.tooltipLines.length > 0 && (
                    <ul className="space-y-1 text-[#D4C9A8]/80">
                      {item.tooltipLines.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="text-[#C4883A]">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function JurisdictionMap() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleMouseEnter = useCallback(
    (geo: GeographyFeature, evt?: React.MouseEvent<SVGPathElement>) => {
      const rawName = geo.properties.name || geo.properties.NAME || "";
      const data = usLookupByName.get(rawName);
      if (data && evt) {
        const rect = (evt.currentTarget as SVGPathElement)
          .closest("svg")
          ?.getBoundingClientRect();

        setTooltip({
          x: evt.clientX - (rect?.left || 0),
          y: evt.clientY - (rect?.top || 0) - 12,
          name: data.name,
          note: data.note,
          tooltipLines: data.tooltipLines,
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
              {({ geographies }: GeographiesRenderArgs) =>
                geographies.map((geo) => {
                  const rawName = geo.properties.name || geo.properties.NAME || "";
                  const data = usLookupByName.get(rawName);
                  const level: ActivityLevel = data?.level || "standard";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(evt: React.MouseEvent<SVGPathElement>) => handleMouseEnter(geo, evt)}
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

          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute z-50 w-72 p-4 rounded-lg shadow-xl bg-[#0f1f1b] border border-[#C4883A]/30 text-[#FAF7F2] text-xs leading-relaxed pointer-events-none"
                style={{ left: tooltip.x - 144, top: tooltip.y - 90 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: FILL[tooltip.level] }}
                  />
                  <p className="font-display font-bold text-sm">{tooltip.name}</p>
                </div>

                <p className="text-[#D4C9A8]/90 mb-2">{tooltip.note}</p>

                {Array.isArray(tooltip.tooltipLines) && tooltip.tooltipLines.length > 0 && (
                  <ul className="space-y-1 text-[#D4C9A8]/80">
                    {tooltip.tooltipLines.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-[#C4883A]">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BadgeRow items={US_TERRITORIES} label="U.S. Territories" />
      <BadgeRow items={CA_JURISDICTIONS} label="🇨🇦 Canada — Provinces & Territories" />
    </div>
  );
}

export default memo(JurisdictionMap);
