'use client';

import { ArrowLeft, MapPin, Calendar, User, Coins, MessageSquare, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ItemDetailPage() {
  const params = useParams();
  
  // Mock data - in real app, fetch based on params.id
  const item = {
    id: 1,
    title: "Brown Leather Wallet",
    description: "Found this brown leather wallet near the fountain in Central Park. It contains some credit cards and loyalty cards, but no ID or driver's license. The wallet appears to be well-used with a distinctive scratch on the back. There's also a receipt from a local coffee shop dated last week.",
    location: "Central Park, near the main fountain",
    exactLocation: "40.7829° N, 73.9654° W",
    date: "14 Dec 2025",
    time: "3:30 PM",
    reward: 500,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop",
    finder: {
      name: "KnightFinder",
      level: 8,
      itemsFound: 45,
      rating: 4.8,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KnightFinder"
    },
    responses: 3,
    status: "Active",
    distinguishingFeatures: [
      "Brown leather material",
      "Scratch on back side",
      "Coffee shop receipt inside",
      "Multiple credit cards",
      "No ID or driver's license"
    ]
  };

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
              <p className="text-medieval-gold font-bold">QUEST ACTIVE</p>
              <p className="text-xs text-medieval-beige/70">This item is waiting to be claimed</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-medieval-gold font-bold text-xl flex items-center space-x-1">
              <Coins className="w-5 h-5" />
              <span>{item.reward}</span>
            </p>
            <p className="text-xs text-medieval-beige/70">Reward</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card className="fantasy-card overflow-hidden">
            <div className="relative h-96 w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </Card>

          {/* Item Details */}
          <Card className="fantasy-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <h1 className="fantasy-title text-3xl mb-2">
                  {item.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-medieval-beige/70">
                  <span className="bg-medieval-gold text-medieval-brown px-3 py-1 rounded-full font-semibold">
                    {item.category}
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>42 views</span>
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

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
                <div>
                  <div className="flex items-center space-x-2 text-medieval-gold mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">Location Found</span>
                  </div>
                  <p className="text-medieval-beige text-sm">{item.location}</p>
                  <p className="text-medieval-beige/60 text-xs mt-1">{item.exactLocation}</p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 text-medieval-gold mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">When Found</span>
                  </div>
                  <p className="text-medieval-beige text-sm">{item.date}</p>
                  <p className="text-medieval-beige/60 text-xs mt-1">{item.time}</p>
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
                  <AvatarImage src={item.finder.avatar} alt={item.finder.name} />
                  <AvatarFallback>KF</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <p className="text-medieval-gold font-bold text-lg">{item.finder.name}</p>
                  <p className="text-medieval-beige/70 text-sm">Level {item.finder.level} Hero</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-medieval-gold/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-medieval-gold">{item.finder.itemsFound}</p>
                  <p className="text-xs text-medieval-beige/70">Items Found</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-medieval-gold">{item.finder.rating}⭐</p>
                  <p className="text-xs text-medieval-beige/70">Rating</p>
                </div>
              </div>

              <Button className="fantasy-button w-full">
                <User className="w-4 h-4 mr-2" />
                VIEW PROFILE
              </Button>
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card className="fantasy-card bg-medieval-gold/10">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-medieval-beige/80 text-sm mb-2">Reward Amount</p>
                <p className="text-4xl font-bold text-medieval-gold flex items-center justify-center space-x-2">
                  <Coins className="w-8 h-8" />
                  <span>{item.reward}</span>
                </p>
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
