import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
  message?: string;
}

const Email = ({ name, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to muchbetter.world</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thanks{ name ? `, ${name}` : ""}!</Heading>
        <Text style={lead}>
          We've received your message and will be in touch shortly — usually
          within one business day.
        </Text>

        {message ? (
          <Section>
            <Text style={subLabel}>Your message</Text>
            <Text style={messageBox}>{message}</Text>
          </Section>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          MuchBetter — gustav@muchbetter.world — +27 67 833 7199
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "Thanks for reaching out to muchbetter.world",
  displayName: "Contact form confirmation",
  previewData: {
    name: "Jane",
    message: "Hi, I'd love to chat about a new site for our business.",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" };
const container = { padding: "24px 28px", maxWidth: "560px" };
const h1 = { fontSize: "22px", color: "#0a2540", margin: "0 0 12px" };
const lead = { fontSize: "14px", color: "#475569", margin: "0 0 16px" };
const subLabel = {
  fontSize: "12px",
  color: "#475569",
  margin: "16px 0 6px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};
const messageBox = {
  fontSize: "14px",
  color: "#0f172a",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "14px 18px",
  margin: "0",
};
const hr = { borderColor: "#e2e8f0", margin: "24px 0 12px" };
const footer = { fontSize: "12px", color: "#94a3b8", margin: 0 };
