export type MemoryCategory =
  | "kilometre_tasi"
  | "ilkler"
  | "yildonumu"
  | "gezi"
  | "ozelgun"
  | "jedi"
  | "donumnoktasi"
  | "kucuksey"
  | "mektup"
  | "kahve"
  | "maker"
  | "sarki"
  | "game";

export type MemoryMood =
  | "happy"
  | "romantic"
  | "funny"
  | "nostalgic"
  | "bittersweet";

export type MemoryKind =
  | "leaf"
  | "flower"
  | "fruit"
  | "dryleaf"
  | "bud"
  | "sparkle";

export interface WhatsAppExcerptItem {
  sender: string;
  text: string;
  time: string;
}

export interface MemoryLocation {
  name: string;
  context?: string;
}

export interface Memory {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  category: MemoryCategory | string;
  tags?: string[];
  story?: string;
  quote?: string;
  whatsapp_excerpt?: WhatsAppExcerptItem[];
  location?: MemoryLocation;
  song_ref?: string;
  mood?: MemoryMood | string;
  is_pinned?: boolean;
  media_count_estimate?: number;
  media_dates?: string[];
  ai_confidence?: "high" | "medium" | "low";
  kind?: MemoryKind;
}

export interface MemoriesPayload {
  metadata: Record<string, unknown>;
  memories: Memory[];
}

export interface GlossaryTerm {
  term: string;
  meaning: string;
  frequency?: number;
  first_use?: string;
  examples?: string[];
}

export interface LocationEntry {
  name: string;
  type?: string;
  first_mention?: string;
  last_mention?: string;
  frequency?: number;
  context?: string;
  estimated_lat?: number;
  estimated_lng?: number;
  associated_memories?: string[];
}
