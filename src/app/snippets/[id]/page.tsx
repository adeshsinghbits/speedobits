// app/snippets/[id]/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { database } from '@/app/firebase/config';
import { ref, onValue, off, push, remove } from 'firebase/database';
import { FaHeart, FaRegHeart, FaCopy, FaTrash, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useUserAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

type Snippet = {
  id: string;
  title: string;
  language: string;
  author: string;
  userId: string;
  code: string;
  likes: number;
  createdAt: number;
};

type Comment = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
};

export default function SnippetDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useUserAuth();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  // Fetch snippet and comments
  useEffect(() => {
    if (!id) return;

    // Fetch snippet
    const snippetRef = ref(database, `snippets/${id}`);
    const snippetUnsubscribe = onValue(snippetRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSnippet({
          id: id as string,
          title: data.title,
          language: data.language,
          author: data.userName || 'Anonymous',
          userId: data.userId || '',
          code: data.code,
          likes: data.likes || 0,
          createdAt: data.createdAt
        });
      } else {
        setSnippet(null);
      }
      setLoading(false);
    });

    // Fetch comments
    const commentsRef = ref(database, `comments/${id}`);
    const commentsUnsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsArray: Comment[] = [];
      if (data) {
        for (const commentId in data) {
          commentsArray.push({
            id: commentId,
            userId: data[commentId].userId,
            userName: data[commentId].userName,
            text: data[commentId].text,
            createdAt: data[commentId].createdAt
          });
        }
        // Sort by date (newest first)
        commentsArray.sort((a, b) => b.createdAt - a.createdAt);
      }
      setComments(commentsArray);
    });

    return () => {
      off(snippetRef, 'value', snippetUnsubscribe);
      off(commentsRef, 'value', commentsUnsubscribe);
    };
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard!');
  };

  const deleteSnippet = async () => {
    if (!user || !snippet) return;
    
    if (confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
      try {
        const snippetRef = ref(database, `snippets/${snippet.id}`);
        await remove(snippetRef);
        toast.success('Snippet deleted successfully');
        router.push('/');
      } catch (error) {
        console.error('Error deleting snippet:', error);
        toast.error('Failed to delete snippet');
      }
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const commentsRef = ref(database, `comments/${id}`);
      await push(commentsRef, {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        text: newComment.trim(),
        createdAt: Date.now()
      });
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-gray-100 pt-30 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-gray-100 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
            <FaArrowLeft className="inline mr-2" /> Back to snippets
          </Link>
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Snippet not found
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100 pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          <FaArrowLeft className="inline mr-2" /> Back to snippets
        </Link>

        {/* Snippet Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {snippet.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  By: {snippet.author}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded">
                  {snippet.language}
                </span>
                {user && user.uid === snippet.userId && (
                  <button
                    onClick={deleteSnippet}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    title="Delete snippet"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 mb-6 relative">
              <pre className="p-4 bg-gray-800 text-gray-100 rounded-lg text-sm overflow-x-auto">
                <code>{snippet.code}</code>
              </pre>
              <button 
                onClick={() => copyToClipboard(snippet.code)}
                className="absolute top-4 right-4 bg-gray-700 p-2 rounded hover:bg-gray-600 transition-colors"
              >
                <FaCopy className="text-white" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={handleLike}
                  className="flex items-center text-sm"
                >
                  {liked ? (
                    <FaHeart className="text-red-500 mr-1" />
                  ) : (
                    <FaRegHeart className="text-gray-500 dark:text-gray-400 mr-1" />
                  )}
                  <span className="text-gray-600 dark:text-gray-400">
                    {snippet.likes + (liked ? 1 : 0)}
                  </span>
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(snippet.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Comments</h2>

          {user ? (
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <FaPaperPlane className="inline mr-2" />
                Post Comment
              </button>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <Link href="/login" className="text-blue-500 hover:underline">Log in</Link> to post a comment.
            </p>
          )}

          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 italic">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{comment.userName}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}