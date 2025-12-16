'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Coins, TrendingUp, TrendingDown, Award } from 'lucide-react';

interface WalletStats {
  currentBalance: number;
  lifetimeEarnings: number;
  lifetimeSpent: number;
  itemsReturned: number;
  score: number;
}

export default function WalletDisplay() {
  const { isSignedIn, getToken } = useAuth();
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      fetchWalletStats();
    }
  }, [isSignedIn]);

  const fetchWalletStats = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching wallet stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-800 font-semibold mb-1">Your Balance</p>
            <div className="flex items-center gap-2">
              <Coins className="w-8 h-8 text-yellow-600" />
              <span className="text-4xl font-bold text-yellow-900">
                {stats.currentBalance.toFixed(2)}
              </span>
              <span className="text-xl text-yellow-700">coins</span>
            </div>
          </div>
          <Award className="w-16 h-16 text-yellow-500 opacity-30" />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Lifetime Earned</p>
              <p className="text-xl font-bold text-green-600">
                {stats.lifetimeEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Lifetime Spent</p>
              <p className="text-xl font-bold text-red-600">
                {stats.lifetimeSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Items Returned</p>
              <p className="text-xl font-bold text-blue-600">{stats.itemsReturned}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Coins className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Score</p>
              <p className="text-xl font-bold text-purple-600">{stats.score}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
