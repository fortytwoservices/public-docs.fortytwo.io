
# Fortytwo Managed Microsoft Entra External ID

Fortytwo's Managed External ID service provides a production-ready, enterprise-grade implementation of Microsoft Entra External ID for customer identity and access management (CIAM), delivered as a fully managed service. This eliminates the complexity of tenant configuration, security hardening, and operational management while providing enhanced functionality and professional support.

## Prerequisites

- Azure subscription with appropriate permissions
- HTTPS-enabled customer-facing applications
- Brand assets for custom sign-in experiences
- Email/SMS provider (Azure Communication Services or custom)
- Basic understanding of OAuth 2.0 and OpenID Connect

## Service Overview

### What We Provide

- **Fully Managed External Tenant**: Complete External ID tenant setup and configuration
- **Multiple Authentication Methods**: Email/password, one-time passcodes, social providers (Google, Facebook, Apple), custom OIDC/SAML
- **CheckID Passwordless Module**: Optional integration with trusted Nordic/European eIDs (BankID, Vipps, MobilePay, ID-porten, Signicat) + global API integrations
- **Production-Ready Infrastructure**: Security-hardened, monitored, enterprise-grade configuration
- **Custom Branding**: Tailored sign-up/sign-in experiences matching your brand
- **API & Partner Portal**: Support for B2B API partners and developer ecosystem
- **Conditional Access Policies**: AI-powered risk detection and adaptive authentication
- **Professional Support**: Implementation guidance, ongoing management, and 24/7 monitoring
- **Compliance Ready**: GDPR, SOC 2, ISO 27001 aligned configurations

### Business Benefits

| Benefit | Self-Managed Approach | Fortytwo Managed Service |
|---------|----------------------|--------------------------|
| Time to Production | 4-8 months | 6-8 weeks |
| Configuration Complexity | High - 100+ settings | Low - Managed for you |
| Security Hardening | DIY security reviews | Enterprise-grade defaults |
| Operational Management | 24/7 internal team needed | Fully managed |
| Support Model | Microsoft standard support | Fortytwo professional support |
| Cost Predictability | Variable + internal staffing | Fixed monthly + usage |
| Compliance Configuration | Self-certification | Pre-configured compliance |

## Architecture

### Managed External ID Deployment

```
Customer Applications
│
│ OAuth/OIDC
▼
┌────────────────────────────────┐
│ Fortytwo Managed │ ◄── Fully Managed
│ External ID Tenant │ ◄── Security Monitored
│ (Customer CIAM) │ ◄── 99.9% SLA
└───────────┬────────────────────┘
│
├─► Custom Branding
├─► Conditional Access
├─► Identity Providers
├─► CheckID Module (Optional)
├─► User Flows
└─► Security Monitoring
│
▼
┌────────────────────────────────┐
│ Microsoft Entra External ID │
│ Platform │
└────────────────────────────────┘
```

### CheckID Integration Architecture

```
End Users (Global Coverage)
│
├─► Nordic/European: BankID/Vipps/MobilePay/National eIDs
├─► Americas: Custom API integrations
├─► Asia-Pacific: Custom API integrations
└─► Middle East/Africa: Custom API integrations
│
▼
┌────────────────────────────────┐
│ CheckID.no Module │ ◄── Optional Add-on
│ (Passwordless Auth) │ ◄── Trusted eID Verification
└───────────┬────────────────────┘
│ OIDC Federation
▼
┌────────────────────────────────┐
│ Fortytwo External ID │
│ Management Layer │
└───────────┬────────────────────┘
│
├─► Configuration Management
├─► Security Monitoring (Sentinel)
├─► User Analytics
└─► Incident Response
```

## Core Services

### Identity Management
- **User Registration**: Self-service sign-up with email verification
- **Profile Management**: Customer self-service account management
- **Password Policies**: Enterprise-grade password requirements
- **Account Recovery**: Secure password reset flows

### Authentication Services
- **Multi-Factor Authentication**: SMS, email OTP, authenticator apps
- **Social Login**: Google, Facebook, Apple, LinkedIn
- **Passwordless**: Email magic links, FIDO2 support
- **CheckID Integration**: Nordic/European national eID verification + global trusted identity verification (optional)
- **SSO**: Single sign-on across your application portfolio

### Security & Risk Management
- **Conditional Access**: Risk-based authentication policies
- **Fraud Detection**: AI-powered anomaly detection
- **Identity Protection**: Real-time threat monitoring
- **Audit Logging**: Comprehensive security event logging

### Developer Experience
- **API Partner Onboarding**: Self-service developer portal
- **OAuth 2.0 / OIDC**: Standard protocol support
- **Webhook Integration**: Real-time event notifications
- **Custom Claims**: Application-specific user attributes

## CheckID Passwordless Module

### Overview
The CheckID module adds trusted, government-grade and payment-provider identity verification for customers worldwide through integration with national electronic IDs, banking credentials, mobile payment systems, and custom API integrations for any market globally.

### Supported Identity Providers

**Nordic Countries**:
- Norway: BankID, Vipps, ID-porten, MobilePay
- Sweden: BankID, MobilePay
- Denmark: MitID, NemID (legacy), MobilePay
- Finland: FTN (Finnish Trust Network), MobilePay
- Iceland: Íslykill (Audkenni)

**European Coverage (via Signicat)**:
- 35+ eID schemes across 44 countries
- Government-issued digital IDs
- Bank-issued identity credentials
- Belgium: itsme®
- Netherlands: iDIN, DigiD
- Germany: Verimi, eID card
- Austria: Handy-Signatur
- Estonia: eID card
- Czech Republic: Bank iD
- Poland: mObywatel
- And 35+ more across EU/EEA

**Global Coverage (via Custom API Integrations)**:
- **Asia-Pacific**: 
  - Singapore: SingPass
  - Japan: MyNumber
  - Australia: myGovID
  - India: Aadhaar (compliance-dependent)
  - Hong Kong: iAM Smart
  - Thailand: NDID
  - Custom integrations for any market
  
- **Americas**:
  - Canada: Government sign-in services
  - USA: Login.gov, ID.me, state-level eIDs
  - Brazil: Gov.br
  - Mexico: e.firma
  - Custom integrations for any market
  
- **Middle East & Africa**:
  - UAE: UAE Pass
  - Saudi Arabia: Absher, NAFATH
  - South Africa: Smart ID
  - Kenya: Huduma Namba
  - Custom integrations for any market

**Payment & Fintech Providers**:
- MobilePay (Nordic)
- Open Banking verification (22 EU countries)
- Bank verification APIs (global)
- Custom payment provider integrations

### CheckID Features

**Passwordless Authentication**:
- Zero password management
- Bank-grade security
- Instant verification
- Reduced friction
- Global coverage via API integrations

**Self-Service Onboarding**:
- Verify identity in seconds
- No manual document checks
- Automatic account provisioning
- Compliance-ready verification
- Works in any market where you operate

**Account Recovery**:
- Re-verify with trusted eID or payment provider
- No helpdesk involvement
- Instant access restoration
- Audit trail maintained

**Custom API Integration Process**:
- Fortytwo builds and maintains integrations
- You specify required markets/providers
- Standardized OIDC/OAuth interface
- One integration point for all providers
- Ongoing maintenance included

### CheckID Use Cases

**1. Nordic B2C Applications**
Enable Norwegian, Swedish, Danish, and Finnish customers to sign in with BankID, Vipps, MobilePay, or their trusted banking credentials.

**2. European Market Expansion**
Support customers across 44 European countries with their national eID schemes and payment verification.

**3. Global Customer Base**
Serve customers worldwide with locally-trusted identity methods through Fortytwo's custom API integrations (Asia, Americas, Middle East, Africa).

**4. High-Value Transactions**
Step-up authentication for sensitive operations using verified government IDs or payment provider credentials.

**5. Regulatory Compliance**
Meet AML/KYC requirements globally with bank-grade identity verification and payment provider authentication.

**6. Employee/Contractor Onboarding**
Passwordless workforce authentication for operations in any country where you have staff.

### CheckID Integration Options

**Standard Integration** (Included in CheckID Module):
- Pre-configured OIDC federation
- BankID, Vipps, MobilePay, ID-porten support
- Standard user flows
- Basic monitoring
- Up to 3 Nordic countries

**Premium Integration**:
- Full Signicat eID Hub access (35+ eIDs)
- MobilePay across all Nordic markets
- Custom claim mapping
- Advanced fraud detection
- White-label frontend
- Up to 10 European countries

**Enterprise Integration**:
- **Unlimited global custom API integrations**
- Fortytwo builds and maintains all integrations
- Any identity provider in any market
- Dedicated CheckID instance
- Custom compliance configurations
- Priority support
- Full white-label options

**Custom API Integration Delivery**:
- Standard providers: 2-4 weeks per integration
- Complex providers: 4-8 weeks per integration
- Ongoing maintenance included in monthly fee
- Updates and upgrades managed by Fortytwo
- SLA-backed availability

### Global Integration Examples

**Manufacturing Company (60+ countries)**:
- Europe: Signicat eID Hub
- Asia: SingPass (Singapore), MyNumber (Japan), custom India integration
- Americas: Login.gov (USA), Gov.br (Brazil)
- Middle East: UAE Pass, NAFATH (Saudi Arabia)
- **Result**: Single authentication flow, locally-trusted verification worldwide

**Financial Services (Regulated Markets)**:
- Nordic: BankID, MobilePay for payments
- EU: Open Banking verification + national eIDs
- USA: Login.gov + bank account verification
- Compliance with local KYC/AML in each market

**IoT/Connected Devices (Global Consumer)**:
- Local payment verification (MobilePay, Apple Pay, Google Pay)
- Government ID fallback for each market
- Device association with verified identity
- Cross-border identity portability

## Supported Use Cases

### 1. Consumer Applications
**Scenario**: E-commerce, SaaS, mobile apps requiring customer authentication

**Features**:
- Fast social login (Google, Facebook, Apple)
- Email/password with MFA
- CheckID for Nordic/European users with BankID/MobilePay (optional)
- CheckID for global markets with local trusted providers (optional)
- Custom branded experiences
- Progressive profiling

**Claims**: Email, name, preferences, subscription status, custom attributes

### 2. B2B Customer Portal
**Scenario**: Business customers accessing services and dashboards

**Features**:
- Enterprise SSO integration
- CheckID for verified business identity globally (optional)
- Multi-tenant support
- Role-based access control
- Company-wide invitations

**Claims**: Company ID, role, permissions, business metadata

### 3. API Partner Ecosystem
**Scenario**: Third-party developers building integrations

**Features**:
- Developer self-registration
- API key management
- OAuth consent flows
- Rate limiting policies

**Claims**: Developer ID, API scopes, organization, tier level

### 4. IoT & Connected Devices
**Scenario**: Mobile apps controlling connected equipment

**Features**:
- Device registration
- Certificate-based auth
- MobilePay/payment verification for device setup
- Offline capability
- Equipment associations

**Claims**: Device IDs, serial numbers, ownership, location

### 5. Multi-Brand Organizations
**Scenario**: Multiple customer-facing brands under one company

**Features**:
- Separate tenant per brand
- Shared identity across brands
- Cross-brand analytics
- Centralized management

**Claims**: Brand affiliation, cross-brand loyalty, preferences

## Custom Branding Options

### Standard Branding (Included)
- **Logo Upload**: Your company logo on sign-in pages
- **Color Scheme**: Primary and accent colors
- **Basic Customization**: Standard layouts and templates
- **Email Templates**: Branded verification and notification emails

### Advanced Branding (Premium)
- **Custom Domain**: login.yourcompany.com
- **Full CSS Control**: Complete UI customization
- **Custom Layouts**: Unique page designs
- **Multi-language**: Support for 20+ languages
- **White-Label**: Complete brand immersion

### Branding Elements

**Sign-in Experience**:
- Background images or colors
- Custom headers and footers
- Terms of service and privacy policy links
- Help and support information
- CheckID branding integration (if module enabled)
- Localized provider names (BankID, MobilePay, local eIDs)

**Email Communications**:
- Verification emails
- Password reset notifications
- Security alerts
- Marketing opt-in confirmations

## Implementation Guide

### 8-Week Deployment Program

**Weeks 1-2: Discovery & Planning**
- Requirements gathering and use case analysis
- Identity provider selection (social, enterprise, custom, CheckID)
- Geographic coverage assessment
- Global integration requirements (which markets need custom APIs)
- User flow design and journey mapping
- Security and compliance requirements
- Brand asset collection
- CheckID module assessment (if requested)

**Weeks 3-4: Tenant Configuration**
- External ID tenant provisioning
- Identity provider integration
- CheckID module integration (if selected)
- Initial custom API integrations (priority markets)
- Custom branding implementation
- User attribute schema design
- Security policy configuration

**Weeks 5-6: Application Integration**
- SDK integration guidance
- API endpoint configuration
- CheckID authentication flows (if enabled)
- Global provider testing
- Test environment setup
- Developer documentation
- QA and security testing

**Weeks 7-8: Go-Live Preparation**
- Production deployment
- Security review and penetration testing
- Performance testing and optimization
- User acceptance testing
- Documentation and training delivery
- Post-launch monitoring setup

**Post-Launch: Ongoing Custom Integrations**
- Additional markets as you expand
- New provider integrations on-demand
- Continuous updates and maintenance
- Performance optimization

### Post-Launch Support
- 30-day hyper-care period
- Weekly check-ins
- Performance monitoring
- User feedback analysis
- Optimization recommendations
- New market integration planning

## Security & Compliance

### Security Features

**Identity Protection**:
- Real-time risk detection
- Anomalous sign-in detection
- Leaked credential monitoring
- Suspicious activity alerts
- CheckID verified identity assurance globally (optional)

**Access Controls**:
- Conditional Access policies
- Location-based restrictions
- Device compliance requirements
- MFA enforcement
- Step-up authentication with CheckID (optional)
- Geographic policy enforcement

**Data Protection**:
- Encryption at rest and in transit
- PII data minimization
- GDPR-compliant data handling
- Right to be forgotten support
- Regional data residency options

### Compliance Standards

**Certifications**:
- SOC 2 Type II
- ISO 27001
- GDPR compliant
- HIPAA eligible (with BAA)
- PCI DSS Level 1 (for payment flows)
- eIDAS compliant (with CheckID module)
- Regional compliance support (PDPA, LGPD, etc.)

**Data Residency**:
- EU data centers available
- Nordic data centers available (Norway)
- US data centers available
- Asia-Pacific data centers available
- Middle East data centers available
- Custom geographic requirements supported

### Audit & Logging

**What We Monitor**:
- All authentication attempts
- CheckID verification events globally (if enabled)
- Configuration changes
- Security policy violations
- Administrative actions
- API usage patterns
- Geographic access patterns

**What We DON'T Store**:
- Passwords (hashed only)
- Payment information
- Unnecessary PII
- Application data
- Provider credentials

**Retention Policies**:
- Security logs: 90 days standard, custom retention available
- Audit logs: 1 year
- User activity: Configurable per compliance requirements

## Monitoring & Operations

### Service Monitoring

**Health Checks**:
- Authentication endpoint availability
- Identity provider connectivity
- CheckID module availability globally (if enabled)
- MobilePay integration status
- Custom API integration health
- Email/SMS delivery rates
- API response times
- Error rates and anomalies

**Alerting**:
- Proactive incident detection
- Provider-specific alerts
- Geographic availability monitoring
- Automatic escalation
- Status page updates
- Customer notifications

### Performance Metrics

**Key Performance Indicators**:
- Authentication success rate (target: >99.5%)
- Sign-in latency (target: <500ms p95)
- CheckID verification success rate globally (target: >99% if enabled)
- MobilePay authentication success rate (target: >99%)
- Custom API integration uptime (target: >99.9%)
- Registration completion rate
- MFA enrollment rate
- Support ticket volume

## Support & SLA

### Service Level Agreement

| Metric | Standard | Premium | Enterprise |
|--------|----------|---------|------------|
| Uptime | 99.9% | 99.95% | 99.99% |
| Authentication Latency | <500ms (p95) | <300ms (p95) | <200ms (p95) |
| Support Response | <4 hours | <2 hours | <1 hour |
| Critical Issue Resolution | <24 hours | <12 hours | <4 hours |
| Monthly Active Users | Up to 100K | Up to 500K | Unlimited |
| Custom API Integrations | 3 included | 10 included | Unlimited |

### Support Tiers

**Standard Support (Included)**:
- Email support (business hours)
- Configuration assistance
- Integration documentation
- Monthly service reviews
- Security patch management
- CheckID module support (if enabled)
- Up to 3 custom API integrations

**Premium Support**:
- 24/7 email & phone support
- Dedicated Slack channel
- Quarterly business reviews
- Priority feature requests
- Custom integration consulting
- CheckID optimization guidance
- Up to 10 custom API integrations
- MobilePay integration support

**Enterprise Support**:
- 24/7 phone & video support
- Dedicated technical account manager
- Weekly operations reviews
- Custom SLA agreements
- Direct access to engineering team
- Custom development services
- Priority CheckID feature requests
- **Unlimited custom API integrations**
- Global provider relationship management

## Pricing Model

### Base Service

**Setup Fee**: One-time implementation (8-week program)
- €13,800 / 145,000 NOK (Standard)
- €23,000 / 241,500 NOK (Growth)
- Custom (Enterprise)

**Monthly Active Users**: Tiered pricing model
- First 50K MAU: Included in base fee
- 50K - 100K MAU: €0.018/user (0.19 NOK/user)
- 100K - 500K MAU: €0.014/user (0.15 NOK/user)
- 500K+ MAU: Custom pricing

**Management Fee**: Monthly operational management
- Standard: €2,300/month (24,150 NOK/month)
- Premium: €4,600/month (48,300 NOK/month)
- Enterprise: Custom

### CheckID Passwordless Module

**Module Setup**: One-time integration
- Standard Integration (Nordic): €4,600 / 48,300 NOK
- Premium Integration (Nordic + Full EU Signicat): €9,200 / 96,600 NOK
- Enterprise Integration (Global Unlimited): €18,400 / 193,200 NOK

**Monthly License**: Per-user pricing
- First 10K MAU: €0.05/user (0.53 NOK/user)
- 10K - 50K MAU: €0.04/user (0.42 NOK/user)
- 50K+ MAU: €0.03/user (0.32 NOK/user)

**Custom API Integration Fees** (Enterprise Package):
- Setup per new market/provider: €2,300-4,600 (24,150-48,300 NOK)
- Monthly maintenance per integration: €460 (4,830 NOK)
- Unlimited integrations: Flat fee €4,600/month (48,300 NOK)

**eID Provider Costs**: Pass-through billing
- Nordic eIDs (BankID, Vipps, MobilePay): ~€0.10-0.30 per authentication (1-3 NOK)
- Signicat eID Hub: €0.15-0.50 per authentication (1.5-5 NOK)
- Global custom APIs: €0.20-0.80 per authentication (2-8 NOK) depending on provider
- Volume discounts available

### Optional Add-Ons

- **Premium Branding**: €6,900 setup + €460/month (72,450 NOK + 4,830 NOK/month)
- **Additional Environments**: €920/month per environment (9,660 NOK/month)
- **Enhanced Monitoring**: €1,380/month (14,490 NOK/month)
- **Migration Services**: €230/hour (2,415 NOK/hour)
- **Custom Integrations**: €230/hour (2,415 NOK/hour)
- **Professional Services**: €230/hour (2,415 NOK/hour)
- **Express Custom API Integration**: €6,900 (72,450 NOK) for 2-week delivery

### Package Examples

**Startup Package** (Up to 50K MAU):
- Setup: €13,800 (145,000 NOK)
- Monthly: €2,300 (24,150 NOK)
- Includes: Standard support, basic branding, 2 environments
- **With CheckID Nordic**: Add €4,600 setup (48,300 NOK) + €0.05/user monthly (0.53 NOK/user)

**Growth Package** (Up to 250K MAU):
- Setup: €23,000 (241,500 NOK)
- Monthly: €4,600 + usage (48,300 NOK + usage)
- Includes: Premium support, advanced branding, 3 environments
- **With CheckID Premium EU**: Add €9,200 setup (96,600 NOK) + €0.04/user monthly (0.42 NOK/user)

**Enterprise Package** (Unlimited MAU):
- Setup: Custom
- Monthly: Custom
- Includes: Enterprise support, white-label, unlimited environments
- **With CheckID Enterprise Global**: Add €18,400 setup (193,200 NOK) + unlimited custom API integrations + €0.03/user monthly (0.32 NOK/user)

### Example Total Cost Scenarios

**Scenario 1: Nordic SaaS with 30K MAU + MobilePay**
- Base monthly: €2,300 (24,150 NOK)
- Users: €0 (included in first 50K)
- CheckID Nordic (BankID, Vipps, MobilePay): 30K × €0.05 = €1,500 (15,750 NOK)
- **Total Monthly**: €3,800 (39,900 NOK)

**Scenario 2: European E-commerce with 150K MAU**
- Base monthly: €4,600 (48,300 NOK)
- Users: 100K × €0.014 = €1,400 (14,700 NOK)
- CheckID Premium (Full EU + MobilePay): 50K × €0.04 = €2,000 (21,000 NOK)
- **Total Monthly**: €8,000 (84,000 NOK)

**Scenario 3: Global Marketplace with 500K MAU (60 countries)**
- Base monthly: Custom (~€8,000 / 84,000 NOK)
- Users: 450K × €0.014 = €6,300 (66,150 NOK)
- CheckID Enterprise Global: 
  - Base: €0.03/user × 200K = €6,000 (63,000 NOK)
  - Unlimited integrations: €4,600 (48,300 NOK)
  - Custom APIs (10 markets): Included
- **Total Monthly**: ~€24,900 (261,450 NOK)

**Scenario 4: Manufacturing/Equipment (60 countries, employee + customer)**
- Base monthly: Custom (~€10,000 / 105,000 NOK)
- Employees (60K): €0.014 × 10K = €140 (1,470 NOK)
- Customers (200K): €0.014 × 150K = €2,100 (22,050 NOK)
- CheckID Enterprise:
  - Unlimited global: €4,600 (48,300 NOK)
  - 15 custom API integrations for key markets
- **Total Monthly**: ~€16,840 (176,820 NOK)

---

## Getting Started

**Ready to simplify your customer identity management globally?**

📧 Contact: [external-id@fortytwo.io](mailto:external-id@fortytwo.io)  
📞 Schedule a demo: [fortytwo.io/book-a-demo](https://www.fortytwo.io/book-a-demo)  
📚 Technical documentation: [docs.fortytwo.io/external-id](https://docs.fortytwo.io/external-id)  
🔐 CheckID module info: [docs.checkid.no](https://docs.checkid.no)

**Next Steps**:
1. Schedule discovery call
2. Identify required geographic markets and providers
3. Receive custom proposal with CheckID assessment
4. Review architecture design
5. Sign MSA and SOW
6. Kick off 8-week implementation
7. Ongoing custom API integrations as you expand

---

*All prices exclude VAT. Norwegian customers subject to 25% MVA. EU customers subject to local VAT rates. Volume discounts available for enterprise deployments. CheckID module requires separate terms with identity provider partners. Custom API integration pricing varies by provider complexity and market requirements. Contact us for detailed pricing based on your specific geographic coverage needs.*
