'use client';

import { useState } from 'react';

interface MonthData {
  month: string;
  label: string;
  amount: number;
}

interface RevenueChartProps {
  data: MonthData[];
}

const PERIODS = [
  { label: '3 mois', value: 3 },
  { label: '6 mois', value: 6 },
  { label: '12 mois', value: 12 },
];

function formatCFA(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString('fr-FR');
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [period, setPeriod] = useState(6);

  const sliced = data.slice(-period);
  const maxVal = Math.max(...sliced.map((d) => d.amount), 1);
  const total = sliced.reduce((s, d) => s + d.amount, 0);

  // Find best month
  const bestIdx = sliced.reduce((best, d, i) => (d.amount > sliced[best].amount ? i : best), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-[#1A202C]">Revenus mensuels</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Total sur la période : <span className="font-semibold text-[#00A36C]">{total.toLocaleString('fr-FR')} F CFA</span>
          </p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                period === value
                  ? 'bg-[#00A36C] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#1A202C]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
            <div key={ratio} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-300 w-10 text-right shrink-0">
                {ratio > 0 ? formatCFA(maxVal * ratio) : '0'}
              </span>
              <div className="flex-1 border-t border-gray-100" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="ml-12 flex items-end gap-2 h-52 pb-8">
          {sliced.map((d, i) => {
            const heightPct = maxVal > 0 ? (d.amount / maxVal) * 100 : 0;
            const isBest = i === bestIdx && d.amount > 0;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-[#1A202C] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                    {d.amount.toLocaleString('fr-FR')} F CFA
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A202C]" />
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full flex items-end" style={{ height: '160px' }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isBest
                        ? 'bg-[#00A36C] shadow-sm shadow-[#00A36C]/30'
                        : d.amount > 0
                        ? 'bg-[#00A36C]/40 group-hover:bg-[#00A36C]/70'
                        : 'bg-gray-100'
                    }`}
                    style={{ height: `${Math.max(heightPct, d.amount > 0 ? 3 : 1)}%` }}
                  />
                </div>

                {/* Label */}
                <span className={`text-[10px] font-medium ${isBest ? 'text-[#00A36C]' : 'text-gray-400'}`}>
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {sliced.some((d) => d.amount > 0) && (
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#00A36C] inline-block" />
            Meilleur mois
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#00A36C]/40 inline-block" />
            Autres mois
          </div>
        </div>
      )}

      {/* Empty state */}
      {!sliced.some((d) => d.amount > 0) && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">Aucun revenu enregistré sur cette période.</p>
        </div>
      )}
    </div>
  );
}
