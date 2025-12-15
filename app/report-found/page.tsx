import { Upload, MapPin, Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ReportFoundPage() {
  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="fantasy-card p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-900/30 border-2 border-green-600 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <div>
            <h1 className="fantasy-title text-2xl md:text-3xl">
              REPORT FOUND ITEM
            </h1>
            <p className="text-medieval-beige/80 text-sm mt-1">
              Help reunite a found item with its owner and earn rewards!
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="fantasy-title text-xl">
            FOUND ITEM DETAILS
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
              placeholder="Describe the found item in detail (color, brand, condition, contents if visible)..."
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>

          {/* Location Found */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Location Found</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="E.g., Central Park near fountain, Metro Station exit 3"
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>

          {/* Date & Time Found */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Date Found</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold">
                Time Found
              </label>
              <input
                type="time"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>
          </div>

          {/* Distinguishing Features */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold">
              Distinguishing Features
            </label>
            <textarea
              rows={3}
              placeholder="Any unique marks, scratches, custom features, or identifying characteristics..."
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Images</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-medieval-gold/50 rounded-lg p-8 text-center hover:border-medieval-gold transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-medieval-gold/50 mx-auto mb-3" />
              <p className="text-medieval-beige mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-medieval-beige/60">
                PNG, JPG, WEBP up to 10MB (Multiple images recommended)
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
              Your Contact Information
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="fantasy-card bg-medieval-gold/10">
        <CardContent className="p-6">
          <h3 className="fantasy-title text-lg mb-4">WHAT HAPPENS NEXT?</h3>
          <div className="space-y-3 text-sm text-medieval-beige/80">
            <div className="flex items-start space-x-3">
              <span className="text-medieval-gold font-bold">1.</span>
              <p>Your found item will be posted and visible to all users looking for lost items</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-medieval-gold font-bold">2.</span>
              <p>The rightful owner will claim the item and verify ownership</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-medieval-gold font-bold">3.</span>
              <p>You'll coordinate a safe meeting place for the handover</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-medieval-gold font-bold">4.</span>
              <p>After successful return, you'll receive the reward set by the owner! 🎉</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/browse-found" className="flex-1">
          <Button className="w-full bg-medieval-brown-light text-medieval-beige border-2 border-medieval-gold/50 hover:border-medieval-gold py-6 rounded-lg font-bold">
            <X className="w-5 h-5 mr-2" />
            CANCEL
          </Button>
        </Link>
        
        <Link href="/profile" className="flex-1">
          <Button className="fantasy-button w-full py-6 text-lg">
            <Plus className="w-5 h-5 mr-2" />
            POST FOUND ITEM
          </Button>
        </Link>
      </div>

      {/* Info Box */}
      <div className="fantasy-card p-4 bg-medieval-gold/5">
        <p className="text-xs text-medieval-beige/70 text-center">
          💡 <span className="font-semibold">Pro Tip:</span> Clear photos and detailed descriptions help owners identify their items faster, leading to quicker rewards!
        </p>
      </div>
    </div>
  );
}
