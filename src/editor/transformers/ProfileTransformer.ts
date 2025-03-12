import { type Transformer } from "@lexical/markdown";
import { type LexicalNode, type TextNode } from "lexical";
import {
  $createProfileNode,
  $isProfileNode,
  ProfileNode,
} from "~/editor/nodes/ProfileNode";

// Regex pattern for Nostr npub IDs
// This matches full npub1 identifiers (captures the entire npub)
const PROFILE_REGEX = /(npub1[a-z0-9]{6,})(?:\s|$)/;

// Create a custom transformer for profile nodes
const profileTransformer: Transformer = {
  dependencies: [ProfileNode],

  // Export the node back to markdown format if needed
  export: (node: LexicalNode): string | null => {
    if (!$isProfileNode(node)) return null;
    const npub = node.getNpub();
    return npub;
  },

  // Match the profile format: npub1...
  importRegExp: PROFILE_REGEX,
  regExp: PROFILE_REGEX,
  type: "text-match" as const,

  // Replace matched text with a profile node
  replace: (textNode: TextNode, match: RegExpMatchArray): void => {
    // Extract npub from the match
    const npub = String(match[1] || "");

    console.log("Profile transformer triggered!", { npub });

    // Create a profile node with the npub
    const profileNode = $createProfileNode(npub);

    // Replace the text node with the profile node
    textNode.replace(profileNode);
  },
};

// Export as array for easy integration with other transformers
const PROFILE_TRANSFORMERS: Array<Transformer> = [profileTransformer];

export default PROFILE_TRANSFORMERS;
