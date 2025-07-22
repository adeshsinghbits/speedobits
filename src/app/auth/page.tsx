"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";

const AuthPage: React.FC = () => {
  const { user, googleSignIn } = useUserAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      // Simulate initial auth check with slight delay
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [user, router]);
  
  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await googleSignIn();
    } catch (error) {
      console.error("Login Failed:", error);
      setIsSigningIn(false);
    }
  };

  // Show loading spinner during initial check or sign-in process
  if (isLoading || isSigningIn || user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <FcGoogle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl" />
          </div>
          <p className="text-lg">
            {isSigningIn ? "Signing you in..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-900">
      <div className="shadow-xl border dark:border-gray-200 rounded-2xl p-8 w-full max-w-md text-center transform transition-all duration-300 hover:scale-[1.02]">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full p-4 inline-block">
            <div className="bg-white rounded-full p-4">
              <FcGoogle className="text-5xl" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 dark:text-gray-300   text-gray-900">Welcome to Speedobits</h1>
        <p className="text-gray-600 mb-8">Sign in to access your account</p>
        
        <div className="space-y-6">
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="flex items-center justify-center gap-3 dark:bg-gray-800 dark:text-white bg-white py-3 px-6 rounded-xl transition-all w-full border border-gray-300 text-lg font-medium shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <FaSpinner className="animate-spin text-blue-500" />
                Signing in...
              </>
            ) : (
              <>
                <FcGoogle className="text-2xl" />
                Sign in with Google
              </>
            )}
          </button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>By signing in, you agree to our</p>
            <p>
              <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and 
              <a href="#" className="text-blue-500 hover:underline"> Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Secure authentication powered by Google</p>
        <div className="flex items-center justify-center mt-2">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span>All connections are encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;