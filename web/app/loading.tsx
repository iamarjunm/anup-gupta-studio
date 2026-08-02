import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-white text-gray-400 gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-black" />
      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold animate-pulse">Loading...</p>
    </div>
  );
}
