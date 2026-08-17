import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Columns,
  Eye,
  GripVertical,
  Lock,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Pedestal } from '../types';
import {
  ZONES,
  movePedestalBetweenSlots,
  shiftPedestalWithinColumn,
} from '../data/initialData';

interface VisualFloorplanMapProps {
  pedestals: Pedestal[];
  selectedPedestal: Pedestal | null;
  onSelectPedestal: (pedestal: Pedestal) => void;
  onToggleStatus: (id: string) => void;
  onUpdatePedestal?: (updated: Pedestal) => void;
  onReorderPedestals?: (updatedList: Pedestal[]) => void;
  onResetToDefault?: () => void;
}

export const VisualFloorplanMap: React.FC<VisualFloorplanMapProps> = ({
  pedestals,
  selectedPedestal,
  onSelectPedestal,
  onToggleStatus,
  onUpdatePedestal,
  onReorderPedestals,
  onResetToDefault,
}) => {
  const [activeZoneId, setActiveZoneId] = useState<string>('A區');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // 'all' | 'pending' | 'moved'
  const [compactMode, setCompactMode] = useState<boolean>(false); // false: Detailed cards, true: Mini boxes
  const [dragMode, setDragMode] = useState<'swap' | 'insert'>('swap'); // 'swap': Direct exchange, 'insert': Reorder sequence
  const [draggingPedestalId, setDraggingPedestalId] = useState<string | null>(null);
  const [dragOverPedestalId, setDragOverPedestalId] = useState<string | null>(null);
  const [dragOverColumnNum, setDragOverColumnNum] = useState<number | null>(null);
  const [moveToast, setMoveToast] = useState<{
    gtCode: string;
    fromOld: string;
    toOld: string;
    newTarget: string;
  } | null>(null);

  // Automatically switch active tab when a pedestal in another zone is selected
  useEffect(() => {
    if (selectedPedestal && selectedPedestal.zone) {
      setActiveZoneId(selectedPedestal.zone);
    }
  }, [selectedPedestal]);

  const activeZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];

  // Filter pedestals for active zone
  const zonePedestals = pedestals.filter((p) => {
    const matchesZone = p.zone === activeZoneId;
    const matchesStatus = filterStatus === 'all' ? true : p.status === filterStatus;
    return matchesZone && matchesStatus;
  });

  // Array of column indices for the active zone
  const columnIndices = Array.from({ length: activeZone.totalColumns }, (_, i) => i + 1);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, pedestal: Pedestal) => {
    e.dataTransfer.setData('text/plain', pedestal.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingPedestalId(pedestal.id);
  };

  const handleDragOverPedestal = (e: React.DragEvent, pedestal: Pedestal) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverPedestalId !== pedestal.id) {
      setDragOverPedestalId(pedestal.id);
    }
  };

  const handleDropOnPedestal = (e: React.DragEvent, targetPedestal: Pedestal) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggingPedestalId;
    const sourcePedestal = pedestals.find((p) => p.id === sourceId);

    if (sourcePedestal && sourcePedestal.id !== targetPedestal.id && onReorderPedestals) {
      const updatedList = movePedestalBetweenSlots(
        pedestals,
        sourceId,
        targetPedestal.zone,
        targetPedestal.colIndex,
        targetPedestal.slotIndex,
        dragMode
      );
      onReorderPedestals(updatedList);

      // Show instant confirmation toast
      const newOldLocation = `${targetPedestal.zone}#${targetPedestal.colIndex}-${targetPedestal.slotIndex}`;
      setMoveToast({
        gtCode: sourcePedestal.customerId,
        fromOld: sourcePedestal.oldCode,
        toOld: newOldLocation,
        newTarget: sourcePedestal.newLocation || newOldLocation,
      });
      setTimeout(() => setMoveToast(null), 4500);
    }
    setDraggingPedestalId(null);
    setDragOverPedestalId(null);
    setDragOverColumnNum(null);
  };

  const handleDragEnd = () => {
    setDraggingPedestalId(null);
    setDragOverPedestalId(null);
    setDragOverColumnNum(null);
  };

  const handleShiftCard = (e: React.MouseEvent, pedestalId: string, direction: 'up' | 'down') => {
    e.stopPropagation();
    const source = pedestals.find((p) => p.id === pedestalId);
    if (onReorderPedestals && source) {
      const targetSlot = direction === 'up' ? source.slotIndex - 1 : source.slotIndex + 1;
      const updatedList = shiftPedestalWithinColumn(pedestals, pedestalId, direction);
      onReorderPedestals(updatedList);

      const newOldLocation = `${source.zone}#${source.colIndex}-${targetSlot}`;
      setMoveToast({
        gtCode: source.customerId,
        fromOld: source.oldCode,
        toOld: newOldLocation,
        newTarget: source.newLocation,
      });
      setTimeout(() => setMoveToast(null), 4500);
    }
  };

  return (
    <section id="visual-floorplan-map-section" className="py-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Columns className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                縱向直排排列平面圖
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  支援區塊拖曳排序
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                抽屜換抽屜整座搬移：依現場縱向直排排列。
              </p>
            </div>
          </div>

          {/* Controls: Compact Mode Toggle, Status Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* View Mode Toggle */}
            <button
              onClick={() => setCompactMode(!compactMode)}
              className={`px-3 py-1.5 rounded-lg font-bold border transition-all flex items-center space-x-1.5 ${
                compactMode
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{compactMode ? '已啟用：精簡方塊模式' : '切換為精簡方塊'}</span>
            </button>

            {/* Status Filter */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-200/80 border border-slate-300/60">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                待搬
              </button>
              <button
                onClick={() => setFilterStatus('moved')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  filterStatus === 'moved'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                已搬
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Movement Toast Banner */}
        {moveToast && (
          <div className="mb-3 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-lg border-2 border-emerald-400 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>
                抽屜 <span className="text-amber-300 font-mono text-base px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700">{moveToast.gtCode}</span> 移動成功！
                舊位置已同步變更為：<span className="text-amber-300 font-mono font-extrabold underline">{moveToast.toOld}</span>
                （新位置維持鎖定：<span className="text-emerald-200 font-mono">{moveToast.newTarget}</span>）
              </span>
            </div>
            <button
              onClick={() => setMoveToast(null)}
              className="text-emerald-200 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-emerald-800"
            >
              關閉
            </button>
          </div>
        )}

        {/* Zone Switcher Tabs */}
        <div className="flex items-center overflow-x-auto pb-2 space-x-2 no-scrollbar">
          {ZONES.map((zone) => {
            const count = pedestals.filter((p) => p.zone === zone.id).length;
            const movedCount = pedestals.filter((p) => p.zone === zone.id && p.status === 'moved').length;
            const isActive = activeZoneId === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => setActiveZoneId(zone.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{zone.name}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-indigo-900/60 text-indigo-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {movedCount} / {count} 已搬
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Zone Sub-header Specification Notice & Drag Guide */}
        <div className="mt-3 bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-indigo-950">
          <div className="flex items-center space-x-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
            <span><strong>{activeZone.name}：</strong>{activeZone.description}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 shrink-0">
            <span className="inline-flex items-center bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
              <GripVertical className="w-3.5 h-3.5 text-indigo-500 mr-0.5" />
              卡片可隨意拖曳排序
            </span>
            <span className="inline-flex items-center bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
              <Lock className="w-3 h-3 text-slate-500 mr-0.5" />
              新位置已鎖定
            </span>
            <div className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200 flex items-center space-x-2">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1 inline-block" />已搬完</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1 inline-block" />待搬運</span>
            </div>
          </div>
        </div>

        {/* Selected Cabinet Movement Banner */}
        {selectedPedestal && (
          <div className="mt-3 bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-indigo-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 border border-indigo-400 flex items-center justify-center font-bold text-amber-300 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-indigo-200 font-semibold flex items-center gap-2">
                  <span>已選取櫃位經辦：<strong className="text-white text-sm">{selectedPedestal.userName}</strong></span>
                  <span className="bg-purple-900/80 text-purple-200 border border-purple-400/50 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                    目前客戶編號：{selectedPedestal.customerId}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-black font-mono mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-600/50">
                    舊位置: {selectedPedestal.oldCode} ({selectedPedestal.oldZone})
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span className="text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/50 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    新位置(固定): {selectedPedestal.newLocation || selectedPedestal.newCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onToggleStatus(selectedPedestal.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                  selectedPedestal.status === 'moved'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                }`}
              >
                {selectedPedestal.status === 'moved' ? '改為未搬' : '點擊標記為已搬'}
              </button>
            </div>
          </div>
        )}

        {/* Horizontal Scrollable Container for Vertical Columns */}
        <div className="mt-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm overflow-x-auto">
          <div className="flex items-start gap-3 min-w-max pb-2">
            
            {columnIndices.map((colNum) => {
              // Get all pedestals belonging to this specific column (欄位)
              const columnItems = zonePedestals
                .filter((p) => p.colIndex === colNum)
                .sort((a, b) => a.slotIndex - b.slotIndex);

              const maxSlotsInThisCol = activeZone.columnSlots[colNum - 1] || 6;
              const isColOver = dragOverColumnNum === colNum;

              return (
                <div
                  key={colNum}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (dragOverColumnNum !== colNum) setDragOverColumnNum(colNum);
                  }}
                  onDragLeave={() => {
                    if (dragOverColumnNum === colNum) setDragOverColumnNum(null);
                  }}
                  className={`flex flex-col rounded-xl border p-2.5 w-44 sm:w-52 shrink-0 transition-all ${
                    isColOver
                      ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-200'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs font-extrabold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      第 {colNum} 排
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded font-semibold">
                      {columnItems.length}/{maxSlotsInThisCol} 格
                    </span>
                  </div>

                  {/* Vertical Stack of Pedestals (由上至下) */}
                  <div className="flex flex-col gap-2">
                    {columnItems.map((p, itemIdx) => {
                      const isSelected = selectedPedestal?.id === p.id;
                      const isMoved = p.status === 'moved';
                      const isDragging = draggingPedestalId === p.id;
                      const isDragOver = dragOverPedestalId === p.id;

                      if (compactMode) {
                        // Compact Mini Box Mode (Draggable)
                        return (
                          <div
                            key={p.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, p)}
                            onDragOver={(e) => handleDragOverPedestal(e, p)}
                            onDrop={(e) => handleDropOnPedestal(e, p)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onSelectPedestal(p)}
                            title={`目前客戶編號: ${p.customerId}\n新位置(固定): ${p.newLocation || `${p.zone}#${p.colIndex}-${p.slotIndex}`}\n舊位置(隨序更新): ${p.oldCode}\n經辦同仁: ${p.userName}`}
                            className={`p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all border flex items-center justify-between group ${
                              isDragging
                                ? 'opacity-40 border-dashed border-indigo-400 bg-indigo-50 scale-95'
                                : isDragOver
                                ? 'ring-2 ring-indigo-500 bg-indigo-100 border-indigo-400 scale-[1.02]'
                                : isSelected
                                ? 'bg-indigo-100 border-2 border-indigo-600 ring-2 ring-indigo-300 shadow-sm'
                                : isMoved
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                                : 'bg-white border-slate-200 hover:bg-amber-50 hover:border-amber-300 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5 min-w-0">
                              <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                              <span className="text-xs font-black font-mono px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                                {p.customerId}
                              </span>
                              <span className="text-[10px] text-slate-700 font-bold truncate max-w-[65px]">{p.userName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleStatus(p.id);
                                }}
                                className="p-0.5 hover:scale-110 transition-transform"
                              >
                                {isMoved ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      }

                      // Detailed Full Card Mode (Draggable)
                      return (
                        <div
                          key={p.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, p)}
                          onDragOver={(e) => handleDragOverPedestal(e, p)}
                          onDrop={(e) => handleDropOnPedestal(e, p)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onSelectPedestal(p)}
                          className={`relative rounded-xl p-2.5 cursor-grab active:cursor-grabbing transition-all border flex flex-col justify-between group select-none ${
                            isDragging
                              ? 'opacity-40 border-dashed border-indigo-400 bg-indigo-50 scale-95 shadow-none'
                              : isDragOver
                              ? 'ring-2 ring-indigo-500 bg-indigo-100 border-indigo-400 scale-[1.02] shadow-md'
                              : isSelected
                              ? 'bg-indigo-50 border-2 border-indigo-600 ring-2 ring-indigo-300 shadow-md scale-[1.02]'
                              : isMoved
                              ? 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200 hover:border-emerald-300 shadow-2xs'
                              : 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-300 shadow-2xs'
                          }`}
                        >
                          {/* Card Top: Grip + Customer ID + Status Button + Shift Buttons */}
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center space-x-1">
                              <span
                                className="text-slate-400 group-hover:text-indigo-600 p-0.5 rounded cursor-grab"
                                title="按住可拖曳排序"
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-purple-100/90 text-purple-800 border border-purple-300 shadow-2xs">
                                {p.customerId}
                              </span>
                            </div>

                            <div className="flex items-center space-x-0.5">
                              {/* Quick Move Up/Down Controls on Hover */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center mr-1">
                                {itemIdx > 0 && (
                                  <button
                                    onClick={(e) => handleShiftCard(e, p.id, 'up')}
                                    className="p-0.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
                                    title="上移一位"
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                )}
                                {itemIdx < columnItems.length - 1 && (
                                  <button
                                    onClick={(e) => handleShiftCard(e, p.id, 'down')}
                                    className="p-0.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
                                    title="下移一位"
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleStatus(p.id);
                                }}
                                className="focus:outline-hidden p-0.5 hover:scale-110 transition-transform"
                                title="點擊切換搬遷狀態"
                              >
                                {isMoved ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-amber-500" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Card Middle: New Location (Locked) & Old Location (Dynamic) */}
                          <div className="text-[11px] text-slate-500 font-medium space-y-0.5">
                            <div className="flex items-center justify-between bg-slate-50/80 px-1.5 py-0.5 rounded border border-slate-200/60">
                              <span className="text-slate-600 flex items-center gap-0.5 text-[10.5px]">
                                <Lock className="w-2.5 h-2.5 text-slate-400" />
                                新位置:
                              </span>
                              <strong className="font-mono text-slate-900 font-bold">
                                {p.newLocation || `${p.zone}#${p.colIndex}-${p.slotIndex}`}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between text-[10.5px] px-1.5 pt-0.5">
                              <span className="text-slate-500">舊位置:</span>
                              <span className="font-mono text-indigo-700 font-bold bg-indigo-50 px-1 rounded">
                                {p.oldCode}
                              </span>
                            </div>
                          </div>

                          {/* Card Bottom: Staff Name & Status */}
                          <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                            <div className="truncate pr-1">
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {p.userName}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                isMoved ? 'text-emerald-800 bg-emerald-200/80' : 'text-amber-800 bg-amber-200/80'
                              }`}
                            >
                              {isMoved ? '已搬' : '待搬'}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {columnItems.length === 0 && (
                      <div className="text-xs text-slate-400 py-6 text-center bg-white rounded-lg border border-dashed border-slate-200">
                        無資料
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
};

