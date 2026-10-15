/* EKAANNTO Wallet Storage Adapter extension point.
 * Current mode is localStorage; replace implementation with authenticated server API later.
 * Do not trust client-side balances for production payouts.
 */
(function (global) {
  'use strict';
  const DB_KEY = 'ekannto_v1';
  const FINANCE_KEY = 'ekannto_finance_v37';
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch (_) { return fallback; } };
  const adapter = {
    mode: 'localStorage',
    async getSellerWallet(sellerId) {
      const db = read(DB_KEY, {}), finance = read(FINANCE_KEY, { adjustments: [], withdrawals: [], paidItems: {}, commissionPct: 10 });
      const seller = (db.sellers || []).find(s => String(s.id) === String(sellerId));
      if (!seller) return null;
      return { sellerId: String(seller.id), seller, finance, source: 'localStorage' };
    },
    async getAllSellerWallets() {
      const db = read(DB_KEY, {});
      return (db.sellers || []).map(s => ({ sellerId: String(s.id), seller, source: 'localStorage' }));
    },
    async createWithdrawal(withdrawal) {
      const finance = read(FINANCE_KEY, { adjustments: [], withdrawals: [], paidItems: {}, commissionPct: 10 });
      finance.withdrawals = Array.isArray(finance.withdrawals) ? finance.withdrawals : [];
      if (finance.withdrawals.some(w => String(w.id) === String(withdrawal.id))) throw new Error('Duplicate withdrawal ID');
      finance.withdrawals.push({ ...withdrawal, balanceDeducted: false });
      localStorage.setItem(FINANCE_KEY, JSON.stringify(finance));
      return withdrawal;
    },
    async applyAdjustment(adjustment) {
      const finance = read(FINANCE_KEY, { adjustments: [], withdrawals: [], paidItems: {}, commissionPct: 10 });
      finance.adjustments = Array.isArray(finance.adjustments) ? finance.adjustments : [];
      finance.adjustments.push(adjustment);
      localStorage.setItem(FINANCE_KEY, JSON.stringify(finance));
      return adjustment;
    }
  };
  global.EkanntoWalletStorage = adapter;
})(window);
