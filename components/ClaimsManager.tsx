'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { claimsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ClaimsManagerProps {
  lostReportId: string;
}

interface RewardBreakdown {
  baseReward: number;
  timeFactor: number;
  urgencyFactor: number;
  ownerSetReward: number | null;
  dynamicCalculation: number;
  finalReward: number;
  reputationPoints: number;
}

export default function ClaimsManager({ lostReportId }: ClaimsManagerProps) {
  const { isSignedIn, getToken } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [rewardBreakdown, setRewardBreakdown] = useState<RewardBreakdown | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    loadClaims();
    loadRewardBreakdown();
  }, [lostReportId]);

  const loadClaims = async () => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      const data = await claimsAPI.getForLostReport(lostReportId);
      setClaims(data);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRewardBreakdown = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/claims/reward-breakdown/${lostReportId}`, {
        cache: 'no-store'
      });
      const result = await response.json();
      if (result.data) {
        setRewardBreakdown(result.data);
      }
    } catch (error) {
      console.error('Error loading reward breakdown:', error);
    }
  };

  const handleApprove = async (claimId: string) => {
    const response = prompt('Add a message for the finder (optional):');
    if (response === null) return; // User cancelled

    setProcessing(claimId);
    try {
      const token = await getToken();
      await claimsAPI.approve(claimId, response || 'Claim approved');
      alert('Claim approved! You can now complete it and release the reward.');
      await loadClaims();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (claimId: string) => {
    const response = prompt('Why are you rejecting this claim? (optional):');
    if (response === null) return; // User cancelled

    setProcessing(claimId);
    try {
      const token = await getToken();
      await claimsAPI.reject(claimId, response || 'Claim rejected');
      alert('Claim rejected.');
      await loadClaims();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleComplete = async (claimId: string) => {
    if (!confirm('Are you sure you want to release the reward? This action cannot be undone.')) {
      return;
    }

    setProcessing(claimId);
    try {
      const token = await getToken();
      await claimsAPI.complete(claimId);
      alert('Reward released successfully! 🎉');
      await loadClaims();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading claims...</div>;
  }

  if (claims.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        No claims yet. When someone finds your item, their claim will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Claims for This Item ({claims.length})</h2>
        {rewardBreakdown && (
          <Button
            onClick={() => setShowBreakdown(!showBreakdown)}
            variant="outline"
            size="sm"
          >
            {showBreakdown ? '📊 Hide' : '📊 Show'} Reward Details
          </Button>
        )}
      </div>

      {showBreakdown && rewardBreakdown && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h3 className="font-bold text-lg mb-3">🎁 Dynamic Reward Calculation</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Reward (Category):</span>
              <span className="font-semibold">${rewardBreakdown.baseReward.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Factor (×{rewardBreakdown.timeFactor.toFixed(2)}):</span>
              <span className="text-gray-600">Based on how long ago item was lost</span>
            </div>
            <div className="flex justify-between">
              <span>Urgency Factor (×{rewardBreakdown.urgencyFactor.toFixed(2)}):</span>
              <span className="text-gray-600">Based on details provided</span>
            </div>
            {rewardBreakdown.ownerSetReward && (
              <div className="flex justify-between text-blue-600">
                <span>Your Set Reward:</span>
                <span className="font-semibold">${rewardBreakdown.ownerSetReward.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between text-lg font-bold text-green-600">
              <span>Final Reward:</span>
              <span>💰 ${rewardBreakdown.finalReward.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-purple-600">
              <span>Reputation Points Awarded:</span>
              <span className="font-semibold">⭐ {rewardBreakdown.reputationPoints} pts</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            💡 Rewards are calculated dynamically based on category, time, and details. The finder will receive coins and reputation points when you release the reward!
          </p>
        </Card>
      )}

      {claims.length === 0 ? (
        <div className="text-center p-4 text-gray-600">
          No claims yet. When someone finds your item, their claim will appear here.
        </div>
      ) : (
        claims.map((claim) => (
        <Card key={claim.id} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{claim.claimer?.displayName || 'Anonymous'}</p>
              <p className="text-sm text-gray-600">{claim.claimer?.email}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                claim.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : claim.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : claim.status === 'REJECTED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {claim.status}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-semibold mb-1">Claimer's Message:</p>
            <p className="text-sm">{claim.claimerMessage || 'No message provided'}</p>
          </div>

          {claim.ownerResponse && (
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm font-semibold mb-1">Your Response:</p>
              <p className="text-sm">{claim.ownerResponse}</p>
            </div>
          )}

          {claim.rewardAmount && claim.rewardAmount > 0 && (
            <p className="text-sm font-semibold text-yellow-600">
              💰 Reward: ${claim.rewardAmount.toFixed(2)}
            </p>
          )}

          <div className="flex gap-2">
            {claim.status === 'PENDING' && (
              <>
                <Button
                  onClick={() => handleApprove(claim.id)}
                  disabled={processing === claim.id}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  ✓ Approve
                </Button>
                <Button
                  onClick={() => handleReject(claim.id)}
                  disabled={processing === claim.id}
                  variant="outline"
                  className="flex-1"
                >
                  ✗ Reject
                </Button>
              </>
            )}

            {claim.status === 'APPROVED' && !claim.rewardPaid && (
              <Button
                onClick={() => handleComplete(claim.id)}
                disabled={processing === claim.id}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                🎁 Complete & Release Reward
              </Button>
            )}

            {claim.status === 'COMPLETED' && (
              <div className="w-full text-center text-green-600 font-semibold">
                ✓ Completed - Reward Released
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Submitted: {new Date(claim.createdAt).toLocaleString()}
          </p>
        </Card>
      )))}
    </div>
  );
}
