import { Package, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function InventoryPage() {
  const items = [
    {
      id: 1,
      title: "Antique Watch",
      location: "Central Park",
      date: "26 Aug",
      status: "Found",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Leather Wallet",
      location: "Coffee Shop",
      date: "12 Sep",
      status: "Claimed",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Blue Backpack",
      location: "Library",
      date: "5 Oct",
      status: "Found",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Gold Ring",
      location: "Beach",
      date: "18 Nov",
      status: "Searching",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Smartphone",
      location: "Metro Station",
      date: "2 Dec",
      status: "Found",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Silver Necklace",
      location: "Restaurant",
      date: "10 Dec",
      status: "Claimed",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Claimed":
        return "bg-medieval-gold text-medieval-brown";
      case "Found":
        return "bg-green-600 text-white";
      case "Searching":
        return "bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50";
      default:
        return "bg-medieval-brown-light text-medieval-beige";
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="fantasy-card p-6">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-medieval-gold" />
          <div>
            <h1 className="fantasy-title text-2xl md:text-3xl">
              YOUR ITEMS & FINDINGS
            </h1>
            <p className="text-medieval-beige/80 text-sm mt-1">
              Track your lost items and discoveries
            </p>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="fantasy-card overflow-hidden hover:scale-105 transition-transform duration-200">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <h3 className="fantasy-title text-lg">
                {item.title}
              </h3>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-medieval-beige/70">Location:</span>
                  <span className="text-medieval-beige font-semibold">{item.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-medieval-beige/70">Date:</span>
                  <span className="text-medieval-beige font-semibold">{item.date}</span>
                </div>
              </div>
              
              <Button className="fantasy-button w-full flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>VIEW DETAILS</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (shown when no items) */}
      {items.length === 0 && (
        <div className="fantasy-card p-12 text-center">
          <Package className="w-16 h-16 text-medieval-gold/50 mx-auto mb-4" />
          <h3 className="fantasy-title text-xl mb-2">
            NO ITEMS YET
          </h3>
          <p className="text-medieval-beige/70 mb-6">
            Start your quest by reporting lost items or finding treasures!
          </p>
          <Button className="fantasy-button">
            BEGIN YOUR QUEST
          </Button>
        </div>
      )}
    </div>
  );
}
