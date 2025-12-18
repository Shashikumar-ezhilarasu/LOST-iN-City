'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, MapPin, Calendar, User, Coins, MessageSquare, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface FoundItem {
  id: string;
  itemName: string;
  description: string;
  category: string;
  foundLocation: string;
  foundDate: string;
  foundCondition: string;
  images: string[];
  distinguishingFeatures: string[];
  status: string;
  reportedBy: {
    id: string;
    displayName: string;
    email: string;
    itemsFoundCount: number;
  };
  createdAt: string;
}

export default function ItemDetailPage() {
  const params = useParams();
  const { getToken } = useAuth();
  const [item, setItem] = useState<FoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchItemDetails();
  }, [params.id]);

  const fetchItemDetails = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/found-reports/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItem(data.data);
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-medieval-gold">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Item not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Back Button */}
      <Link href="/browse-found">
        <Button className="bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO QUESTS</span>
        </Button>
      </Link>

      {/* Status Banner */}
      <div className="fantasy-card p-4 bg-medieval-gold/10 border-l-4 border-medieval-gold">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-medieval-gold font-bold">{item.status}</p>
              <p className="text-xs text-medieval-beige/70">This item is waiting to be claimed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card className="fantasy-card overflow-hidden">
            <div className="relative h-96 w-full">
              {item.images && item.images.length > 0 ? (
                <Image
                  src={item.images[0]}
                  alt={item.itemName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-medieval-brown-light">
                  <span className="text-medieval-beige/50">No image available</span>
                </div>
              )}
            </div>
          </Card>

          {/* Item Details */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <h1 className="fantasy-title text-3xl mb-2">
                  {item.itemName}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-medieval-beige/70">
                  <span className="bg-medieval-gold text-medieval-brown px-3 py-1 rounded-full font-semibold">
                    {item.category}
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{item.responses} responses</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="fantasy-title text-lg mb-3">DESCRIPTION</h3>
                <p className="text-medieval-beige leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Distinguishing Features */}
              {item.distinguishingFeatures && item.distinguishingFeatures.length > 0 && (
                <div>
                  <h3 className="fantasy-title text-lg mb-3">DISTINGUISHING FEATURES</h3>
                  <ul className="space-y-2">
                    {item.distinguishingFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-medieval-beige">
                        <CheckCircle className="w-4 h-4 text-medieval-gold mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
                <div>
                  <div className="flex items-center space-x-2 text-medieval-gold mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">Location Found</span>
                  </div>
                  <p className="text-medieval-beige text-sm">{item.foundLocation}</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 text-medieval-gold mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">When Found</span>
                  </div>
                  <p className="text-medieval-beige text-sm">
                    {new Date(item.foundDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Verification Notice */}
              <div className="bg-medieval-gold/5 border-l-4 border-medieval-gold p-4 rounded">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-medieval-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-medieval-gold font-semibold text-sm mb-1">VERIFICATION REQUIRED</p>
                    <p className="text-medieval-beige/80 text-xs">
                      To claim this item, you'll need to provide proof of ownership and answer verification questions from the finder.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Finder Profile */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="fantasy-title text-lg mb-4">FOUND BY</h3>
              
              <div className="flex items-center space-x-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.reportedBy.displayName}`} alt={item.reportedBy.displayName} />
                  <AvatarFallback>{item.reportedBy.displayName[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="text-medieval-gold font-bold text-lg">{item.reportedBy.displayName}</p>
                  <p className="text-medieval-beige/70 text-sm">Hero</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-3 border-t-2 border-medieval-gold/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-medieval-gold">{item.reportedBy.itemsFoundCount || 0}</p>
                  <p className="text-xs text-medieval-beige/70">Items Found</p>
                </div>
              </div>

              <Link href={`/profile`}>
                <Button className="fantasy-button w-full">
                  <User className="w-4 h-4 mr-2" />
                  VIEW PROFILE
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card className="fantasy-card bg-medieval-gold/10">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-medieval-beige/80 text-sm mb-2">This is a Found Item</p>
                <p className="text-medieval-gold font-bold">Contact the finder to claim</p>
              </div>

              <Button className="fantasy-button w-full py-6 text-lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                CLAIM THIS ITEM
              </Button>

              <p className="text-xs text-medieval-beige/60 text-center">
                By claiming, you agree to verify ownership and meet at a safe public location
              </p>
            </CardContent>
          </Card>

          {/* Share Card */}
          <Card className="fantasy-card">
            <CardContent className="p-6">
              <h3 className="fantasy-title text-sm mb-3">SHARE QUEST</h3>
              <p className="text-xs text-medieval-beige/70 mb-3">
                Help spread the word about this lost item
              </p>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-medieval-brown-light border-2 border-medieval-gold/30 hover:border-medieval-gold text-medieval-beige py-2 text-sm">
                  Facebook
                </Button>
                <Button className="flex-1 bg-medieval-brown-light border-2 border-medieval-gold/30 hover:border-medieval-gold text-medieval-beige py-2 text-sm">
                  Twitter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
