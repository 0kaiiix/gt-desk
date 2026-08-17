import React, { useState, useMemo } from 'react';
import { Table, Search, Copy, Check, CheckCircle2, Clock, Download, ArrowUpDown, MapPin, Edit3, X, Save } from 'lucide-react';
import { Pedestal } from '../types';
import { ZONES } from '../data/initialData';

interface PedestalTableProps {
  pedestals: Pedestal[];
  onToggleStatus: (id: string) => void;
  onBatchToggleStatus?: (ids: string[], targetStatus: 'moved' | 'pending') => void;
  onSelectPedestalOnMap?: (pedestal: Pedestal) => void;
  onUpdatePedestal?: (updated: Pedestal) => void;
}

export const PedestalTable: React.FC<PedestalTableProps> = ({
  pedestals,
  onToggleStatus,
  onBatchToggleStatus,
  onSelectPedestalOnMap,
  onUpdatePedestal,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [sortField, setSortField] = useState<'customerId' | 'userName' | 'oldCode' | 'newCode' | 'zone' | 'status'>('zone');
  const [sortAsc, setSortAsc] = useState(true);

  // Quick Edit Modal state
  const [editingPedestal, setEditingPedestal] = useState<Pedestal | null>(null);
  const [editCustomerId, setEditCustomerId] = useState('');
  const [editUserName, setEditUserName] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Filtered & Sorted Pedestals
  const filteredPedestals = useMemo(() => {
    return pedestals
      .filter((p) => {
        const matchesQuery =
          !searchFilter ||
          (p.customerId && p.customerId.toLowerCase().includes(searchFilter.toLowerCase())) ||
          p.userName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.oldCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.newCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
          (p.notes && p.notes.toLowerCase().includes(searchFilter.toLowerCase()));

        const matchesZone = zoneFilter === 'all' || p.zone === zoneFilter;
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

        return matchesQuery && matchesZone && matchesStatus;
      })
      .sort((a, b) => {
        if (sortField === 'oldCode') {
          const res = a.oldCode.localeCompare(b.oldCode, undefined, { numeric: true, sensitivity: 'base' });
          return sortAsc ? res : -res;
        }
        if (sortField === 'newCode') {
          const res = a.newCode.localeCompare(b.newCode, undefined, { numeric: true, sensitivity: 'base' });
          return sortAsc ? res : -res;
        }
        if (sortField === 'customerId') {
          const res = (a.customerId || '').localeCompare(b.customerId || '', undefined, { numeric: true, sensitivity: 'base' });
          return sortAsc ? res : -res;
        }
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';

        if (typeof valA === 'string' && typeof valB === 'string') {
          const res = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
          return sortAsc ? res : -res;
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [pedestals, searchFilter, zoneFilter, statusFilter, sortField, sortAsc]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPedestals.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopySingleRow = (p: Pedestal) => {
    const text = `區域:${p.zone} | 客戶編號:${p.customerId} | 經辦:${p.userName} | 舊位置:${p.oldCode} | 新位置:${p.newCode} | 狀態:${p.status === 'moved' ? '已搬' : '未搬'}${p.notes ? ` | 備註:${p.notes}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllFiltered = () => {
    const header = `區域\t目前客戶編號\t經辦同仁\t舊位置\t新位置\t搬遷狀態\t備註\n`;
    const rows = filteredPedestals
      .map(
        (p) =>
          `${p.zone}\t${p.customerId}\t${p.userName}\t${p.oldCode}\t${p.newCode}\t${p.status === 'moved' ? '已搬' : '未搬'}\t${p.notes || ''}`
      )
      .join('\n');
    navigator.clipboard.writeText(header + rows);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadCSV = () => {
    const header = '\uFEFF區域,目前客戶編號,經辦同仁,舊位置,新位置,搬遷狀態,備註\n';
    const rows = filteredPedestals
      .map(
        (p) =>
          `"${p.zone}","${p.customerId}","${p.userName}","${p.oldCode}","${p.newCode}","${
            p.status === 'moved' ? '已搬' : '未搬'
          }","${p.notes || ''}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `辦公室抽屜換抽屜對照表_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditModal = (p: Pedestal) => {
    setEditingPedestal(p);
    setEditCustomerId(p.customerId || '');
    setEditUserName(p.userName || '');
    setEditNotes(p.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPedestal) return;

    if (onUpdatePedestal) {
      onUpdatePedestal({
        ...editingPedestal,
        customerId: editCustomerId.trim() || editingPedestal.customerId,
        userName: editUserName.trim() || editingPedestal.userName,
        notes: editNotes.trim() || undefined,
      });
    }
    setEditingPedestal(null);
  };

  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <Table className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                完整對照搜尋與批次核對表 <span className="text-xs font-normal text-slate-500">(底部詳細明細)</span>
              </h2>
              <p className="text-xs text-slate-500">
                包含區域、目前客戶編號、經辦同仁、舊位置、新位置與即時搬遷狀態，支援批次勾選、編輯與匯出 CSV。
              </p>
            </div>
          </div>

          {/* Table Level Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyAllFiltered}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border ${
                copiedAll
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? '已複製全表文字' : '一鍵複製選取/全表'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下載 CSV 表格</span>
            </button>
          </div>
        </div>

        {/* Filters and Control Toolbar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="即時篩選目前客戶編號 (如 CUST-0001)、同仁姓名、舊櫃或新代號..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            {/* Zone Filter Dropdown */}
            <div>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:border-blue-600 focus:outline-hidden"
              >
                <option value="all">所有區域 (全部)</option>
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter Dropdown */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:border-blue-600 focus:outline-hidden"
              >
                <option value="all">搬遷狀態：不限 (全部)</option>
                <option value="pending">待搬遷 (未搬)</option>
                <option value="moved">已完成 (已搬)</option>
              </select>
            </div>
          </div>

          {/* Batch Operations Bar when items selected */}
          {selectedIds.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 flex items-center justify-between text-xs animate-fadeIn">
              <span className="font-bold text-indigo-900">
                已勾選 <strong className="text-indigo-700">{selectedIds.length}</strong> 筆抽屜櫃紀錄
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (onBatchToggleStatus) onBatchToggleStatus(selectedIds, 'moved');
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                >
                  批次標記為 [已搬]
                </button>
                <button
                  onClick={() => {
                    if (onBatchToggleStatus) onBatchToggleStatus(selectedIds, 'pending');
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700"
                >
                  批次標記為 [未搬]
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredPedestals.length > 0 &&
                      selectedIds.length === filteredPedestals.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
                <th
                  onClick={() => handleSort('zone')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>區域</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customerId')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>目前客戶編號</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('userName')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>經辦同仁</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('oldCode')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>舊位置</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('newCode')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>新位置</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="p-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>搬遷狀態</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3">備註</th>
                <th className="p-3 text-right">快捷操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPedestals.length > 0 ? (
                filteredPedestals.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const isMoved = p.status === 'moved';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : isMoved ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(p.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>

                      {/* Zone */}
                      <td className="p-3 font-semibold text-slate-800">{p.zone}</td>

                      {/* Customer ID */}
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {p.customerId}
                        </span>
                      </td>

                      {/* User Name */}
                      <td className="p-3 font-bold text-slate-900">{p.userName}</td>

                      {/* Old Code */}
                      <td className="p-3 font-mono font-bold text-slate-700">{p.oldCode}</td>

                      {/* New Code */}
                      <td className="p-3 font-mono font-bold text-blue-700">{p.newCode}</td>

                      {/* Status Toggle */}
                      <td className="p-3">
                        <button
                          onClick={() => onToggleStatus(p.id)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                            isMoved
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {isMoved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              已完成
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                              待搬遷
                            </>
                          )}
                        </button>
                      </td>

                      {/* Notes */}
                      <td className="p-3 text-xs text-slate-500 max-w-xs truncate">
                        {p.notes ? (
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {p.notes}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {onUpdatePedestal && (
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="編輯目前客戶編號與備註"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleCopySingleRow(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-colors"
                            title="複製此列資料"
                          >
                            {copiedId === p.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {onSelectPedestalOnMap && (
                            <button
                              onClick={() => onSelectPedestalOnMap(p)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              title="在地圖平面圖定位"
                            >
                              <MapPin className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    查無符合條件的抽屜櫃紀錄
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Edit Customer ID & Details Modal */}
      {editingPedestal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  編輯抽屜櫃資料 ({editingPedestal.newCode})
                </h3>
              </div>
              <button
                onClick={() => setEditingPedestal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  目前客戶編號 (必填/重要)
                </label>
                <input
                  type="text"
                  required
                  value={editCustomerId}
                  onChange={(e) => setEditCustomerId(e.target.value)}
                  placeholder="例如 CUST-0001, C10001"
                  className="w-full px-3 py-2 border border-purple-300 bg-purple-50/40 rounded-xl font-mono font-bold text-slate-900 focus:outline-hidden focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  經辦同仁姓名
                </label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  位置規格 (唯讀)
                </label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 flex justify-between">
                  <span>舊位置: {editingPedestal.oldCode}</span>
                  <span>➔</span>
                  <span className="font-bold text-blue-700">新位置: {editingPedestal.newCode}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  備註
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="可自由輸入備註說明..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPedestal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>儲存變更</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
