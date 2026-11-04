import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency } from '../../utils/formatters';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  CreditCard,
  QrCode,
  Banknote,
  Award,
  Grid3X3,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export default function ReportsPage() {
  const { stats, orders, tables, menuItems, customers, settings } = useCafe();
  const [timeRange, setTimeRange] = useState('All');

  // Breakdown of payment methods
  const paymentBreakdown = React.useMemo(() => {
    const summary = { UPI: 0, Card: 0, Cash: 0 };
    orders.forEach(o => {
      if (o.status === 'Completed' && o.paymentMethod) {
        summary[o.paymentMethod] = (summary[o.paymentMethod] || 0) + (o.total || 0);
      }
    });
    return summary;
  }, [orders]);

  const totalCompletedSales = (paymentBreakdown.UPI || 0) + (paymentBreakdown.Card || 0) + (paymentBreakdown.Cash || 0) || 1;

  // Most active tables
  const tableActivity = React.useMemo(() => {
    const counts = {};
    orders.forEach(o => {
      const name = o.tableName || 'Table';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  // Hourly order density (mock-to-actual distribution)
  const hourlyData = [
    { hour: '09 AM', orders: 4, revenue: 1200 },
    { hour: '11 AM', orders: 9, revenue: 2900 },
    { hour: '01 PM', orders: 15, revenue: 5400 },
    { hour: '03 PM', orders: 8, revenue: 2400 },
    { hour: '05 PM', orders: 14, revenue: 4800 },
    { hour: '07 PM', orders: 18, revenue: 6200 },
    { hour: '09 PM', orders: 11, revenue: 3600 }
  ];
  const maxHourlyRevenue = Math.max(...hourlyData.map(h => h.revenue));

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241A14] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#5C3A21]" />
            Reports & Business Intelligence
          </h2>
          <p className="text-xs text-[#8A7A6E]">
            Financial analytics, payment channel breakdown, and table yield analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['Today', 'This Week', 'This Month', 'All'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                timeRange === range
                  ? 'bg-[#5C3A21] text-white border-[#5C3A21]'
                  : 'bg-white text-[#665A4F] border-[#E8E0D5] hover:bg-[#FAF7F2]'
              }`}
            >
              {range}
            </button>
          ))}
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-white border border-[#E8E0D5] text-[#5C3A21] hover:bg-[#FAF7F2]"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] shadow-sm">
          <span className="text-[11px] font-bold text-[#8A7A6E] uppercase">Total Realized Revenue</span>
          <h3 className="text-2xl font-extrabold text-[#241A14] mt-1">{formatCurrency(stats.totalRevenue)}</h3>
          <p className="text-xs text-emerald-600 mt-0.5">Paid Orders Only</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] shadow-sm">
          <span className="text-[11px] font-bold text-[#8A7A6E] uppercase">Average Ticket Value</span>
          <h3 className="text-2xl font-extrabold text-[#241A14] mt-1">{formatCurrency(stats.avgOrderValue)}</h3>
          <p className="text-xs text-blue-600 mt-0.5">Per Completed Dining Session</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] shadow-sm">
          <span className="text-[11px] font-bold text-[#8A7A6E] uppercase">Repeat Guest Factor</span>
          <h3 className="text-2xl font-extrabold text-[#241A14] mt-1">
            {Math.round((customers.filter(c => c.totalVisits > 1).length / Math.max(1, customers.length)) * 100)}%
          </h3>
          <p className="text-xs text-[#E58A3A] mt-0.5">High Loyalty Retention</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] shadow-sm">
          <span className="text-[11px] font-bold text-[#8A7A6E] uppercase">Table Turn Rate</span>
          <h3 className="text-2xl font-extrabold text-[#241A14] mt-1">
            {(orders.length / (settings.tableCount || 12)).toFixed(1)}x
          </h3>
          <p className="text-xs text-purple-600 mt-0.5">Turns per Table/Day</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Rush Volume Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[#241A14]">Peak Cafe Rush Hours</h3>
              <p className="text-xs text-[#8A7A6E]">Revenue and volume distribution across operating hours</p>
            </div>
            <span className="text-xs font-semibold text-[#5C3A21] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E8E0D5]">
              Peak: 07:00 PM
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-[#E8E0D5]">
            {hourlyData.map((h, i) => {
              const heightPercent = Math.round((h.revenue / maxHourlyRevenue) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#8A7A6E] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    ₹{h.revenue}
                  </span>
                  <div className="w-full max-w-[38px] bg-[#FAF7F2] rounded-t-xl h-full flex items-end p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-[#5C3A21] to-[#E58A3A] rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#665A4F] mt-2 whitespace-nowrap">
                    {h.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#241A14] mb-1">Payment Channel Split</h3>
            <p className="text-xs text-[#8A7A6E] mb-5">Transactions across UPI, Card, and Cash</p>

            <div className="space-y-4">
              {/* UPI */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-[#5C3A21]">
                    <QrCode className="w-4 h-4 text-[#E58A3A]" /> UPI / Dynamic QR
                  </span>
                  <span>{formatCurrency(paymentBreakdown.UPI)} ({Math.round(((paymentBreakdown.UPI || 0) / totalCompletedSales) * 100)}%)</span>
                </div>
                <div className="w-full bg-[#FAF7F2] h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.round(((paymentBreakdown.UPI || 0) / totalCompletedSales) * 100)}%` }}
                    className="bg-[#E58A3A] h-full rounded-full"
                  />
                </div>
              </div>

              {/* Card */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-[#5C3A21]">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Credit / Debit Card
                  </span>
                  <span>{formatCurrency(paymentBreakdown.Card)} ({Math.round(((paymentBreakdown.Card || 0) / totalCompletedSales) * 100)}%)</span>
                </div>
                <div className="w-full bg-[#FAF7F2] h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.round(((paymentBreakdown.Card || 0) / totalCompletedSales) * 100)}%` }}
                    className="bg-blue-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Cash */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1.5 text-[#5C3A21]">
                    <Banknote className="w-4 h-4 text-emerald-600" /> Cash At Counter
                  </span>
                  <span>{formatCurrency(paymentBreakdown.Cash)} ({Math.round(((paymentBreakdown.Cash || 0) / totalCompletedSales) * 100)}%)</span>
                </div>
                <div className="w-full bg-[#FAF7F2] h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.round(((paymentBreakdown.Cash || 0) / totalCompletedSales) * 100)}%` }}
                    className="bg-emerald-600 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8E0D5] text-xs text-[#8A7A6E]">
            UPI accounts for majority of digital settlements.
          </div>
        </div>
      </div>

      {/* Most Active Tables Yield */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E0D5] shadow-sm">
        <h3 className="font-bold text-base text-[#241A14] mb-1">Most Active Tables</h3>
        <p className="text-xs text-[#8A7A6E] mb-4">Table utilization ranking by number of tickets</p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {tableActivity.map((t, idx) => (
            <div
              key={t.name}
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D5] text-center"
            >
              <span className="w-6 h-6 rounded-full bg-[#5C3A21] text-white text-[10px] font-bold flex items-center justify-center mx-auto mb-2">
                #{idx + 1}
              </span>
              <h4 className="font-extrabold text-sm text-[#241A14]">{t.name}</h4>
              <p className="text-xs font-semibold text-[#E58A3A] mt-1">{t.count} Orders</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
