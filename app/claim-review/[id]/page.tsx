'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { ArrowLeft, User, MessageSquare, CheckCircle, XCircle, Coins, Calendar, MapPin, Eye, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Claim {
  id: string;
  lostReport: {
    id: string;
    itemName: string;
    description: string;
    lostLocation: string;
    lostDate: string;
    rewardAmount: number;
    images: string[];
    reportedBy: {
      id: string;
      clerkId: string;
      displayName: string;
      email: string;
    };
  };
  claimer: {
    id: string;
    clerkId: string;
    displayName: string;
    email: string;
    phone?: string;
    itemsReturnedCount: number;
    score: number;
  };
  foundReport?: {
    id: string;
    itemName: string;
    description: string;
    foundLocation: string;
    foundDate: string;
    foundCondition: string;
    images: string[];
  };
  claimerMessage: string;
  status: string;
  rewardAmount: number;
  rewardPaid: boolean;
  ownerResponse?: string;
  createdAt: string;
}

export default function ClaimReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [ownerResponse, setOwnerResponse] = useState('');

  useEffect(() => {
    fetchClaimDetails();
  }, [params.id]);

  const fetchClaimDetails = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClaim(data.data);
      }
    } catch (error) {
      console.error('Error fetching claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this claim? This confirms that this person has found your item.')) {
      return;
    }

    setProcessing(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/${params.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response: ownerResponse || 'Claim approved. Thank you for finding my item!',
        }),
      });

      if (response.ok) {
        alert('✅ Claim approved! You can now arrange to meet and verify the item.');
        fetchClaimDetails();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to approve claim'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    setProcessing(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/${params.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response: reason || 'This claim does not match my lost item.',
        }),
      });

      if (response.ok) {
        alert('Claim rejected.');
        router.push('/profile?tab=claims');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to reject claim'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReleaseReward = async () => {
    if (!confirm(`Are you sure you want to release ${claim?.rewardAmount} coins to ${claim?.claimer.displayName}? This action cannot be undone.`)) {
      return;
    }

    setProcessing(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/${params.id}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert(`🎉 Reward of ${claim?.rewardAmount} coins released successfully! Thank you for using LostCity.`);
        fetchClaimDetails();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to release reward'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medieval-gold mx-auto mb-4"></div>
          <p className="text-medieval-beige">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="fantasy-card max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="fantasy-title text-xl mb-2">Claim Not Found</h2>
            <p className="text-medieval-beige mb-4">The claim you're looking for doesn't exist.</p>
            <Link href="/profile?tab=claims">
              <Button className="fantasy-button">View All Claims</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === claim.lostReport.reportedBy.clerkId;

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="fantasy-card max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="fantasy-title text-xl mb-2">Access Denied</h2>
            <p className="text-medieval-beige mb-4">You don't have permission to view this claim.</p>
            <Link href="/">
              <Button className="fantasy-button">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto px-4">
      {/* Back Button */}
      <Link href="/profile?tab=claims">
        <Button className="bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO CLAIMS</span>
        </Button>
      </Link>

      {/* Status Banner */}
      <Card className={`fantasy-card ${
        claim.status === 'APPROVED' ? 'bg-blue-900/20 border-blue-600' :
        claim.status === 'REJECTED' ? 'bg-red-900/20 border-red-600' :
        claim.status === 'COMPLETED' ? 'bg-green-900/20 border-green-600' :
        'bg-yellow-900/20 border-yellow-600'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {claim.status === 'APPROVED' && <CheckCircle className="w-6 h-6 text-blue-400" />}
              {claim.status === 'REJECTED' && <XCircle className="w-6 h-6 text-red-400" />}
              {claim.status === 'COMPLETED' && <CheckCircle className="w-6 h-6 text-green-400" />}
              {claim.status === 'PENDING' && <AlertCircle className="w-6 h-6 text-yellow-400" />}
              <div>
                <p className="text-lg font-bold" style={{color: 
                  claim.status === 'APPROVED' ? '#60a5fa' :
                  claim.status === 'REJECTED' ? '#f87171' :
                  claim.status === 'COMPLETED' ? '#4ade80' :
                  '#fbbf24'
                }}>
                  {claim.status === 'APPROVED' ? 'CLAIM APPROVED' :
                   claim.status === 'REJECTED' ? 'CLAIM REJECTED' :
                   claim.status === 'COMPLETED' ? 'REWARD RELEASED' :
                   'PENDING REVIEW'}
                </p>
                <p className="text-xs text-medieval-beige/70">
                  {claim.status === 'PENDING' && 'Review this claim and decide if this is your item'}
                  {claim.status === 'APPROVED' && !claim.rewardPaid && 'Meet with the finder to verify and collect your item'}
                  {claim.status === 'COMPLETED' && 'Thank you for using LostCity!'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Finder Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Finder Profile Card */}
          <Card className="fantasy-card bg-medieval-gold/5">
            <CardContent className="p-6 space-y-4">
              <h2 className="fantasy-title text-lg flex items-center space-x-2">
                <User className="w-5 h-5 text-medieval-gold" />
                <span>FINDER DETAILS</span>
              </h2>

              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="w-24 h-24 border-4 border-medieval-gold">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${claim.claimer.displayName}`} />
                  <AvatarFallback className="text-2xl">{claim.claimer.displayName[0]}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-medieval-gold font-bold text-xl">{claim.claimer.displayName}</p>
                  <p className="text-medieval-beige/70 text-sm">{claim.claimer.email}</p>
                  {claim.claimer.phone && (
                    <p className="text-medieval-beige/70 text-sm">📞 {claim.claimer.phone}</p>
                  )}
                </div>

                <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t-2 border-medieval-gold/30">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-medieval-gold">{claim.claimer.score || 0}</p>
                    <p className="text-xs text-medieval-beige/70">Reputation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-medieval-gold">{claim.claimer.itemsReturnedCount || 0}</p>
                    <p className="text-xs text-medieval-beige/70">Items Returned</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reward Amount */}
          <Card className="fantasy-card bg-medieval-gold/10">
            <CardContent className="p-6 text-center">
              <p className="text-medieval-beige/80 text-sm mb-2">Reward Amount</p>
              <div className="flex items-center justify-center space-x-2">
                <Coins className="w-8 h-8 text-medieval-gold" />
                <span className="text-4xl font-bold text-medieval-gold">{claim.rewardAmount}</span>
              </div>
              <p className="text-xs text-medieval-beige/60 mt-2">coins</p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Claim Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lost Item Info */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="fantasy-title text-lg">YOUR LOST ITEM</h2>
              
              <div className="flex items-start space-x-4">
                {claim.lostReport.images && claim.lostReport.images.length > 0 && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-medieval-gold/30 flex-shrink-0">
                    <Image 
                      src={claim.lostReport.images[0]} 
                      alt={claim.lostReport.itemName} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-medieval-gold font-bold text-xl mb-2">{claim.lostReport.itemName}</h3>
                  <p className="text-medieval-beige/80 text-sm mb-3">{claim.lostReport.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-medieval-beige/70">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{claim.lostReport.lostLocation}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(claim.lostReport.lostDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finder's Message */}
          <Card className="fantasy-card bg-medieval-brown-light border-l-4 border-yellow-600">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
                <h2 className="fantasy-title text-lg text-yellow-600">MESSAGE FROM FINDER</h2>
              </div>
              <div className="bg-medieval-brown p-4 rounded-lg">
                <p className="text-medieval-beige leading-relaxed whitespace-pre-wrap">
                  {claim.claimerMessage || 'No message provided'}
                </p>
              </div>
              <p className="text-xs text-medieval-beige/60">
                Sent on {new Date(claim.createdAt).toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </CardContent>
          </Card>

          {/* Found Report (if attached) */}
          {claim.foundReport && (
            <Card className="fantasy-card bg-medieval-brown-light border-l-4 border-medieval-gold">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-6 h-6 text-medieval-gold" />
                  <h2 className="fantasy-title text-lg text-medieval-gold">FOUND REPORT DETAILS</h2>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-medieval-gold font-bold text-lg">{claim.foundReport.itemName}</p>
                    <p className="text-medieval-beige/80 text-sm mt-1">{claim.foundReport.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-medieval-gold font-semibold">Found Location:</p>
                      <p className="text-medieval-beige/80">{claim.foundReport.foundLocation}</p>
                    </div>
                    <div>
                      <p className="text-medieval-gold font-semibold">Found Date:</p>
                      <p className="text-medieval-beige/80">{new Date(claim.foundReport.foundDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-medieval-gold font-semibold">Condition:</p>
                      <p className="text-medieval-beige/80">{claim.foundReport.foundCondition}</p>
                    </div>
                  </div>

                  {claim.foundReport.images && claim.foundReport.images.length > 0 && (
                    <div>
                      <p className="text-medieval-gold font-semibold mb-2 text-sm">Photos:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {claim.foundReport.images.map((img, idx) => (
                          <div key={idx} className="relative h-24 rounded overflow-hidden border-2 border-medieval-gold/30">
                            <Image src={img} alt={`Found item ${idx + 1}`} fill className="object-cover" unoptimized />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {claim.status === 'PENDING' && (
            <Card className="fantasy-card">
              <CardContent className="p-6 space-y-4">
                <h3 className="fantasy-title text-lg">YOUR RESPONSE</h3>
                
                <textarea
                  placeholder="Add a message to the finder (optional)..."
                  value={ownerResponse}
                  onChange={(e) => setOwnerResponse(e.target.value)}
                  className="w-full bg-medieval-brown-light border-2 border-medieval-gold/30 rounded p-3 text-medieval-beige"
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleReject}
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    {processing ? 'Processing...' : 'Reject Claim'}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {processing ? 'Processing...' : 'Approve Claim'}
                  </Button>
                </div>

                <p className="text-xs text-medieval-beige/60 text-center">
                  Approving will confirm this person has found your item. You can release the reward after verifying in person.
                </p>
              </CardContent>
            </Card>
          )}

          {claim.status === 'APPROVED' && !claim.rewardPaid && (
            <Card className="fantasy-card bg-green-900/10 border-2 border-green-600">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-green-400 font-bold text-lg mb-2">Claim Approved!</h3>
                    <p className="text-medieval-beige/80 text-sm mb-4">
                      You've approved this claim. Contact {claim.claimer.displayName} at {claim.claimer.email} to arrange a safe meeting location. 
                      After verifying the item in person, click below to release the reward.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleReleaseReward}
                  disabled={processing}
                  className="w-full fantasy-button bg-medieval-gold text-medieval-brown hover:bg-medieval-gold/90 font-bold py-4 text-lg"
                >
                  <Coins className="w-6 h-6 mr-2" />
                  {processing ? 'Processing...' : `Release ${claim.rewardAmount} Coins Reward`}
                </Button>

                <p className="text-xs text-medieval-beige/60 text-center">
                  ⚠️ Only release the reward after you've verified and received your item. This action cannot be undone.
                </p>
              </CardContent>
            </Card>
          )}

          {claim.status === 'COMPLETED' && (
            <Card className="fantasy-card bg-green-900/20 border-2 border-green-600">
              <CardContent className="p-6 text-center space-y-3">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                <h3 className="text-green-400 font-bold text-xl">Reward Released! 🎉</h3>
                <p className="text-medieval-beige/80">
                  You've successfully released {claim.rewardAmount} coins to {claim.claimer.displayName}. 
                  Thank you for using LostCity!
                </p>
                <div className="pt-4">
                  <Link href="/">
                    <Button className="fantasy-button">Return Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
