import { Sparkles, Coins, Search, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="space-y-8 py-8">
      {/* Hero Banner */}
      <div className="fantasy-card p-8 md:p-12 text-center space-y-6">
        <div className="flex justify-center mb-4">
          <Sparkles className="w-16 h-16 text-medieval-gold animate-pulse" />
        </div>
        
        <h1 className="fantasy-title text-3xl md:text-5xl mb-4">
          FIND & REWARD
        </h1>
        
        <p className="text-xl md:text-2xl text-medieval-beige mb-2">
          Reconnect with Lost Belongings!
        </p>
        
        <p className="text-sm md:text-base text-medieval-beige/80 max-w-2xl mx-auto">
          Embark on noble quests to reunite lost treasures with their rightful owners. 
          Earn gold, gain experience, and become a legendary hero of humanity!
        </p>
        
        <Link href="/quests">
          <Button className="fantasy-button text-lg md:text-xl mt-6 py-6 px-8 md:px-12">
            START YOUR QUEST (Sign Up)
          </Button>
        </Link>
      </div>

      {/* How It Works Section */}
      <div className="mt-12">
        <h2 className="fantasy-title text-2xl md:text-3xl text-center mb-8">
          HOW IT WORKS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="fantasy-card p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full gold-border bg-medieval-brown flex items-center justify-center">
                <Coins className="w-10 h-10 text-medieval-gold" />
              </div>
            </div>
            
            <h3 className="fantasy-title text-lg">
              1. POST & REWARD
            </h3>
            
            <p className="text-medieval-beige text-sm">
              Set coins or cash as a reward for your lost item. 
              The greater the bounty, the more adventurers will seek it!
            </p>
          </div>

          {/* Step 2 */}
          <div className="fantasy-card p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full gold-border bg-medieval-brown flex items-center justify-center">
                <Search className="w-10 h-10 text-medieval-gold" />
              </div>
            </div>
            
            <h3 className="fantasy-title text-lg">
              2. FIND & CONNECT
            </h3>
            
            <p className="text-medieval-beige text-sm">
              Browse quests for found items. When you discover a match, 
              initiate contact through our secure messenger!
            </p>
          </div>

          {/* Step 3 */}
          <div className="fantasy-card p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full gold-border bg-medieval-brown flex items-center justify-center">
                <Handshake className="w-10 h-10 text-medieval-gold" />
              </div>
            </div>
            
            <h3 className="fantasy-title text-lg">
              3. HANDOVER & CLAIM
            </h3>
            
            <p className="text-medieval-beige text-sm">
              Complete the handover at a safe meeting point. 
              Claim your reward and level up your hero status!
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="fantasy-card p-6 text-center bg-gradient-to-r from-medieval-brown-light to-medieval-brown">
        <p className="text-medieval-gold text-lg mb-4">
          Ready to begin your legendary journey?
        </p>
        <Link href="/quests">
          <Button className="fantasy-button">
            ENTER THE REALM
          </Button>
        </Link>
      </div>
    </div>
  );
}
