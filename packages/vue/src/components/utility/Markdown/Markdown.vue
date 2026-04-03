<script setup lang="ts">
/** @module Markdown */
import { computed } from 'vue';
import { cn } from '@artisanpack-ui/tokens';
import type { MarkdownProps } from './types';

const props = defineProps<MarkdownProps>();

/**
 * Minimal markdown-to-HTML converter.
 * Handles headings, bold, italic, links, images, lists, code blocks,
 * inline code, blockquotes, horizontal rules, and paragraphs.
 */
function parseMarkdown(md: string): string {
  let html = md;
  const codeBlocks: string[] = [];

  // Fenced code blocks (``` ... ```) — replace with placeholders
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(`<pre><code>${escapeHtml(code.trimEnd())}</code></pre>`);
    return `__CODE_BLOCK_${index}__`;
  });

  // Split into lines for block-level processing
  const lines = html.split('\n');
  const result: string[] = [];
  let inList: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Restore code block placeholders
    const codeBlockMatch = line.match(/^__CODE_BLOCK_(\d+)__$/);
    if (codeBlockMatch) {
      if (inList) {
        result.push(inList === 'ul' ? '</ul>' : '</ol>');
        inList = null;
      }
      result.push(codeBlocks[Number(codeBlockMatch[1])]);
      continue;
    }

    // Horizontal rules
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      if (inList) {
        result.push(inList === 'ul' ? '</ul>' : '</ol>');
        inList = null;
      }
      result.push('<hr>');
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (inList) {
        result.push(inList === 'ul' ? '</ul>' : '</ol>');
        inList = null;
      }
      const level = headingMatch[1].length;
      result.push(`<h${level}>${applyInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Blockquotes
    const blockquoteMatch = line.match(/^>\s?(.*)$/);
    if (blockquoteMatch) {
      if (inList) {
        result.push(inList === 'ul' ? '</ul>' : '</ol>');
        inList = null;
      }
      result.push(`<blockquote><p>${applyInline(blockquoteMatch[1])}</p></blockquote>`);
      continue;
    }

    // Unordered list items
    const ulMatch = line.match(/^[-*+]\s+(.+)$/);
    if (ulMatch) {
      if (inList !== 'ul') {
        if (inList) result.push('</ol>');
        result.push('<ul>');
        inList = 'ul';
      }
      result.push(`<li>${applyInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list items
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (inList !== 'ol') {
        if (inList) result.push('</ul>');
        result.push('<ol>');
        inList = 'ol';
      }
      result.push(`<li>${applyInline(olMatch[1])}</li>`);
      continue;
    }

    // Close any open list if the line is not a list item
    if (inList) {
      result.push(inList === 'ul' ? '</ul>' : '</ol>');
      inList = null;
    }

    // Empty line
    if (line.trim() === '') {
      continue;
    }

    // Paragraph
    result.push(`<p>${applyInline(line)}</p>`);
  }

  if (inList) {
    result.push(inList === 'ul' ? '</ul>' : '</ol>');
  }

  return result.join('\n');
}

/** Sanitize a URL to prevent javascript: and data: schemes. */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return '#';
  }
  return trimmed;
}

/** Apply inline markdown transformations (bold, italic, links, images, code). */
function applyInline(text: string): string {
  // First escape HTML to prevent XSS
  let result = escapeHtml(text);

  // Extract inline code spans into placeholders so their content is not re-parsed
  const codeSpans: string[] = [];
  result = result.replace(/`([^`]+)`/g, (_m, content: string) => {
    const index = codeSpans.length;
    codeSpans.push(`<code>${content}</code>`);
    return `\uE000CS${index}\uE001`;
  });

  // Images (before links to avoid conflict)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt: string, src: string) =>
    `<img src="${sanitizeUrl(src)}" alt="${alt}">`,
  );
  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) =>
    `<a href="${sanitizeUrl(href)}">${label}</a>`,
  );
  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.+?)_/g, '<em>$1</em>');

  // Restore code span placeholders
  result = result.replace(/\uE000CS(\d+)\uE001/g, (_m, index: string) => codeSpans[Number(index)]);

  return result;
}

/** Escape HTML special characters. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const renderedHtml = computed(() => parseMarkdown(props.content));

const containerClasses = computed(() => cn('prose', props.className));
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div
    :class="containerClasses"
    v-html="renderedHtml"
  />
</template>
