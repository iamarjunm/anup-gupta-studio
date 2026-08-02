export default function AdminOrdersLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-16 bg-gray-100 rounded w-1/4"></div>
            <div className="h-16 bg-gray-100 rounded w-1/4"></div>
            <div className="h-16 bg-gray-100 rounded w-1/4"></div>
            <div className="h-16 bg-gray-100 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
