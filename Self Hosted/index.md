# Self Hosted Solution

- [Open API Renderer](Renderer/10_estimation.md)
- [Static Documentation](Static%20docs/index.md)

---
## Overview

This document compares two approaches for providing API documentation and developer onboarding:

- **Self-built Dev Portal**  
  An internal solution combining OpenAPI reference documentation with versioned static content (business flows, guides) using Markdown/Markdoc, secured via SSO and role-based access.

- **Redocly Subscription**  
  A commercial, managed documentation platform focused on OpenAPI reference rendering with enterprise-grade features.

The goal is to support an informed **build vs buy** decision.

---

## High-level comparison

{% callout type="info" %}
This comparison focuses on **OpenAPI 3.0.1**, **versioned documentation**, **static business content**, and **SSO/RBAC** support.
{% /callout %}

| Dimension | Self-build (In-House)  | Redocly Subscription |
|--------|------------------------|----------------------|
| Time to first MVP | ~10–12 weeks           | Same day |
| Upfront cost | Development effort     | Subscription |
| Long-term cost | Lower after break-even | Recurring |
| Customization | Full control           | Limited |
| Ownership | Full                   | Vendor |
| Maintenance | Internal               | Vendor-managed |

---

## Self-build option

### Pros

{% callout type="success" %}
**Strengths of the self-built approach**
{% /callout %}

- **Full customization**
    - Unified experience for OpenAPI reference and business flows
    - Custom Markdoc components (steps, callouts, diagrams, tabs)
    - Portal UX aligned with internal standards and branding

- **Tight integration**
    - Versioned static docs and OpenAPI specs move together
    - Deep links between business flows and API operations
    - Custom Try-It proxy behavior and request samples

- **Security and access control**
    - Native integration with corporate SSO (OIDC / SAML)
    - Role-based access at page, navigation, and search levels
    - Server-side content delivery for restricted documentation

- **Ownership and extensibility**
    - No vendor lock-in
    - Ability to evolve features incrementally
    - Source code owned and controlled internally

- **Cost efficiency over time**
    - One-time build investment
    - No per-seat or per-API recurring license fees

---

### Cons

{% callout type="warning" %}
**Trade-offs and risks of the self-built approach**
{% /callout %}

- **Upfront delivery effort**
    - ~10–12 weeks with a 3-developer team (2 ramping on React/Node)
    - Requires architectural decisions and ongoing ownership

- **Maintenance responsibility**
    - Dependency updates, security patches, and upgrades
    - Performance tuning for large OpenAPI specs

- **Advanced features require additional work**
    - OAuth2 interactive flows (beyond “paste token”)
    - Analytics, usage metrics, and spec diffing
    - Sophisticated full-text search ranking

- **Operational overhead**
    - UI/UX design
    - CI/CD pipelines for docs
    - Linting, link checking, preview environments

---

## Redocly subscription

### Pros

{% callout type="success" %}
**Strengths of Redocly**
{% /callout %}

- **Immediate availability**
    - Production-grade OpenAPI rendering out of the box
    - No initial development delay

- **Enterprise-ready features**
    - OAuth2 / OpenID Connect support
    - Hosted Try-It functionality
    - Built-in search and analytics

- **Reduced maintenance**
    - Updates, fixes, and enhancements handled by vendor
    - Professional support and SLAs

- **Polished UX**
    - Mature schema rendering
    - High-quality navigation and search experience

---

### Cons

{% callout type="warning" %}
**Limitations of Redocly**
{% /callout %}

- **Recurring subscription cost**
    - Enterprise features required for SSO/RBAC
    - Cost increases with scale and usage

- **Limited customization**
    - Constrained UI/UX customization
    - Business flows and narrative documentation are not first-class citizens

- **Vendor dependency**
    - Roadmap controlled externally
    - Feature gaps require workarounds or waiting for vendor support

- **Integration complexity**
    - Static business documentation often requires a separate solution
    - Tight coupling between guides and API flows is harder to achieve

---

## When self-build is the better choice

{% callout type="info" %}
Self-build is recommended when most of the following apply:
{% /callout %}

- Strong need for **business flow documentation** alongside APIs
- Requirement for **fine-grained RBAC** and internal-only content
- Desire to **avoid long-term licensing costs**
- Internal capability to maintain and evolve the platform
- APIs and docs are a strategic internal product

---

## When Redocly is the better choice

{% callout type="info" %}
Redocly is recommended when:
{% /callout %}

- Time-to-market is the top priority
- Documentation scope is primarily OpenAPI reference
- Maintenance capacity is limited
- Subscription cost is acceptable
- Advanced features (OAuth flows, analytics) are immediately required

---

## Summary

{% callout type="success" %}
**Decision framing**
{% /callout %}

- **Self-build** offers maximum flexibility, ownership, and long-term cost efficiency at the expense of upfront effort and ongoing maintenance.
- **Redocly** provides immediate value and reduced operational burden but introduces recurring costs and customization limits.

Both options are viable; the optimal choice depends on whether documentation is treated as a **strategic internal platform** or a **commodity tooling concern**.
