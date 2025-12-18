'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface Claim {
  id: string;
  lostReport: {
    id: string;
    itemName: string;
  };
  claimer: {
    displayName: string;
  };
  claimerMessage: string;
  status: string;
  createdAt: string;
}

export default function NotificationBell() {
  const { getToken } = useAuth();
  const [pendingClaims, setPendingClaims] = useState<Claim[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingClaims();
    // Poll for new claims every 30 seconds
    const interval = setInterval(fetchPendingClaims, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingClaims = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/my-lost-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const pending = (data.data || []).filter((claim: Claim) => claim.status === 'PENDING');
        setPendingClaims(pending);
      }
    } catch (error) {
      console.error('Error fetching pending claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const notificationCount = pendingClaims.length;

  return (
    <div className="relative">
      <Button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative bg-medieval-brown-light border-2 border-medieval-gold/50 text-medieval-beige hover:border-medieval-gold"
      >
        <Bell className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {notificationCount}
          </span>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 z-50">
          <Card className="fantasy-card shadow-lg">
            <CardContent className="p-4">
              <h3 className="fantasy-title text-lg mb-3 flex items-center justify-between">
                Pending Claims
                <span className="text-medieval-gold text-sm">{notificationCount}</span>
              </h3>

              {loading ? (
                <p className="text-medieval-beige/70 text-center py-4">Loading...</p>
              ) : notificationCount === 0 ? (
                <p className="text-medieval-beige/70 text-center py-4">No pending claims</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingClaims.map((claim) => (
                    <Link key={claim.id} href={`/claim-review/${claim.id}`}>
                      <div className="bg-medieval-brown p-3 rounded-lg border-2 border-medieval-gold/30 hover:border-medieval-gold cursor-pointer transition-colors">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-medieval-gold font-bold text-sm">
                            {claim.lostReport.itemName}
                          </p>
                          <span className="text-xs text-medieval-beige/60">
                            {new Date(claim.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-medieval-beige/80 text-xs mb-2">
                          Found by: <span className="text-medieval-gold">{claim.claimer.displayName}</span>
                        </p>
                        <p className="text-medieval-beige/70 text-xs line-clamp-2">
                          "{claim.claimerMessage || 'No message'}"
                        </p>
                        <p className="text-green-400 text-xs mt-2 font-semibold">
                          👉 Click to review claim →
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-medieval-gold/30">
                <Link href="/profile?tab=claims">
                  <Button className="w-full fantasy-button text-sm">
                    View All Claims
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
