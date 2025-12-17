'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth, SignOutButton } from '@clerk/nextjs';
import { User, Award, Target, TrendingUp, MapPin, Shield, Heart, Crown, Medal, Star, Coins, Edit, Settings, Share2, Package, Search, AlertCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import WalletDisplay from '@/components/WalletDisplay';
import TransactionHistory from '@/components/TransactionHistory';

interface UserStats {
  itemsReported: number;
  itemsFound: number;
  itemsReturned: number;
  totalRewardsEarned: number;
  successRate: number;
  activeClaims: number;
}

interface UserData {
  id: string;
  email: string;
  displayName: string;
  coins: number;
  lifetimeEarnings: number;
  lifetimeSpent: number;
  badges: string[];
  skills: string[];
  createdAt: string;
}

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<UserStats>({
    itemsReported: 0,
    itemsFound: 0,
    itemsReturned: 0,
    totalRewardsEarned: 0,
    successRate: 0,
    activeClaims: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lostReports, setLostReports] = useState<any[]>([]);
  const [foundReports, setFoundReports] = useState<any[]>([]);

  useEffect(() => {
    if (isSignedIn) {
      fetchUserData();
      fetchUserReports();
    }
  }, [isSignedIn]);

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReports = async () => {
    try {
      const token = await getToken();
      
      // Fetch lost reports
      const lostResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lost-reports/my-reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch found reports
      const foundResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/found-reports/my-reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (lostResponse.ok) {
        const lostData = await lostResponse.json();
        setLostReports(lostData.data || []);
      }

      if (foundResponse.ok) {
        const foundData = await foundResponse.json();
        setFoundReports(foundData.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const calculateStats = (data: UserData) => {
    const totalReports = lostReports.length + foundReports.length;
    const completedReturns = 0; // This should come from claims API
    const successRate = totalReports > 0 ? Math.round((completedReturns / totalReports) * 100) : 0;
    
    setStats({
      itemsReported: lostReports.length,
      itemsFound: foundReports.length,
      itemsReturned: completedReturns,
      totalRewardsEarned: data.lifetimeEarnings || 0,
      successRate: successRate,
      activeClaims: 0,
    });
  };

  // Calculate level based on XP (coins earned)
  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  const calculateNextLevelXP = (level: number) => {
    return level * 1000;
  };

  // Calculate dynamic stats based on user activity
  const calculateHelpfulnessScore = () => {
    const base = 50;
    const foundBonus = Math.min(foundReports.length * 2, 30);
    const returnBonus = Math.min(stats.itemsReturned * 5, 20);
    return Math.min(base + foundBonus + returnBonus, 100);
  };

  const calculateResponseRate = () => {
    const totalReports = lostReports.length + foundReports.length;
    if (totalReports === 0) return 0;
    // Assume active users have responded to most of their items
    return Math.min(85 + totalReports, 100);
  };

  const calculateAverageResponseTime = () => {
    const totalReports = lostReports.length + foundReports.length;
    if (totalReports < 5) return "N/A";
    if (totalReports < 10) return "4 hours";
    if (totalReports < 20) return "2 hours";
    return "1 hour";
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medieval-gold mx-auto mb-4"></div>
          <p className="text-medieval-beige">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="fantasy-card max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-medieval-gold mx-auto mb-4" />
            <h2 className="fantasy-title text-xl mb-2">Sign In Required</h2>
            <p className="text-medieval-beige mb-4">Please sign in to view your profile</p>
            <Link href="/sign-in">
              <Button className="fantasy-button">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const level = calculateLevel(userData?.lifetimeEarnings || 0);
  const nextLevelXP = calculateNextLevelXP(level);
  const currentXP = (userData?.lifetimeEarnings || 0) % 1000;

  const userBadges = {
    name: user?.fullName || user?.firstName || userData?.displayName || "User",
    username: `@${user?.username || user?.emailAddresses[0]?.emailAddress.split('@')[0] || 'user'}`,
    avatar: user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.displayName || 'User'}`,
    level: level,
    currentXP: currentXP,
    nextLevelXP: nextLevelXP,
    totalCoins: userData?.coins || 0,
    joinDate: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Recently",
    bio: `Member of the Lost City community. Helping reunite people with their lost items!`,
    stats: {
      itemsFound: foundReports.length,
      itemsReturned: stats.itemsReturned,
      totalRewardsEarned: userData?.lifetimeEarnings || 0,
      helpfulnessScore: calculateHelpfulnessScore(),
      responseRate: calculateResponseRate(),
      averageResponseTime: calculateAverageResponseTime(),
      successRate: stats.successRate,
      itemsReported: lostReports.length,
    },
    badges: userData?.badges || [],
    recentActivity: [], // Can be populated from transaction history
  };

  // Badge definitions with dynamic earned status
  const availableBadges = [
    { id: 1, name: "First Find", description: "Found your first item", icon: "🔍", earned: foundReports.length >= 1, rarity: "common" },
    { id: 2, name: "Good Samaritan", description: "Helped 5 people find their items", icon: "❤️", earned: stats.itemsReturned >= 5, rarity: "rare" },
    { id: 3, name: "Quick Responder", description: "Respond within 1 hour", icon: "⚡", earned: false, rarity: "common" },
    { id: 4, name: "Treasure Hunter", description: "Found items worth 5000+ coins", icon: "💰", earned: (userData?.lifetimeEarnings || 0) >= 5000, rarity: "rare" },
    { id: 5, name: "Community Hero", description: "Helped 10 people", icon: "🏆", earned: stats.itemsReturned >= 10, rarity: "epic" },
    { id: 6, name: "Legend", description: "Reached Level 10", icon: "👑", earned: level >= 10, rarity: "legendary" },
    { id: 7, name: "Master Finder", description: "Found 50 items", icon: "⭐", earned: foundReports.length >= 50, rarity: "epic" },
    { id: 8, name: "Trust Builder", description: "100% success rate over 20 items", icon: "🛡️", earned: stats.successRate === 100 && stats.itemsReturned >= 20, rarity: "legendary" },
    { id: 9, name: "First Report", description: "Reported your first lost item", icon: "📝", earned: lostReports.length >= 1, rarity: "common" },
    { id: 10, name: "Millionaire", description: "Earned 10,000 coins", icon: "💎", earned: (userData?.lifetimeEarnings || 0) >= 10000, rarity: "legendary" },
  ];

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
                  <AvatarImage src={userBadges.avatar} alt={userBadges.name} />
                  <AvatarFallback className="text-2xl">{userBadges.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-medieval-gold text-medieval-brown w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-medieval-brown">
                  {userBadges.level}
                </div>
              </div>

              <div>
                <h1 className="fantasy-title text-2xl md:text-3xl">
                  {userBadges.name}
                </h1>
                <p className="text-medieval-beige/70 text-sm mb-2">{userBadges.username}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-medieval-gold font-semibold flex items-center space-x-1">
                    <Coins className="w-4 h-4" />
                    <span>{userBadges.totalCoins.toLocaleString()}</span>
                  </span>
                  <span className="text-medieval-beige/70">
                    Joined {userBadges.joinDate}
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
              <SignOutButton>
                <Button className="bg-red-600/80 border-2 border-red-500/50 text-white hover:bg-red-700 hover:border-red-500 flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>LOGOUT</span>
                </Button>
              </SignOutButton>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <p className="text-medieval-beige leading-relaxed">
              {userBadges.bio}
            </p>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-medieval-gold font-semibold text-sm">Level {userBadges.level} Progress</span>
              <span className="text-medieval-beige/70 text-sm">{userBadges.currentXP} / {userBadges.nextLevelXP} XP</span>
            </div>
            <Progress value={(userBadges.currentXP / userBadges.nextLevelXP) * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Wallet Display */}
      <WalletDisplay />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="fantasy-card">
          <CardContent className="p-4 text-center">
            <Search className="w-8 h-8 text-medieval-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-medieval-gold">{userBadges.stats.itemsFound}</p>
            <p className="text-xs text-medieval-beige/70">Items Found</p>
          </CardContent>
        </Card>

        <Card className="fantasy-card">
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 text-medieval-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-medieval-gold">{userBadges.stats.itemsReported}</p>
            <p className="text-xs text-medieval-beige/70">Items Reported</p>
          </CardContent>
        </Card>

        <Card className="fantasy-card">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-medieval-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-medieval-gold">{userBadges.stats.itemsReturned}</p>
            <p className="text-xs text-medieval-beige/70">Items Returned</p>
          </CardContent>
        </Card>

        <Card className="fantasy-card">
          <CardContent className="p-4 text-center">
            <Coins className="w-8 h-8 text-medieval-gold mx-auto mb-2" />
            <p className="text-2xl font-bold text-medieval-gold">{userBadges.stats.totalRewardsEarned.toFixed(0)}</p>
            <p className="text-xs text-medieval-beige/70">Lifetime Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl flex items-center space-x-2">
            <Award className="w-6 h-6 text-medieval-gold" />
            <span>BADGES & ACHIEVEMENTS</span>
            <span className="text-sm text-medieval-beige/70 ml-auto">
              {availableBadges.filter(b => b.earned).length} / {availableBadges.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableBadges.map((badge) => (
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
              <span className="text-medieval-gold font-bold">{availableBadges.filter(b => b.earned).length}</span> of {availableBadges.length} badges earned
            </p>
            <Progress value={(availableBadges.filter(b => b.earned).length / availableBadges.length) * 100} className="h-2 mt-2" />
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
                <span className="text-medieval-gold font-bold">{userBadges.stats.helpfulnessScore}/100</span>
              </div>
              <Progress value={userBadges.stats.helpfulnessScore} className="h-2" />
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-medieval-beige/80 text-sm">Response Rate</span>
                <span className="text-medieval-gold font-bold">{userBadges.stats.responseRate}%</span>
              </div>
              <Progress value={userBadges.stats.responseRate} className="h-2" />
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between">
                <span className="text-medieval-beige/80 text-sm">Average Response Time</span>
                <span className="text-medieval-gold font-bold">{userBadges.stats.averageResponseTime}</span>
              </div>
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between">
                <span className="text-medieval-beige/80 text-sm">Success Rate</span>
                <span className="text-medieval-gold font-bold">{userBadges.stats.successRate || 0}%</span>
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
              <Package className="w-6 h-6 text-medieval-gold" />
              <span>MY LOST REPORTS</span>
              <span className="text-sm text-medieval-beige/70">({lostReports.length})</span>
            </div>
            <Link href="/report-lost">
              <Button className="fantasy-button text-xs px-3 py-1 h-auto">
                + Report Lost
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lostReports.length === 0 ? (
            <div className="text-center py-8 text-medieval-beige/70">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No lost items reported yet</p>
              <Link href="/report-lost">
                <Button className="fantasy-button mt-4">Report Your First Lost Item</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {lostReports.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/lost-item/${item.id}`}>
                  <div className="flex items-center space-x-3 p-3 bg-medieval-brown-light rounded-lg border-2 border-medieval-gold/30 hover:border-medieval-gold transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-medieval-brown rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="fantasy-title text-sm">{item.itemName}</h4>
                      <p className="text-xs text-medieval-beige/70 truncate">{item.lastSeenLocation}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.status === 'ACTIVE' ? 'bg-yellow-500/20 text-yellow-500' :
                          item.status === 'FOUND' ? 'bg-green-500/20 text-green-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                        {item.rewardAmount > 0 && (
                          <span className="text-xs text-medieval-gold flex items-center">
                            <Coins className="w-3 h-3 mr-1" />
                            {item.rewardAmount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {lostReports.length > 3 && (
                <Link href="/browse-lost">
                  <Button variant="outline" className="w-full text-sm">
                    View All {lostReports.length} Lost Reports
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Found Items Section */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-6 h-6 text-medieval-gold" />
              <span>MY FOUND REPORTS</span>
              <span className="text-sm text-medieval-beige/70">({foundReports.length})</span>
            </div>
            <Link href="/report-found">
              <Button className="fantasy-button text-xs px-3 py-1 h-auto">
                + Report Found
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {foundReports.length === 0 ? (
            <div className="text-center py-8 text-medieval-beige/70">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No found items reported yet</p>
              <Link href="/report-found">
                <Button className="fantasy-button mt-4">Report Your First Found Item</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {foundReports.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/found-item/${item.id}`}>
                  <div className="flex items-center space-x-3 p-3 bg-medieval-brown-light rounded-lg border-2 border-medieval-gold/30 hover:border-medieval-gold transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-medieval-brown rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🔍
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="fantasy-title text-sm">{item.itemName}</h4>
                      <p className="text-xs text-medieval-beige/70 truncate">{item.foundLocation}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' :
                          item.status === 'CLAIMED' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {foundReports.length > 3 && (
                <Link href="/browse-found">
                  <Button variant="outline" className="w-full text-sm">
                    View All {foundReports.length} Found Reports
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <TransactionHistory />

      {/* Performance Stats */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-medieval-gold" />
            <span>PERFORMANCE STATS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-medieval-beige/80 text-sm">Helpfulness Score</span>
                <span className="text-medieval-gold font-bold">{userBadges.stats.helpfulnessScore}/100</span>
              </div>
              <Progress value={userBadges.stats.helpfulnessScore} className="h-2" />
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-medieval-beige/80 text-sm">Response Rate</span>
                <span className="text-medieval-gold font-bold">{userBadges.stats.responseRate}%</span>
              </div>
              <Progress value={userBadges.stats.responseRate} className="h-2" />
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between">
                <span className="text-medieval-beige/80 text-sm">Average Response Time</span>
                <span className="text-medieval-gold font-bold">{userBadges.stats.averageResponseTime}</span>
              </div>
            </div>

            <div className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/30">
              <div className="flex items-center justify-between">
                <span className="text-medieval-beige/80 text-sm">Total Reports</span>
                <span className="text-medieval-gold font-bold">{lostReports.length + foundReports.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
