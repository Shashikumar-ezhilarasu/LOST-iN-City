import { Search, MapPin, Calendar, Filter, Eye, MessageSquare, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function BrowseLostPage() {
  const lostItems = [
    {
      id: 1,
      title: "Brown Leather Wallet",
      description: "Lost near the fountain. Contains credit cards but no ID.",
      location: "Central Park",
      date: "14 Dec",
      reward: 500,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop",
      owner: "KnightFinder",
      responses: 3,
    },
    {
      id: 2,
      title: "Gold Ring",
      description: "Wedding band with engraving inside. Lost at the beach.",
      location: "Beach",
      date: "18 Nov",
      reward: 2000,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
      owner: "AdventureQueen",
      responses: 7,
    },
    {
      id: 3,
      title: "Blue Backpack",
      description: "Nike backpack with laptop compartment. Contains textbooks.",
      location: "University Library",
      date: "5 Oct",
      reward: 800,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      owner: "QuestMaster",
      responses: 5,
    },
    {
      id: 4,
      title: "iPhone 14 Pro",
      description: "Black iPhone with cracked screen protector.",
      location: "Metro Station",
      date: "2 Dec",
      reward: 1500,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      owner: "HeroOfRealm",
      responses: 12,
    },
    {
      id: 5,
      title: "Silver Watch",
      description: "Citizen watch with metal band. Battery still working.",
      location: "Gym Locker Room",
      date: "9 Dec",
      reward: 1200,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      owner: "GoldSeeker",
      responses: 4,
    },
    {
      id: 6,
      title: "Prescription Glasses",
      description: "Black frame glasses in blue case.",
      location: "Coffee Shop",
      date: "8 Dec",
      reward: 400,
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
      owner: "LostItemHunter",
      responses: 2,
    },
    {
      id: 7,
      title: "Car Keys with Fob",
      description: "Toyota key fob with keychain. Lost in parking lot.",
      location: "Shopping Mall",
      date: "10 Dec",
      reward: 1000,
      image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop",
      owner: "DragonSlayer99",
      responses: 8,
    },
    {
      id: 8,
      title: "Red Baseball Cap",
      description: "NY Yankees cap, slightly worn.",
      location: "Sports Stadium",
      date: "7 Dec",
      reward: 300,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop",
      owner: "TreasureFinder",
      responses: 1,
    },
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="fantasy-card p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-red-900/30 border-2 border-red-600 flex items-center justify-center">
            <span className="text-2xl">😢</span>
          </div>
          <div>
            <h1 className="fantasy-title text-2xl md:text-3xl">
              LOST ITEMS NEEDING HEROES
            </h1>
            <p className="text-medieval-beige/80 text-sm mt-1">
              Help reunite these items with their rightful owners
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="fantasy-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-medieval-gold" />
              <input
                type="text"
                placeholder="Search lost items by name or location..."
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg pl-12 pr-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>

            {/* Filter Button */}
            <Button className="fantasy-button flex items-center justify-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>FILTERS</span>
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="px-4 py-2 bg-medieval-gold text-medieval-brown rounded-lg font-semibold text-sm">
              All Items
            </button>
            <button className="px-4 py-2 bg-medieval-brown-light border-2 border-medieval-gold/30 text-medieval-beige rounded-lg font-semibold text-sm hover:border-medieval-gold">
              Electronics
            </button>
            <button className="px-4 py-2 bg-medieval-brown-light border-2 border-medieval-gold/30 text-medieval-beige rounded-lg font-semibold text-sm hover:border-medieval-gold">
              Jewelry
            </button>
            <button className="px-4 py-2 bg-medieval-brown-light border-2 border-medieval-gold/30 text-medieval-beige rounded-lg font-semibold text-sm hover:border-medieval-gold">
              Accessories
            </button>
            <button className="px-4 py-2 bg-medieval-brown-light border-2 border-medieval-gold/30 text-medieval-beige rounded-lg font-semibold text-sm hover:border-medieval-gold">
              High Reward
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between px-2">
        <p className="text-medieval-beige/80 text-sm">
          <span className="text-medieval-gold font-bold">{lostItems.length}</span> lost items awaiting heroes
        </p>
        <select className="bg-medieval-brown-light border-2 border-medieval-gold/30 rounded-lg px-3 py-2 text-medieval-beige text-sm focus:border-medieval-gold focus:outline-none">
          <option>Newest First</option>
          <option>Highest Reward</option>
          <option>Most Urgent</option>
          <option>Nearest Location</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lostItems.map((item) => (
          <Card key={item.id} className="fantasy-card overflow-hidden hover:scale-105 transition-transform duration-200">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-2 right-2 bg-medieval-gold text-medieval-brown px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                <Coins className="w-3 h-3" />
                <span>{item.reward}</span>
              </div>
              <div className="absolute bottom-2 left-2 bg-medieval-brown/90 border-2 border-medieval-gold/50 px-2 py-1 rounded-lg flex items-center space-x-1">
                <MessageSquare className="w-3 h-3 text-medieval-gold" />
                <span className="text-xs text-medieval-beige font-semibold">{item.responses}</span>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <h3 className="fantasy-title text-lg">
                {item.title}
              </h3>
              
              <p className="text-sm text-medieval-beige/80 line-clamp-2">
                {item.description}
              </p>

              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2 text-medieval-beige/70">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-medieval-beige/70">
                  <Calendar className="w-3 h-3" />
                  <span>Lost on {item.date}</span>
                </div>
              </div>

              <div className="pt-2 border-t-2 border-medieval-gold/30">
                <p className="text-xs text-medieval-beige/60 mb-2">
                  Posted by <span className="text-medieval-gold font-semibold">{item.owner}</span>
                </p>
              </div>
              
              <Link href={`/lost-item/${item.id}`}>
                <Button className="fantasy-button w-full flex items-center justify-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>HELP FIND</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-6">
        <Button className="fantasy-button px-12">
          LOAD MORE QUESTS
        </Button>
      </div>

      {/* Info Box */}
      <div className="fantasy-card p-4 bg-medieval-gold/5">
        <p className="text-xs text-medieval-beige/70 text-center">
          💰 <span className="font-semibold">Hero Tip:</span> When you find an item, you can report it and help connect it with the owner to earn the reward!
        </p>
      </div>
    </div>
  );
}
