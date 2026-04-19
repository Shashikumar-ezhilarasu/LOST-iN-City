'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Sparkles, Wand2, ArrowRight, ShieldCheck, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface MatchDetail {
  foundReportId: string;
  foundReportTitle: string;
  matchScore: number;
  reasoning: string;
  category: string;
  foundLocation: string;
  foundDescription: string;
}

interface AIMatch {
  lostReportId: string;
  lostReportTitle: string;
  matches: MatchDetail[];
}

export default function MagicMatches() {
  const { getToken, isSignedIn } = useAuth();
  const [matches, setMatches] = useState<AIMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchMatches();
    }
  }, [isSignedIn]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/matches`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`The mystical scrolls are silent (HTTP ${response.status})`);
      }

      const result = await response.json();
      setMatches(result);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching AI matches:', err);
      // Don't show error to user if it's just a missing API key on backend
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      fetchMatches();
      setIsScanning(false);
    }, 3000);
  };

  if (loading && !isScanning) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-12 h-12 text-medieval-gold animate-spin" />
      </div>
    );
  }

  return (
    <Card className="fantasy-card relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Wand2 className="w-32 h-32 text-medieval-gold" />
      </div>

      <CardHeader className="border-b-2 border-medieval-gold/20 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="fantasy-title text-2xl flex items-center space-x-3">
            <Sparkles className="w-7 h-7 text-medieval-gold animate-pulse" />
            <span>AI TYPICAL MATCHES</span>
          </CardTitle>
          <Button 
            onClick={startScan} 
            disabled={isScanning}
            className="fantasy-button bg-none border-2 border-medieval-gold text-medieval-gold hover:bg-medieval-gold/10 px-4 py-1 h-auto text-xs"
          >
            {isScanning ? "CONJURING..." : "REFRESH VISION"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center space-y-4"
            >
              <Loader2 className="w-16 h-16 text-medieval-gold animate-spin mx-auto" />
              <p className="fantasy-title text-xl animate-pulse">Scanning the realm for matches...</p>
              <p className="text-medieval-beige/60 italic text-sm">Consulting the ancient Gemini scrolls</p>
            </motion.div>
          ) : matches.length > 0 ? (
            <div className="space-y-8">
              {matches.map((group, idx) => (
                <motion.div 
                  key={group.lostReportId}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-medieval-gold/30" />
                    <h3 className="text-medieval-gold font-bold text-sm uppercase tracking-widest whitespace-nowrap">
                      Your Lost {group.lostReportTitle}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-medieval-gold/30" />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {group.matches.map((match, mIdx) => (
                      <div 
                        key={match.foundReportId}
                        className="group relative bg-medieval-brown/50 rounded-xl border-2 border-medieval-gold/20 p-5 hover:border-medieval-gold/60 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-3">
                              <span className="bg-medieval-gold/10 text-medieval-gold text-[10px] px-2 py-0.5 rounded border border-medieval-gold/30 font-bold uppercase">
                                Typical Match
                              </span>
                              <div className="flex items-center text-xs text-medieval-beige/50">
                                <ShieldCheck className="w-3 h-3 mr-1 text-green-500/70" />
                                {match.matchScore}% Confidence
                              </div>
                            </div>
                            
                            <h4 className="fantasy-title text-lg">{match.foundReportTitle}</h4>
                            
                            <div className="flex items-center space-x-4 text-xs text-medieval-beige/60 italic">
                              <span className="flex items-center">
                                <Info className="w-3 h-3 mr-1" />
                                {match.category}
                              </span>
                              <span>•</span>
                              <span>Found at: {match.foundLocation}</span>
                            </div>

                            <p className="text-sm text-medieval-beige/80 bg-medieval-gold/5 p-3 rounded-lg border-l-4 border-medieval-gold italic leading-relaxed mt-3">
                              <span className="block font-bold text-medieval-gold mb-1 not-italic text-[10px] uppercase tracking-wider">Guardian's Description:</span>
                              "{match.foundDescription}"
                            </p>

                            <p className="text-sm text-medieval-gold bg-medieval-gold/10 p-3 rounded-lg border-l-4 border-medieval-gold font-medium leading-relaxed mt-3">
                              <span className="block font-bold text-medieval-gold mb-1 text-[10px] uppercase tracking-wider">AI Insight:</span>
                              "{match.reasoning}"
                            </p>
                          </div>

                          <div className="flex items-center justify-end">
                            <Link href={`/found-item/${match.foundReportId}`}>
                              <Button className="fantasy-button py-2 px-4 text-sm flex items-center group-hover:scale-105 transition-transform">
                                <span>VIEW ITEM</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-4 bg-medieval-gold/5 rounded-2xl border-2 border-dashed border-medieval-gold/20">
              <div className="w-16 h-16 bg-medieval-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-medieval-gold/40" />
              </div>
              <p className="fantasy-title text-lg text-medieval-beige/60">No sightings reported yet</p>
              <p className="text-medieval-beige/40 max-w-sm mx-auto text-sm italic px-4">
                Our AI scouts are patrolling the realm. When a matching item is found, it will appear here in your vision.
              </p>
            </div>
          )}
        </AnimatePresence>
      </CardContent>

      <div className="bg-medieval-gold/10 p-4 border-t-2 border-medieval-gold/20 text-center">
        <p className="text-[10px] text-medieval-gold/60 uppercase tracking-[0.2em] font-bold">
          Powered by Gemini Vision • Medieval Intelligence System
        </p>
      </div>
    </Card>
  );
}

// Minimal Link stub since it wasn't imported
import Link from 'next/link';
