"use client";
export default function EditorHeader({
  language,
  lineCount
}: {
  language: string;
  lineCount: number;
}) {
  return (
    <div className="px-4 py-3 bg-gray-900 flex justify-between items-center">
      <h2 className="font-medium flex items-center gap-2">
        {/* Editor Icon */}
        Editor
      </h2>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
          {language}
        </span>
        <span className="text-xs text-gray-400">
          {lineCount} lines
        </span>
      </div>
    </div>
  );
}