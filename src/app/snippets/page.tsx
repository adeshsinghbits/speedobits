"use client";
import { useState, useEffect } from 'react';
import { database } from '@/app/firebase/config';
import { ref, onValue, off, remove } from 'firebase/database';
import { FaSearch, FaHeart, FaRegHeart, FaCopy, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useUserAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

type Snippet = {
  id: string;
  title: string;
  language: string;
  author: string;
  userId: string; // Added user ID for ownership check
  code: string;
  likes: number;
  createdAt: number;
};

export default function CodeSnippetsPage() {
  const { user } = useUserAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedSnippets, setLikedSnippets] = useState<string[]>([]);
  
  // Fetch snippets from Firebase
  useEffect(() => {
    const snippetsRef = ref(database, 'snippets');
    
    const fetchData = onValue(snippetsRef, (snapshot) => {
      const data = snapshot.val();
      const snippetsArray: Snippet[] = [];
      
      for (const id in data) {
        snippetsArray.push({
          id,
          title: data[id].title,
          language: data[id].language,
          author: data[id].userName || 'Anonymous',
          userId: data[id].userId || '', // Store user ID
          code: data[id].code,
          likes: data[id].likes || 0,
          createdAt: data[id].createdAt
        });
      }
      
      // Sort by most recent first
      snippetsArray.sort((a, b) => b.createdAt - a.createdAt);
      setSnippets(snippetsArray);
      setLoading(false);
    });

    return () => off(snippetsRef, 'value', fetchData);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = snippets.filter(snippet => 
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedLanguage !== 'all') {
      result = result.filter(snippet => 
        snippet.language.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    setFilteredSnippets(result);
  }, [searchTerm, selectedLanguage, snippets]);

  // Get unique languages
  const languages = ['all', ...new Set(snippets.map(snippet => snippet.language))];

  const handleLike = (id: string) => {
    if (likedSnippets.includes(id)) {
      setLikedSnippets(likedSnippets.filter(snippetId => snippetId !== id));
    } else {
      setLikedSnippets([...likedSnippets, id]);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard!');
  };

  const deleteSnippet = async (snippetId: string) => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
      try {
        const snippetRef = ref(database, `snippets/${snippetId}`);
        await remove(snippetRef);
        toast.success('Snippet deleted successfully');
      } catch (error) {
        console.error('Error deleting snippet:', error);
        toast.error('Failed to delete snippet');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-gray-100 pt-30 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Discover & Share Code Snippets
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore a curated collection of code snippets from the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Languages:</span>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span 
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-all ${
                      selectedLanguage === lang 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {filteredSnippets.length} {filteredSnippets.length === 1 ? 'snippet' : 'snippets'} found
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search snippets by title, language, or author..."
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Snippets Grid */}
        {filteredSnippets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👨‍💻</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No snippets found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <div 
                key={snippet.id} 
                className="bg-white  dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow relative"
              >
                {/* Delete button for author */}
                {user && user.uid === snippet.userId && (
                  <button
                    onClick={() => deleteSnippet(snippet.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors z-10"
                    title="Delete snippet"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
                
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                        {snippet.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        By: {snippet.author}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium rounded">
                      {snippet.language}
                    </span>
                  </div>
                  
                  <div className="mt-4 overflow-hidden relative group">
                    <Link href={`/snippets/${snippet.id}`}>
                      <pre className="p-4 bg-gray-800 text-gray-100 rounded-lg text-sm max-h-40">
                        <code>{snippet.code}</code>
                      </pre>
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(snippet.code);
                      }}
                      className="absolute top-2 right-2 bg-gray-700 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaCopy className="text-white" />
                    </button>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <button 
                        onClick={() => handleLike(snippet.id)}
                        className="flex items-center text-sm"
                      >
                        {likedSnippets.includes(snippet.id) ? (
                          <FaHeart className="text-red-500 mr-1" />
                        ) : (
                          <FaRegHeart className="text-gray-500 dark:text-gray-400 mr-1" />
                        )}
                        <span className="text-gray-600 dark:text-gray-400">
                          {snippet.likes + (likedSnippets.includes(snippet.id) ? 1 : 0)}
                        </span>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </div>
                    <Link 
                      href={`/snippets/${snippet.id}`}
                      className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 