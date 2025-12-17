'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Trophy, Crown, Medal, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  coins: number;
  itemsFound: number;
  itemsReturned: number;
  level: number;
}

export default function LeaderboardPage() {
  const { getToken, isSignedIn } = useAuth();
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchLeaderboard();
    }
  }, [isSignedIn]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard?page=1&pageSize=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTopPlayers(result.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to fetch leaderboard');
      // Fallback to mock data
      setTopPlayers([
        { 
          rank: 1, 
          userId: '1',
          displayName: "DragonSlayer99", 
          coins: 50000, 
          level: 15,
          itemsFound: 120,
          itemsReturned: 100,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <Star className="w-5 h-5 text-medieval-gold/50" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-medieval-brown shadow-2xl scale-110";
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-500 text-medieval-brown shadow-xl scale-105";
      case 3:
        return "bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg";
      default:
        return "bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/30";
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="fantasy-card p-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-medieval-gold animate-pulse" />
          <div>
            <h1 className="fantasy-title text-2xl md:text-3xl">
              HALL OF LEGENDS
            </h1>
            <p className="text-medieval-beige/80 text-sm mt-1">
              The mightiest heroes of the realm
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center mt-8">
          <div className="relative">
            <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-gray-400">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topPlayers[1].displayName}`} alt={topPlayers[1].displayName} />
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Medal className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="fantasy-card p-3 mt-4 text-center w-full">
            <p className="text-xs md:text-sm font-bold text-medieval-gold truncate">
              {topPlayers[1].displayName}
            </p>
            <p className="text-xs text-medieval-beige/80">
              {topPlayers[1].coins.toLocaleString()} 🪙
            </p>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-yellow-400 shadow-2xl">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topPlayers[0].displayName}`} alt={topPlayers[0].displayName} />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <div className="fantasy-card p-4 mt-6 text-center w-full bg-gradient-to-b from-medieval-gold/20 to-medieval-brown-light">
            <p className="text-sm md:text-base font-bold text-medieval-gold truncate">
              {topPlayers[0].displayName}
            </p>
            <p className="text-xs text-medieval-beige/80">
              {topPlayers[0].coins.toLocaleString()} 🪙
            </p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center mt-12">
          <div className="relative">
            <Avatar className="w-14 h-14 md:w-18 md:h-18 border-4 border-amber-700">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topPlayers[2].displayName}`} alt={topPlayers[2].displayName} />
              <AvatarFallback>3</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Medal className="w-7 h-7 text-amber-700" />
            </div>
          </div>
          <div className="fantasy-card p-2 mt-4 text-center w-full">
            <p className="text-xs md:text-sm font-bold text-medieval-gold truncate">
              {topPlayers[2].displayName}
            </p>
            <p className="text-xs text-medieval-beige/80">
              {topPlayers[2].coins.toLocaleString()} 🪙
            </p>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <Card className="fantasy-card">
        <CardContent className="p-4 space-y-2">
          {topPlayers.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-102 ${
                player.rank <= 3
                  ? "bg-medieval-gold/10 border-2 border-medieval-gold/50"
                  : "bg-medieval-brown border-2 border-medieval-gold/30"
              }`}
            >
              {/* Left: Rank, Avatar, Name */}
              <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadgeColor(player.rank)}`}>
                  {player.rank <= 3 ? getRankIcon(player.rank) : player.rank}
                </div>

                <Avatar className="w-10 h-10 md:w-12 md:h-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.displayName}`} alt={player.displayName} />
                  <AvatarFallback>{player.displayName[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-medieval-beige font-bold text-sm md:text-base truncate">
                    {player.displayName}
                  </p>
                  <p className="text-medieval-beige/60 text-xs">
                    Level {player.level} • {player.itemsFound} items
                  </p>
                </div>
              </div>

              {/* Right: Coins */}
              <div className="text-right">
                <p className="text-medieval-gold font-bold text-sm md:text-base">
                  {player.coins.toLocaleString()}
                </p>
                <p className="text-medieval-gold/70 text-xs">coins</p>
              </div>
            </div>
          ))}

          {/* Current User */}
          <div className="mt-6 pt-4 border-t-2 border-medieval-gold/50">
            <div className="flex items-center justify-between p-4 rounded-lg bg-medieval-gold/20 border-2 border-medieval-gold">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-medieval-brown-light flex items-center justify-center font-bold text-medieval-beige">
                  124
                </div>

                <Avatar className="w-10 h-10 md:w-12 md:h-12">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="You" />
                  <AvatarFallback>YOU</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-medieval-gold font-bold text-sm md:text-base">
                    You
                  </p>
                  <p className="text-medieval-gold/80 text-xs">
                    Level 1 • 8 items
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-medieval-gold font-bold text-sm md:text-base">
                  12,000
                </p>
                <p className="text-medieval-gold/70 text-xs">coins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
