'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { ArrowLeft, MapPin, Calendar, User, Coins, MessageSquare, Eye, CheckCircle, AlertCircle, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Claim {
  id: string;
  claimer: {
    id: string;
    displayName: string;
    email: string;
  };
  foundReport?: {
    id: string;
    itemName: string;
    description: string;
    images: string[];
  };
  claimerMessage: string;
  status: string;
  rewardAmount: number;
  rewardPaid: boolean;
  createdAt: string;
}

interface LostItem {
  id: string;
  itemName: string;
  description: string;
  category: string;
  lostLocation: string;
  lostDate: string;
  rewardAmount: number;
  images: string[];
  distinguishingFeatures: string[];
  status: string;
  reportedBy: {
    id: string;
    displayName: string;
    email: string;
    itemsReturnedCount: number;
  };
  createdAt: string;
}

export default function LostItemDetailPage() {
  const params = useParams();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [item, setItem] = useState<LostItem | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingClaim, setProcessingClaim] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    fetchItemDetails();
    fetchClaims();
  }, [params.id]);

  const fetchItemDetails = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lost-reports/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItem(data.data);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/lost-report/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClaims(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const handleApproveClaim = async (claimId: string) => {
    if (!confirm('Are you sure you want to approve this claim? This will mark the item as matched.')) {
      return;
    }

    setProcessingClaim(claimId);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/${claimId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response: responseMessage[claimId] || 'Claim approved',
        }),
      });

      if (response.ok) {
        alert('Claim approved successfully! You can now complete the exchange and release the reward.');
        fetchClaims();
        fetchItemDetails();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to approve claim'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessingClaim(null);
    }
  };

  const handleRejectClaim = async (claimId: string) => {
    if (!confirm('Are you sure you want to reject this claim?')) {
      return;
    }

    setProcessingClaim(claimId);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/${claimId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response: responseMessage[claimId] || 'Claim rejected',
        }),
      });

      if (response.ok) {
        alert('Claim rejected.');
        fetchClaims();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to reject claim'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessingClaim(null);
    }
  };

  const handleCompleteAndPayReward = async (claimId: string) => {
    if (!confirm('Have you received your item? This will release the reward to the finder. This action cannot be undone.')) {
      return;
    }

    setProcessingClaim(claimId);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claims/${claimId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('🎉 Reward released successfully! Thank you for using LostCity.');
        fetchClaims();
        fetchItemDetails();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to complete claim'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessingClaim(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medieval-gold mx-auto mb-4"></div>
          <p className="text-medieval-beige">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="fantasy-card max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-medieval-gold mx-auto mb-4" />
            <h2 className="fantasy-title text-xl mb-2">Item Not Found</h2>
            <p className="text-medieval-beige mb-4">The item you're looking for doesn't exist.</p>
            <Link href="/browse-lost">
              <Button className="fantasy-button">Browse Lost Items</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === item.reportedBy.id;
  const pendingClaims = claims.filter(c => c.status === 'PENDING');
  const approvedClaim = claims.find(c => c.status === 'APPROVED');

  return (
    <div className="space-y-6 py-6">
      {/* Back Button */}
      <Link href="/browse-lost">
        <Button className="bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO LOST ITEMS</span>
        </Button>
      </Link>

      {/* Item Header */}
      <Card className="fantasy-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-red-900/30 border-2 border-red-600 flex items-center justify-center">
                <span className="text-2xl">😢</span>
              </div>
              <div>
                <h1 className="fantasy-title text-2xl md:text-3xl">
                  {item.itemName}
                </h1>
                <p className="text-medieval-beige/70 text-sm mt-1">
                  Lost Item • Posted by <span className="text-medieval-gold">{item.reportedBy.displayName}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end space-x-2 bg-medieval-gold text-medieval-brown px-4 py-2 rounded-full font-bold">
                <Coins className="w-5 h-5" />
                <span className="text-lg">{item.rewardAmount}</span>
              </div>
              <p className="text-xs text-medieval-beige/60 mt-1">Reward Offered</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Item Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card className="fantasy-card overflow-hidden">
            <div className="relative h-96 w-full">
              <Image
                src={item.images?.[0] || "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop"}
                alt={item.itemName}
                fill
                className="object-cover"
                unoptimized
              />
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold border-2 ${
                item.status === 'MATCHED' ? 'bg-blue-900/90 border-blue-600 text-blue-400' :
                item.status === 'CLOSED' ? 'bg-gray-900/90 border-gray-600 text-gray-400' :
                'bg-green-900/90 border-green-600 text-green-400'
              }`}>
                {item.status}
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="fantasy-title text-xl">DESCRIPTION</h2>
              <p className="text-medieval-beige leading-relaxed">
                {item.description}
              </p>

              {item.distinguishingFeatures && item.distinguishingFeatures.length > 0 && (
                <div className="pt-4 border-t-2 border-medieval-gold/30">
                  <h3 className="text-medieval-gold font-semibold mb-3">
                    DISTINGUISHING FEATURES
                  </h3>
                  <ul className="space-y-2">
                    {item.distinguishingFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-medieval-beige/80">
                        <CheckCircle className="w-4 h-4 text-medieval-gold flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Time */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="fantasy-title text-xl">LOCATION & TIME</h2>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-medieval-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-medieval-beige font-semibold">{item.lostLocation}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-medieval-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-medieval-beige font-semibold">
                      {new Date(item.lostDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-medieval-brown-light border-2 border-medieval-gold/30 rounded-lg p-8 text-center">
                <MapPin className="w-12 h-12 text-medieval-gold/50 mx-auto mb-2" />
                <p className="text-medieval-beige/60 text-sm">Interactive Map Coming Soon</p>
              </div>
            </CardContent>
          </Card>

          {/* Claims Section (Only visible to owner) */}
          {isOwner && claims.length > 0 && (
            <Card className="fantasy-card">
              <CardContent className="p-6 space-y-4">
                <h2 className="fantasy-title text-xl">CLAIMS ({claims.length})</h2>
                
                {approvedClaim && (
                  <div className="bg-blue-900/20 border-2 border-blue-600 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-blue-400 font-bold">✅ Approved Claim</h3>
                      <span className="text-xs text-blue-400/70">
                        Approved {new Date(approvedClaim.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-start space-x-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{approvedClaim.claimer.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-medieval-gold font-semibold">{approvedClaim.claimer.displayName}</p>
                        <p className="text-medieval-beige/80 text-sm">{approvedClaim.claimerMessage}</p>
                      </div>
                    </div>

                    {!approvedClaim.rewardPaid && (
                      <Button
                        onClick={() => handleCompleteAndPayReward(approvedClaim.id)}
                        disabled={processingClaim === approvedClaim.id}
                        className="w-full fantasy-button mt-3"
                      >
                        {processingClaim === approvedClaim.id ? 'Processing...' : '💰 Complete & Release Reward'}
                      </Button>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {pendingClaims.map((claim) => (
                    <div key={claim.id} className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{claim.claimer.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-medieval-gold font-semibold">{claim.claimer.displayName}</p>
                            <p className="text-medieval-beige/60 text-xs">
                              {new Date(claim.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs bg-yellow-900/30 border border-yellow-600 text-yellow-400 px-2 py-1 rounded">
                          PENDING
                        </span>
                      </div>

                      <p className="text-medieval-beige/80 text-sm mb-3">
                        {claim.claimerMessage || 'No message provided'}
                      </p>

                      {claim.foundReport && (
                        <div className="bg-medieval-brown-light p-3 rounded mb-3">
                          <p className="text-xs text-medieval-gold font-semibold mb-1">Found Report Attached:</p>
                          <p className="text-xs text-medieval-beige/80">{claim.foundReport.description}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <textarea
                          placeholder="Add a response message (optional)..."
                          value={responseMessage[claim.id] || ''}
                          onChange={(e) => setResponseMessage({ ...responseMessage, [claim.id]: e.target.value })}
                          className="w-full bg-medieval-brown-light border-2 border-medieval-gold/30 rounded p-2 text-medieval-beige text-sm"
                          rows={2}
                        />
                        
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleApproveClaim(claim.id)}
                            disabled={processingClaim === claim.id}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            {processingClaim === claim.id ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button
                            onClick={() => handleRejectClaim(claim.id)}
                            disabled={processingClaim === claim.id}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approved Claim - Waiting for Reward Release */}
          {isOwner && approvedClaim && !approvedClaim.rewardPaid && (
            <Card className="fantasy-card bg-green-900/20 border-2 border-green-600">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="fantasy-title text-lg text-green-400">✓ CLAIM APPROVED</h2>
                  <span className="text-xs bg-green-900/50 border border-green-600 text-green-400 px-3 py-1 rounded-full font-bold">
                    READY TO RELEASE
                  </span>
                </div>

                <div className="bg-medieval-brown-light p-4 rounded-lg space-y-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{approvedClaim.claimer.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-medieval-gold font-semibold">{approvedClaim.claimer.displayName}</p>
                      <p className="text-medieval-beige/60 text-xs">{approvedClaim.claimer.email}</p>
                      <p className="text-medieval-beige/80 text-sm mt-2">{approvedClaim.claimerMessage}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-medieval-gold/10 border-2 border-medieval-gold rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-medieval-beige font-semibold">Reward Amount:</span>
                    <div className="flex items-center space-x-2 text-medieval-gold font-bold text-xl">
                      <Coins className="w-6 h-6" />
                      <span>{approvedClaim.rewardAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-medieval-beige/70">
                    This will be transferred from your wallet to the finder.
                  </p>
                </div>

                <div className="bg-blue-900/20 border-2 border-blue-600 rounded-lg p-4">
                  <p className="text-xs text-blue-400">
                    <span className="font-bold">Important:</span> Only release the reward after you have physically received your item back from the finder.
                  </p>
                </div>

                <Button
                  onClick={() => handleCompleteAndPayReward(approvedClaim.id)}
                  disabled={processingClaim === approvedClaim.id}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-6"
                >
                  {processingClaim === approvedClaim.id ? (
                    'Processing...'
                  ) : (
                    <>
                      <Coins className="w-5 h-5 mr-2" />
                      VERIFY & RELEASE REWARD
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Owner & Actions */}
        <div className="space-y-6">
          {/* Owner Info */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="fantasy-title text-lg">ITEM OWNER</h2>
              
              <div className="flex items-center space-x-3">
                <Avatar className="w-16 h-16 gold-border">
                  <AvatarFallback>{item.reportedBy.displayName[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-medieval-gold font-bold text-lg">
                    {item.reportedBy.displayName}
                  </h3>
                  <p className="text-medieval-beige/70 text-sm">
                    LostCity Member
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4 border-t-2 border-medieval-gold/30">
                <div className="text-center p-3 bg-medieval-brown rounded-lg">
                  <p className="text-2xl font-bold text-medieval-gold">
                    {item.reportedBy.itemsReturnedCount || 0}
                  </p>
                  <p className="text-xs text-medieval-beige/70 mt-1">Items Returned</p>
                </div>
              </div>

              <Link href={`/profile`}>
                <Button className="w-full bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold">
                  VIEW PROFILE
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Action Card - Only show to non-owners */}
          {!isOwner && item.status === 'OPEN' && (
            <Card className="fantasy-card bg-medieval-gold/10">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-medieval-gold font-bold text-lg mb-2">
                    Found This Item?
                  </p>
                  <p className="text-sm text-medieval-beige/80 mb-4">
                    Help reunite the owner with their lost item and earn {item.rewardAmount} coins!
                  </p>
                </div>

                <Link href={`/found-item/claim/${item.id}`}>
                  <Button className="fantasy-button w-full flex items-center justify-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>CLAIM THIS ITEM</span>
                  </Button>
                </Link>

                <Link href="/report-found">
                  <Button className="w-full bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold">
                    REPORT AS FOUND
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Stats Card */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-3">
              <h3 className="fantasy-title text-sm">QUEST STATS</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-medieval-gold" />
                    <span className="text-medieval-beige/70">Claims</span>
                  </div>
                  <span className="text-medieval-gold font-bold">{claims.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-medieval-gold" />
                    <span className="text-medieval-beige/70">Posted</span>
                  </div>
                  <span className="text-medieval-gold font-bold">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Notice */}
          <Card className="fantasy-card bg-medieval-gold/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-medieval-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-medieval-beige/70">
                    <span className="font-bold text-medieval-gold">Safety First:</span> Always meet in public places and verify ownership before handing over items.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
