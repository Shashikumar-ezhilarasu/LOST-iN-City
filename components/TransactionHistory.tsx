'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Gift, Trophy, Coins } from 'lucide-react';

interface Transaction {
  id: string;
  fromUser: any;
  toUser: any;
  amount: number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function TransactionHistory() {
  const { isSignedIn, getToken } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      fetchTransactions();
    }
  }, [isSignedIn]);

  const fetchTransactions = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string, isReceived: boolean) => {
    switch (type) {
      case 'REWARD':
        return <Gift className="w-5 h-5 text-green-600" />;
      case 'QUEST_REWARD':
        return <Trophy className="w-5 h-5 text-purple-600" />;
      case 'BONUS':
        return <Coins className="w-5 h-5 text-yellow-600" />;
      case 'TIP':
        return isReceived ? (
          <ArrowDownLeft className="w-5 h-5 text-green-600" />
        ) : (
          <ArrowUpRight className="w-5 h-5 text-red-600" />
        );
      default:
        return isReceived ? (
          <ArrowDownLeft className="w-5 h-5 text-green-600" />
        ) : (
          <ArrowUpRight className="w-5 h-5 text-red-600" />
        );
    }
  };

  const getTransactionColor = (type: string, isReceived: boolean) => {
    if (type === 'REWARD' || type === 'QUEST_REWARD' || type === 'BONUS') {
      return 'text-green-600';
    }
    return isReceived ? 'text-green-600' : 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Transaction History</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-3 border rounded">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Transaction History</h3>
        <div className="text-center py-8 text-gray-500">
          <Coins className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No transactions yet</p>
          <p className="text-sm">Start finding items to earn coins!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Transaction History</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((transaction) => {
          const isReceived = transaction.toUser !== null;

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${isReceived ? 'bg-green-50' : 'bg-red-50'}`}>
                {getTransactionIcon(transaction.type, isReceived)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{transaction.description}</p>
                <p className="text-xs text-gray-600">{formatDate(transaction.createdAt)}</p>
                {transaction.type === 'TIP' && (
                  <p className="text-xs text-gray-500">
                    {isReceived
                      ? `From ${transaction.fromUser?.displayName || 'Anonymous'}`
                      : `To ${transaction.toUser?.displayName || 'Anonymous'}`}
                  </p>
                )}
              </div>

              <div className={`font-bold ${getTransactionColor(transaction.type, isReceived)}`}>
                <span className="text-lg">
                  {isReceived ? '+' : '-'}
                  {transaction.amount.toFixed(2)}
                </span>
                <span className="text-xs ml-1">coins</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
