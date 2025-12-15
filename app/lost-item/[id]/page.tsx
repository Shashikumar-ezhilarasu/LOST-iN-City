'use client';

import { ArrowLeft, MapPin, Calendar, User, Coins, MessageSquare, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LostItemDetailPage() {
  const params = useParams();
  
  // Mock data - in real app, fetch based on params.id
  const item = {
    id: 1,
    title: "Brown Leather Wallet",
    description: "Lost my brown leather wallet near the fountain in Central Park. It contains credit cards and some loyalty cards, but no ID. The wallet has a distinctive scratch on the back. Very important to me as it was a gift.",
    location: "Central Park, near the main fountain",
    exactLocation: "40.7829° N, 73.9654° W",
    dateLost: "14 Dec 2025",
    timeLost: "Around 3:30 PM",
    reward: 500,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop",
    owner: {
      name: "AdventureQueen",
      level: 12,
      itemsLost: 3,
      itemsReturned: 2,
      rating: 4.9,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AdventureQueen"
    },
    responses: 3,
    status: "Active",
    distinguishingFeatures: [
      "Brown leather material",
      "Scratch on back side",
      "Gift from family member",
      "Multiple credit cards inside",
      "No ID or driver's license"
    ]
  };

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
                  {item.title}
                </h1>
                <p className="text-medieval-beige/70 text-sm mt-1">
                  Lost Item • Posted by <span className="text-medieval-gold">{item.owner.name}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end space-x-2 bg-medieval-gold text-medieval-brown px-4 py-2 rounded-full font-bold">
                <Coins className="w-5 h-5" />
                <span className="text-lg">{item.reward}</span>
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
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-4 right-4 bg-green-900/90 border-2 border-green-600 px-3 py-1 rounded-full text-sm font-bold text-green-400">
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
                    <p className="text-medieval-beige font-semibold">{item.location}</p>
                    <p className="text-xs text-medieval-beige/60 mt-1">{item.exactLocation}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-medieval-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-medieval-beige font-semibold">
                      {item.dateLost}
                    </p>
                    <p className="text-xs text-medieval-beige/60 mt-1">{item.timeLost}</p>
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
        </div>

        {/* Right Column - Owner & Actions */}
        <div className="space-y-6">
          {/* Owner Info */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="fantasy-title text-lg">ITEM OWNER</h2>
              
              <div className="flex items-center space-x-3">
                <Avatar className="w-16 h-16 gold-border">
                  <AvatarImage src={item.owner.avatar} />
                  <AvatarFallback>{item.owner.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-medieval-gold font-bold text-lg">
                    {item.owner.name}
                  </h3>
                  <p className="text-medieval-beige/70 text-sm">
                    Level {item.owner.level} Adventurer
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-medieval-gold/30">
                <div className="text-center p-3 bg-medieval-brown rounded-lg">
                  <p className="text-2xl font-bold text-medieval-gold">
                    {item.owner.itemsReturned}
                  </p>
                  <p className="text-xs text-medieval-beige/70 mt-1">Items Returned</p>
                </div>
                
                <div className="text-center p-3 bg-medieval-brown rounded-lg">
                  <p className="text-2xl font-bold text-medieval-gold">
                    {item.owner.rating}⭐
                  </p>
                  <p className="text-xs text-medieval-beige/70 mt-1">Rating</p>
                </div>
              </div>

              <Link href="/profile">
                <Button className="w-full bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold">
                  VIEW PROFILE
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card className="fantasy-card bg-medieval-gold/10">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-medieval-gold font-bold text-lg mb-2">
                  Found This Item?
                </p>
                <p className="text-sm text-medieval-beige/80 mb-4">
                  Help reunite the owner with their lost item and earn the reward!
                </p>
              </div>

              <Button className="fantasy-button w-full flex items-center justify-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>I FOUND THIS!</span>
              </Button>

              <Link href="/report-found">
                <Button className="w-full bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold">
                  REPORT AS FOUND
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-3">
              <h3 className="fantasy-title text-sm">QUEST STATS</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-medieval-gold" />
                    <span className="text-medieval-beige/70">Views</span>
                  </div>
                  <span className="text-medieval-gold font-bold">247</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-medieval-gold" />
                    <span className="text-medieval-beige/70">Responses</span>
                  </div>
                  <span className="text-medieval-gold font-bold">{item.responses}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-medieval-gold" />
                    <span className="text-medieval-beige/70">Posted</span>
                  </div>
                  <span className="text-medieval-gold font-bold">1 day ago</span>
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
