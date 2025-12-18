'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';

export default function AdminDatabasePage() {
  const { getToken } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  const updateAllUsers = async () => {
    if (!confirm('This will update ALL users in the database to have minimum 1000 coins. Continue?')) {
      return;
    }

    setUpdating(true);
    setResult(null);

    try {
      const token = await getToken();
      
      if (!token) {
        setResult({ success: false, message: 'Authentication error. Please sign in again.' });
        setUpdating(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/admin/update-all-balances`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          success: true,
          message: data.data.message,
          count: data.data.users_updated
        });
      } else {
        const errorText = await response.text();
        let errorMsg = `HTTP ${response.status}`;
        try {
          const error = JSON.parse(errorText);
          errorMsg = error.message || errorMsg;
        } catch {}
        setResult({ success: false, message: `Failed to update: ${errorMsg}` });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-medieval-brown to-medieval-brown-light p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 bg-medieval-beige border-4 border-medieval-gold">
          <div className="text-center mb-6">
            <Database className="w-16 h-16 mx-auto text-medieval-gold mb-4" />
            <h1 className="text-3xl font-bold text-medieval-brown mb-2">
              Admin Database Tools
            </h1>
            <p className="text-medieval-brown-light">
              Manage database-wide operations
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-2 border-yellow-600 bg-yellow-50">
              <h2 className="text-xl font-bold text-medieval-brown mb-3">
                Update All User Balances
              </h2>
              <p className="text-medieval-brown-light mb-4">
                This will update all users in the database to have a minimum balance of 1000 coins.
                Users with 1000+ coins will not be affected.
              </p>
              
              <Button
                onClick={updateAllUsers}
                disabled={updating}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3"
              >
                {updating ? 'Updating All Users...' : 'Update All Users to 1000 Coins'}
              </Button>
            </Card>

            {result && (
              <Card className={`p-6 border-2 ${result.success ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
                <div className="flex items-start gap-4">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                      {result.success ? 'Success!' : 'Error'}
                    </h3>
                    <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                      {result.message}
                    </p>
                    {result.count !== undefined && (
                      <p className="text-green-700 font-bold mt-2">
                        Users updated: {result.count}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">ℹ️ Information</h3>
              <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
                <li>New users automatically start with 1000 coins</li>
                <li>This updates existing users who have less than 1000</li>
                <li>The system tracks all coin transactions for auditing</li>
                <li>Rewards are deducted from owner and given to finder</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
