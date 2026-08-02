import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      <p className="mt-4 text-sm tracking-widest uppercase text-gray-500">Loading...</p>
    </div>
  );
}
