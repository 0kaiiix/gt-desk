import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { QuickSearch } from './components/QuickSearch';
import { VisualFloorplanMap } from './components/VisualFloorplanMap';
import { PedestalTable } from './components/PedestalTable';
import { Pedestal, MovementStats } from './types';
import { INITIAL_PEDESTALS, calculateStats } from './data/initialData';
import { ChevronUp, Smartphone } from 'lucide-react';
import {
  subscribeToPedestals,
  updatePedestalStatusInFirestore,
  batchUpdatePedestalsStatusInFirestore,
  updatePedestalInFirestore,
  saveAllPedestalsToFirestore,
  resetPedestalsInFirestore,
  fetchAllPedestalsFromFirestore,
} from './lib/firebase';

const STORAGE_KEY = 'OFFICE_PEDESTALS_CUSTOMER_MAP_V34_UPDATE_GT1636';

export default function App() {
  const [pedestals, setPedestals] = useState<Pedestal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 199) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load local pedestals data', e);
    }
    return INITIAL_PEDESTALS;
  });

  const [selectedPedestal, setSelectedPedestal] = useState<Pedestal | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'syncing' | 'error'>('connected');

  // Firebase Firestore real-time synchronization
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = subscribeToPedestals(
      INITIAL_PEDESTALS,
      (cloudData) => {
        if (!isSubscribed) return;
        if (Array.isArray(cloudData) && cloudData.length > 0) {
          setPedestals(cloudData);
          setCloudStatus('connected');
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          } catch (e) {
            console.error('LocalStorage write error:', e);
          }
        }
      },
      (error) => {
        console.warn('Firestore subscription status:', error);
        setCloudStatus('error');
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Save to localStorage whenever pedestals array changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pedestals));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [pedestals]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats: MovementStats = calculateStats(pedestals);

  // Toggle moved status for a single pedestal (Local + Firebase Sync)
  const handleToggleStatus = async (id: string) => {
    const targetItem = pedestals.find((p) => p.id === id);
    if (!targetItem) return;
    const newStatus = targetItem.status === 'moved' ? 'pending' : 'moved';

    // Optimistic local update
    setPedestals((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    if (selectedPedestal && selectedPedestal.id === id) {
      setSelectedPedestal((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // Sync to Firestore
    try {
      setCloudStatus('syncing');
      await updatePedestalStatusInFirestore(id, newStatus);
      setCloudStatus('connected');
    } catch (e) {
      console.error('Error syncing status to Firebase:', e);
      setCloudStatus('error');
    }
  };

  // Batch toggle status (Local + Firebase Sync)
  const handleBatchToggleStatus = async (ids: string[], targetStatus: 'moved' | 'pending') => {
    const now = new Date().toISOString();

    // Optimistic local update
    setPedestals((prev) =>
      prev.map((item) =>
        ids.includes(item.id)
          ? { ...item, status: targetStatus, updatedAt: now }
          : item
      )
    );

    // Sync to Firestore
    try {
      setCloudStatus('syncing');
      await batchUpdatePedestalsStatusInFirestore(ids, targetStatus);
      setCloudStatus('connected');
    } catch (e) {
      console.error('Error syncing batch status to Firebase:', e);
      setCloudStatus('error');
    }
  };

  // Update pedestal info (Local + Firebase Sync)
  const handleUpdatePedestal = async (updated: Pedestal) => {
    const itemWithTime = { ...updated, updatedAt: new Date().toISOString() };
    setPedestals((prev) =>
      prev.map((item) => (item.id === updated.id ? itemWithTime : item))
    );
    if (selectedPedestal && selectedPedestal.id === updated.id) {
      setSelectedPedestal(itemWithTime);
    }

    try {
      setCloudStatus('syncing');
      await updatePedestalInFirestore(itemWithTime);
      setCloudStatus('connected');
    } catch (e) {
      console.error('Error updating pedestal in Firebase:', e);
      setCloudStatus('error');
    }
  };

  // Reorder pedestals list after dragging (Local + Firebase Sync)
  const handleReorderPedestals = async (updatedList: Pedestal[]) => {
    setPedestals(updatedList);
    if (selectedPedestal) {
      const updatedSelected = updatedList.find((p) => p.id === selectedPedestal.id);
      if (updatedSelected) {
        setSelectedPedestal(updatedSelected);
      }
    }

    try {
      setCloudStatus('syncing');
      await saveAllPedestalsToFirestore(updatedList);
      setCloudStatus('connected');
    } catch (e) {
      console.error('Error saving reordered pedestals to Firebase:', e);
      setCloudStatus('error');
    }
  };

  // Reset to default initial order with fixed new locations (Local + Firebase Sync)
  const handleResetToDefault = async () => {
    if (window.confirm('確定要將所有排位的排序重置為初始預設順序嗎？此操作將同步重設 Firebase 雲端資料庫。')) {
      setPedestals(INITIAL_PEDESTALS);
      setSelectedPedestal(null);
      try {
        setCloudStatus('syncing');
        await resetPedestalsInFirestore(INITIAL_PEDESTALS);
        setCloudStatus('connected');
      } catch (e) {
        console.error('Error resetting pedestals in Firebase:', e);
        setCloudStatus('error');
      }
    }
  };

  // Force fetch fresh data from Firestore
  const handleForceSync = async () => {
    try {
      setCloudStatus('syncing');
      const freshData = await fetchAllPedestalsFromFirestore();
      if (Array.isArray(freshData) && freshData.length > 0) {
        setPedestals(freshData);
      }
      setCloudStatus('connected');
    } catch (e) {
      console.error('Error fetching fresh data from Firestore:', e);
      setCloudStatus('error');
    }
  };

  // Locate pedestal on map and smoothly scroll to the floorplan map section
  const handleSelectAndScrollToMap = (pedestal: Pedestal) => {
    setSelectedPedestal(pedestal);
    setTimeout(() => {
      const mapElement = document.getElementById('visual-floorplan-map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const scrollToSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white pb-16 sm:pb-0">
      
      {/* 1. Header with Title, Progress Metrics & Cloud Sync Status */}
      <Header stats={stats} cloudStatus={cloudStatus} onForceSync={handleForceSync} />

      {/* Main Content Area */}
      <main className="flex-1 space-y-0">
        
        {/* 2. Personal Quick Search & Batch Verification Area */}
        <QuickSearch
          pedestals={pedestals}
          onToggleStatus={handleToggleStatus}
          onBatchToggleStatus={handleBatchToggleStatus}
          onSelectPedestalOnMap={handleSelectAndScrollToMap}
          onUpdatePedestal={handleUpdatePedestal}
        />

        {/* 3. Zone Column Floorplan Map */}
        <VisualFloorplanMap
          pedestals={pedestals}
          selectedPedestal={selectedPedestal}
          onSelectPedestal={(pedestal) => setSelectedPedestal(pedestal)}
          onToggleStatus={handleToggleStatus}
          onUpdatePedestal={handleUpdatePedestal}
          onReorderPedestals={handleReorderPedestals}
          onResetToDefault={handleResetToDefault}
        />

        {/* 4. Full Cross-Reference Search Table */}
        <PedestalTable
          pedestals={pedestals}
          onToggleStatus={handleToggleStatus}
          onBatchToggleStatus={handleBatchToggleStatus}
          onSelectPedestalOnMap={handleSelectAndScrollToMap}
          onUpdatePedestal={handleUpdatePedestal}
        />
      </main>

      {/* Footer Instructions */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>
              辦公室抽屜櫃「抽屜換抽屜」搬遷定位系統 (共 199 格：A區 67格 / B區 84格 / C區 48格)
            </span>
          </div>
          <div className="text-slate-500">
            依經辦同仁進行批次核對與整座抽屜推運搬遷！
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Mobile Users */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col space-y-2 sm:hidden">
        {showScrollTop && (
          <button
            onClick={scrollToSearch}
            className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
            aria-label="回頂部快速搜尋"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
