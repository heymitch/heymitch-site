import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocPageProps {
  breadcrumb: string;
  content: string;
  lastVerified?: string;
}

export default function DocPage({ breadcrumb, content, lastVerified }: DocPageProps) {
  return (
    <div className="flex justify-center">
      <article className="flex-1 min-w-0 max-w-2xl px-8 lg:px-12 py-10">
        {/* Breadcrumb */}
        <div className="font-mono text-sm text-brown/60 mb-8 flex items-center gap-1.5">
          <a href="/" className="hover:text-brown transition-colors">heymitch.ai</a>
          <span className="text-brown/30">/</span>
          <a href="/cowork-docs" className="hover:text-brown transition-colors">field docs</a>
          <span className="text-brown/30">/</span>
          <span className="text-brown/80">{breadcrumb}</span>
        </div>

        {lastVerified && (
          <div className="mb-6">
            <span className="font-mono text-xs text-brown/50 border border-brown/15 rounded px-2.5 py-1">
              Last verified: {lastVerified}
            </span>
          </div>
        )}

        {/* Markdown content */}
        <div className="prose-field-docs">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-brown/10">
          <a
            href="/cowork-docs"
            className="font-sans text-sm text-brown/60 hover:text-orange transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
            Back to all docs
          </a>
        </div>
      </article>
    </div>
  );
}
