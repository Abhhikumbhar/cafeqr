import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  Banknote,
  IndianRupee,
  Plus,
  Trash2,
  Printer,
  X,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Receipt,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function CashRegisterModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const {
    stats,
    register,
    expenses,
    addExpense,
    deleteExpense,
    updateOpeningCash,
    settings
  } = useCafe();

  const [openingInput, setOpeningInput] = useState(register?.openingCash || 1000);
  const [isEditingOpening, setIsEditingOpening] = useState(false);

  // New Expense Form State
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Dairy & Milk');

  // Actual Physical Cash Counted
  const [countedCash, setCountedCash] = useState('');

  const todayStr = new Date().toDateString();
  const todaysExpenses = expenses.filter(
    e => new Date(e.createdAt).toDateString() === todayStr
  );

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;
    addExpense(expTitle, expAmount, expCategory);
    setExpTitle('');
    setExpAmount('');
  };

  const handleSaveOpening = () => {
    updateOpeningCash(openingInput);
    setIsEditingOpening(false);
  };

  // Variance calculation
  const physicalCount = countedCash !== '' ? Number(countedCash) : null;
  const variance = physicalCount !== null ? physicalCount - stats.expectedCashInDrawer : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-[#E8E0D5]">
        {/* Header (No print) */}
        <div className="no-print p-4 sm:p-5 bg-gradient-to-r from-[#241A14] to-[#5C3A21] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E58A3A] flex items-center justify-center text-white shadow-md">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                <span>Daily Shift & Cash Register (Z-Report)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase font-mono">
                  Live
                </span>
              </h3>
              <p className="text-[11px] text-[#C8BAAA]">
                Track opening cash float, cash/UPI sales, daily petty expenses & reconciliation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF7F2]">
          {/* Printable Z-Report Sheet */}
          <div className="printable-area space-y-4">
            {/* Header info on print */}
            <div className="hidden print:block text-center border-b border-black pb-3 mb-3 font-mono">
              <h2 className="text-xl font-black">{settings.cafeName || 'The 7 Cafe'}</h2>
              <p className="text-xs uppercase font-bold">*** DAY-END CASH Z-REPORT ***</p>
              <p className="text-[10px]">{formatDateTime(new Date().toISOString())}</p>
            </div>

            {/* 1. Cash Inflow / Outflow KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Opening Cash Float */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E0D5] shadow-xs">
                <span className="text-[10px] font-bold text-[#8A7A6E] uppercase block">
                  Opening Float (Starting Cash)
                </span>
                {isEditingOpening ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      value={openingInput}
                      onChange={(e) => setOpeningInput(e.target.value)}
                      className="w-20 text-xs font-bold p-1 border rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={handleSaveOpening}
                      className="text-[10px] px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-black text-[#241A14]">
                      {formatCurrency(stats.openingCash)}
                    </span>
                    <button
                      onClick={() => setIsEditingOpening(true)}
                      className="no-print text-[10px] text-blue-600 font-bold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Cash Sales Today */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E0D5] shadow-xs">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                  Cash Sales (Physical Cash)
                </span>
                <span className="text-base font-black text-emerald-600 mt-1 block">
                  +{formatCurrency(stats.todaysCashSales)}
                </span>
              </div>

              {/* UPI Sales Today */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E0D5] shadow-xs">
                <span className="text-[10px] font-bold text-blue-700 uppercase block">
                  UPI Sales (PhonePe / GPay)
                </span>
                <span className="text-base font-black text-blue-600 mt-1 block">
                  {formatCurrency(stats.todaysUpiSales)}
                </span>
              </div>

              {/* Petty Expenses Today */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E0D5] shadow-xs">
                <span className="text-[10px] font-bold text-rose-700 uppercase block">
                  Daily Petty Expenses
                </span>
                <span className="text-base font-black text-rose-600 mt-1 block">
                  -{formatCurrency(stats.todaysExpensesTotal)}
                </span>
              </div>
            </div>

            {/* 2. Expected Cash Drawer Calculation Formula */}
            <div className="bg-white p-4 rounded-3xl border border-[#E8E0D5] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E8E0D5]/60 pb-2">
                <h4 className="font-extrabold text-xs text-[#241A14] flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-[#5C3A21]" />
                  <span>Calculated Drawer Cash (System Expected)</span>
                </h4>
                <span className="text-xs font-mono font-black text-[#5C3A21] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {formatCurrency(stats.expectedCashInDrawer)}
                </span>
              </div>

              <div className="text-xs text-[#665A4F] grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#E8E0D5]/50">
                  <span className="text-[10px] block text-[#8A7A6E]">1. Starting Float</span>
                  <span className="font-bold text-[#241A14]">+{formatCurrency(stats.openingCash)}</span>
                </div>
                <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#E8E0D5]/50">
                  <span className="text-[10px] block text-[#8A7A6E]">2. Plus Cash Inflow</span>
                  <span className="font-bold text-emerald-600">+{formatCurrency(stats.todaysCashSales)}</span>
                </div>
                <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#E8E0D5]/50">
                  <span className="text-[10px] block text-[#8A7A6E]">3. Minus Cash Spent</span>
                  <span className="font-bold text-rose-600">-{formatCurrency(stats.todaysExpensesTotal)}</span>
                </div>
              </div>
            </div>

            {/* 3. Physical Cash Count & Reconciliation (Tally) */}
            <div className="no-print bg-gradient-to-r from-[#FFFDF9] to-[#FAF4EB] p-4 rounded-3xl border-2 border-[#EADCCB] shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-black text-xs text-[#241A14]">
                    Physical Cash Count & Day-End Reconciliation
                  </h4>
                  <p className="text-[10px] text-[#8A7A6E]">
                    Count your physical cash notes at day close and enter here to check variance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#5C3A21]">₹</span>
                  <input
                    type="number"
                    placeholder="Enter physical cash"
                    value={countedCash}
                    onChange={(e) => setCountedCash(e.target.value)}
                    className="w-36 text-xs font-bold py-2 px-3 rounded-xl bg-white border border-[#E8E0D5] text-[#241A14] shadow-xs focus:ring-2 focus:ring-[#5C3A21]"
                  />
                </div>
              </div>

              {physicalCount !== null && (
                <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                  variance === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : variance > 0
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {variance === 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>
                      {variance === 0
                        ? 'Perfect Match! Cash drawer is 100% reconciled.'
                        : variance > 0
                        ? `Excess Cash: ${formatCurrency(variance)} more than calculated.`
                        : `Shortage Cash: ${formatCurrency(Math.abs(variance))} missing from drawer!`}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-black">
                    {variance >= 0 ? `+${formatCurrency(variance)}` : `-${formatCurrency(Math.abs(variance))}`}
                  </span>
                </div>
              )}
            </div>

            {/* 4. Daily Petty Expenses Section */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E0D5] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E8E0D5]/60 pb-2">
                <h4 className="font-black text-xs text-[#241A14] flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  <span>Daily Cash Expenses Log ({todaysExpenses.length})</span>
                </h4>
                <span className="text-xs font-bold text-rose-600">
                  Total: {formatCurrency(stats.todaysExpensesTotal)}
                </span>
              </div>

              {/* Add Expense Input Form (No Print) */}
              <form onSubmit={handleAddExpenseSubmit} className="no-print grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Expense title (e.g. 5L Milk, Bread, Gas)"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="sm:col-span-5 text-xs py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
                  required
                />
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="sm:col-span-3 text-xs py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
                >
                  <option value="Dairy & Milk">Dairy & Milk</option>
                  <option value="Bakery & Buns">Bakery & Buns</option>
                  <option value="Vegetables & Tea">Vegetables & Tea</option>
                  <option value="Ice & Water">Ice & Water</option>
                  <option value="Gas & Fuel">Gas & Fuel</option>
                  <option value="Cleaning & Misc">Cleaning & Misc</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount (₹)"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="sm:col-span-2 text-xs py-2 px-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5] text-[#241A14]"
                  required
                />
                <button
                  type="submit"
                  className="sm:col-span-2 py-2 px-3 rounded-xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              {/* Expenses List */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pt-1">
                {todaysExpenses.length === 0 ? (
                  <p className="text-center py-4 text-xs text-[#8A7A6E]">
                    No expenses recorded today yet.
                  </p>
                ) : (
                  todaysExpenses.map(exp => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D5]/60 text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#241A14]">{exp.title}</span>
                        <span className="text-[10px] text-[#8A7A6E] ml-2 px-2 py-0.5 rounded-md bg-white border border-[#E8E0D5]">
                          {exp.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-rose-600 font-mono">
                          -{formatCurrency(exp.amount)}
                        </span>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="no-print text-gray-400 hover:text-rose-600 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (No Print) */}
        <div className="no-print p-4 bg-white border-t border-[#E8E0D5] flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#5C3A21] hover:bg-[#4B2E19] text-white font-extrabold text-xs shadow-md shadow-[#5C3A21]/20 flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Day-End Z-Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
