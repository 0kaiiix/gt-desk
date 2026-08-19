import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, Clock, Copy, ShieldAlert, User, MapPin, X, Check, CheckSquare, Users } from 'lucide-react';
import { Pedestal } from '../types';
import { DISTINCT_STAFF_NAMES, parseLocationCode } from '../data/initialData';

interface QuickSearchProps {
  pedestals: Pedestal[];
  onToggleStatus: (id: string) => void;
  onBatchToggleStatus?: (ids: string[], targetStatus: 'moved' | 'pending') => void;
  onSelectPedestalOnMap?: (pedestal: Pedestal) => void;
  onUpdatePedestal?: (updated: Pedestal) => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({
  pedestals,
  onToggleStatus,
  onBatchToggleStatus,
  onSelectPedestalOnMap,
  onUpdatePedestal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null);
  const [copied, setCopied] = useState(false);
  const [batchSelectedIds, setBatchSelectedIds] = useState<string[]>([]);

  // Filter matched pedestals based on search input
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();
    return pedestals.filter(
      (p) =>
        (p.customerId && p.customerId.toLowerCase().includes(term)) ||
        p.userName.toLowerCase().includes(term) ||
        p.oldCode.toLowerCase().includes(term) ||
        p.newCode.toLowerCase().includes(term) ||
        p.zone.toLowerCase().includes(term) ||
        `${p.zone}#${p.colIndex}-${p.slotIndex}`.toLowerCase().includes(term)
    );
  }, [searchTerm, pedestals]);

  // Handle selecting a pedestal from suggestions or default selection
  const activePedestal = selectedPedestal || (suggestions.length > 0 ? suggestions[0] : null);

  const handleCopyText = (pedestal: Pedestal) => {
    const pOld = parseLocationCode(pedestal.oldCode);
    const pNew = parseLocationCode(pedestal.newLocation || pedestal.newCode);
    const text = `【抽屜換抽屜 搬遷指示】\n目前客戶編號：${pedestal.customerId}\n經辦同仁：${pedestal.userName}\n舊位置：${pedestal.oldCode} (${pOld.formatted})\n新位置：${pedestal.newCode} (${pNew.formatted})\n搬遷指示：請將舊位置 [${pedestal.oldCode}] 整座抽屜移至新位置 [${pedestal.newCode}]。`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAllSuggestions = () => {
    if (batchSelectedIds.length === suggestions.length) {
      setBatchSelectedIds([]);
    } else {
      setBatchSelectedIds(suggestions.map((p) => p.id));
    }
  };

  const handleToggleBatchId = (id: string) => {
    setBatchSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-white py-6 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Badge & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
              <Search className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              經辦同仁 批次查詢與勾選核對
            </h2>
          </div>
          <span className="text-xs font-medium text-blue-800 bg-blue-100/90 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            抽屜換抽屜：依經辦同仁一次核對所有負責抽屜
          </span>
        </div>

        {/* Search Input Box */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedPedestal(null);
                setBatchSelectedIds([]);
              }}
              placeholder="搜尋目前客戶編號 (如 CUST-0001)、同仁姓名、舊櫃或新代號..."
              className="w-full pl-11 pr-10 py-3.5 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-2xl text-slate-900 placeholder-slate-400 text-sm sm:text-base font-medium shadow-md focus:outline-hidden transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPedestal(null);
                  setBatchSelectedIds([]);
                }}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Quick Dropdown Suggestions */}
          {searchTerm.trim().length > 0 && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-64 overflow-y-auto divide-y divide-slate-100">
              {suggestions.length > 0 ? (
                suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPedestal(p);
                      if (onSelectPedestalOnMap) onSelectPedestalOnMap(p);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-blue-50/80 transition-colors ${
                      activePedestal?.id === p.id ? 'bg-blue-50 font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                        {p.userName.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm text-slate-900 font-bold flex items-center gap-2">
                          <span>{p.userName}</span>
                          <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            {p.customerId}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          舊位置: <span className="font-mono text-slate-700 font-semibold">{p.oldCode}</span> ➔ 新位置: <span className="font-mono text-blue-700 font-bold">{p.newCode}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      p.status === 'moved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status === 'moved' ? '已搬遷' : '未搬遷'}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500 text-sm">
                  查無符合「{searchTerm}」的同仁、客戶編號或櫃位紀錄
                </div>
              )}
            </div>
          )}

          {/* Fast Quick Buttons for Staff & Hot GT codes */}
          {!searchTerm && (
            <div className="mt-3 flex flex-col items-center gap-1.5 text-xs text-slate-500">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  經辦同仁快速篩選：
                </span>
                {DISTINCT_STAFF_NAMES.map((staff) => (
                  <button
                    key={staff}
                    onClick={() => setSearchTerm(staff)}
                    className="px-2 py-0.5 bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-full transition-colors font-medium shadow-2xs"
                  >
                    {staff}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Batch Match List View when Searching for Staff */}
        {searchTerm.trim().length > 0 && suggestions.length > 1 && (
          <div className="mt-5 max-w-3xl mx-auto bg-white rounded-2xl p-4 shadow-md border border-indigo-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  符合搜尋「<span className="text-indigo-600">{searchTerm}</span>」的抽屜共有 <span className="text-blue-600 font-mono text-base">{suggestions.length}</span> 個
                </h3>
              </div>

              {/* Batch Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSelectAllSuggestions}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
                >
                  {batchSelectedIds.length === suggestions.length ? '取消全選' : '全選此搜尋結果'}
                </button>
                {batchSelectedIds.length > 0 && onBatchToggleStatus && (
                  <>
                    <button
                      onClick={() => {
                        onBatchToggleStatus(batchSelectedIds, 'moved');
                        setBatchSelectedIds([]);
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs"
                    >
                      一鍵核對勾選標記為 [已搬] ({batchSelectedIds.length})
                    </button>
                    <button
                      onClick={() => {
                        onBatchToggleStatus(batchSelectedIds, 'pending');
                        setBatchSelectedIds([]);
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs"
                    >
                      標記 [未搬] ({batchSelectedIds.length})
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* List of matched drawers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {suggestions.map((p) => {
                const isChecked = batchSelectedIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleToggleBatchId(p.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-indigo-50/90 border-indigo-400 ring-1 ring-indigo-300'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-slate-800">{p.userName}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            {p.customerId}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {p.oldCode} ➔ <strong className="text-slate-900">{p.newCode}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatus(p.id);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        p.status === 'moved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status === 'moved' ? '已搬' : '未搬'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prominent Large Result Card */}
        {activePedestal ? (() => {
          const parsedOld = parseLocationCode(activePedestal.oldCode);
          const parsedNew = parseLocationCode(activePedestal.newLocation || activePedestal.newCode);

          return (
            <div className="mt-5 max-w-3xl mx-auto bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-blue-200/80 relative overflow-hidden transition-all animate-fadeIn">
              {/* Background Decorative Accent */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-100/50 rounded-full blur-2xl pointer-events-none" />

              {/* Top Bar of Result Card */}
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {activePedestal.userName}
                      </h3>
                      <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                        目前客戶編號：{activePedestal.customerId}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center text-xs text-slate-500 mt-1 gap-1.5">
                      <div className="flex items-center text-blue-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1 shrink-0" />
                        目標新位置：<strong>{parsedNew.formatted}</strong>
                      </div>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-500">
                        目前抽屜位置：<span className="font-mono text-slate-700">{activePedestal.zone}#第{activePedestal.colIndex}排-{activePedestal.slotIndex}格</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge & Toggle Button */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                      activePedestal.status === 'moved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {activePedestal.status === 'moved' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                        已完成搬遷
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-1 text-amber-600" />
                        待整座推運搬遷
                      </>
                    )}
                  </span>
                  
                  <button
                    onClick={() => onToggleStatus(activePedestal.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                      activePedestal.status === 'moved'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {activePedestal.status === 'moved' ? '改標記為未搬' : '點擊標記為已搬'}
                  </button>
                </div>
              </div>

              {/* Middle Key Mapping Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  
                  {/* Old Pedestal Box */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-2xs">
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                      舊位置 (整座搬離)
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-slate-800 mt-1">
                      {activePedestal.oldCode}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 font-medium">
                      舊區域：{parsedOld.formatted}
                    </div>
                  </div>

                  {/* New Pedestal Box */}
                  <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-300 shadow-2xs relative">
                    <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      新位置 (整座搬入)
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-blue-700 mt-1">
                      {activePedestal.newCode}
                    </div>
                    <div className="text-xs text-blue-900 font-medium mt-0.5">
                      新區域：{parsedNew.formatted}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-1">
                <div className="text-slate-500">
                  {activePedestal.notes ? (
                    <span className="inline-flex items-center text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      備註：{activePedestal.notes}
                    </span>
                  ) : (
                    <span>抽屜換抽屜：整座舊抽屜直接替換至新位置。</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyText(activePedestal)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border ${
                      copied
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
                    <span>{copied ? '已複製指示文字' : '複製搬遷指示'}</span>
                  </button>

                  {onSelectPedestalOnMap && (
                    <button
                      onClick={() => onSelectPedestalOnMap(activePedestal)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-2xs flex items-center space-x-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>在地圖平面圖定位此櫃位</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })() : null}
      </div>
    </section>
  );
};
