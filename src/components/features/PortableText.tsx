import { PortableText as PortableTextReact, PortableTextComponents } from '@portabletext/react';
import { ArbitraryTypedObject, PortableTextBlock, TypedObject } from '@portabletext/types';
import ImageZoom from './ImageZoom';
import { urlForImage } from '@/sanity/lib/image';
import { PortableTextContentNode } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Quote, Info, AlertTriangle, CheckCircle, Lightbulb, Copy, Terminal } from 'lucide-react';

interface PortableTextChild {
    text?: string;
    [key: string]: unknown;
}

interface PortableTextCodeBlock extends TypedObject {
    _type: 'code';
    code?: string;
    language?: string;
    filename?: string;
}

interface PortableTextCalloutBlock extends TypedObject {
    _type: 'callout';
    type?: 'info' | 'warning' | 'success' | 'idea';
    text?: string;
}

type PortableTextNode =
    | PortableTextBlock
    | PortableTextCodeBlock
    | PortableTextCalloutBlock
    | ArbitraryTypedObject;

const components: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            const imageUrl = urlForImage(value).url();
            return (
                <div className="my-10 group">
                    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                        <ImageZoom
                            src={imageUrl}
                            alt={value.alt || 'Content Image'}
                            width={1200}
                            height={800}
                            className="w-full object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                        />
                    </div>
                    {(value.caption || value.alt) && (
                        <div className="text-center text-sm text-zinc-500 dark:text-zinc-500 mt-4 italic font-medium">
                            {value.caption || value.alt}
                        </div>
                    )}
                </div>
            );
        },
        code: ({ value }) => {
            return (
                <div className="my-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-lg">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-zinc-500" />
                            <span className="text-xs font-mono text-zinc-400">
                                {value.filename || value.language || 'code'}
                            </span>
                        </div>
                        <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <Copy size={14} />
                        </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300 leading-relaxed bg-[#0d0d0d]">
                        <code>{value.code}</code>
                    </pre>
                </div>
            );
        },
        callout: ({ value }) => {
            const types = {
                info: {
                    icon: Info,
                    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
                    border: 'border-blue-200 dark:border-blue-900/30',
                    text: 'text-blue-900 dark:text-blue-100',
                    iconColor: 'text-blue-500'
                },
                warning: {
                    icon: AlertTriangle,
                    bg: 'bg-amber-50/50 dark:bg-amber-900/10',
                    border: 'border-amber-200 dark:border-amber-900/30',
                    text: 'text-amber-900 dark:text-amber-100',
                    iconColor: 'text-amber-500'
                },
                success: {
                    icon: CheckCircle,
                    bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
                    border: 'border-emerald-200 dark:border-emerald-900/30',
                    text: 'text-emerald-900 dark:text-emerald-100',
                    iconColor: 'text-emerald-500'
                },
                idea: {
                    icon: Lightbulb,
                    bg: 'bg-indigo-50/50 dark:bg-indigo-900/10',
                    border: 'border-indigo-200 dark:border-indigo-900/30',
                    text: 'text-indigo-900 dark:text-indigo-100',
                    iconColor: 'text-indigo-500'
                }
            };

            const config = types[value.type as keyof typeof types] || types.info;
            const Icon = config.icon;

            return (
                <div className={`my-8 p-5 rounded-2xl border ${config.bg} ${config.border} flex gap-4 items-start`}>
                    <div className={`mt-1 flex-shrink-0 ${config.iconColor}`}>
                        <Icon size={20} />
                    </div>
                    <div className={`text-sm leading-relaxed ${config.text}`}>
                        {value.text}
                    </div>
                </div>
            );
        }
    },
    block: {
        h1: ({ children, value }) => {
            const text = (value.children as PortableTextChild[])?.map((c) => c.text || '').join('') || '';
            return <h1 id={slugify(text)} className="text-3xl sm:text-4xl font-bold mt-12 mb-6 scroll-mt-24 text-zinc-900 dark:text-zinc-50 tracking-tight">{children}</h1>
        },
        h2: ({ children, value }) => {
            const text = (value.children as PortableTextChild[])?.map((c) => c.text || '').join('') || '';
            return <h2 id={slugify(text)} className="text-2xl sm:text-3xl font-bold mt-10 mb-5 scroll-mt-24 text-zinc-900 dark:text-zinc-50 tracking-tight">{children}</h2>
        },
        h3: ({ children, value }) => {
            const text = (value.children as PortableTextChild[])?.map((c) => c.text || '').join('') || '';
            return <h3 id={slugify(text)} className="text-xl sm:text-2xl font-bold mt-8 mb-4 scroll-mt-24 text-zinc-900 dark:text-zinc-50 tracking-tight">{children}</h3>
        },
        h4: ({ children, value }) => {
            const text = (value.children as PortableTextChild[])?.map((c) => c.text || '').join('') || '';
            return <h4 id={slugify(text)} className="text-lg sm:text-xl font-bold mt-6 mb-3 scroll-mt-24 text-zinc-900 dark:text-zinc-50">{children}</h4>
        },
        blockquote: ({ children }) => (
            <div className="my-10 relative pl-8 border-l-4 border-amber-500">
                <Quote className="absolute -left-2 -top-4 w-10 h-10 text-amber-500/10 rotate-12" />
                <blockquote className="text-xl sm:text-2xl italic font-serif text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <span aria-hidden="true">&ldquo;</span>
                    {children}
                    <span aria-hidden="true">&rdquo;</span>
                </blockquote>
            </div>
        ),
        lead: ({ children }) => (
            <p className="text-xl sm:text-2xl font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 border-b border-zinc-100 dark:border-zinc-800/50 pb-8">
                {children}
            </p>
        ),
        normal: ({ children }) => <p className="mb-6 leading-relaxed text-zinc-800 dark:text-zinc-200 text-lg">{children}</p>,
    },
    list: {
        bullet: ({ children }) => (
            <ul className="my-6 ml-6 list-none space-y-4">
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ol className="my-6 ml-6 list-none counter-reset-list space-y-4">
                {children}
            </ol>
        ),
    },
    listItem: {
        bullet: ({ children }) => (
            <li className="relative pl-7 text-lg text-zinc-800 dark:text-zinc-200">
                <span className="absolute left-0 top-3 w-1.5 h-1.5 rounded-full bg-amber-500" />
                {children}
            </li>
        ),
        number: ({ children, index }) => (
            <li className="relative pl-8 text-lg text-zinc-800 dark:text-zinc-200">
                <span className="absolute left-0 top-1 text-sm font-bold text-amber-500 font-mono">
                    {(index + 1).toString().padStart(2, '0')}.
                </span>
                {children}
            </li>
        ),
    },
    marks: {
        link: ({ value, children }) => {
            const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
            return (
                <a
                    href={value?.href}
                    target={target}
                    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-500 underline decoration-amber-500/30 underline-offset-4 hover:decoration-amber-500 transition-all duration-200"
                >
                    {children}
                </a>
            );
        },
        code: ({ children }) => (
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                {children}
            </code>
        ),
        strong: ({ children }) => <strong className="font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{children}</strong>,
        underline: ({ children }) => <span className="underline decoration-amber-500/50 decoration-2 underline-offset-4">{children}</span>,
    }
};

export default function PortableText({ value }: { value?: PortableTextContentNode[] | null }) {
    if (!value) return null;
    return (
        <div className="portable-text max-w-none">
            <PortableTextReact<PortableTextNode> value={value as PortableTextNode[]} components={components} />
        </div>
    );
}
