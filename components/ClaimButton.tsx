'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { claimsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface ClaimButtonProps {
  lostReportId: string;
  foundReportId?: string;
  rewardAmount?: number;
}

export default function ClaimButton({ lostReportId, foundReportId, rewardAmount }: ClaimButtonProps) {
  const { isSignedIn, getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmitClaim = async () => {
    if (!isSignedIn) {
      alert('Please sign in to submit a claim');
      return;
    }

    if (!message.trim()) {
      alert('Please provide a message describing how you found the item');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get Clerk session token
      const token = await getToken();
      
      // Submit claim
      await claimsAPI.create(lostReportId, foundReportId || null, message);
      
      alert('Claim submitted successfully! The owner will review it.');
      setShowForm(false);
      setMessage('');
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert(`Failed to submit claim: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Button disabled className="w-full">
        Sign in to claim this item
      </Button>
    );
  }

  if (!showForm) {
    return (
      <div className="space-y-2">
        {rewardAmount && rewardAmount > 0 && (
          <p className="text-sm text-yellow-600 font-semibold">
            💰 Reward: ${rewardAmount.toFixed(2)}
          </p>
        )}
        <Button onClick={() => setShowForm(true)} className="w-full">
          🎯 I Found This Item!
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold">Claim This Lost Item</h3>
      {rewardAmount && rewardAmount > 0 && (
        <p className="text-sm text-yellow-600 font-semibold">
          💰 Reward Available: ${rewardAmount.toFixed(2)}
        </p>
      )}
      <textarea
        className="w-full p-2 border rounded-md"
        rows={4}
        placeholder="Describe how/where you found this item and when the owner can collect it..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="flex gap-2">
        <Button
          onClick={handleSubmitClaim}
          disabled={isSubmitting || !message.trim()}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Claim'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setShowForm(false);
            setMessage('');
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
      <p className="text-xs text-gray-600">
        💡 The owner will review your claim and can approve it if it's legitimate.
        Once approved, they can release the reward to your wallet.
      </p>
    </div>
  );
}
