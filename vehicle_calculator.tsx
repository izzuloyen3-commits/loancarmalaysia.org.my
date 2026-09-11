import React, { useState, useMemo } from 'react';

const TRANSLATIONS = {
  ms: {
    title: "Kalkulator Pinjaman",
    vehiclePrice: "Harga Kereta",
    downpayment: "Deposit",
    loanTenure: "Tempoh Pinjaman",
    interestRate: "Kadar Faedah",
    monthlyInstallment: "Ansuran Bulanan",
    totalPrincipal: "Jumlah Pokok",
    totalInterest: "Jumlah Faedah",
    totalPayable: "Jumlah Keseluruhan",
    minSalary: "Gaji Bersih Layak (30%)",
    comfortSalary: "Gaji Selesa (10%)",
    amount: "RM",
    percentage: "%",
    years: "Tahun",
    salaryRec: "Cadangan Gaji",
    breakdown: "Ringkasan Pinjaman"
  },
  en: {
    title: "Vehicle Loan",
    vehiclePrice: "Vehicle Price",
    downpayment: "Downpayment",
    loanTenure: "Loan Tenure",
    interestRate: "Interest Rate",
    monthlyInstallment: "Monthly Installment",
    totalPrincipal: "Total Principal",
    totalInterest: "Total Interest",
    totalPayable: "Total Payable",
    minSalary: "Minimum Net Salary (30%)",
    comfortSalary: "Comfortable Net Salary (10%)",
    amount: "RM",
    percentage: "%",
    years: "Years",
    salaryRec: "Salary Recommendation",
    breakdown: "Loan Breakdown"
  },
  zh: {
    title: "汽车贷款计算器",
    vehiclePrice: "汽车价格",
    downpayment: "首期付款",
    loanTenure: "贷款期限",
    interestRate: "年利率",
    monthlyInstallment: "每月供款",
    totalPrincipal: "贷款本金",
    totalInterest: "总利息",
    totalPayable: "总还款额",
    minSalary: "最低净薪要求 (30%)",
    comfortSalary: "舒适净薪要求 (10%)",
    amount: "RM",
    percentage: "%",
    years: "年",
    salaryRec: "薪资建议",
    breakdown: "贷款明细"
  }
};

export default function App() {
  const [lang, setLang] = useState('ms');
  const t = TRANSLATIONS[lang];

  // Input states (Using strings to prevent cursor jumping on decimal points)
  const [vehiclePrice, setVehiclePrice] = useState("80000");
  const [dpMode, setDpMode] = useState("percentage"); // 'percentage' | 'amount'
  const [dpValue, setDpValue] = useState("10");
  const [loanTenure, setLoanTenure] = useState("9");
  const [interestRate, setInterestRate] = useState("3.0");

  const calculations = useMemo(() => {
    const price = parseFloat(vehiclePrice) || 0;
    const dpRaw = parseFloat(dpValue) || 0;
    const tenure = parseFloat(loanTenure) || 0;
    const rate = parseFloat(interestRate) || 0;

    // Downpayment Calc
    let downpaymentAmount = 0;
    if (dpMode === 'percentage') {
      downpaymentAmount = price * (dpRaw / 100);
    } else {
      downpaymentAmount = dpRaw;
    }

    // Ensure downpayment isn't more than vehicle price
    if (downpaymentAmount > price) downpaymentAmount = price;

    const principal = price - downpaymentAmount;
    
    // Flat Rate Interest Calc
    const totalInterest = principal * (rate / 100) * tenure;
    const totalPayable = principal + totalInterest;
    
    const months = tenure * 12;
    const monthlyInstallment = months > 0 ? (totalPayable / months) : 0;

    // Salary Eligibility Rules (Strictly rounded up to nearest 100)
    const rawMinSalary = monthlyInstallment > 0 ? (monthlyInstallment / 0.30) : 0;
    const rawComfortSalary = monthlyInstallment > 0 ? (monthlyInstallment / 0.10) : 0;

    // Rounding UP to the nearest hundred (e.g., 3456.78 -> 3500.00)
    const minSalary = rawMinSalary > 0 ? Math.ceil(rawMinSalary / 100) * 100 : 0;
    const comfortSalary = rawComfortSalary > 0 ? Math.ceil(rawComfortSalary / 100) * 100 : 0;

    return {
      downpaymentAmount,
      principal,
      totalInterest,
      totalPayable,
      monthlyInstallment,
      minSalary,
      comfortSalary
    };
  }, [vehiclePrice, dpMode, dpValue, loanTenure, interestRate]);

  // Utility to format RM correctly
  const formatRM = (value) => {
    return 'RM ' + value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans selection:bg-emerald-200 py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 overflow-hidden flex flex-col border border-emerald-50">
        
        {/* Header & Lang Selector */}
        <div className="pt-6 px-6 pb-4 flex justify-between items-center bg-white sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t.title}</h1>
          <div className="flex bg-slate-100 p-1 rounded-full space-x-1">
            {['ms', 'en', 'zh'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ease-in-out ${
                  lang === l 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Vehicle Price */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">{t.vehiclePrice}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 font-semibold">RM</span>
              </div>
              <input
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none font-semibold text-slate-800 text-lg"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Downpayment */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-600">{t.downpayment}</label>
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setDpMode('percentage')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${dpMode === 'percentage' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                >
                  {t.percentage}
                </button>
                <button
                  onClick={() => setDpMode('amount')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${dpMode === 'amount' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                >
                  {t.amount}
                </button>
              </div>
            </div>
            <div className="relative">
              {dpMode === 'amount' && (
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-semibold">RM</span>
                </div>
              )}
              <input
                type="number"
                value={dpValue}
                onChange={(e) => setDpValue(e.target.value)}
                className={`w-full pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none font-semibold text-slate-800 text-lg ${dpMode === 'amount' ? 'pl-12' : 'pl-4'}`}
                placeholder="0"
              />
              {dpMode === 'percentage' && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-semibold">%</span>
                </div>
              )}
            </div>
            {/* Contextual helper for DP */}
            {dpMode === 'percentage' && calculations.downpaymentAmount > 0 && (
              <p className="text-xs text-emerald-600 font-medium px-1">
                = {formatRM(calculations.downpaymentAmount)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Loan Tenure */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-600">{t.loanTenure}</label>
              <div className="relative">
                <select
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none font-semibold text-slate-800 appearance-none text-lg"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((year) => (
                    <option key={year} value={year}>{year} {t.years}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-600">{t.interestRate}</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full pl-4 pr-8 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none font-semibold text-slate-800 text-lg"
                  placeholder="0.0"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-semibold">%</span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            
            {/* Primary Metric Card (Emerald) */}
            <div className="bg-gradient-to-br from-[#0F766E] to-[#10B981] rounded-3xl p-6 shadow-lg shadow-emerald-900/20 text-white relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
               
               <p className="text-emerald-100 text-sm font-medium mb-1 relative z-10">{t.monthlyInstallment}</p>
               <h2 className="text-4xl font-bold tracking-tight relative z-10">
                 {formatRM(calculations.monthlyInstallment)}
               </h2>
               <p className="text-emerald-50 text-xs mt-1 opacity-80 relative z-10">{loanTenure} {t.years} • {interestRate}% p.a.</p>
            </div>

            {/* Breakdown Summary */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.breakdown}</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{t.totalPrincipal}</span>
                <span className="font-semibold text-slate-800">{formatRM(calculations.principal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{t.totalInterest}</span>
                <span className="font-semibold text-slate-800">{formatRM(calculations.totalInterest)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-50 flex justify-between items-center text-sm">
                <span className="text-slate-700 font-medium">{t.totalPayable}</span>
                <span className="font-bold text-emerald-700">{formatRM(calculations.totalPayable)}</span>
              </div>
            </div>

            {/* Salary Recommendation Section (Strict 100s Rounding) */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 shadow-sm space-y-3">
               <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{t.salaryRec}</h3>
               
               <div className="flex flex-col space-y-1">
                 <div className="flex justify-between items-end">
                   <span className="text-sm text-slate-600">{t.minSalary}</span>
                   <span className="text-lg font-bold text-slate-800">{formatRM(calculations.minSalary)}</span>
                 </div>
                 <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[30%] rounded-full"></div>
                 </div>
               </div>

               <div className="flex flex-col space-y-1 pt-2">
                 <div className="flex justify-between items-end">
                   <span className="text-sm text-slate-600">{t.comfortSalary}</span>
                   <span className="text-lg font-bold text-emerald-700">{formatRM(calculations.comfortSalary)}</span>
                 </div>
                 <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[10%] rounded-full"></div>
                 </div>
               </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}