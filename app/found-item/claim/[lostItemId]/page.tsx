'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Coins, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  params: {
    lostItemId: string;
  };
}

export default function ClaimItemPage({ params }: Props) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [lostItem, setLostItem] = useState<any>(null);
  const [myFoundReports, setMyFoundReports] = useState<any[]>([]);
  const [selectedFoundReport, setSelectedFoundReport] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await getToken();
      
      // Fetch lost item details
      const lostResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lost-reports/${params.lostItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (lostResponse.ok) {
        const data = await lostResponse.json();
        setLostItem(data.data);
      }

      // Fetch my found reports
      const foundResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/found-reports/my-reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (foundResponse.ok) {
        const data = await foundResponse.json();
        setMyFoundReports(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async () => {
    if (!message.trim()) {
      alert('Please provide a message explaining why this item matches');
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lost_report_id: params.lostItemId,
          found_report_id: selectedFoundReport || null,
          message: message,
        }),
      });

      if (response.ok) {
        alert('✅ Claim submitted successfully! The owner will review your claim.');
        router.push(`/lost-item/${params.lostItemId}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to submit claim'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medieval-gold mx-auto mb-4"></div>
          <p className="text-medieval-beige">Loading...</p>
        </div>
      </div>
    );
  }

  if (!lostItem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-medieval-beige">Item not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-3xl mx-auto">
      <Link href={`/lost-item/${params.lostItemId}`}>
        <Button className="bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </Button>
      </Link>

      <Card className="fantasy-card">
        <CardContent className="p-6 space-y-6">
          <div>
            <h1 className="fantasy-title text-2xl mb-2">Claim Item</h1>
            <p className="text-medieval-beige/70">
              Submit a claim for: <span className="text-medieval-gold font-bold">{lostItem.itemName}</span>
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Coins className="w-5 h-5 text-medieval-gold" />
              <span className="text-medieval-gold font-bold text-lg">
                Reward: {lostItem.rewardAmount} coins
              </span>
            </div>
          </div>

          {myFoundReports.length > 0 && (
            <div>
              <label className="block text-medieval-gold font-semibold mb-2">
                Link to Your Found Report (Optional)
              </label>
              <select
                title="Link to your found report"
                value={selectedFoundReport}
                onChange={(e) => setSelectedFoundReport(e.target.value)}
                className="w-full bg-medieval-brown-light border-2 border-medieval-gold/30 rounded p-3 text-medieval-beige"
              >
                <option value="">None - I'll describe it below</option>
                {myFoundReports.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.itemName} - {new Date(report.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <p className="text-xs text-medieval-beige/60 mt-1">
                If you've already reported this item as found, link it here
              </p>
            </div>
          )}

          <div>
            <label className="block text-medieval-gold font-semibold mb-2">
              Message to Owner *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain how you found this item, where it is now, and any details that prove you have the correct item..."
              className="w-full bg-medieval-brown-light border-2 border-medieval-gold/30 rounded p-3 text-medieval-beige min-h-[150px]"
              required
            />
            <p className="text-xs text-medieval-beige/60 mt-1">
              Be specific and provide details that match the item description
            </p>
          </div>

          <div className="bg-medieval-gold/10 border-2 border-medieval-gold/30 rounded-lg p-4">
            <h3 className="text-medieval-gold font-semibold mb-2">📋 What Happens Next?</h3>
            <ul className="space-y-2 text-sm text-medieval-beige/80">
              <li>1. The owner will review your claim</li>
              <li>2. They may approve or reject based on the information provided</li>
              <li>3. If approved, coordinate with the owner for item exchange</li>
              <li>4. Once verified, the owner releases the reward to you!</li>
            </ul>
          </div>

          <Button
            onClick={handleSubmitClaim}
            disabled={submitting || !message.trim()}
            className="w-full fantasy-button flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>{submitting ? 'Submitting...' : 'SUBMIT CLAIM'}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
