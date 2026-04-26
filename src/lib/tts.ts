import { PortableTextContentNode } from './types';

const PARAGRAPH_BREAK = '\n\n';

const ABBREVIATION_MAP: Record<string, string> = {
  'dll.': 'dan lain-lain',
  'dsb.': 'dan sebagainya',
  'dkk.': 'dan kawan-kawan',
  'yg.': 'yang',
  'utk.': 'untuk',
  'dg.': 'dengan',
  'dgn.': 'dengan',
  'tdk.': 'tidak',
  'tsb.': 'tersebut',
  'sbg.': 'sebagai',
  'spt.': 'seperti',
  'krn.': 'karena',
  'shg.': 'sehingga',
  'bhw.': 'bahwa',
  'ttg.': 'tentang',
  'thd.': 'terhadap',
  'pd.': 'pada',
  'dr.': 'dokter',
  'Prof.': 'Profesor',
  'Ir.': 'Insinyur',
  'No.': 'Nomor',
  'vol.': 'volume',
  'hal.': 'halaman',
  'hlm.': 'halaman',
  'ed.': 'edisi',
  'cet.': 'cetakan',
  'Sdr.': 'Saudara',
  'Sdri.': 'Saudari',
};

const ABBREVIATION_REGEX = new RegExp(
  Object.keys(ABBREVIATION_MAP)
    .map(k => k.replace(/\./g, '\\.'))
    .join('|'),
  'gi'
);

/**
 * Extract text from PortableText blocks for TTS,
 * preserving paragraph boundaries and skipping code blocks.
 */
export function extractTtsText(blocks: PortableTextContentNode[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  const paragraphs: string[] = [];

  for (const block of blocks) {
    if (block._type === 'code') {
      continue;
    }

    if (block._type === 'block' && 'children' in block && Array.isArray(block.children)) {
      const text = block.children
        .map((child: { text?: string }) => child.text || '')
        .join(' ')
        .trim();
      if (text) paragraphs.push(text);
    }

    if (block._type === 'callout' && 'text' in block && typeof block.text === 'string') {
      if (block.text.trim()) paragraphs.push(block.text.trim());
    }
  }

  return paragraphs.join(PARAGRAPH_BREAK);
}

/**
 * Extract text from HTML string for TTS, preserving paragraph boundaries.
 */
export function extractTtsTextFromHtml(html: string): string {
  if (!html) return '';

  return html
    .replace(/<pre[\s\S]*?<\/pre>/gi, '')
    .replace(/<code[\s\S]*?<\/code>/gi, '')
    .replace(/<br\s*\/?>/gi, PARAGRAPH_BREAK)
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote)>/gi, PARAGRAPH_BREAK)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, 'dan')
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&quot;/g, '"')
    .split(PARAGRAPH_BREAK)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .join(PARAGRAPH_BREAK);
}

/**
 * Preprocess text for more natural TTS output.
 * Normalizes abbreviations, strips URLs, handles special characters.
 */
export function preprocessTtsText(text: string): string {
  let result = text;

  // Expand Indonesian abbreviations
  result = result.replace(ABBREVIATION_REGEX, (match) => {
    const key = Object.keys(ABBREVIATION_MAP).find(
      k => k.toLowerCase() === match.toLowerCase()
    );
    return key ? ABBREVIATION_MAP[key] : match;
  });

  // Strip URLs
  result = result.replace(/https?:\/\/[^\s)]+/g, '');

  // Strip email addresses
  result = result.replace(/[\w.-]+@[\w.-]+\.\w+/g, '');

  // Handle em-dash / en-dash → comma pause
  result = result.replace(/[—–]/g, ', ');

  // Handle ellipsis
  result = result.replace(/\.{3,}/g, '...');

  // Handle parenthetical content — add slight pauses
  result = result.replace(/\(/g, ', ');
  result = result.replace(/\)/g, ', ');

  // Strip markdown artifacts
  result = result.replace(/[*_~`#]/g, '');

  // Normalize multiple spaces
  result = result.replace(/[^\S\n]+/g, ' ');

  // Normalize multiple commas
  result = result.replace(/,\s*,/g, ',');

  return result.trim();
}

/**
 * Represents a chunk of text for TTS with metadata.
 */
export interface TtsChunk {
  text: string;
  paragraphIndex: number;
  isLastInParagraph: boolean;
}

/**
 * Sentence-aware abbreviation-safe regex.
 * Splits on sentence-ending punctuation NOT preceded by common abbreviations.
 */
const SENTENCE_END = /(?<![Dd]r|[Dd]ll|[Dd]sb|[Dd]kk|[Hh]al|[Hh]lm|[Vv]ol|[Nn]o|[Ee]d|[Cc]et|[Ss]dr|[Ss]pt|[Ss]bg|[Pp]rof|[Ii]r)([.!?])(?:\s+|$)/g;

function splitSentences(text: string): string[] {
  const sentences: string[] = [];
  let lastIndex = 0;

  SENTENCE_END.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SENTENCE_END.exec(text)) !== null) {
    const end = match.index + match[0].length;
    const sentence = text.slice(lastIndex, end).trim();
    if (sentence) sentences.push(sentence);
    lastIndex = end;
  }

  const remaining = text.slice(lastIndex).trim();
  if (remaining) sentences.push(remaining);

  return sentences;
}

/**
 * Chunk text into TTS-friendly segments.
 * Respects paragraph boundaries and sentence structure.
 * Target: ~350 chars per chunk, never splitting mid-sentence.
 */
export function chunkTtsText(text: string, maxLength: number = 350): TtsChunk[] {
  if (!text) return [];

  const paragraphs = text.split(PARAGRAPH_BREAK).filter(p => p.trim().length > 0);
  const chunks: TtsChunk[] = [];

  paragraphs.forEach((paragraph, pIdx) => {
    const sentences = splitSentences(paragraph);
    let currentChunk = '';
    const isLastParagraph = pIdx === paragraphs.length - 1;

    sentences.forEach((sentence, sIdx) => {
      const isLastSentence = sIdx === sentences.length - 1;

      if (currentChunk.length + sentence.length + 1 > maxLength && currentChunk) {
        chunks.push({
          text: currentChunk.trim(),
          paragraphIndex: pIdx,
          isLastInParagraph: false,
        });
        currentChunk = '';
      }

      if (sentence.length > maxLength) {
        if (currentChunk) {
          chunks.push({
            text: currentChunk.trim(),
            paragraphIndex: pIdx,
            isLastInParagraph: false,
          });
          currentChunk = '';
        }
        const subChunks = sentence.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [sentence];
        subChunks.forEach((sub, subIdx) => {
          chunks.push({
            text: sub.trim(),
            paragraphIndex: pIdx,
            isLastInParagraph: isLastSentence && subIdx === subChunks.length - 1,
          });
        });
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }

      if (isLastSentence && currentChunk) {
        chunks.push({
          text: currentChunk.trim(),
          paragraphIndex: pIdx,
          isLastInParagraph: !isLastParagraph,
        });
        currentChunk = '';
      }
    });
  });

  return chunks;
}

/**
 * Estimate listening time in minutes based on text length and speech rate.
 * Average TTS speaks ~150 words/minute at rate 1.0.
 */
export function estimateListeningTime(text: string, rate: number = 1.0): number {
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const wordsPerMinute = 150 * rate;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
