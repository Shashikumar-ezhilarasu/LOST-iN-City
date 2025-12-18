'use client';

import { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { Search, MapPin, Calendar, Filter, Eye, MessageSquare, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { LostReportResponse } from "@/lib/api";

export default function BrowseLostPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [lostItems, setLostItems] = useState<LostReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    if (isLoaded) {
      fetchLostItems();
    }
  }, [searchQuery, categoryFilter, isLoaded, isSignedIn]);

  // Refetch when page becomes visible (handles navigation back from report page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isLoaded) {
        fetchLostItems();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoaded, searchQuery, categoryFilter, isSignedIn]);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth token if user is signed in
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const params = new URLSearchParams({
        page: '1',
        pageSize: '20',
        ...(searchQuery && { q: searchQuery }),
        ...(categoryFilter && { category: categoryFilter }),
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lost-reports?${params}`, {
        headers,
        cache: 'no-store', // Ensure fresh data on every fetch
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // API returns { data: [...], meta: {...} } where data is the array directly
      setLostItems(data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching lost items:', err);
      setError(err.message || 'Failed to fetch lost items');
      setLostItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

      {/* Error Message */}
      {error && (
        <div className="fantasy-card p-4 bg-red-900/20 border-2 border-red-600">
          <p className="text-red-400">{error}</p>
        </div>
      )}

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <button 
              onClick={() => setCategoryFilter("")}
              className={`px-4 py-2 ${!categoryFilter ? 'bg-medieval-gold text-medieval-brown' : 'bg-medieval-brown-light border-2 border-medieval-gold/30 text-medieval-beige hover:border-medieval-gold'} rounded-lg font-semibold text-sm`}>
              All Items
            </button>
            <button 
              onClick={() => setCategoryFilter("Electronics")}
              className={`px-4 py-2 ${categoryFilter === "Electronics" ? 'bg-medieval-gold text-medieval-brown' : 'bg-medieval-brown-light border-2 border-medieval-gold/30 text-medieval-beige hover:border-medieval-gold'} rounded-lg font-semibold text-sm`}>
              Electronics
            </button>
            <button 
              onClick={() => setCategoryFilter("Personal Items")}
              className={`px-4 py-2 ${categoryFilter === "Personal Items" ? 'bg-medieval-gold text-medieval-brown' : 'bg-medieval-brown-light border-2 border-medieval-gold/30 text-medieval-beige hover:border-medieval-gold'} rounded-lg font-semibold text-sm`}>
              Personal Items
            </button>
            <button 
              onClick={() => setCategoryFilter("Accessories")}
              className={`px-4 py-2 ${categoryFilter === "Accessories" ? 'bg-medieval-gold text-medieval-brown' : 'bg-medieval-brown-light border-2 border-medieval-gold/30 text-medieval-beige hover:border-medieval-gold'} rounded-lg font-semibold text-sm`}>
              Accessories
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between px-2">
        <p className="text-medieval-beige/80 text-sm">
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <span className="text-medieval-gold font-bold">{lostItems?.length || 0}</span> lost items awaiting heroes
            </>
          )}
        </p>
        <select 
          aria-label="Sort lost items"
          className="bg-medieval-brown-light border-2 border-medieval-gold/30 rounded-lg px-3 py-2 text-medieval-beige text-sm focus:border-medieval-gold focus:outline-none">
          <option>Newest First</option>
          <option>Highest Reward</option>
          <option>Most Urgent</option>
          <option>Nearest Location</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-medieval-gold"></div>
          <p className="text-medieval-beige/80 mt-4">Loading lost items...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && lostItems.length === 0 && (
        <div className="fantasy-card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="fantasy-title text-xl mb-2">No Lost Items Found</h3>
          <p className="text-medieval-beige/80 mb-6">
            {searchQuery || categoryFilter 
              ? "Try adjusting your search or filters" 
              : "Be the first to report a lost item!"}
          </p>
          <Link href="/report-lost">
            <Button className="fantasy-button">Report Lost Item</Button>
          </Link>
        </div>
      )}

      {/* Items Grid */}
      {!loading && lostItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lostItems.map((item) => (
            <Card key={item.id} className="fantasy-card overflow-hidden hover:scale-105 transition-transform duration-200">
              <div className="relative h-48 w-full overflow-hidden bg-medieval-brown-light">
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
                {item.rewardAmount && (
                  <div className="absolute top-2 right-2 bg-medieval-gold text-medieval-brown px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Coins className="w-3 h-3" />
                    <span>{item.rewardAmount}</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-medieval-brown/90 border-2 border-medieval-gold/50 px-2 py-1 rounded-lg flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3 text-medieval-gold" />
                  <span className="text-xs text-medieval-beige font-semibold">0</span>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <h3 className="fantasy-title text-lg">
                  {item.title}
                </h3>
                
                <p className="text-sm text-medieval-beige/80 line-clamp-2">
                  {item.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-medieval-beige/70">
                    <MapPin className="w-4 h-4 text-medieval-gold" />
                    <span>{item.locationName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-medieval-beige/70">
                    <Calendar className="w-4 h-4 text-medieval-gold" />
                    <span>{formatDate(item.lostAt)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/lost-item/${item.id}`}>
                    <Button className="fantasy-button w-full flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>VIEW DETAILS</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="fantasy-card p-4 bg-medieval-gold/5">
        <p className="text-xs text-medieval-beige/70 text-center">
          💰 <span className="font-semibold">Hero Tip:</span> When you find an item, you can report it and help connect it with the owner to earn the reward!
        </p>
      </div>
    </div>
  );
}
