import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { theme } from "./theme";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import { ListNode, ListItemNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { ToolbarPlugin } from "./plugins/toolbar/ToolbarPlugin";
import { OnChangeDebouncePlugin } from "./plugins/onChangeDebounce/OnChangeDebouncePlugin";
import { OnBlurPlugin } from "./plugins/onBlur/OnBlurPlugin";
import { OnFocusPlugin } from "./plugins/onFocus/OnFocusPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import MarkdownImageShortcutPlugin from "./plugins/MarkdownImageShortcut";
// import ProfileShortcutPlugin from "./plugins/ProfileShortcutPlugin";

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { TRANSFORMERS } from "./transformers";
import { EditorState, LexicalEditor } from "lexical";
import { ScrollCenterCurrentLinePlugin } from "./plugins/scollCenterCurrentLine/ScrollCenterCurrentLinePlugin";
import { YouTubeNode } from "./nodes/YouTubeNode";
import { TweetNode } from "./nodes/TwitterNode";
import { ImageNode } from "./nodes/ImageNode";
import { ProfileNode } from "./nodes/ProfileNode";
// import TreeViewPlugin from "./plugins/treeview/TreeViewPlugin";
import { useAppState } from "~/store";
import TabKeyPlugin from "./plugins/TabKeyPlugin";
import ProfilePlugin, {
  ProfileMarkdownPlugin,
} from "./plugins/toolbar/components/profile/ProfileActions";
import { ProfilePastePlugin } from "./plugins/toolbar/components/profile/ProfilePastePlugin";
import ImagePastePlugin from "./plugins/toolbar/components/image/ImagePastePlugin";
// import TreeViewPlugin from "./plugins/treeview/TreeViewPlugin";

async function onFocus(event: FocusEvent, editor: LexicalEditor) {
  await editor.read(async () => {
    // const markdown = $convertToMarkdownString(TRANSFORMERS);
    // console.log("onFocus", markdown);
  });
}

export const Editor = () => {
  const markdown = useAppState.getState().markdown;
  const setMarkdown = useAppState.getState().setMarkdown;

  function getInitalContent() {
    return $convertFromMarkdownString(markdown, TRANSFORMERS, undefined, true);
  }

  const initialConfig = {
    namespace: "Editor",
    editorState: () => getInitalContent(),
    theme,
    onError: () => {},
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      CodeHighlightNode,
      CodeNode,
      HorizontalRuleNode,
      QuoteNode,
      ImageNode,
      LinkNode,
      AutoLinkNode,
      HashtagNode,
      CodeNode,
      CodeHighlightNode,
      YouTubeNode,
      TweetNode,
      ProfileNode,
    ],
  };

  async function onChange(editorState: EditorState, editor: LexicalEditor) {
    await editor.read(async () => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      setMarkdown(markdown);
      console.log("onChange", markdown);
    });
  }

  async function onBlur(event: FocusEvent, editor: LexicalEditor) {
    await editor.read(async () => {
      //   const markdown = $convertToMarkdownString(TRANSFORMERS);
      //   console.log("onBlur", markdown);
    });
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-[30%]">
        <ToolbarPlugin />
      </div>
      <div className="relative editor-shell">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[calc(100vh-4rem)] py-8 md:px-[30%] flex-auto select-text flex-col pb-[50%] caret-sky-500/90 focus-visible:outline-none border-t" />
            // <ContentEditable className="p-8 flex-auto select-text flex-col focus-visible:outline-none" />
          }
          placeholder={
            <div className="absolute inset-0 text-gray-400 py-8 px-[30%] pointer-events-none">
              Write something...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <OnChangeDebouncePlugin onChange={onChange} debounceTime={500} />
      <OnBlurPlugin onBlur={onBlur} />
      <OnFocusPlugin onFocus={onFocus} />
      <TabKeyPlugin tabSize={2} useSpaces={true} />
      <MarkdownImageShortcutPlugin />
      <ImagePastePlugin />
      <ProfilePlugin />
      <ProfilePastePlugin />
      <ProfileMarkdownPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <AutoFocusPlugin />
      <ListPlugin />
      <HistoryPlugin />
      <ScrollCenterCurrentLinePlugin />
      {/* <TreeViewPlugin /> */}
    </LexicalComposer>
  );
};
