// Sample vendor directory for the Vendor research agent. Every vendor here is MADE UP for the demo:
// no real company names, people or facts. Files starting with "_" in api/ are not web addresses on Vercel,
// so this is only read by the server code.
//
// The fields mirror what a vendor risk team checks before inviting a vendor:
// sanctions screening, recent breaches, financial health, Canadian data hosting and certifications.

const AS_OF = "2026-11";

const VENDORS = [
  // Software / SaaS
  { id: "V-101", name: "Maplestack Service Desk", category: "Software / SaaS", offers: "Cloud help desk and IT ticketing with service-level tracking and a self-service portal.", keywords: ["help desk", "ticketing", "itsm", "service desk", "support"], hostsInCanada: true, certifications: ["SOC 2 Type II", "ISO 27001"], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 12 },
  { id: "V-102", name: "Northline Tickets", category: "Software / SaaS", offers: "Lightweight ticketing and email-to-ticket tool for small IT teams.", keywords: ["ticketing", "help desk", "email", "support"], hostsInCanada: false, certifications: ["SOC 2 Type II"], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 3 },
  { id: "V-103", name: "Quillgate ITSM", category: "Software / SaaS", offers: "Enterprise IT service management suite: tickets, assets, change management.", keywords: ["itsm", "service desk", "ticketing", "asset", "change"], hostsInCanada: true, certifications: ["SOC 2 Type II", "ISO 27001"], soc1: true, sanctionsHit: false, breach: "Customer support portal exposed contact details in 2025; fixed and disclosed.", financialHealth: "Stable", financialClients: 21 },
  { id: "V-104", name: "Harbourlight Sign", category: "Software / SaaS", offers: "E-signature and document workflow with Canadian data residency.", keywords: ["e-signature", "signature", "documents", "workflow"], hostsInCanada: true, certifications: ["SOC 2 Type II", "ISO 27001"], soc1: true, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 30 },
  { id: "V-105", name: "Cobaltwren Desk", category: "Software / SaaS", offers: "Low-cost help desk for start-ups; recently cut staff and is seeking funding.", keywords: ["help desk", "ticketing", "support"], hostsInCanada: true, certifications: [], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Weak", financialClients: 0 },

  // IT professional or managed services
  { id: "V-201", name: "Granite Watch Security", category: "IT professional or managed services", offers: "24/7 managed detection and response (security operations centre) run from Canada.", keywords: ["security monitoring", "soc", "mdr", "siem", "24/7", "managed security"], hostsInCanada: true, certifications: ["SOC 2 Type II", "ISO 27001"], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 18 },
  { id: "V-202", name: "Tidewater Cyber", category: "IT professional or managed services", offers: "Managed security monitoring with an offshore analyst team.", keywords: ["security monitoring", "soc", "siem", "24/7", "managed security"], hostsInCanada: false, certifications: ["ISO 27001"], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Watch", financialClients: 5 },
  { id: "V-203", name: "Larchmont Consulting", category: "IT professional or managed services", offers: "IT project delivery and staff augmentation for financial services.", keywords: ["consulting", "project", "staff", "implementation", "data platform"], hostsInCanada: true, certifications: ["ISO 27001"], soc1: true, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 25 },
  { id: "V-204", name: "Redfern Managed IT", category: "IT professional or managed services", offers: "Managed service desk and end-user support, including security monitoring add-on.", keywords: ["managed services", "service desk", "help desk", "security monitoring", "24/7"], hostsInCanada: true, certifications: ["SOC 2 Type II"], soc1: false, sanctionsHit: true, breach: null, financialHealth: "Stable", financialClients: 4 },

  // Cloud and hosting
  { id: "V-301", name: "Borealis Cloud Vault", category: "Cloud and hosting", offers: "Encrypted off-site backup storage in two Canadian regions.", keywords: ["backup", "storage", "disaster recovery", "cloud"], hostsInCanada: true, certifications: ["SOC 2 Type II", "ISO 27001"], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 14 },
  { id: "V-302", name: "Stratus Peak Hosting", category: "Cloud and hosting", offers: "Managed cloud hosting and data platforms for regulated industries.", keywords: ["data platform", "hosting", "cloud", "database", "loan", "servicing", "scale"], hostsInCanada: true, certifications: ["SOC 2 Type II", "ISO 27001"], soc1: true, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 22 },
  { id: "V-303", name: "Driftwood Data", category: "Cloud and hosting", offers: "Data warehouse and reconciliation platform; US hosting only.", keywords: ["data platform", "warehouse", "reconciliation", "cloud", "scale"], hostsInCanada: false, certifications: ["SOC 2 Type II"], soc1: true, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 9 },
  { id: "V-304", name: "Fjordline Backup", category: "Cloud and hosting", offers: "Backup-as-a-service with immutable copies.", keywords: ["backup", "storage", "ransomware", "cloud"], hostsInCanada: true, certifications: ["ISO 27001"], soc1: false, sanctionsHit: false, breach: "Ransomware incident at a subcontractor in 2024; no customer data lost, per the vendor.", financialHealth: "Watch", financialClients: 6 },
  { id: "V-305", name: "Lakeshore Ledger Cloud", category: "Cloud and hosting", offers: "Mortgage and loan servicing data platform with automated reconciliations.", keywords: ["loan", "servicing", "mortgage", "data platform", "reconciliation", "scale"], hostsInCanada: true, certifications: ["SOC 2 Type II", "ISO 27001"], soc1: true, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 16 },

  // IT hardware or equipment
  { id: "V-401", name: "Pinecrest Devices", category: "IT hardware or equipment", offers: "Business laptops with imaging, warranty and asset tagging; Canadian reseller.", keywords: ["laptop", "hardware", "devices", "refresh"], hostsInCanada: true, certifications: ["ISO 9001"], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 40 },
  { id: "V-402", name: "Ironbark AV", category: "IT hardware or equipment", offers: "Meeting room audio-visual design and installation.", keywords: ["av", "audio", "video", "meeting room", "boardroom"], hostsInCanada: true, certifications: [], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Stable", financialClients: 8 },
  { id: "V-403", name: "Silverbirch Supply", category: "IT hardware or equipment", offers: "Laptops and peripherals at volume pricing, shipped from overseas.", keywords: ["laptop", "hardware", "devices", "peripherals"], hostsInCanada: false, certifications: [], soc1: false, sanctionsHit: false, breach: null, financialHealth: "Watch", financialClients: 2 }
];

const source = v => `Sample vendor directory (made-up data), profile ${v.id}, as of ${AS_OF}`;

module.exports = { VENDORS, AS_OF, source };
