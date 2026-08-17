import React from 'react';
import { PackageCheck, CheckCircle2, Clock, MapPin, Sparkles, Cloud, CloudCheck, RefreshCw } from 'lucide-react';
import { MovementStats } from '../types';

interface HeaderProps {
  stats: MovementStats;
  cloudStatus?: 'connected' | 'syncing' | 'error';
  onForceSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, cloudStatus = 'connected', onForceSync }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <PackageCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  辦公室抽屜櫃重新分配與對照系統
                </h1>
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  SPA 對照版
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                活動櫃整體搬遷對照 · 移動舊櫃至新代號位 · 手機與多端即時查閱
              </p>
            </div>
          </div>

          {/* Firebase Cloud Sync Status Badge & Action */}
          <div className="flex items-center space-x-2 self-start sm:self-center">
            {cloudStatus === 'connected' && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Firebase 雲端即時連線同步</span>
              </div>
            )}
            {cloudStatus === 'syncing' && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>即時寫入雲端中...</span>
              </div>
            )}
            {cloudStatus === 'error' && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 shadow-2xs">
                <Cloud className="w-3.5 h-3.5 text-amber-600" />
                <span>離線暫存模式</span>
              </div>
            )}

            {onForceSync && (
              <button
                onClick={onForceSync}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-300 text-xs transition-colors flex items-center gap-1 font-medium"
                title="重新從 Firebase 雲端讀取最新數據"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">立即刷新</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & Quick Metrics */}
        <div className="mt-3 sm:mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
          <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-medium text-slate-700 mb-1.5 gap-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-slate-900 font-bold">
                <MapPin className="w-4 h-4 text-blue-600 mr-1" />
                總搬遷進度：
                <span className="text-blue-700 font-extrabold ml-1">{stats.percentage}%</span>
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                已搬遷：<strong className="ml-1">{stats.moved}</strong> 座
              </span>
              <span className="flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                待搬遷：<strong className="ml-1">{stats.pending}</strong> 座
              </span>
            </div>
            <div className="text-xs text-slate-500 font-normal">
              全公司共 <strong className="text-slate-800">{stats.total}</strong> 座活動抽屜櫃
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
};

