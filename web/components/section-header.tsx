import Link from 'next/link';

export function SectionHeader({ title, viewAll }: { title: string, viewAll?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-lg md:text-xl font-semibold uppercase tracking-wide text-gray-900">
        {title}
      </h2>
      {viewAll && (
        <Link href="#" className="text-xs text-gray-800 font-semibold uppercase tracking-wider hover:underline underline-offset-4">
          View All
        </Link>
      )}
    </div>
  )
}
