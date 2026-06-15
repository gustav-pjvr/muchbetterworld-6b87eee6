/**
 * Registry of app email templates.
 *
 * This file is consumed by the scaffolded transactional email send route
 * (`/lovable/email/transactional/send`) once the email domain is configured
 * and email infra is set up. Until then it is a passive declaration so the
 * templates are ready to send from day one.
 */
import type { ComponentType } from "react";

export interface TemplateEntry {
  component: ComponentType<Record<string, unknown>>;
  subject: string | ((data: Record<string, unknown>) => string);
  displayName?: string;
  previewData?: Record<string, unknown>;
  to?: string;
}

import { template as signupNotification } from "./signup-notification";
import { template as contactConfirmation } from "./contact-confirmation";

export const TEMPLATES: Record<string, TemplateEntry> = {
  "signup-notification": signupNotification,
  "contact-confirmation": contactConfirmation,
};
