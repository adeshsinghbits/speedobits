"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { FaSpinner, FaSignOutAlt, FaUser, FaEnvelope, FaCalendarAlt, FaCode } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { database } from "@/app/firebase/config";
import { ref, query, orderByChild, equalTo, onValue } from "firebase/database";
import Link from "next/link";

const DashboardPage: React.FC = () => {
    const { user, logOut } = useUserAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [lastLogin, setLastLogin] = useState("");
    const [snippetStats, setSnippetStats] = useState({
        totalSnippets: 0,
        lastShared: "",
        mostPopularLanguage: "",
        totalLikes: 0
    });

    // Fetch user snippets data
    useEffect(() => {
        if (!user) {
            router.push("/auth");
        } else {
            const fetchUserData = async () => {
                try {
                    // Set last login time
                    setLastLogin(new Date().toLocaleString());
                    
                    // Fetch snippets data
                    const snippetsRef = ref(database, 'snippets');
                    const userSnippetsQuery = query(
                        snippetsRef,
                        orderByChild('userId'),
                        equalTo(user.uid)
                    );
                    
                    onValue(userSnippetsQuery, (snapshot) => {
                        const snippetsData = snapshot.val();
                        if (snippetsData) {
                            const snippetsArray = Object.values(snippetsData);
                            const stats = {
                                totalSnippets: snippetsArray.length,
                                lastShared: snippetsArray.reduce((latest, snippet) => {
                                    return snippet.createdAt > (latest?.createdAt || 0) ? snippet : latest;
                                }, {}).createdAt,
                                mostPopularLanguage: getMostPopularLanguage(snippetsArray),
                                totalLikes: snippetsArray.reduce((sum, snippet) => sum + (snippet.likes || 0), 0)
                            };
                            setSnippetStats({
                                totalSnippets: stats.totalSnippets,
                                lastShared: stats.lastShared ? new Date(stats.lastShared).toLocaleDateString() : "Never",
                                mostPopularLanguage: stats.mostPopularLanguage || "None",
                                totalLikes: stats.totalLikes
                            });
                        }
                        setIsLoading(false);
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setIsLoading(false);
                }
            };

            fetchUserData();
        }
    }, [user, router]);

    const getMostPopularLanguage = (snippets: any[]) => {
        const languageCounts: Record<string, number> = {};
        snippets.forEach(snippet => {
            const lang = snippet.language;
            languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        });
        return Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    };

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

                            {/* Snippet Stats */}
                            <div className="mb-6 dark:text-gray-700 text-gray-200">
                                <h3 className="text-lg font-medium mb-3 flex items-center">
                                    <FaCode className="mr-2 text-blue-500" />
                                    Code Snippets
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between">
                                        <span>Total Shared:</span>
                                        <span className="font-medium">{snippetStats.totalSnippets}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Total Likes:</span>
                                        <span className="font-medium">{snippetStats.totalLikes}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Last Shared:</span>
                                        <span className="font-medium">{snippetStats.lastShared}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Top Language:</span>
                                        <span className="font-medium">{snippetStats.mostPopularLanguage}</span>
                                    </p>
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

                            <div className="mt-8 dark:text-gray-400 text-gray-300">
                                <h3 className="text-lg font-medium mb-4 flex items-center">
                                    <FcGoogle className="mr-2 text-xl" />
                                    Google Account
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p className="flex items-center">
                                        <FaCalendarAlt className="mr-2" />
                                        Joined: {new Date(user.metadata.creationTime).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center">
                                        <FaCalendarAlt className="mr-2" />
                                        Last login: {lastLogin || "Just now"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Panel */}
                    <div className="lg:col-span-3">
                        <div className="dark:bg-white dark:text-gray-900 bg-gray-900 text-white rounded-xl shadow-md overflow-hidden">
                            {/* Tab Content */}
                            <div className="p-6">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold">My Coding Activity</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Snippet Statistics Card */}
                                            <div className="border border-gray-200 rounded-lg p-6">
                                                <h4 className="font-medium text-gray-500 mb-4 flex items-center">
                                                    <FaCode className="mr-2 text-blue-500" />
                                                    Snippet Statistics
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Total Snippets Shared</p>
                                                            <p className="text-2xl font-bold">{snippetStats.totalSnippets}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Total Likes Received</p>
                                                            <p className="text-2xl font-bold">{snippetStats.totalLikes}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Most Used Language</p>
                                                            <p className="text-xl font-medium">{snippetStats.mostPopularLanguage}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Recent Activity Card */}
                                            <div className="border border-gray-200 rounded-lg p-6">
                                                <h4 className="font-medium text-gray-500 mb-4 flex items-center">
                                                    <FaCalendarAlt className="mr-2 text-blue-500" />
                                                    Recent Activity
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Last Snippet Shared</p>
                                                        <p className="font-medium">
                                                            {snippetStats.lastShared === "Never" 
                                                                ? "No snippets shared yet" 
                                                                : snippetStats.lastShared}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Account Created</p>
                                                        <p className="font-medium">
                                                            {new Date(user.metadata.creationTime).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Last Login</p>
                                                        <p className="font-medium">{lastLogin}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-medium text-gray-500 mb-4">My Snippet Performance</h4>
                                            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                                [Snippet performance chart placeholder]
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2 text-center">
                                                View all your snippets in the <Link href="/snippets" className="text-blue-500 hover:underline">community section</Link>
                                            </p>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="dark:bg-gray-800 dark:text-gray-200 bg-white border-t md:mt-20">
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