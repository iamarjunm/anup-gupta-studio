export default function AdminUsersLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-56"></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
            <div className="h-12 bg-gray-100 rounded flex-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
