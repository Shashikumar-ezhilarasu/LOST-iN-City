import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Lost City</h1>
          <p className="text-gray-600">Create an account to start helping your community</p>
        </div>
        
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/"
        />
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <div className="space-y-2">
            <p className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔍</span>
              <span>Find lost items and earn rewards</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-2xl">💰</span>
              <span>Build your reputation in the community</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>Complete quests and unlock achievements</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
