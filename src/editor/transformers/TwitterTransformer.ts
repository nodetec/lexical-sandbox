import type { ElementTransformer } from "@lexical/markdown";
import { $createParagraphNode, ElementNode, LexicalNode } from "lexical";
import { $createTweetNode } from "../nodes/TwitterNode";

/**
 * Extracts Tweet ID from Twitter/X URLs
 */
function extractTweetId(text: string): string | null {
  // Extract tweet ID from URLs like:
  // https://twitter.com/username/status/1234567890123456789
  // https://x.com/username/status/1234567890123456789
  // https://x.com/i/web/status/1234567890123456789
  const match = text.match(
    /(?:twitter\.com|x\.com)\/(?:\w+\/status\/|i\/web\/status\/)(\d+)/
  );

  if (match && match[1]) {
    return match[1];
  }

  // Try to extract just the ID if it's only the ID
  const idMatch = text.match(/^(\d{10,25})$/);
  if (idMatch) {
    return idMatch[1];
  }

  return null;
}

/**
 * Checks if a string is a valid Twitter/X URL
 */
function isTwitterUrl(text: string): boolean {
  return (
    (text.includes("twitter.com/") || text.includes("x.com/")) &&
    (text.includes("/status/") || text.includes("/i/web/status/"))
  );
}

/**
 * Transformer for converting Twitter/X URLs in markdown to embedded Twitter nodes
 */
const TwitterTransformer: ElementTransformer = {
  dependencies: [],
  export: () => null,
  regExp:
    /(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/(\w+\/status\/|i\/web\/status\/)\d+(\?[^\\s]*)?/,
  replace: (
    parentNode: ElementNode,
    children: Array<LexicalNode>,
    match: Array<string>
  ): boolean | void => {
    const url = match[0];

    if (!isTwitterUrl(url)) {
      return false;
    }

    const tweetId = extractTweetId(url);
    if (!tweetId) {
      return false;
    }

    // Create Twitter node
    const tweetNode = $createTweetNode(tweetId);

    // Create paragraph nodes before and after for proper spacing
    const paragraphBefore = $createParagraphNode();
    const paragraphAfter = $createParagraphNode();

    // Insert nodes at the appropriate locations
    parentNode.insertBefore(paragraphBefore);
    paragraphBefore.insertAfter(tweetNode);
    tweetNode.insertAfter(paragraphAfter);

    // Return true to indicate successful transformation
    return true;
  },
  type: "element",
};

const TWITTER_TRANSFORMERS: Array<ElementTransformer> = [TwitterTransformer];

export default TWITTER_TRANSFORMERS;
