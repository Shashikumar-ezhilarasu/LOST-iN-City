'use client';

import { useState, useEffect } from "react";
import { Upload, MapPin, Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { foundReportsAPI, imageToBase64, FoundReportRequest } from "@/lib/api";

const categories = [
  "Electronics",
  "Personal Items",
  "Documents",
  "Keys",
  "Accessories",
  "Bags",
  "Others",
];

export default function ReportFoundPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
    locationName: '',
    foundDate: '',
    foundTime: '12:00',
    latitude: 0,
    longitude: 0,
    color: '',
    brand: '',
    foundCondition: '',
    holdingInstructions: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get Clerk authentication token
      const token = await getToken();
      if (!token) {
        throw new Error('Please sign in to report a found item');
      }

      const imageBase64 = await Promise.all(
        images.map(img => imageToBase64(img))
      );

      const { title, description, category, locationName, foundDate, foundTime, latitude, longitude, color, brand, foundCondition, holdingInstructions } = formData;
      const foundAt = `${foundDate}T${foundTime}:00+05:30`;

      const reportData: FoundReportRequest = {
        title,
        description,
        category,
        foundAt,
        locationName: locationName || undefined,
        latitude: latitude || 12.9716,
        longitude: longitude || 77.5946,
        images: imageBase64.length > 0 ? imageBase64 : undefined,
        color: color || undefined,
        brand: brand || undefined,
        foundCondition: foundCondition || undefined,
        holdingInstructions: holdingInstructions || undefined,
      };

      const response = await foundReportsAPI.create(reportData, token);
      
      // Success! Show message and redirect to the browse page
      alert('✅ Found item report created successfully! Redirecting...');
      
      // Small delay to ensure backend has processed the request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate and force refresh
      await router.push('/browse-found');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create report.');
      console.error('Error creating found report:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medieval-gold"></div>
      </div>
    );
  }

  // Don't render if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

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

      {/* Error Message */}
      {error && (
        <div className="fantasy-card p-4 bg-red-900/20 border-2 border-red-600">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
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
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe the found item in detail (color, brand, condition, contents if visible)..."
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50 resize-none"
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
              required
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
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
                required
                value={formData.foundDate}
                onChange={(e) => setFormData({ ...formData, foundDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                aria-label="Date Found"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold">
                Time Found
              </label>
              <input
                type="time"
                value={formData.foundTime}
                onChange={(e) => setFormData({ ...formData, foundTime: e.target.value })}
                aria-label="Time Found"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>
          </div>

          {/* Distinguishing Features / Found Condition */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold">
              Condition & Features (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.foundCondition}
              onChange={(e) => setFormData({ ...formData, foundCondition: e.target.value })}
              placeholder="Any unique marks, scratches, custom features, or identifying characteristics..."
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Images (Optional, max 5)</span>
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 5}
              />
              <label
                htmlFor="image-upload"
                className={`block w-full bg-medieval-brown border-2 border-dashed border-medieval-gold/50 rounded-lg px-4 py-8 text-center cursor-pointer hover:border-medieval-gold transition-colors ${
                  images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="w-8 h-8 text-medieval-gold/50 mx-auto mb-2" />
                <p className="text-medieval-beige/60">
                  {images.length >= 5
                    ? 'Maximum 5 images reached'
                    : 'Click to upload images'}
                </p>
              </label>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-medieval-gold/30"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute top-1 right-1 bg-red-600 rounded-full p-1 hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Optional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold">
                Color (Optional)
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="E.g., Blue, Black, Red"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold">
                Brand (Optional)
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="E.g., Nike, Apple, Samsung"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>
          </div>

          {/* Holding Instructions */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold">
              Holding Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.holdingInstructions}
              onChange={(e) => setFormData({ ...formData, holdingInstructions: e.target.value })}
              placeholder="Where are you keeping the item? How can the owner contact you?"
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50 resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-medieval-gold font-semibold">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              aria-label="Item Category"
              className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-medieval-gold hover:bg-medieval-gold/90 text-medieval-brown font-bold py-6 text-lg"
            >
              {loading ? 'Posting...' : 'POST FOUND ITEM'}
            </Button>
            <Link href="/" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-medieval-gold/50 bg-transparent hover:bg-medieval-gold/10 text-medieval-gold py-6 text-lg"
              >
                CANCEL
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      </form>

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

      {/* Info Box */}
      <div className="fantasy-card p-4 bg-medieval-gold/5">
        <p className="text-xs text-medieval-beige/70 text-center">
          💡 <span className="font-semibold">Pro Tip:</span> Clear photos and detailed descriptions help owners identify their items faster, leading to quicker rewards!
        </p>
      </div>
    </div>
  );
}
