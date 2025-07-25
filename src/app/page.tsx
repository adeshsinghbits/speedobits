"use client";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaCode, FaUsers, FaRocket, FaChartLine, FaGithub, FaUser, FaSpinner } from "react-icons/fa";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import Link from "next/link";

const HomePage = () => {
  const { user, googleSignIn } = useUserAuth();
  console.log("user", user);
  
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState([
    { value: "10K+", label: "Active Users" },
    { value: "100K+", label: "Projects Created" },
    { value: "1M+", label: "Lines of Code" },
  ]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Initialize theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Handle sign in
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await googleSignIn();
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Failed:", error);
      setIsLoading(false);
    }
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Full Stack Developer",
      content: "CodeCollab transformed how our remote team works. Real-time collaboration and the built-in editor are game-changers!",
    },
    {
      name: "Samantha Lee",
      role: "Engineering Lead",
      content: "The dashboard analytics helped us optimize our workflow and identify bottlenecks. Our productivity increased by 40%.",
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      content: "As a non-technical founder, CodeCollab helped me understand our codebase and collaborate effectively with developers.",
    },
  ];

  // Features data
  const features = [
    {
      icon: <FaCode className="text-3xl text-indigo-500" />,
      title: "Real-time Code Editor",
      description: "Collaborate with your team in real-time with syntax highlighting, auto-completion, and live preview."
    },
    {
      icon: <FaUsers className="text-3xl text-blue-500" />,
      title: "Team Collaboration",
      description: "Invite team members, assign tasks, and track progress in a shared workspace designed for developers."
    },
    {
      icon: <FaRocket className="text-3xl text-purple-500" />,
      title: "Deployment Tools",
      description: "Deploy your applications directly from the platform with one-click deployments to popular cloud services."
    },
    {
      icon: <FaChartLine className="text-3xl text-green-500" />,
      title: "Performance Analytics",
      description: "Get insights into your code performance, team productivity, and project health with detailed analytics."
    },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                <span className="block">Collaborate. Code.</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Create Together.
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
                CodeCollab is the ultimate platform for developers to collaborate in real-time, 
                share projects, and build amazing applications together.
              </p>
              {user && (
                <div  className="mt-10 flex flex-col sm:flex-row gap-4">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Welcome,<span className="text-indigo-600"> {user.displayName} </span>
                  </h2>
                </div>
              )}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {!user && (
                  <button
                    className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition"
                    onClick={handleSignIn}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <FcGoogle className="text-xl" />
                        Get Started with Google
                      </div>
                    )}
                  </button>
                )}
                <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
                  <FaGithub />
                  View on GitHub
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-1 shadow-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                  <div className="bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      <div>
                        <h3 className="font-bold text-lg dark:text-white">Project Dashboard</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">2 collaborators • Updated 2 hours ago</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                      <div className="text-green-600 dark:text-green-400"> Welcome to Speedobits</div>
                      <div className="text-purple-600 dark:text-purple-400">function</div>
                      <div className="ml-4">
                        <div className="text-blue-600 dark:text-blue-400">collaborate</div>
                        <div className="ml-4 text-gray-700 dark:text-gray-300">console.<span className="text-yellow-600 dark:text-yellow-400">log</span>(<span className="text-green-600 dark:text-green-400">Building amazing things together</span>);</div>
                      </div>
                      <div className="text-purple-600 dark:text-purple-400"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="mt-2 text-xl opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Powerful Features for Developers</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to build, collaborate, and deploy your projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">How CodeCollab Works</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started in minutes and supercharge your development workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 lg:block hidden"></div>
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sign Up & Create Project</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create an account in seconds using Google authentication and start a new project with one click.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-600 to-purple-600 lg:block hidden"></div>
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Invite & Collaborate</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Invite team members to your project and start coding together in real-time with our collaborative editor.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Deploy & Analyze</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Deploy your application with one click and monitor performance with our built-in analytics dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Trusted by Developers</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who have transformed their workflow with CodeCollab
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 flex items-center justify-center">
                <FaUser className="text-3xl text-gray-400" />
              </div>
              
              <div className="mb-6">
                <p className="text-xl italic text-gray-700 dark:text-gray-300">
                  &quot;{testimonials[activeTestimonial].content}&quot;
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {testimonials[activeTestimonial].name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
              
              <div className="flex mt-8 space-x-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${
                      activeTestimonial === index 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Development Workflow?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join thousands of developers building amazing things together with CodeCollab
          </p>
          {!user ? (
            <button
              onClick={googleSignIn}
              className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              Sign up with Google
            </button>
          ) : (
            <Link href="/dashboard" className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
              Go to Dashboard
            </Link>
          )}
          <p className="mt-4 text-blue-200">No credit card required • Free forever plan</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white">Speedobits</span>
              </div>
              <p className="mt-4">
                The ultimate platform for collaborative coding and project management.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© {new Date().getFullYear()} CodeCollab. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-sm hover:text-white"
              >
                {theme === "light" ? (
                  <>
                    <FaRegLightbulb className="text-yellow-400" />
                    Switch to Dark Mode
                  </>
                ) : (
                  <>
                    <FaLightbulb className="text-yellow-400" />
                    Switch to Light Mode
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;