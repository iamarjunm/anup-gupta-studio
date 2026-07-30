import { PortableText, PortableTextComponents } from '@portabletext/react';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-gray-700 text-[13px] leading-relaxed mb-3">{children}</p>,
    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 mb-4 text-gray-700 text-[13px] space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 mb-4 text-gray-700 text-[13px] space-y-1">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function RichText({ value }: { value: any }) {
  if (!value) return null;
  return (
    <div className="portable-text">
      <PortableText value={value} components={components} />
    </div>
  );
}
