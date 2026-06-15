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
  email?: string;
  company?: string | null;
  phone?: string | null;
  projectType?: string | null;
  message?: string;
  submittedAt?: string;
}

const Email = ({
  name,
  email,
  company,
  phone,
  projectType,
  message,
  submittedAt,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New conversation request from {name ?? "a visitor"}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New conversation request</Heading>
        <Text style={lead}>
          Someone just submitted the contact form on muchbetter.world.
        </Text>

        <Section style={card}>
          <Row label="Name" value={name} />
          <Row label="Email" value={email} />
          <Row label="Company" value={company ?? "—"} />
          <Row label="Phone" value={phone ?? "—"} />
          <Row label="Project type" value={projectType ?? "—"} />
          <Row label="Submitted" value={submittedAt ?? ""} />
        </Section>

        <Heading as="h2" style={h2}>
          Message
        </Heading>
        <Text style={messageBox}>{message}</Text>

        <Hr style={hr} />
        <Text style={footer}>
          MuchBetter — gustav@muchbetter.world — +27 67 833 7199
        </Text>
      </Container>
    </Body>
  </Html>
);

const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <Text style={row}>
    <strong style={rowLabel}>{label}:</strong>{" "}
    <span style={rowValue}>{value || ""}</span>
  </Text>
);

export const template = {
  component: Email,
  subject: (data) => {
    const name =
      data && typeof data === "object" && "name" in data
        ? String((data as { name?: string }).name ?? "")
        : "";
    return name ? `New conversation request from ${name}` : "New conversation request";
  },
  displayName: "Contact form notification",
  previewData: {
    name: "Jane Smith",
    email: "jane@example.com",
    company: "Acme Co.",
    phone: "+27 11 555 0100",
    projectType: "Website Development",
    message: "Hi, I'd love to chat about a new site for our business.",
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif" };
const container = { padding: "24px 28px", maxWidth: "560px" };
const h1 = { fontSize: "22px", color: "#0a2540", margin: "0 0 12px" };
const h2 = { fontSize: "16px", color: "#0a2540", margin: "20px 0 8px" };
const lead = { fontSize: "14px", color: "#475569", margin: "0 0 16px" };
const card = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "14px 18px",
};
const row = { fontSize: "14px", color: "#0f172a", margin: "4px 0" };
const rowLabel = { color: "#475569", fontWeight: 600 };
const rowValue = { color: "#0f172a" };
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
