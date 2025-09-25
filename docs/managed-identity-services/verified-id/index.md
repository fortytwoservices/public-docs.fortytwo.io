# Fortytwo Managed Microsoft Entra Verified ID

Fortytwo's Managed Verified ID service provides a production-ready, enterprise-grade implementation of Microsoft Entra Verified ID, delivered as a managed proxy service. This eliminates the complexity of direct Microsoft integration while providing enhanced functionality and professional support.

## Prerequisites:
- Microsoft Entra ID tenant (for ID Token credentials)
- HTTPS-enabled client application (if not using CheckID frontend)
- Webhook endpoint capability
- API key management system
- Brand assets (for white-label options)

## Service Overview

### What We Provide

- **Standalone Verified ID Provider**: Direct Microsoft Entra Verified ID integration service
- **Multiple Credential Types**: Government ID, Mobile Driver's License, Employee credentials, ID Token, and ID Token Hint
- **Production-Ready Infrastructure**: Kubernetes-hosted, auto-scaling, enterprise-grade
- **Simplified APIs**: Unified endpoints for issuance and verification
- **CheckID Frontend Integration**: Optional web-based identity verification frontend
- **White-Label Solutions**: Fully customizable branding and user experience
- **Professional Support**: Implementation guidance and ongoing technical support
- **Compliance Ready**: Built with enterprise security and audit requirements

### Business Benefits

| Benefit | Traditional Approach | Fortytwo Managed Service |
| - | - | - |
| **Time to Production** | 3-6 months | 6 weeks |
| **Integration Complexity** | High - Direct MS APIs | Low - Simplified proxy |
| **Infrastructure Management** | Self-managed | Fully managed |
| **Support Model** | Community + MS Support | Professional Fortytwo support |
| **Credential Branding** | Microsoft-branded | Fortytwo or White-labeled |
| **Multi-tenant Ready** | Custom implementation | Built-in |
| **Frontend Included** | Build your own | Optional CheckID frontend |

---

## Architecture

### Standalone Verified ID Provider

```
Client Applications
        │
        │ API Calls
        ▼
┌───────────────────────────┐
│  Fortytwo Verified ID     │ ◄── Standalone Service
│     Provider Service      │ ◄── No User Data Storage
│  (.NET 8 Minimal APIs)    │ ◄── Enterprise Security
└───────────┬───────────────┘
            │ Forward Requests
            ▼
┌───────────────────────────┐
│   Microsoft Entra        │
│   Verified ID Service     │
└───────────────────────────┘
```

### Optional CheckID Frontend Integration

```
End Users
    │
    │ Web Interface
    ▼
┌───────────────────────────┐
│      CheckID Frontend     │ ◄── Optional Web UI
│   (Identity Verification) │ ◄── User Experience Layer
└───────────┬───────────────┘
            │ API Calls
            ▼
┌───────────────────────────┐
│  Fortytwo Verified ID     │ ◄── Core Provider Service
│     Provider Service      │ ◄── Credential Management
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│   Microsoft Entra        │
│   Verified ID Service     │
└───────────────────────────┘
```

### Core Services

- **Verified ID Provider**: Core credential issuance and verification service
- **API Gateway**: Request routing, authentication, and rate limiting
- **Request Transformer**: API mapping and validation
- **Response Formatter**: Standardized response formatting
- **Webhook Forwarder**: Event relay to client systems
- **Monitoring & Audit**: Comprehensive logging and metrics

---

## Supported Credential Types

### 1. Employee Credential

Professional employee verification with customizable claims.

**Claims Included:**
- Employee ID, Display Name, Email
- Department, Job Title, Country Code
- Identity Provider, Verification Level
- Onboarding Date

**Use Cases:**
- Employee verification for system access
- Cross-organizational collaboration
- Temporary worker verification

### 2. Government ID Credential

Government-issued identity document verification.

**Claims Included:**
- Document type and issuing authority
- Personal identification data
- Document validity status

### 3. Mobile Driver's License (mDL)

Digital driver's license verification compliant with ISO 18013-5 standards.

### 4. ID Token Credential

Entra ID-based identity credential for existing enterprise users.

### 5. ID Token Hint Credential

Direct claims-based credential issuance for custom scenarios.

---

## Frontend Solutions

### CheckID as Frontend Option

CheckID serves as an optional web-based frontend that provides a complete user experience for identity verification and credential management:

**CheckID Frontend Features:**
- **Web-based Identity Verification**: User-friendly interface for credential requests
- **QR Code Display**: Seamless mobile wallet integration
- **Real-time Status Updates**: Live progress tracking for users
- **Multi-language Support**: Localized user experience
- **Responsive Design**: Works across desktop and mobile browsers

### Integration Options

**Option 1: Verified ID Provider Only**
```
Your Application → Fortytwo Verified ID Provider → Microsoft Entra Verified ID
```
- Direct API integration
- Build your own user interface
- Full control over user experience

**Option 2: CheckID Frontend + Verified ID Provider**
```
Users → CheckID Frontend → Fortytwo Verified ID Provider → Microsoft Entra Verified ID
```
- Ready-to-use web interface
- Faster implementation
- Professional user experience included

**Option 3: White-Label Solution**
```
Users → Your Branded Frontend → Fortytwo Verified ID Provider → Microsoft Entra Verified ID
```
- Fully customized branding
- Your domain and certificates
- Complete white-label experience

### CheckID Frontend Workflow

1. **User Access**: User visits CheckID web application
2. **Identity Selection**: Choose verification method (Gov ID, Employee, etc.)
3. **Credential Request**: CheckID calls Fortytwo Verified ID Provider
4. **QR Code Display**: User scans QR with Microsoft Authenticator
5. **Real-time Updates**: CheckID shows progress and completion status
6. **Integration**: Results forwarded to your backend systems

---

## White-Label Options

### Complete Branding Customization

Transform the service to match your organization's brand and requirements:

**Frontend Customization:**
- **Custom Domain**: Use your own domain name (e.g., `credentials.yourcompany.com`)
- **Brand Assets**: Your logos, colors, fonts, and styling
- **Custom Messaging**: Tailored user instructions and help text
- **Localization**: Support for your preferred languages
- **SSL Certificates**: Your own SSL certificates and security policies

**Credential Branding:**
- **Issuer Identity**: Credentials issued under your organization's name
- **Custom Logos**: Your organization's logo on digital credentials
- **Brand Colors**: Credential cards match your brand palette
- **Custom Claims**: Organization-specific data fields and validation

**API Customization:**
- **Custom Endpoints**: API paths that match your naming conventions
- **Response Format**: Customize JSON structures to match your systems
- **Webhook Integration**: Events delivered with your preferred payload format
- **Rate Limiting**: Custom limits based on your usage patterns

### White-Label Deployment Models

**Shared Infrastructure (Standard)**
- Your branding on shared Fortytwo infrastructure
- Cost-effective for most organizations
- Standard SLAs and support

**Dedicated Instance (Enterprise)**
- Dedicated infrastructure for your organization
- Enhanced security and isolation
- Custom SLAs and compliance requirements
- Premium support and monitoring

**Hybrid Model (Custom)**
- Mix of shared and dedicated components
- Tailored to specific security or compliance needs
- Custom pricing and support agreements

### White-Label Implementation Process

**Week 1-2: Brand Configuration**
- Brand asset collection and integration
- Domain setup and SSL configuration
- Custom styling and UI adjustments

**Week 3-4: Service Customization**
- API endpoint customization
- Credential definition branding
- Webhook payload formatting

**Week 5-6: Testing & Deployment**
- End-to-end white-label testing
- Domain verification and go-live
- Documentation and training delivery

---

## Implementation Guide

### 6-Week Quick-Start Program

**Week 1 - Planning & Analysis**
- Requirements gathering and use case selection
- Integration architecture design
- White-label requirements assessment
- Security and compliance review

**Weeks 2-3 - Service Enablement**
- Fortytwo service configuration
- Credential definition setup
- CheckID frontend configuration (if selected)
- Test environment provisioning

**Weeks 4-5 - Integration & Development**
- API integration development
- User journey implementation
- Webhook endpoint setup
- Brand customization (white-label)

**Week 6 - Testing & Production Deployment**
- End-to-end testing
- Production deployment
- Documentation handover and training

---

## Security & Compliance

### Security Model

- **Client API Key Authentication**: Secure client identification
- **Rate Limiting**: Per-client request throttling
- **Audit Logging**: Comprehensive request/response logging
- **No User Data Storage**: Stateless provider architecture
- **Encrypted Transport**: TLS 1.3 for all communications
- **Domain Isolation**: White-label domains with dedicated security policies

### Data Handling

**What We Store:**
- Client configuration and API keys
- Request audit logs (no PII)
- Operational metrics
- Webhook URLs and configurations
- Brand assets and customization settings

**What We DON'T Store:**
- User credentials or personal data
- Session information
- Authentication state
- Issued credential content

### Compliance

- **GDPR Compliant**: No personal data retention
- **SOC 2 Type II**: Annual compliance audits
- **ISO 27001**: Information security management
- **Azure Security**: Leverages Microsoft's enterprise security
- **Custom Compliance**: White-label options support additional compliance requirements

---

## Support & SLA

### Service Level Agreement

| Metric | Standard | White-Label Enterprise |
| - | - | - |
| **Uptime** | 99.9% | 99.95% |
| **Response Time** | < 200ms (95th percentile) | < 100ms (95th percentile) |
| **Support Response** | < 4 hours (business hours) | < 2 hours (24/7) |
| **Resolution Time** | < 24 hours (P1 issues) | < 12 hours (P1 issues) |

### Support Tiers

**Professional Support (Included):**
- Email support (business hours)
- Integration documentation
- Basic troubleshooting
- CheckID frontend support

**Enterprise Support (White-Label):**
- 24/7 support availability
- Dedicated technical account manager
- Custom integration consulting
- Priority feature requests
- Brand customization support
- Custom compliance assistance

### Pricing Model

**Standard Service:**
- API Call Volume: Tiered pricing based on monthly calls
- CheckID Frontend: Included at no additional cost
- Setup Fee: One-time configuration and onboarding

**White-Label Options:**
- Custom Branding: One-time setup fee + monthly branding license
- Dedicated Instance: Monthly infrastructure cost
- Premium Support: Annual support contract
- Custom Development: Professional services hourly rate

**Contact**: [verified-id@fortytwo.io](mailto:verified-id@fortytwo.io)