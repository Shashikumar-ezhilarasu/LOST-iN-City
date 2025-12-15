import { Trophy, Crown, Medal, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LeaderboardPage() {
  const topPlayers = [
    { 
      rank: 1, 
      name: "DragonSlayer99", 
      coins: 50000, 
      level: 15,
      itemsFound: 120,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DragonSlayer99"
    },
    { 
      rank: 2, 
      name: "LostItemHunter", 
      coins: 45000, 
      level: 14,
      itemsFound: 105,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LostItemHunter"
    },
    { 
      rank: 3, 
      name: "QuestMaster", 
      coins: 40000, 
      level: 13,
      itemsFound: 95,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=QuestMaster"
    },
    { 
      rank: 4, 
      name: "TreasureFinder", 
      coins: 35000, 
      level: 12,
      itemsFound: 88,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TreasureFinder"
    },
    { 
      rank: 5, 
      name: "HeroOfRealm", 
      coins: 30000, 
      level: 11,
      itemsFound: 75,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HeroOfRealm"
    },
    { 
      rank: 6, 
      name: "KnightFinder", 
      coins: 28000, 
      level: 10,
      itemsFound: 70,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KnightFinder"
    },
    { 
      rank: 7, 
      name: "GoldSeeker", 
      coins: 25000, 
      level: 10,
      itemsFound: 65,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GoldSeeker"
    },
    { 
      rank: 8, 
      name: "AdventureQueen", 
      coins: 22000, 
      level: 9,
      itemsFound: 60,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AdventureQueen"
    },
  ];

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
              <AvatarImage src={topPlayers[1].avatar} alt={topPlayers[1].name} />
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Medal className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="fantasy-card p-3 mt-4 text-center w-full">
            <p className="text-xs md:text-sm font-bold text-medieval-gold truncate">
              {topPlayers[1].name}
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
              <AvatarImage src={topPlayers[0].avatar} alt={topPlayers[0].name} />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <div className="fantasy-card p-4 mt-6 text-center w-full bg-gradient-to-b from-medieval-gold/20 to-medieval-brown-light">
            <p className="text-sm md:text-base font-bold text-medieval-gold truncate">
              {topPlayers[0].name}
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
              <AvatarImage src={topPlayers[2].avatar} alt={topPlayers[2].name} />
              <AvatarFallback>3</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Medal className="w-7 h-7 text-amber-700" />
            </div>
          </div>
          <div className="fantasy-card p-2 mt-4 text-center w-full">
            <p className="text-xs md:text-sm font-bold text-medieval-gold truncate">
              {topPlayers[2].name}
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
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-medieval-beige font-bold text-sm md:text-base truncate">
                    {player.name}
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
