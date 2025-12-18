'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Gift, Trophy, Coins, RefreshCcw, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  fromUser: {
    clerkId: string;
    displayName: string;
    email: string;
  } | null;
  toUser: {
    clerkId: string;
    displayName: string;
    email: string;
  } | null;
  amount: number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function TransactionHistory() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'received' | 'sent'>('all');

  useEffect(() => {
    if (isSignedIn) {
      fetchTransactions();
      
      // Auto-refresh transactions every 30 seconds
      const interval = setInterval(() => {
        fetchTransactions();
      }, 30000);
      
      return () => clearInterval(interval);
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

  // Determine if transaction is received or sent by the current user
  const isTransactionReceived = (transaction: Transaction) => {
    if (!user) return false;
    
    // If fromUser is null, it's a system reward (always received)
    if (!transaction.fromUser) return true;
    
    // Check if current user is the recipient
    return transaction.toUser?.clerkId === user.id;
  };

  const getTransactionIcon = (type: string, isReceived: boolean) => {
    switch (type) {
      case 'REWARD':
        return <Gift className="w-5 h-5" />;
      case 'QUEST_REWARD':
        return <Trophy className="w-5 h-5" />;
      case 'BONUS':
      case 'ADMIN_CREDIT':
        return <Coins className="w-5 h-5" />;
      case 'REFUND':
        return <RefreshCcw className="w-5 h-5" />;
      case 'ADMIN_DEBIT':
        return <AlertCircle className="w-5 h-5" />;
      case 'TIP':
      case 'TRANSFER':
      case 'PURCHASE':
        return isReceived ? (
          <ArrowDownLeft className="w-5 h-5" />
        ) : (
          <ArrowUpRight className="w-5 h-5" />
        );
      default:
        return isReceived ? (
          <ArrowDownLeft className="w-5 h-5" />
        ) : (
          <ArrowUpRight className="w-5 h-5" />
        );
    }
  };

  const getTransactionStyle = (type: string, isReceived: boolean) => {
    // System rewards and credits
    if (type === 'REWARD' || type === 'QUEST_REWARD' || type === 'BONUS' || type === 'ADMIN_CREDIT') {
      return {
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        amountColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
      };
    }
    
    // Refunds
    if (type === 'REFUND') {
      return {
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
        amountColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
      };
    }
    
    // Admin debit
    if (type === 'ADMIN_DEBIT') {
      return {
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
        amountColor: 'text-orange-600 dark:text-orange-400',
        borderColor: 'border-orange-200 dark:border-orange-800',
      };
    }
    
    // User transfers - received
    if (isReceived) {
      return {
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-600 dark:text-green-400',
        amountColor: 'text-green-600 dark:text-green-400',
        borderColor: 'border-green-200 dark:border-green-800',
      };
    }
    
    // User transfers - sent
    return {
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
      amountColor: 'text-rose-600 dark:text-rose-400',
      borderColor: 'border-rose-200 dark:border-rose-800',
    };
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
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const getOtherPartyName = (transaction: Transaction, isReceived: boolean) => {
    if (isReceived) {
      return transaction.fromUser?.displayName || 'System';
    }
    return transaction.toUser?.displayName || 'Unknown';
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    const isReceived = isTransactionReceived(transaction);
    if (filter === 'received') return isReceived;
    if (filter === 'sent') return !isReceived;
    return true;
  });

  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <Card className="p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Transaction History
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Transaction History
        </h3>
        <div className="text-center py-12 text-gray-500">
          <Coins className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-lg mb-1">No transactions yet</p>
          <p className="text-sm">Start finding items to earn coins!</p>
        </div>
      </Card>
    );
  }

  const stats = {
    received: transactions.filter(t => isTransactionReceived(t)).length,
    sent: transactions.filter(t => !isTransactionReceived(t)).length,
  };

  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Transaction History
        </h3>
        <span className="text-xs text-gray-500">
          {filteredTransactions.length} of {transactions.length}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-white dark:bg-gray-700 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          All ({transactions.length})
        </button>
        <button
          onClick={() => setFilter('received')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'received'
              ? 'bg-white dark:bg-gray-700 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <span className="flex items-center justify-center gap-1">
            <ArrowDownLeft className="w-3 h-3" />
            Received ({stats.received})
          </span>
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            filter === 'sent'
              ? 'bg-white dark:bg-gray-700 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <span className="flex items-center justify-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            Sent ({stats.sent})
          </span>
        </button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTransactions.map((transaction) => {
          const isReceived = isTransactionReceived(transaction);
          const style = getTransactionStyle(transaction.type, isReceived);

          return (
            <div
              key={transaction.id}
              className={`flex items-center gap-3 p-4 border ${style.borderColor} rounded-lg hover:shadow-md transition-all duration-200 ${style.bgColor}`}
            >
              <div className={`p-3 rounded-lg ${style.iconColor} bg-white/50 dark:bg-gray-900/50`}>
                {getTransactionIcon(transaction.type, isReceived)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1 truncate text-gray-900 dark:text-gray-100">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span>{formatDate(transaction.createdAt)}</span>
                  {(transaction.type === 'TIP' || transaction.type === 'TRANSFER' || transaction.type === 'PURCHASE') && (
                    <>
                      <span>•</span>
                      <span className="truncate">
                        {isReceived ? 'From' : 'To'}: {getOtherPartyName(transaction, isReceived)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`font-bold text-lg ${style.amountColor}`}>
                  {isReceived ? '+' : '-'}{transaction.amount.toFixed(0)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">coins</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </Card>
  );
}
