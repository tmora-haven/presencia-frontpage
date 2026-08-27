/**
 * WordPress returns `title.rendered` / `excerpt.rendered` as HTML fragments.
 * The frontpage only ever needs *text*, so we never render that HTML.
 * This converts a fragment to decoded plain text: tags are dropped, entities
 * (&#8211; &hellip; &amp; …) are decoded, whitespace is collapsed.
 *
 * Because the output is plain text rendered through React's normal escaping,
 * a malicious `<script>` in a post title becomes harmless literal text.
 */
const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;

export function decodeHtml(fragment: string | null | undefined): string {
  if (!fragment) return '';
  const text = parser
    ? (parser.parseFromString(fragment, 'text/html').body.textContent ?? '')
    : fragment.replace(/<[^>]*>/g, '');
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s*\[…\]\s*$/, '…') // WP's default excerpt marker "[&hellip;]"
    .trim();
}
