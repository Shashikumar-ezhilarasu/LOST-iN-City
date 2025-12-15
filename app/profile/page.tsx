'use client';

import { User, Award, Target, TrendingUp, MapPin, Shield, Heart, Crown, Medal, Star, Coins, Edit, Settings, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const userProfile = {
    name: "You",
    username: "@heroicfinder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    level: 1,
    currentXP: 1200,
    nextLevelXP: 2000,
    totalCoins: 12000,
    joinDate: "Dec 2025",
    bio: "Passionate about helping people reunite with their lost items. Every lost treasure has a story, and I'm here to help complete those stories!",
    stats: {
      itemsFound: 8,
      itemsReturned: 5,
      totalRewardsEarned: 6500,
      helpfulnessScore: 87,
      responseRate: 92,
      averageResponseTime: "2 hours",
      successRate: 75,
    },
    badges: [
      { id: 1, name: "First Find", description: "Found your first item", icon: "🔍", earned: true, rarity: "common" },
      { id: 2, name: "Good Samaritan", description: "Helped 5 people find their items", icon: "❤️", earned: true, rarity: "rare" },
      { id: 3, name: "Quick Responder", description: "Respond within 1 hour", icon: "⚡", earned: true, rarity: "common" },
      { id: 4, name: "Treasure Hunter", description: "Found items worth 5000+ coins", icon: "💰", earned: true, rarity: "rare" },
      { id: 5, name: "Community Hero", description: "Helped 10 people", icon: "🏆", earned: false, rarity: "epic" },
      { id: 6, name: "Legend", description: "Reached Level 10", icon: "👑", earned: false, rarity: "legendary" },
      { id: 7, name: "Master Finder", description: "Found 50 items", icon: "⭐", earned: false, rarity: "epic" },
      { id: 8, name: "Trust Builder", description: "100% success rate over 20 items", icon: "🛡️", earned: false, rarity: "legendary" },
    ],
    recentActivity: [
      { id: 1, type: "found", item: "Brown Wallet", reward: 500, date: "2 days ago", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop" },
      { id: 2, type: "returned", item: "Gold Necklace", reward: 2000, date: "5 days ago", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop" },
      { id: 3, type: "found", item: "Blue Backpack", reward: 800, date: "1 week ago", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" },
    ],
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-medieval-beige/50";
      case "rare": return "border-blue-400";
      case "epic": return "border-purple-500";
      case "legendary": return "border-medieval-gold animate-pulse";
      default: return "border-medieval-beige/50";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-medieval-brown-light";
      case "rare": return "bg-blue-900/30";
      case "epic": return "bg-purple-900/30";
      case "legendary": return "bg-medieval-gold/20";
      default: return "bg-medieval-brown-light";
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Profile Header */}
      <Card className="fantasy-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-medieval-gold">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="text-2xl">YOU</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-medieval-gold text-medieval-brown w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-medieval-brown">
                  {userProfile.level}
                </div>
              </div>

              <div>
                <h1 className="fantasy-title text-2xl md:text-3xl">
                  {userProfile.name}
                </h1>
                <p className="text-medieval-beige/70 text-sm mb-2">{userProfile.username}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-medieval-gold font-semibold flex items-center space-x-1">
                    <Coins className="w-4 h-4" />
                    <span>{userProfile.totalCoins.toLocaleString()}</span>
                  </span>
                  <span className="text-medieval-beige/70">
                    Joined {userProfile.joinDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button className="fantasy-button flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>EDIT</span>
              </Button>
              <Button className="bg-medieval-brown-light border-2 border-medieval-gold/50 text-medieval-beige hover:border-medieval-gold flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>SHARE</span>
              </Button>
              <Button className="bg-medieval-brown-light border-2 border-medieval-gold/50 text-medieval-beige hover:border-medieval-gold">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <p className="text-medieval-beige leading-relaxed">
              {userProfile.bio}
            </p>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-medieval-gold font-semibold text-sm">Level {userProfile.level} Progress</span>
              <span className="text-medieval-beige/70 text-sm">{userProfile.currentXP} / {userProfile.nextLevelXP} XP</span>
            </div>
            <Progress value={(userProfile.currentXP / userProfile.nextLevelXP) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="fantasy-card">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-medieval-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-medieval-gold">{userProfile.stats.itemsFound}</p>
            <p className="text-xs text-medieval-beige/70">Items Found</p>
          </CardContent>
        </Card>

        <Card className="fantasy-card">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-medieval-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-medieval-gold">{userProfile.stats.itemsReturned}</p>
            <p className="text-xs text-medieval-beige/70">Items Returned</p>
          </CardContent>
        </Card>

        <Card className="fantasy-card">
          <CardContent className="p-4 text-center">
            <Coins className="w-8 h-8 text-medieval-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-medieval-gold">{userProfile.stats.totalRewardsEarned}</p>
            <p className="text-xs text-medieval-beige/70">Rewards Earned</p>
          </CardContent>
        </Card>

        <Card className="fantasy-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-medieval-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-medieval-gold">{userProfile.stats.successRate}%</p>
            <p className="text-xs text-medieval-beige/70">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl flex items-center space-x-2">
            <Award className="w-6 h-6 text-medieval-gold" />
            <span>BADGES & ACHIEVEMENTS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userProfile.badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-4 rounded-lg border-4 ${getRarityColor(badge.rarity)} ${getRarityBg(badge.rarity)} ${
                  badge.earned ? '' : 'opacity-40 grayscale'
                } transition-all hover:scale-105`}
              >
                {badge.earned && (
                  <div className="absolute -top-2 -right-2 bg-medieval-gold text-medieval-brown w-6 h-6 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                )}
                <div className="text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="fantasy-title text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs text-medieval-beige/70">{badge.description}</p>
                  <p className="text-xs text-medieval-gold mt-2 capitalize">{badge.rarity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Badge Progress */}
          <div className="mt-6 bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
            <p className="text-medieval-beige/80 text-sm">
              <span className="text-medieval-gold font-bold">{userProfile.badges.filter(b => b.earned).length}</span> of {userProfile.badges.length} badges earned
            </p>
            <Progress value={(userProfile.badges.filter(b => b.earned).length / userProfile.badges.length) * 100} className="h-2 mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl flex items-center space-x-2">
            <Shield className="w-6 h-6 text-medieval-gold" />
            <span>HEROIC STATISTICS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-medieval-beige/80 text-sm">Helpfulness Score</span>
                <span className="text-medieval-gold font-bold">{userProfile.stats.helpfulnessScore}/100</span>
              </div>
              <Progress value={userProfile.stats.helpfulnessScore} className="h-2" />
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-medieval-beige/80 text-sm">Response Rate</span>
                <span className="text-medieval-gold font-bold">{userProfile.stats.responseRate}%</span>
              </div>
              <Progress value={userProfile.stats.responseRate} className="h-2" />
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between">
                <span className="text-medieval-beige/80 text-sm">Average Response Time</span>
                <span className="text-medieval-gold font-bold">{userProfile.stats.averageResponseTime}</span>
              </div>
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between">
                <span className="text-medieval-beige/80 text-sm">Success Rate</span>
                <span className="text-medieval-gold font-bold">{userProfile.stats.successRate}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Lost Items Section */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">😢</span>
              <span>MY LOST ITEMS</span>
            </div>
            <Link href="/report-lost">
              <Button className="fantasy-button text-xs px-3 py-1 h-auto">
                + Report Lost
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Lost Item 1 */}
            <div className="flex items-center space-x-3 p-3 bg-medieval-brown-light rounded-lg border-2 border-medieval-gold/30">
              <div className="w-16 h-16 bg-medieval-brown rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop" alt="Wallet" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-medieval-gold truncate">Brown Leather Wallet</h4>
                <p className="text-xs text-medieval-beige/70">Lost on Dec 14 • Reward: 500 coins</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-900/30 border border-green-600 text-green-400 text-xs rounded-full">
                  Active
                </span>
              </div>
            </div>

            {/* Lost Item 2 */}
            <div className="flex items-center space-x-3 p-3 bg-medieval-brown-light rounded-lg border-2 border-medieval-gold/30">
              <div className="w-16 h-16 bg-medieval-brown rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop" alt="Phone" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-medieval-gold truncate">iPhone 14 Pro</h4>
                <p className="text-xs text-medieval-beige/70">Lost on Dec 2 • Reward: 1,500 coins</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-900/30 border border-blue-600 text-blue-400 text-xs rounded-full">
                  Matched (2 leads)
                </span>
              </div>
            </div>

            {/* Lost Item 3 */}
            <div className="flex items-center space-x-3 p-3 bg-medieval-brown-light rounded-lg border-2 border-medieval-gold/30">
              <div className="w-16 h-16 bg-medieval-brown rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" alt="Backpack" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-medieval-gold truncate">Blue Backpack</h4>
                <p className="text-xs text-medieval-beige/70">Lost on Oct 5 • Reward: 800 coins</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-medieval-gold/30 border border-medieval-gold text-medieval-gold text-xs rounded-full">
                  Returned ✓
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Found Items Section */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">🔍</span>
              <span>MY FOUND ITEMS</span>
            </div>
            <Link href="/report-found">
              <Button className="fantasy-button text-xs px-3 py-1 h-auto">
                + Report Found
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Found Item 1 */}
            <div className="flex items-center space-x-3 p-3 bg-medieval-brown-light rounded-lg border-2 border-medieval-gold/30">
              <div className="w-16 h-16 bg-medieval-brown rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop" alt="Ring" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-medieval-gold truncate">Gold Wedding Ring</h4>
                <p className="text-xs text-medieval-beige/70">Found on Nov 18 • Potential: 2,000 coins</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-900/30 border border-blue-600 text-blue-400 text-xs rounded-full">
                  Matched
                </span>
              </div>
            </div>

            {/* Found Item 2 */}
            <div className="flex items-center space-x-3 p-3 bg-medieval-brown-light rounded-lg border-2 border-medieval-gold/30">
              <div className="w-16 h-16 bg-medieval-brown rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" alt="Watch" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-medieval-gold truncate">Silver Watch</h4>
                <p className="text-xs text-medieval-beige/70">Found on Dec 9 • Earned: 1,200 coins</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-medieval-gold/30 border border-medieval-gold text-medieval-gold text-xs rounded-full">
                  Returned ✓
                </span>
              </div>
            </div>

            {/* Found Item 3 */}
            <div className="flex items-center space-x-3 p-3 bg-medieval-brown-light rounded-lg border-2 border-medieval-gold/30">
              <div className="w-16 h-16 bg-medieval-brown rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=100&h=100&fit=crop" alt="Glasses" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-medieval-gold truncate">Prescription Glasses</h4>
                <p className="text-xs text-medieval-beige/70">Found on Dec 8 • Potential: 400 coins</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-900/30 border border-green-600 text-green-400 text-xs rounded-full">
                  Available
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-medieval-gold" />
            <span>RECENT ACTIVITY</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userProfile.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-4 bg-medieval-brown rounded-lg border-2 border-medieval-gold/30 hover:border-medieval-gold transition-all"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden gold-border flex-shrink-0">
                  <Image
                    src={activity.image}
                    alt={activity.item}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1">
                  <p className="text-medieval-beige font-semibold">{activity.item}</p>
                  <p className="text-xs text-medieval-beige/70">
                    {activity.type === 'found' ? '🔍 Found' : '✅ Returned'} • {activity.date}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-medieval-gold font-bold flex items-center space-x-1">
                    <Coins className="w-4 h-4" />
                    <span>+{activity.reward}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Humanity Impact */}
      <Card className="fantasy-card bg-gradient-to-r from-medieval-gold/20 to-medieval-brown-light">
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 text-medieval-gold mx-auto mb-4" />
          <h3 className="fantasy-title text-2xl mb-2">HUMANITY IMPACT</h3>
          <p className="text-medieval-beige/80 mb-4">
            You've helped <span className="text-medieval-gold font-bold">{userProfile.stats.itemsReturned} people</span> reunite with their lost treasures!
          </p>
          <p className="text-sm text-medieval-beige/70">
            Every item returned makes the world a better place. Keep up the heroic work!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
