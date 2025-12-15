import { Upload, MapPin, Calendar, Coins, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ReportLostPage() {
  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="fantasy-card p-6">
        <div className="flex items-center space-x-3">
          <Plus className="w-8 h-8 text-medieval-gold" />
          <div>
            <h1 className="fantasy-title text-2xl md:text-3xl">
              REPORT LOST ITEM
            </h1>
            <p className="text-medieval-beige/80 text-sm mt-1">
              Post a quest to find your lost treasure
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl">
            QUEST DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Item Name */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <span>Item Name</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="E.g., Leather Wallet, Gold Ring, Blue Backpack"
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <span>Description</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe your lost item in detail (color, brand, unique features)..."
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Last Seen Location</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="E.g., Central Park, Coffee Shop on Main Street"
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>

          {/* Date Lost */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Date Lost</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>

          {/* Reward Amount */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>Reward Amount</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="1000"
                min="0"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 pr-20 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-medieval-gold font-bold">
                <Coins className="w-5 h-5" />
                <span>Coins</span>
              </div>
            </div>
            <p className="text-xs text-medieval-beige/60">
              Minimum reward: 100 coins • Higher rewards attract more heroes!
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
              <span className="text-medieval-beige/60 text-xs font-normal">(Optional)</span>
            </label>
            <div className="border-2 border-dashed border-medieval-gold/50 rounded-lg p-8 text-center hover:border-medieval-gold transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-medieval-gold/50 mx-auto mb-3" />
              <p className="text-medieval-beige mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-medieval-beige/60">
                PNG, JPG, WEBP up to 10MB
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold">
              Category
            </label>
            <select className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50">
              <option>Electronics</option>
              <option>Accessories</option>
              <option>Jewelry</option>
              <option>Documents</option>
              <option>Keys</option>
              <option>Bags & Luggage</option>
              <option>Clothing</option>
              <option>Other</option>
            </select>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold">
              Contact Information
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="fantasy-card bg-medieval-gold/10">
        <CardContent className="p-6">
          <h3 className="fantasy-title text-lg mb-4">QUEST SUMMARY</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-medieval-beige/80">Posting Fee:</span>
              <span className="text-medieval-gold font-bold">50 Coins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medieval-beige/80">Reward Amount:</span>
              <span className="text-medieval-gold font-bold">TBD</span>
            </div>
            <div className="border-t-2 border-medieval-gold/30 pt-3 flex justify-between">
              <span className="text-medieval-gold font-semibold">Total Cost:</span>
              <span className="text-medieval-gold font-bold text-lg">50 + Reward</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/quests" className="flex-1">
          <Button className="w-full bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold py-6 rounded-lg font-bold">
            <X className="w-5 h-5 mr-2" />
            CANCEL
          </Button>
        </Link>
        
        <Link href="/quests" className="flex-1">
          <Button className="fantasy-button w-full py-6 text-lg">
            <Plus className="w-5 h-5 mr-2" />
            POST QUEST
          </Button>
        </Link>
      </div>

      {/* Info Box */}
      <div className="fantasy-card p-4 bg-medieval-gold/5">
        <p className="text-xs text-medieval-beige/70 text-center">
          💡 <span className="font-semibold">Pro Tip:</span> Items with clear photos and detailed descriptions have a 70% higher recovery rate!
        </p>
      </div>
    </div>
  );
}
