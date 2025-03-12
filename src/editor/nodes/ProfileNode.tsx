import {
  DecoratorNode,
  SerializedLexicalNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type LexicalNode,
  type NodeKey,
  type Spread,
} from "lexical";

import * as React from "react";
import { JSX, useEffect, useState } from "react";

export interface ProfileData {
  npub: string;
  name?: string;
  picture?: string;
  displayName?: string;
}

interface ProfileComponentProps {
  profileData: ProfileData;
  nodeKey: NodeKey;
}

// This will be the React component that renders in the editor
function ProfileComponent({ profileData }: ProfileComponentProps) {
  const [profile, setProfile] = useState<ProfileData>(profileData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching profile data
    async function fetchProfileData() {
      try {
        setLoading(true);
        // In a real implementation, you would fetch actual profile data here
        // For this example, we'll just simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data - in a real implementation this would come from an API
        const mockData: Partial<ProfileData> = {
          name: profileData.npub.substring(0, 8) + "...",
          displayName: "User " + profileData.npub.substring(4, 8),
          picture: `https://avatars.dicebear.com/api/identicon/${profileData.npub}.svg`,
        };

        setProfile({
          ...profileData,
          ...mockData,
        });
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Error fetching profile data");
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [profileData.npub]);

  if (loading) {
    return <div className="profile-card loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-card error">{error}</div>;
  }

  return <span className=" text-blue-500">{profile.npub}</span>;
}

export type SerializedProfileNode = Spread<
  {
    npub: string;
  },
  SerializedLexicalNode
>;

export class ProfileNode extends DecoratorNode<JSX.Element> {
  __npub: string;

  static getType(): string {
    return "profile";
  }

  static clone(node: ProfileNode): ProfileNode {
    return new ProfileNode(node.__npub, node.__key);
  }

  constructor(npub: string, key?: NodeKey) {
    super(key);
    this.__npub = npub;
  }

  static importJSON(serializedNode: SerializedProfileNode): ProfileNode {
    return $createProfileNode(serializedNode.npub);
  }

  exportJSON(): SerializedProfileNode {
    return {
      ...super.exportJSON(),
      npub: this.getNpub(),
    };
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("span");
    dom.className = "profile-node";
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-profile", this.__npub);
    element.textContent = `Profile: ${this.__npub}`;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-profile")) {
          return null;
        }
        return {
          conversion: convertProfileElement,
          priority: 2,
        };
      },
    };
  }

  getTextContent(): string {
    return this.__npub;
  }

  decorate(): JSX.Element {
    const profileData: ProfileData = {
      npub: this.__npub,
    };
    return (
      <ProfileComponent profileData={profileData} nodeKey={this.getKey()} />
    );
  }

  getNpub(): string {
    return this.__npub;
  }
}

function convertProfileElement(
  domNode: HTMLElement
): DOMConversionOutput | null {
  const npub = domNode.getAttribute("data-lexical-profile");
  if (npub) {
    const node = $createProfileNode(npub);
    return { node };
  }
  return null;
}

export function $createProfileNode(npub: string): ProfileNode {
  return new ProfileNode(npub);
}

export function $isProfileNode(
  node: LexicalNode | null | undefined
): node is ProfileNode {
  return node instanceof ProfileNode;
}
