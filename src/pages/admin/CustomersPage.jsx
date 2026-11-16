import React, { useState } from 'react';
import { useCafe } from '../../context/CafeContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  Users,
  Search,
  Award,
  Sparkles,
  Phone,
  Calendar,
  Gift,
  Clock,
  Eye,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Tag
} from 'lucide-react';

export default function CustomersPage() {
  const { customers, orders, updateCustomer, addToast } = useCafe();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  // Calculate customer order history
  const getCustomerOrders = (customer) => {
    const clean = customer.phone.replace(/\D/g, '').slice(-10);
    return orders.filter(o => {
      const ordClean = (o.customerPhone || '').replace(/\D/g, '').slice(-10);
      return ordClean === clean || (customer.completedOrderIds && customer.completedOrderIds.includes(o.id));
    });
  };

  // Birthday offer sender
  const handleSendBirthdayOffer = (cust) => {
    const updatedCoupons = [
      ...(cust.availableCoupons || []),
      { code: 'BDAYSPECIAL', title: '🎂 Birthday Treat: ₹100 OFF', discount: 100, minBill: 200, isLocked: false }
    ];
    updateCustomer(cust.id, { availableCoupons: updatedCoupons });
    addToast(`Birthday offer (₹100 OFF) sent to ${cust.name}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header & CRM Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241A14] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#5C3A21]" />
            Customer Relationship Management (CRM)
          </h2>
          <p className="text-xs text-[#8A7A6E]">
            Track guest frequency, milestone rewards, lifetime value, and targeted offers.
          </p>
        </div>

        {/* Search by Mobile or Name */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7A6E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mobile number or name..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-[#E8E0D5] text-[#241A14] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5C3A21]"
          />
        </div>
      </div>

      {/* CRM Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] shadow-sm">
          <span className="text-xs font-semibold text-[#8A7A6E] uppercase">Total Enrolled Guests</span>
          <h3 className="text-2xl font-extrabold text-[#241A14] mt-1">{customers.length}</h3>
          <p className="text-xs text-emerald-600 mt-0.5">100% Verified Phone Profiles</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] shadow-sm">
          <span className="text-xs font-semibold text-[#8A7A6E] uppercase">Repeat Customer Rate</span>
          <h3 className="text-2xl font-extrabold text-[#241A14] mt-1">
            {Math.round((customers.filter(c => c.totalVisits > 1).length / Math.max(1, customers.length)) * 100)}%
          </h3>
          <p className="text-xs text-[#5C3A21] mt-0.5">
            {customers.filter(c => c.totalVisits >= 3).length} Gold/VIP Members
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E0D5] shadow-sm">
          <span className="text-xs font-semibold text-[#8A7A6E] uppercase">Total Loyalty Points Outstanding</span>
          <h3 className="text-2xl font-extrabold text-[#241A14] mt-1">
            {customers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0)} pts
          </h3>
          <p className="text-xs text-[#E58A3A] mt-0.5">₹10 spent = 1 Loyalty Point</p>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-[#E8E0D5] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E8E0D5]">
          <h3 className="font-bold text-base text-[#241A14]">Guest Directory & Visit Counts</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E0D5] text-[#8A7A6E] font-semibold bg-[#FAF7F2]">
                <th className="py-3.5 pl-5">Customer Profile</th>
                <th className="py-3.5">Mobile Number</th>
                <th className="py-3.5">Total Visits</th>
                <th className="py-3.5">Total Spending</th>
                <th className="py-3.5">Loyalty Points</th>
                <th className="py-3.5">Next Milestone</th>
                <th className="py-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5]/70">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#8A7A6E]">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#5C3A21]" />
                    <p className="font-bold text-sm text-[#241A14]">No customer profiles yet</p>
                    <p className="text-xs text-[#8A7A6E] mt-0.5">Customers will be automatically enrolled when orders are completed with their phone numbers.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => {
                  const visits = cust.totalVisits || 1;
                  const nextMilestone = visits < 3 ? '3rd Visit Perk' : visits < 5 ? '5th Visit: ₹50 OFF' : visits < 10 ? '10th Visit: Free Item' : 'VIP Tier Elite';

                  return (
                    <tr key={cust.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3.5 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#5C3A21]/10 text-[#5C3A21] font-bold text-xs flex items-center justify-center">
                            {cust.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#241A14]">{cust.name}</p>
                            <p className="text-[10px] text-[#8A7A6E]">Since {cust.memberSince}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-[#5C3A21]">
                        +91 {cust.phone}
                      </td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                          <Award className="w-3 h-3 text-[#E58A3A]" />
                          {visits} Visits
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-[#241A14]">
                        {formatCurrency(cust.totalSpent)}
                      </td>
                      <td className="py-3.5 font-bold text-[#5C3A21]">
                        {cust.loyaltyPoints} pts
                      </td>
                      <td className="py-3.5 text-[#E58A3A] font-semibold">
                        {nextMilestone}
                      </td>
                      <td className="py-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSendBirthdayOffer(cust)}
                            className="p-1.5 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                            title="Grant Birthday Offer (₹100 OFF)"
                          >
                            <Gift className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="p-1.5 text-[#5C3A21] hover:bg-[#E8E0D5] rounded-lg transition-colors"
                            title="View Profile & Orders"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-[#241A14]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E0D5] relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F8F5F0] text-[#665A4F] hover:text-[#241A14] flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-3.5 border-b border-[#E8E0D5] pb-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5C3A21] text-white font-extrabold text-lg flex items-center justify-center">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#241A14]">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-[#8A7A6E]">
                  +91 {selectedCustomer.phone} • Enrolled {selectedCustomer.memberSince}
                </p>
              </div>
            </div>

            {/* Loyalty Milestone Progress */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E0D5] mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#5C3A21] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#E58A3A]" />
                  Visit Milestone Progress
                </span>
                <span className="font-extrabold text-[#241A14]">
                  {selectedCustomer.totalVisits} / 5 visits
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#EAE3D9] h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (selectedCustomer.totalVisits / 5) * 100)}%` }}
                  className="bg-gradient-to-r from-[#5C3A21] to-[#E58A3A] h-full rounded-full transition-all duration-500"
                />
              </div>

              <p className="text-[11px] text-[#665A4F]">
                {selectedCustomer.totalVisits >= 5
                  ? '🎉 5th Visit Completed! ₹50 OFF Coupon unlocked.'
                  : `Just ${5 - selectedCustomer.totalVisits} more visit(s) to unlock ₹50 OFF reward!`}
              </p>
            </div>

            {/* Available Rewards */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A7A6E] block">
                Active Rewards & Coupons
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCustomer.availableCoupons?.length > 0 ? (
                  selectedCustomer.availableCoupons.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs flex items-center gap-2"
                    >
                      <Tag className="w-3.5 h-3.5 text-[#E58A3A]" />
                      <div>
                        <p className="font-bold">{c.code}</p>
                        <p className="text-[10px] text-amber-700">{c.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8A7A6E]">No active coupons right now.</p>
                )}
              </div>
            </div>

            {/* Past Completed Orders */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A7A6E] block mb-2">
                Visit & Order History
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {getCustomerOrders(selectedCustomer).map(ord => (
                  <div
                    key={ord.id}
                    className="p-2 rounded-xl border border-[#E8E0D5] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold font-mono text-[#5C3A21]">#{ord.id}</span>
                      <span className="text-[#8A7A6E] ml-2">{ord.tableName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#8A7A6E] text-[10px]">{formatDateTime(ord.completedAt || ord.createdAt)}</span>
                      <span className="font-extrabold">{formatCurrency(ord.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8E0D5] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl bg-[#5C3A21] text-white text-xs font-bold hover:bg-[#4B2E19]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
