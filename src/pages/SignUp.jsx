import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
              card: 'bg-white shadow rounded-lg',
              headerTitle: 'text-gray-900',
              headerSubtitle: 'text-gray-600',
              socialButtonsBlockButton: 
                'border border-gray-300 hover:bg-gray-50 text-gray-700',
              formFieldInput: 
                'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
              footerActionLink: 'text-indigo-600 hover:text-indigo-500'
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
} 