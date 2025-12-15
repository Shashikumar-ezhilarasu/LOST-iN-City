import { Gift, Plus, Search, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function QuestsPage() {
  const dailyQuests = [
    { id: 1, title: "Find 3 items", progress: 60, reward: 500 },
    { id: 2, title: "Post 1 lost item", progress: 100, reward: 200 },
    { id: 3, title: "Chat with 2 finders", progress: 50, reward: 300 },
  ];

  const leaderboard = [
    { rank: 1, name: "DragonSlayer99", coins: 50000 },
    { rank: 2, name: "LostItemHunter", coins: 45000 },
    { rank: 3, name: "QuestMaster", coins: 40000 },
    { rank: 4, name: "TreasureFinder", coins: 35000 },
    { rank: 5, name: "HeroOfRealm", coins: 30000 },
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Welcome Banner */}
      <div className="fantasy-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="fantasy-title text-2xl md:text-3xl mb-2">
              WELCOME BACK, PLAYER!
            </h1>
            <p className="text-medieval-beige/80 text-sm">
              Continue your noble quest to reunite lost treasures
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-medieval-gold/20 px-4 py-3 rounded-lg gold-border">
            <Gift className="w-8 h-8 text-medieval-gold" />
            <div>
              <p className="text-xs text-medieval-beige/80">Daily</p>
              <p className="text-sm font-bold text-medieval-gold">Reward</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/report-lost">
          <Button className="fantasy-button w-full h-16 text-lg flex items-center justify-center space-x-3">
            <Plus className="w-6 h-6" />
            <span>REPORT LOST ITEM</span>
          </Button>
        </Link>
        
        <Link href="/browse-found">
          <Button className="fantasy-button w-full h-16 text-lg flex items-center justify-center space-x-3">
            <Search className="w-6 h-6" />
            <span>BROWSE FOUND ITEMS</span>
          </Button>
        </Link>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Quests */}
        <Card className="fantasy-card">
          <CardHeader>
            <CardTitle className="fantasy-title text-xl flex items-center space-x-2">
              <Target className="w-6 h-6 text-medieval-gold" />
              <span>DAILY QUESTS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dailyQuests.map((quest) => (
              <div key={quest.id} className="bg-medieval-brown p-4 rounded-lg border-2 border-medieval-gold/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-medieval-beige font-semibold">
                    {quest.title}
                  </h3>
                  <span className="text-medieval-gold text-sm font-bold">
                    +{quest.reward} 🪙
                  </span>
                </div>
                
                <Progress value={quest.progress} className="mb-2 h-3" />
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-medieval-beige/70">
                    {quest.progress}% Complete
                  </span>
                  
                  {quest.progress === 100 ? (
                    <Button className="fantasy-button py-1 px-3 text-xs">
                      CLAIM
                    </Button>
                  ) : (
                    <Button 
                      className="bg-medieval-brown-light text-medieval-beige/50 py-1 px-3 text-xs border-2 border-medieval-gold/30 rounded-lg"
                      disabled
                    >
                      In Progress
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leaderboard Preview */}
        <Card className="fantasy-card">
          <CardHeader>
            <CardTitle className="fantasy-title text-xl flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-medieval-gold" />
              <span>LEADERBOARD</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard.map((player) => (
              <div 
                key={player.rank}
                className="flex items-center justify-between p-3 rounded-lg bg-medieval-brown border-2 border-medieval-gold/30 hover:border-medieval-gold/60 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    player.rank === 1 ? "bg-medieval-gold text-medieval-brown" :
                    player.rank === 2 ? "bg-medieval-gold/70 text-medieval-brown" :
                    player.rank === 3 ? "bg-medieval-gold/50 text-medieval-brown" :
                    "bg-medieval-brown-light text-medieval-beige"
                  }`}>
                    {player.rank}
                  </div>
                  
                  <span className="text-medieval-beige font-semibold">
                    {player.name}
                  </span>
                </div>
                
                <span className="text-medieval-gold font-bold">
                  {player.coins.toLocaleString()} 🪙
                </span>
              </div>
            ))}
            
            {/* Current User */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-medieval-gold/20 border-2 border-medieval-gold mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-medieval-brown-light flex items-center justify-center font-bold text-medieval-beige text-sm">
                  124
                </div>
                
                <span className="text-medieval-gold font-bold">
                  You
                </span>
              </div>
              
              <span className="text-medieval-gold font-bold">
                12,000 🪙
              </span>
            </div>
            
            <Link href="/leaderboard">
              <Button className="fantasy-button w-full mt-4">
                VIEW FULL LEADERBOARD
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
