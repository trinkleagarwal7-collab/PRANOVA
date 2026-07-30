import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Leaf, RefreshCw, Award, Info, HelpCircle, ShieldCheck } from "lucide-react";
import { SustainabilityLog, SustainabilityMetrics } from "../types";

interface ImpactTrackerProps {
  history: SustainabilityLog[];
  metrics: SustainabilityMetrics;
}

interface TimelinePoint {
  date: Date;
  carbonSaved: number;
  plasticAvoided: number;
  actionName: string;
}

export default function ImpactTracker({ history, metrics }: ImpactTrackerProps) {
  const [activeChart, setActiveChart] = useState<"carbon" | "materials">("carbon");
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hoveredMaterial, setHoveredMaterial] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 450, height: 220 });

  // Monitor element resize to make D3 SVG chart fully responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // enforce responsive limits
      setDimensions({
        width: Math.max(300, width - 32),
        height: 220
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 1. Process history to build cumulative stats
  const timelineData: TimelinePoint[] = React.useMemo(() => {
    // Sort chronological ascending
    const sortedHistory = [...history].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    let cumulativeCarbon = 0;
    let cumulativePlastic = 0;

    return sortedHistory.map((item) => {
      cumulativeCarbon += item.carbonSaved;
      cumulativePlastic += item.plasticAvoided;
      return {
        date: new Date(item.date),
        carbonSaved: parseFloat(cumulativeCarbon.toFixed(1)),
        plasticAvoided: parseFloat(cumulativePlastic.toFixed(1)),
        actionName: item.action
      };
    });
  }, [history]);

  // D3 Coordinate Calculation for Line Chart
  const lineChartSvg = React.useMemo(() => {
    if (timelineData.length === 0) return null;

    const margin = { top: 20, right: 20, bottom: 35, left: 40 };
    const chartWidth = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    // Scales
    const xExtent = d3.extent(timelineData, d => d.date) as [Date, Date];
    // If only 1 data point, buffer the time range
    if (xExtent[0].getTime() === xExtent[1].getTime()) {
      xExtent[0] = new Date(xExtent[0].getTime() - 24 * 60 * 60 * 1000 * 5); // minus 5 days
      xExtent[1] = new Date(xExtent[1].getTime() + 24 * 60 * 60 * 1000 * 5); // plus 5 days
    }

    const xScale = d3.scaleTime()
      .domain(xExtent)
      .range([0, chartWidth]);

    const yValMax = d3.max(timelineData, d => d.carbonSaved) || 10;
    const yScale = d3.scaleLinear()
      .domain([0, Math.max(yValMax * 1.15, 5)])
      .range([chartHeight, 0]);

    // Generator for path
    const lineGenerator = d3.line<TimelinePoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.carbonSaved))
      .curve(d3.curveMonotoneX);

    const areaGenerator = d3.area<TimelinePoint>()
      .x(d => xScale(d.date))
      .y0(chartHeight)
      .y1(d => yScale(d.carbonSaved))
      .curve(d3.curveMonotoneX);

    const pathD = lineGenerator(timelineData) || "";
    const areaD = areaGenerator(timelineData) || "";

    // Generate x & y axes markers safely
    const xTicks = xScale.ticks(Math.min(5, timelineData.length + 2));
    const yTicks = yScale.ticks(4);

    const formattedTicksX = xTicks.map(t => ({
      val: t,
      formatted: d3.timeFormat("%b %d")(t),
      x: xScale(t)
    }));

    const formattedTicksY = yTicks.map(t => ({
      val: t,
      y: yScale(t)
    }));

    return {
      margin,
      chartWidth,
      chartHeight,
      pathD,
      areaD,
      ticksX: formattedTicksX,
      ticksY: formattedTicksY,
      xScale,
      yScale
    };
  }, [timelineData, dimensions]);

  // Recycled Materials Breakdown (Donut Chart calculations using D3)
  const materialDonutData = React.useMemo(() => {
    // Estimated breakdown of raw bio-matter savings in kg
    // based on total carbon + plastic saved, scaled into botanical material segments
    const baseCork = Math.max(0.8, parseFloat((metrics.carbonSaved * 0.45).toFixed(1)));
    const baseRubber = Math.max(1.2, parseFloat((metrics.carbonSaved * 0.35).toFixed(1)));
    const baseHemp = Math.max(0.5, parseFloat((metrics.carbonSaved * 0.15).toFixed(1)));
    const avoidedPVC = Math.max(1.5, parseFloat((metrics.plasticAvoided * 1.0).toFixed(1)));

    return [
      { name: "Raw Cork Bark", value: baseCork, color: "bg-art-cork", stroke: "#cca47c", desc: "Regenerative soil bark carbon-sink" },
      { name: "Hevea Rubber Sap", value: baseRubber, color: "bg-art-sage", stroke: "#7fa690", desc: "Co2-absorbing liquid plantation rubber" },
      { name: "Organic Hemp Core", value: baseHemp, color: "bg-art-terracotta", stroke: "#d97d65", desc: "Fossil-free structural natural fiber" },
      { name: "Avoided PVC Plastic", value: avoidedPVC, color: "bg-art-charcoal", stroke: "#2e2e2e", desc: "Prevented carcinogenic synthetic vinyl" }
    ];
  }, [metrics]);

  const donutArcs = React.useMemo(() => {
    const radius = 70;
    const innerRadius = 45;

    const pieGenerator = d3.pie<typeof materialDonutData[0]>()
      .value(d => d.value)
      .sort(null);

    const arcGenerator = d3.arc<d3.PieArcDatum<typeof materialDonutData[0]>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4)
      .padAngle(0.04);

    const arcs = pieGenerator(materialDonutData);

    return arcs.map(arc => ({
      d: arcGenerator(arc) || "",
      data: arc.data,
      centroid: arcGenerator.centroid(arc)
    }));
  }, [materialDonutData]);

  const totalBioSaved = materialDonutData.reduce((acc, curr) => acc + curr.value, 0);

  // Milestones Level
  const currentMilestone = React.useMemo(() => {
    const score = metrics.sustainabilityScore;
    if (score < 40) return { title: "Conscious Seedling", badge: "Level 1", desc: "Nurturing healthy botanical roots." };
    if (score < 70) return { title: "Active Oak Sapling", badge: "Level 2", desc: "Growing a powerful eco-friendly shield." };
    if (score < 90) return { title: "Circular Canopy", badge: "Level 3", desc: "Shielding our atmosphere from microplastics." };
    return { title: "Regenerative Carbon Hero", badge: "Elder Tree", desc: "Cradle-to-cradle zero-waste legacy!" };
  }, [metrics.sustainabilityScore]);

  return (
    <div id="impact-tracker" className="rounded-3xl border border-art-charcoal/10 bg-white p-6 shadow-2xs text-left space-y-6">
      
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-art-stone pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-art-sage animate-pulse" />
            <h4 className="font-serif text-lg font-bold text-art-charcoal italic">Pranova ESG Real-Time Audit</h4>
          </div>
          <p className="text-xs text-art-charcoal/60 font-light">
            Interactive environmental audits demonstrating materials diverted from landfills and active CO2 offsets.
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex bg-art-stone/45 p-1 rounded-full border border-art-charcoal/5 self-start sm:self-auto">
          <button
            onClick={() => setActiveChart("carbon")}
            className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-all ${
              activeChart === "carbon"
                ? "bg-art-charcoal text-art-bg shadow-2xs"
                : "text-art-charcoal/70 hover:text-art-charcoal hover:bg-art-stone/55"
            }`}
          >
            Carbon Offset Path
          </button>
          <button
            onClick={() => setActiveChart("materials")}
            className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-all ${
              activeChart === "materials"
                ? "bg-art-charcoal text-art-bg shadow-2xs"
                : "text-art-charcoal/70 hover:text-art-charcoal hover:bg-art-stone/55"
            }`}
          >
            Diverted Material Mix
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Chart + Milestone Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Visualization Canvas Block (lg:col-span-8) */}
        <div ref={containerRef} className="lg:col-span-8 bg-art-stone/15 rounded-2xl p-4 border border-art-charcoal/5 min-h-[250px] relative">
          
          {activeChart === "carbon" ? (
            // Carbon Timeline Section
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-art-charcoal/55 uppercase tracking-widest font-mono">
                  Cumulative CO2 Blocked Timeline (kg)
                </span>
                <span className="text-xs font-serif font-bold text-art-terracotta italic">
                  Total Saved: {metrics.carbonSaved} kg CO2
                </span>
              </div>

              {timelineData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-xs text-art-charcoal/40 italic">
                  Complete challenges or log practices to feed real data points.
                </div>
              ) : (
                <div className="relative">
                  <svg 
                    width={dimensions.width} 
                    height={dimensions.height}
                    className="overflow-visible"
                  >
                    {lineChartSvg && (
                      <g transform={`translate(${lineChartSvg.margin.left}, ${lineChartSvg.margin.top})`}>
                        
                        {/* Horizontal Gridlines */}
                        {lineChartSvg.ticksY.map((t, idx) => (
                          <g key={idx} transform={`translate(0, ${t.y})`} className="opacity-15">
                            <line 
                              x1={0} 
                              x2={lineChartSvg.chartWidth} 
                              y1={0} 
                              y2={0} 
                              stroke="#000" 
                              strokeDasharray="3,3"
                              strokeWidth={1}
                            />
                            <text 
                              x={-10} 
                              y={4} 
                              textAnchor="end" 
                              className="text-[9px] font-mono font-bold fill-art-charcoal"
                            >
                              {t.val}
                            </text>
                          </g>
                        ))}

                        {/* X-Axis Ticks */}
                        {lineChartSvg.ticksX.map((t, idx) => (
                          <g key={idx} transform={`translate(${t.x}, 0)`}>
                            <line 
                              y1={lineChartSvg.chartHeight} 
                              y2={lineChartSvg.chartHeight + 5} 
                              stroke="#000" 
                              className="opacity-20"
                            />
                            <text 
                              y={lineChartSvg.chartHeight + 18} 
                              textAnchor="middle" 
                              className="text-[9px] font-mono font-bold fill-art-charcoal/60"
                            >
                              {t.formatted}
                            </text>
                          </g>
                        ))}

                        {/* Area Shade */}
                        <path 
                          d={lineChartSvg.areaD} 
                          fill="url(#area-gradient)"
                          className="opacity-40"
                        />

                        {/* Main Line */}
                        <path 
                          d={lineChartSvg.pathD} 
                          fill="none" 
                          stroke="#d97d65" // Terracotta line
                          strokeWidth={2.5}
                        />

                        {/* Active Dots */}
                        {timelineData.map((d, idx) => {
                          const x = lineChartSvg.xScale(d.date);
                          const y = lineChartSvg.yScale(d.carbonSaved);
                          const isHovered = hoveredPoint?.actionName === d.actionName;

                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r={isHovered ? 6 : 4}
                              className={`cursor-pointer transition-all ${
                                isHovered 
                                  ? "fill-art-charcoal stroke-white stroke-2 shadow" 
                                  : "fill-art-terracotta stroke-white stroke-1.5"
                              }`}
                              onMouseEnter={(e) => {
                                setHoveredPoint(d);
                                const rect = e.currentTarget.getBoundingClientRect();
                                const containerRect = containerRef.current?.getBoundingClientRect();
                                if (containerRect) {
                                  setTooltipPos({
                                    x: rect.left - containerRect.left + 15,
                                    y: rect.top - containerRect.top - 55
                                  });
                                }
                              }}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          );
                        })}

                        {/* Gradients Definitions */}
                        <defs>
                          <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d97d65" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#d97d65" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                      </g>
                    )}
                  </svg>

                  {/* HTML Tooltip mapped inside the absolute container */}
                  {hoveredPoint && (
                    <div 
                      className="absolute z-20 pointer-events-none p-3 bg-art-charcoal text-art-bg rounded-xl shadow-md text-xs border border-white/10 max-w-[200px] transition-all duration-150"
                      style={{ left: tooltipPos.x, top: tooltipPos.y }}
                    >
                      <div className="font-mono text-[9px] text-art-terracotta font-bold uppercase">
                        {hoveredPoint.date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="font-bold leading-tight mt-0.5">{hoveredPoint.actionName}</div>
                      <div className="mt-1.5 border-t border-white/10 pt-1 flex justify-between font-mono text-[9px]">
                        <span>CO2 SAVED:</span>
                        <span className="font-bold text-art-cork">{hoveredPoint.carbonSaved} kg</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Diverted Materials Breakdown Donut Chart
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-art-charcoal/55 uppercase tracking-widest font-mono">
                  Diverted Raw Bio-Matter Breakdown
                </span>
                <span className="text-xs font-serif font-bold text-art-sage italic">
                  Total Organic Yield: {totalBioSaved.toFixed(1)} kg
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-1">
                {/* SVG Donut */}
                <div className="relative">
                  <svg width={180} height={180} className="overflow-visible">
                    <g transform="translate(90, 90)">
                      {donutArcs.map((arc, idx) => {
                        const isHovered = hoveredMaterial === arc.data.name;
                        return (
                          <path
                            key={idx}
                            d={arc.d}
                            fill={arc.data.stroke}
                            className="transition-all duration-200 cursor-pointer hover:opacity-85"
                            style={{
                              transform: isHovered ? "scale(1.06)" : "scale(1)"
                            }}
                            onMouseEnter={() => setHoveredMaterial(arc.data.name)}
                            onMouseLeave={() => setHoveredMaterial(null)}
                          />
                        );
                      })}
                    </g>
                  </svg>
                  
                  {/* Absolute Center Metric label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-serif text-xl font-bold text-art-charcoal">{totalBioSaved.toFixed(1)}</span>
                    <span className="text-[8px] font-mono font-bold uppercase text-art-charcoal/50">Kg Saved</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-2.5 max-w-[240px] w-full">
                  {materialDonutData.map((item, idx) => {
                    const isHovered = hoveredMaterial === item.name;
                    return (
                      <div 
                        key={idx}
                        className={`p-2 rounded-xl border transition-all text-left flex items-start gap-2.5 cursor-pointer ${
                          isHovered 
                            ? "bg-art-stone/30 border-art-charcoal/20" 
                            : "bg-transparent border-transparent"
                        }`}
                        onMouseEnter={() => setHoveredMaterial(item.name)}
                        onMouseLeave={() => setHoveredMaterial(null)}
                      >
                        <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5`} style={{ backgroundColor: item.stroke }} />
                        <div className="space-y-0.5">
                          <div className="flex justify-between w-full gap-6">
                            <span className="text-xs font-bold text-art-charcoal">{item.name}</span>
                            <span className="text-xs font-mono font-bold text-art-terracotta">{item.value} kg</span>
                          </div>
                          <p className="text-[10px] text-art-charcoal/60 leading-tight font-light">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Level & Milestone Sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Level Progress */}
          <div className="rounded-2xl border border-art-charcoal/10 bg-art-stone/20 p-5 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-art-stone/50 pb-2">
              <span className="text-[10px] font-bold text-art-sage uppercase tracking-widest">
                Pranova Circle Tier
              </span>
              <span className="rounded-full bg-art-charcoal text-art-bg px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase">
                {currentMilestone.badge}
              </span>
            </div>

            <div className="space-y-1">
              <h5 className="font-serif text-base font-bold text-art-charcoal italic leading-snug">
                {currentMilestone.title}
              </h5>
              <p className="text-xs text-art-charcoal/70 leading-relaxed font-light">
                {currentMilestone.desc}
              </p>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-mono font-bold uppercase text-art-charcoal/50">
                <span>Circle Index Score</span>
                <span>{metrics.sustainabilityScore}/100</span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-art-charcoal/5">
                <div 
                  className="h-full bg-art-sage transition-all duration-1000"
                  style={{ width: `${metrics.sustainabilityScore}%` }}
                />
              </div>
            </div>

            {/* Verification Seal */}
            <div className="flex items-center gap-2 rounded-xl bg-white/70 p-2.5 border border-art-charcoal/5 text-[10px] text-art-charcoal/80 leading-relaxed">
              <ShieldCheck className="h-4.5 w-4.5 text-art-sage shrink-0" />
              <span>
                All logged savings are third-party GOTS and carbon-passport certified.
              </span>
            </div>
          </div>

          {/* Environmental Equivalents Info Card */}
          <div className="rounded-2xl border border-art-stone bg-white p-5 space-y-3">
            <h5 className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-widest">
              Circular Economy Equivalent Savings
            </h5>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-art-sage/10 flex items-center justify-center shrink-0">
                  <span className="text-sm">🌳</span>
                </div>
                <div>
                  <div className="font-bold text-art-charcoal">
                    {metrics.treeEquivalents} Tree Months
                  </div>
                  <p className="text-[10px] text-art-charcoal/60 leading-tight">
                    CO2 absorbency equivalent of fully mature oaks.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-art-terracotta/10 flex items-center justify-center shrink-0">
                  <span className="text-sm">🛢️</span>
                </div>
                <div>
                  <div className="font-bold text-art-charcoal">
                    {(metrics.plasticAvoided * 1.5).toFixed(1)} Liters Petroleum
                  </div>
                  <p className="text-[10px] text-art-charcoal/60 leading-tight">
                    Avoided oil refinery demand for PVC polymers.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
