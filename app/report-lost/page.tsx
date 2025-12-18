'use client';

import { useState, useEffect } from "react";
import { Upload, MapPin, Calendar, Coins, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { lostReportsAPI, imageToBase64, LostReportRequest } from "@/lib/api";

const categories = [
  "Electronics",
  "Personal Items",
  "Documents",
  "Keys",
  "Accessories",
  "Bags",
  "Others",
];

export default function ReportLostPage() {
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
    lostDate: '',
    lostTime: '12:00',
    latitude: 0,
    longitude: 0,
    rewardAmount: '',
    color: '',
    brand: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 images
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
        throw new Error('Please sign in to report a lost item');
      }

      // Convert images to base64
      const imageData = await Promise.all(
        images.map(img => imageToBase64(img))
      );

      // Combine date and time into ISO 8601 format
      const lostAt = `${formData.lostDate}T${formData.lostTime}:00+05:30`;

      const reportData: LostReportRequest = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        lostAt: lostAt,
        latitude: formData.latitude || 12.9716, // Default to Bangalore coordinates
        longitude: formData.longitude || 77.5946,
        locationName: formData.locationName,
        rewardAmount: formData.rewardAmount ? parseFloat(formData.rewardAmount) : undefined,
        images: imageData.length > 0 ? imageData : undefined,
        color: formData.color || undefined,
        brand: formData.brand || undefined,
      };

      const response = await lostReportsAPI.create(reportData, token);
      
      // Success! Show message and redirect to the browse page
      alert('✅ Lost item report created successfully! Redirecting...');
      
      // Redirect to the created item's detail page
      if (response.data?.id) {
        router.push(`/lost-item/${response.data.id}`);
      } else {
        // Fallback to browse page
        router.push('/browse-lost');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create report. Please try again.');
      console.error('Error creating lost report:', err);
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
                placeholder="Describe the item in detail (color, size, brand, unique features...)"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50 resize-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold flex items-center space-x-2">
                <span>Category</span>
                <span className="text-red-500">*</span>
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

            {/* Location */}
            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Last Seen Location</span>
              </label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="E.g., Central Plaza, Near Dragon Fountain"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>

            {/* Lost Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-medieval-gold font-semibold flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date Lost</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.lostDate}
                  onChange={(e) => setFormData({ ...formData, lostDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  aria-label="Date Lost"
                  className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-medieval-gold font-semibold">
                  Time Lost
                </label>
                <input
                  type="time"
                  value={formData.lostTime}
                  onChange={(e) => setFormData({ ...formData, lostTime: e.target.value })}
                  aria-label="Time Lost"
                  className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
                />
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

            {/* Reward */}
            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold flex items-center space-x-2">
                <Coins className="w-4 h-4" />
                <span>Reward (Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.rewardAmount}
                onChange={(e) => setFormData({ ...formData, rewardAmount: e.target.value })}
                placeholder="Enter reward amount in gold coins"
                className="w-full bg-medieval-brown border-2 border-medieval-gold/50 rounded-lg px-4 py-3 text-medieval-beige placeholder-medieval-beige/40 focus:border-medieval-gold focus:outline-none focus:ring-2 focus:ring-medieval-gold/50"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-medieval-gold font-semibold flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Photos (Optional, max 5)</span>
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

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-medieval-gold hover:bg-medieval-gold/90 text-medieval-brown font-bold py-6 text-lg"
              >
                {loading ? 'Posting Quest...' : 'POST QUEST'}
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
    </div>
  );
}
