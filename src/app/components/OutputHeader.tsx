"use client";
export default function OutputHeader({
  executionTime
}: {
  executionTime: number | null;
}) {
  return (
    <div className="px-4 py-3 bg-gray-900 flex justify-between items-center">
      <h2 className="font-medium flex items-center gap-2">
        {/* Output Icon */}
        Output
      </h2>
      <div className="flex items-center gap-2">
        {executionTime !== null && (
          <span className="text-xs bg-purple-600 px-2 py-1 rounded">
            {executionTime} ms
          </span>
        )}
      </div>
    </div>
  );
}