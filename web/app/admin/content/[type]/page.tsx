import { cmsSchemas } from '@/lib/schema-config';
import { fetchDocuments } from '@/app/actions/cms';
import { CmsTable } from '@/components/admin/cms-table';
import { SiteSettingsEditor } from '@/components/admin/site-settings-editor';
import { redirect } from 'next/navigation';

export default async function AdminContentPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const schema = cmsSchemas.find(s => s.name === type);
  
  if (!schema) {
    redirect('/admin');
  }

  const { data: initialDocs } = await fetchDocuments(schema.name);

  if (schema.name === 'siteSettings') {
    return <SiteSettingsEditor schema={schema} initialDoc={initialDocs?.[0]} />;
  }

  return (
    <div className="space-y-8">
      <CmsTable schema={schema} initialDocs={initialDocs || []} />
    </div>
  );
}
