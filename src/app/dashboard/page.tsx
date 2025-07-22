"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { FaSpinner, FaSignOutAlt, FaUser, FaEnvelope, FaCalendarAlt, FaIdCard } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const DashboardPage: React.FC = () => {
    const { user, logOut } = useUserAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [lastLogin, setLastLogin] = useState("");

  // Redirect unauthenticated users
    useEffect(() => {
        if (!user) {
        router.push("/auth");
        } else {
        // Simulate loading user data
        setTimeout(() => {
            setIsLoading(false);
            // Set last login time (example)
            setLastLogin(new Date().toLocaleString());
        }, 800);
        }
    }, [user, router]);

    const handleLogOut = async () => {
        try {
        setIsLoggingOut(true);
        await logOut();
        router.push("/auth");
        } catch (error) {
        console.error("Logout Failed:", error);
        setIsLoggingOut(false);
        }
    };

if (!user || isLoading) {
return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-900">
    <div className="flex flex-col items-center space-y-6">
        <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <FaUser className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl text-blue-500" />
        </div>
        <p className="text-xl text-gray-600 font-medium">Loading your dashboard...</p>
    </div>
    </div>
);
}

return (
<div className="min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-900 pt-10">
    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
            <div className="dark:bg-white dark:text-gray-900 bg-gray-900 text-gray-900 rounded-xl shadow-md p-6">
                <div className="flex flex-col items-center mb-8">
                {user.photoURL ? (
                    <Image
                    height={128}
                    width={128}
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover mb-4"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-5xl">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </span>
                    </div>
                )}
                <h2 className="text-xl font-bold text-gray-900 text-center">{user.displayName || "User"}</h2>
                <p className="text-gray-600 text-center">{user.email}</p>
                <div className="mt-2 flex items-center text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Verified Account</span>
                </div>
                </div>

                <button
                    onClick={handleLogOut}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-xl transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                {isLoggingOut ? (
                    <FaSpinner className="animate-spin" />
                    ) : (
                        <FaSignOutAlt />
                    )}
                        Sign Out
                </button>

                <div className="mt-8 dark:text-gray-400  text-gray-300">
                    <h3 className="text-lg font-medium  mb-4 flex items-center">
                        <FcGoogle className="mr-2 text-xl" />
                        Google Account
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            Joined: {new Date(user.metadata.creationTime).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            Last login: {lastLogin || "Just now"}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3">
            <div className="dark:bg-white dark:text-gray-900 bg-gray-900 text-white rounded-xl shadow-md overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                        onClick={() => setActiveTab("profile")}
                        className={`py-4 px-6 text-center font-medium text-sm ${
                            activeTab === "profile"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        >
                        Profile Information
                        </button>
                        <button
                        onClick={() => setActiveTab("activity")}
                        className={`py-4 px-6 text-center font-medium text-sm ${
                            activeTab === "activity"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        >
                        Recent Activity
                        </button>
                        <button
                        onClick={() => setActiveTab("settings")}
                        className={`py-4 px-6 text-center font-medium text-sm ${
                            activeTab === "settings"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        >
                        Account Settings
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                        <h3 className="text-xl font-bold ">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-400 rounded-lg">
                            <div className="p-5 rounded-lg">
                            <h4 className="font-medium text-gray-500 mb-2 flex items-center">
                                <FaUser className="mr-2 text-blue-500" />
                                Basic Information
                            </h4>
                            <div className="space-y-3">
                                <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-medium">{user.displayName || "Not provided"}</p>
                                </div>
                                <div>
                                <p className="text-sm text-gray-500">Account ID</p>
                                <p className="font-medium text-sm">{user.uid}</p>
                                </div>
                            </div>
                            </div>
                            
                            <div className="p-5 rounded-lg">
                            <h4 className="font-medium text-gray-500 mb-2 flex items-center">
                                <FaEnvelope className="mr-2 text-blue-500" />
                                Contact Information
                            </h4>
                            <div className="space-y-3">
                                <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                <p className="text-sm text-gray-500">Email Verification</p>
                                <p className="font-medium">
                                    {user.emailVerified ? (
                                    <span className="text-green-600">Verified</span>
                                    ) : (
                                    <span className="text-yellow-600">Pending verification</span>
                                    )}
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        <div className="border border-gray-400 p-5 rounded-lg">
                            <h4 className="font-medium text-gray-500 mb-2 flex items-center">
                            <FcGoogle className="mr-2 text-xl" />
                            Connected Google Account
                            </h4>
                            <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{user.email}</p>
                                <p className="text-sm text-gray-500">
                                {user.providerData?.[0]?.providerId || "google.com"}
                                </p>
                            </div>
                            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                                Manage Connection
                            </button>
                            </div>
                        </div>
                        </div>
                    )}
                    
                    {activeTab === "activity" && (
                        <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                            <div key={item} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                                <div className="flex justify-between">
                                <div>
                                    <h4 className="font-medium">Account Login</h4>
                                    <p className="text-sm text-gray-500">Successful authentication</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{lastLogin || "Just now"}</p>
                                    <p className="text-xs text-green-600">Completed</p>
                                </div>
                                </div>
                                <div className="mt-3 flex items-center text-sm">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                <span>San Francisco, CA (Approximate location)</span>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    )}
                    
                    {activeTab === "settings" && (
                        <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                        <div className="space-y-6">
                            <div className="border border-gray-200 rounded-lg p-6">
                            <h4 className="font-medium text-lg mb-4">Security</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Password</p>
                                    <p className="text-sm text-gray-500">
                                    You can&apos;t change password for Google accounts
                                    </p>
                                </div>
                                <button 
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium cursor-not-allowed"
                                    disabled
                                >
                                    Change
                                </button>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Two-factor Authentication</p>
                                    <p className="text-sm text-gray-500">
                                    Add an extra layer of security to your account
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                                    Enable
                                </button>
                                </div>
                            </div>
                            </div>
                            
                            <div className="border border-gray-200 rounded-lg p-6">
                            <h4 className="font-medium text-lg mb-4">Account Management</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Delete Account</p>
                                    <p className="text-sm text-gray-500">
                                    Permanently remove your account and all data
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                                    Delete Account
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    </main>

    {/* Footer */}
    <footer className="dark:bg-gray-800 dark:text-gray-200  bg-white border-t md:mt-20">
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Speedobits. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500">
            Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
            Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
            Contact Us
            </a>
        </div>
        </div>
    </div>
    </footer>
</div>
);
};

export default DashboardPage;