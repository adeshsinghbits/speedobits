// app/page.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { useUserAuth } from '@/app/context/AuthContext';
import dynamic from 'next/dynamic';
import { LANGUAGE_CONFIG } from '@/app/constants';
import ControlPanel from '@/app/components/ControlPanel';
import EditorHeader from '@/app/components/EditorHeader';
import OutputHeader from '@/app/components/OutputHeader';
import OutputPlaceholder from '@/app/components/OutputPlaceholder';
import { database } from '@/app/firebase/config';
import { ref, push, serverTimestamp } from 'firebase/database'
import { toast } from 'react-hot-toast';
// Dynamically import Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  ),
});

export default function CodeEditorPage() {
  const { user } = useUserAuth();
  const [code, setCode] = useState(LANGUAGE_CONFIG.javascript.starter);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef<any>(null);
  
  const [isSharing, setIsSharing] = useState(false);
  const [shareTitle, setShareTitle] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const shareToCommunity = async () => {
    if (!user) {
      alert('Please login to share your code');
      return;
    }
    
    setIsSharing(true);
    try {
      const snippetsRef = ref(database, 'snippets');
      await push(snippetsRef, {
        title: shareTitle || 'Untitled Snippet',
        code,
        language,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
        likes: 0,
        views: 0
      });
      toast.success('Snippet shared successfully');
      setShowShareModal(false);
      setShareTitle('');
    } catch (error) {
      console.error('Error sharing snippet:', error);
      alert('Failed to share snippet');
    } finally {
      setIsSharing(false);
    }
  };

  const languageOptions = Object.entries(LANGUAGE_CONFIG).map(([id, config]) => ({
    id,
    name: config.name
  }));
  // When language changes, reset the code to the starter
  useEffect(() => {
    setCode(LANGUAGE_CONFIG[language].starter);
    setOutput('');
    setExecutionTime(null);
  }, [language]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    setExecutionTime(null);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: LANGUAGE_CONFIG[language].piston,
          version: LANGUAGE_CONFIG[language].version,
          files: [{ content: code }],
        }),
      });
      console.log(code, "user",user);
      
      const data = await response.json();
      
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      
      if (data.run) {
        setOutput(data.run.output || data.run.stderr || 'No output');
      } else if (data.message) {
        setOutput(`Error: ${data.message}`);
      } else {
        setOutput('Unexpected response from execution engine');
      }
    } catch (error: any) {
      setOutput(`Network error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };


  const resetCode = () => {
    if (confirm('Are you sure you want to reset the code to the starter?')) {
      setCode(LANGUAGE_CONFIG[language].starter);
      setOutput('');
      setExecutionTime(null);
    }
  };

  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Editor Column */}
          <div className="lg:col-span-3 min-h-[85vh] flex flex-col gap-6">
            <ControlPanel
              language={language}
              onLanguageChange={setLanguage}
              onRun={runCode}
              isRunning={isRunning}
              onReset={resetCode}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              languageOptions={languageOptions}
              icons={language.icon}
              onShare={() => setShowShareModal(true)}
            />

            {/* Editor */}
            <div className="bg-gray-800 rounded-xl overflow-hidden flex-1 flex flex-col shadow-xl">
              <EditorHeader 
                language={language} 
                lineCount={code.split('\n').length} 
              />
              <div className="flex-1">
                <MonacoEditor
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme={"vs-dark"}
                  options={{
                    minimap: { enabled: true },
                    fontSize: fontSize,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: 'Fira Code, monospace',
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    glyphMargin: true,
                    folding: true,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                  }}
                  onMount={handleEditorMount}
                />
              </div>
            </div>
          </div>
          
          {/* Output Column */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Output Panel */}
            <div className="bg-gray-800 rounded-xl h-full flex flex-col shadow-xl">
              <OutputHeader 
                executionTime={executionTime} 
              />
              <div className="flex-1 p-4 font-mono text-sm whitespace-pre-wrap overflow-auto bg-gray-900/50">
                {output || <OutputPlaceholder />}
              </div>
            </div>
          </div>
          {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Share to Community</h3>
              <input
                type="text"
                placeholder="Enter snippet title"
                className="w-full p-3 bg-gray-700 rounded-lg mb-4"
                value={shareTitle}
                onChange={(e) => setShareTitle(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={shareToCommunity}
                  disabled={isSharing}
                  className={`px-4 py-2 rounded-md ${
                    isSharing ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isSharing ? 'Sharing...' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}