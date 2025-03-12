import {
  ElementTransformer,
  TRANSFORMERS as BASE_TRANSFORMERS,
} from "@lexical/markdown";

import IMAGE_TRANSFORMERS from "./ImageTransformer";
import YOUTUBE_TRANSFORMERS from "./YouTubeTransformer";
import TWITTER_TRANSFORMERS from "./TwitterTransformer";
import PROFILE_TRANSFORMERS from "./ProfileTransformer";

// Override any base transformers if needed (none for now)
const overrides: Record<string, ElementTransformer> = {};

// Find and replace base transformers with our overrides
const filteredBaseTransformers = BASE_TRANSFORMERS.filter(
  (transformer) => !overrides[transformer.type]
);

// Export custom transformers combined with filtered base transformers
export const TRANSFORMERS = [
  ...PROFILE_TRANSFORMERS,
  ...IMAGE_TRANSFORMERS, // NOTE this one must come first to avoid conflict with link transformer
  ...filteredBaseTransformers,
  ...YOUTUBE_TRANSFORMERS,
  ...TWITTER_TRANSFORMERS,
  ...Object.values(overrides),
];
