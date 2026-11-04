export type RemoteSource = {
  repo: string;
  ref?: string;
  path?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  // Featured products get a tab in the header; the rest are reached from the home page.
  featured?: boolean;
  source?: RemoteSource;
};

export const site = {
  title: 'Fortytwo Docs',
  url: 'https://docs.fortytwo.io',
  repo: 'fortytwoservices/public-docs.fortytwo.io',
  branch: 'main',
};

// Order here is the order of the tabs and the home page cards.
// `id` is the folder under docs/ (and the URL prefix). A product with `source`
// is pulled from another repository at build time instead, see scripts/fetch-sources.mjs.
export const products: Product[] = [
  {
    id: 'ai-universe',
    featured: true,
    name: 'AI Universe',
    description: 'Your own AI platform, running in your Azure tenant. Build, govern and run AI apps.',
    icon: 'sparkles',
    badge: 'New',
  },
  {
    id: 'checkid',
    featured: true,
    name: 'CheckID',
    description: 'Onboard new employees with an ID they already trust, such as BankID, and no temporary passwords.',
    icon: 'scan-face',
  },
  {
    id: 'identity-universe',
    featured: true,
    name: 'Identity Universe',
    description: 'Identity and access management built on the data you already have about your people.',
    icon: 'fingerprint',
  },
  {
    id: 'managed-identity-services',
    name: 'Managed Identity Services',
    description: 'HR provisioning, criteria groups, Verified ID and other managed Entra services.',
    icon: 'users-round',
  },
  {
    id: 'marketplace-offerings',
    name: 'Marketplace Offerings',
    description: 'Azure Marketplace products: AKS, landing zones, self-hosted runners and more.',
    icon: 'store',
  },
  {
    id: 'Managed Azure AD B2C',
    name: 'Azure AD B2C',
    description: 'Customer identity with Azure AD B2C: app integration, policies and branding.',
    icon: 'key-round',
  },
  {
    id: 'Entra Reference Architecture',
    name: 'Entra Reference Architecture',
    description: 'Reference designs for Microsoft Entra, including Norwegian municipalities.',
    icon: 'landmark',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'How to report vulnerabilities and reach our security team.',
    icon: 'shield-check',
  },
  {
    id: 'Generic',
    name: 'General',
    description: 'Working with Fortytwo: shared channels, information labelling.',
    icon: 'info',
  },
];

// Copied verbatim from mkdocs.yml (redirect_maps), including its literal %20 keys.
export const redirects: Record<string, string> = {
  'Self%20Hosted%20Runners/GitHub/index.md': 'marketplace-offerings/self-hosted-runners/github/index.md',
  'Self%20Hosted%20Runners/Azure%20DevOps/index.md': 'marketplace-offerings/self-hosted-runners/ado/index.md',
  'Self%20Hosted%20Runners/index.md': 'marketplace-offerings/self-hosted-runners/index.md',
  'identity-universe/get-started/iam-admins/index.md': 'identity-universe/get-started/permissions/index.md',
  'identity-universe/group-link/api.md': 'identity-universe/collections/api/grouplink-api.md',
  'identity-universe/group-link/index.md': 'identity-universe/collections/plandesign/group-link-entraid.md',
  'identity-universe/collections/plandesign/group-link.md': 'identity-universe/collections/plandesign/group-link-overview.md',
  'identity-universe/collections/api/index.md': 'identity-universe/collections/api/collections-api.md',
  'identity-universe/collections/troubleshooting.md': 'identity-universe/collections/troubleshooting/troubleshoot-collections.md',
  'identity-universe/collections/plandesign/migration-patterns.md': 'identity-universe/collections/deployuse/migration-patterns.md',
};
