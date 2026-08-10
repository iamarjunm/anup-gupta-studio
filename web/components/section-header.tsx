import Link from 'next/link';

export function SectionHeader({ title, viewAll, viewAllLink = "/collection/all" }: { title: string, viewAll?: boolean, viewAllLink?: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-lg md:text-xl font-semibold uppercase tracking-normal text-gray-900">
        {title}
      </h2>
      {viewAll && (
        <Link href={viewAllLink} className="text-xs text-gray-800 font-semibold uppercase tracking-wider hover:underline underline-offset-4">
          View All
        </Link>
      )}
    </div>
  )
}
