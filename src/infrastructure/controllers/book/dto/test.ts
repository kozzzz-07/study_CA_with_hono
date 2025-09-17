import { z } from "zod";

const CONTACT_TYPE_NAMES = ["product", "technical", "general"] as const;

export type ContactTypeValues = (typeof CONTACT_TYPE_NAMES)[number];
export type ContactTypeKeys = Capitalize<ContactTypeValues>;

export const CONTACT_TYPE = {
  Product: { value: "product", label: "製品" },
  Technical: { value: "technical", label: "技術" },
  General: { value: "general", label: "その他全般" },
} as const satisfies Record<
  ContactTypeKeys,
  { value: ContactTypeValues; label: string }
>;

export const contactTypeSchema = z.enum(CONTACT_TYPE_NAMES);
