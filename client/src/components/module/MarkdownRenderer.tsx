import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { memo } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 decoration-primary/30 underline-offset-4 transition-colors" />
          ),
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-4xl font-extrabold tracking-tight mb-8 text-foreground" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-2xl font-bold tracking-tight mt-12 mb-6 text-foreground border-b border-border/50 pb-2" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-xl font-semibold tracking-tight mt-8 mb-4 text-foreground" />
          ),
          p: ({ node, ...props }) => (
            <p {...props} className="leading-relaxed mb-6 text-foreground/80" />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2 text-foreground/80" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground/80" />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="leading-relaxed" />
          ),
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-8 border-border/50" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
