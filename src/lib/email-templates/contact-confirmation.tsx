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
  projectType?: string | null;
}

const Email = ({ name, message, projectType }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to MuchBetter</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thanks{name ? `, ${name}` : ""}!</Heading>
        <Text style={lead}>
          We&apos;ve received your message and Gustav will be in touch shortly.
          In the meantime, here&apos;s a copy of what you sent for your records.
        </Text>

        {projectType ? (
          <Section style={card}>
            <Text style={rowText}>
              <strong style={rowLabel}>Project type:</strong> {projectType}
            </Text>
          </Section>
        ) : null}

        <Heading as="h2" style={h2}>
          Your message
        </Heading>
        <Text style={messageBox}>{message}</Text>

        <Text style={cta}>
          Need to reach us directly? Email{" "}
          <a href="mailto:gustav@muchbetter.world" style={link}>
            gustav@muchbetter.world
          </a>{" "}
          or call +27 67 833 7199.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          MuchBetter — Better solutions. Much better World.
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "Thanks for reaching out to MuchBetter",
  displayName: "Contact form confirmation",
  previewData: {
    name: "Jane",
    message: "Hi, I'd love to chat about a new site for our business.",
    projectType: "Website Development",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" };
const container = { padding: "24px 28px", maxWidth: "560px" };
const h1 = { fontSize: "24px", color: "#0a2540", margin: "0 0 12px" };
const h2 = { fontSize: "16px", color: "#0a2540", margin: "20px 0 8px" };
const lead = { fontSize: "15px", color: "#475569", margin: "0 0 16px", lineHeight: "1.55" };
const card = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "12px 16px",
  margin: "0 0 8px",
};
const rowText = { fontSize: "14px", color: "#0f172a", margin: 0 };
const rowLabel = { color: "#475569", fontWeight: 600 };
const messageBox = {
  fontSize: "14px",
  color: "#0f172a",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "14px 18px",
  margin: "0 0 20px",
};
const cta = { fontSize: "14px", color: "#475569", margin: "12px 0 0", lineHeight: "1.55" };
const link = { color: "#2a9d8f", textDecoration: "underline" };
const hr = { borderColor: "#e2e8f0", margin: "24px 0 12px" };
const footer = { fontSize: "12px", color: "#94a3b8", margin: 0 };
