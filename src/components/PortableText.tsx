import { PortableText as PortableTextReact, PortableTextComponents } from '@portabletext/react';
import ImageZoom from './ImageZoom';
import { urlForImage } from '@/sanity/lib/image';
import { slugify } from '@/lib/utils';

const components: PortableTextComponents = {
    types: {
        image: ({ value }) => {
            // Use urlForImage helper to get URL string
            const imageUrl = urlForImage(value).url();
            return (
                <div className="my-8">
                    <ImageZoom
                        src={imageUrl}
                        alt={value.alt || 'Content Image'} // Default alt if missing
                        width={800} // Default width for optimization
                        height={500} // Aspect ratio approximation
                        className="rounded-lg shadow-md"
                    />
                    {value.caption && (
                        <div className="text-center text-sm text-gray-500 mt-2">
                            {value.caption}
                        </div>
                    )}
                </div>
            );
        },
    },
    block: {
        h1: ({ children, value }) => {
            const text = value.children?.map((c: any) => c.text).join('') || '';
            return <h1 id={slugify(text)} className="text-3xl font-semibold sm:font-bold mt-8 mb-4 scroll-mt-24">{children}</h1>
        },
        h2: ({ children, value }) => {
            const text = value.children?.map((c: any) => c.text).join('') || '';
            return <h2 id={slugify(text)} className="text-2xl font-semibold sm:font-bold mt-8 mb-4 scroll-mt-24">{children}</h2>
        },
        h3: ({ children, value }) => {
            const text = value.children?.map((c: any) => c.text).join('') || '';
            return <h3 id={slugify(text)} className="text-xl font-semibold sm:font-bold mt-6 mb-3 scroll-mt-24">{children}</h3>
        },
        h4: ({ children, value }) => {
            const text = value.children?.map((c: any) => c.text).join('') || '';
            return <h4 id={slugify(text)} className="text-lg font-semibold mt-4 mb-2 scroll-mt-24">{children}</h4>
        },
        blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-500 pl-4 italic my-4">{children}</blockquote>,
        normal: ({ children }) => <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>,
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>,
    },
    marks: {
        link: ({ value, children }) => {
            const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
            return (
                <a
                    href={value?.href}
                    target={target}
                    rel={target === '_blank' ? 'noindex nofollow' : undefined}
                    className="text-amber-600 hover:text-amber-500 underline"
                >
                    {children}
                </a>
            );
        }
    }
};

export default function PortableText({ value }: { value: any }) {
    return <PortableTextReact value={value} components={components} />;
}
