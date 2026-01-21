# Static Documentation 
### (Markdoc) Epics & Estimates

## Overview
This backlog covers implementation of **static documentation pages** (business flows, guides, onboarding) using **Markdown + Markdoc**, stored in Git, **versioned alongside OpenAPI specs**, and protected by **SSO and role-based access control (RBAC)**.

**Team**
- 3 developers
- 1 experienced in React/Node
- 2 developers new to React/Node

**Tooling**
- React + TypeScript
- Node.js (backend / content delivery)
- Markdoc
- GitHub Copilot (Agentic)

**Delivery target**
- Integrated with existing OpenAPI documentation portal
- MVP scope (no CMS, Git-based workflow)

---

## EPIC 1 – Versioned Content System (Git-backed)
**Goal:** Load and organize static documentation from Git, versioned alongside OpenAPI specs.

### Stories
- Define content folder conventions per version
- Frontmatter schema (title, roles, sidebar metadata)
- ContentRegistry to index markdown files per version
- Slug generation and redirect handling

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 8             |
| With AI Tool | **5**         |

**Notes:**  
Mostly file system + metadata work; Copilot helps significantly with parsing and typing.

---

## EPIC 2 – Markdoc Pipeline & Rendering
**Goal:** Compile and render Markdoc-based content safely and efficiently.

### Stories
- Markdoc configuration & schema
- Build-time Markdoc compiler
- React renderer for compiled Markdoc AST
- Asset resolution (images, attachments)
- Markdown sanitization rules

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 10            |
| With AI Tool | **6**         |

**Notes:**  
Markdoc concepts require learning; Copilot helps but does not remove design decisions.

---

## EPIC 3 – Custom Markdoc Components (Business Flows)
**Goal:** Provide structured components to explain business flows clearly.

### Stories
- Callout blocks (info/warn/error/success)
- Tabs (language or variant-based)
- Steps / Flow component
- Accordion (FAQ)
- Mermaid diagram support
- OperationLink (deep link to OpenAPI operations)

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 9             |
| With AI Tool | **5**         |

**Notes:**  
Reusable UI components benefit heavily from Copilot-generated scaffolding.

---

## EPIC 4 – Unified Navigation & Routing
**Goal:** Merge static docs and OpenAPI reference into one navigable portal.

### Stories
- Version-aware routing (`/docs/:version/...`)
- Unified sidebar navigation
- Breadcrumbs
- ScrollSpy for static pages
- Redirect handling for renamed pages

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 8             |
| With AI Tool | **5**         |

**Notes:**  
Complexity comes from version + role interactions, not UI rendering.

---

## EPIC 5 – Version Selector Integration
**Goal:** Switching versions updates static docs, OpenAPI, nav, and search.

### Stories
- VersionRegistry shared with OpenAPI
- VersionSelector UI integration
- Content + OpenAPI reload on version change
- Fallback UX if page missing in version

| Estimate Type | Effort (Days) |
|--------------|-------------|
| Original     | 6           |
| With AI Tool | **4**       |

---

## EPIC 6 – Search (Static Docs + OpenAPI)
**Goal:** Unified search across guides, flows, and API reference.

### Stories
- Build-time search index per version
- Index static docs (title, headings, body)
- Merge with OpenAPI search index
- Version-aware search loading
- Grouped search results UI

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 9             |
| With AI Tool | **6**       |

**Notes:**  
Search correctness matters more than speed of implementation.

---

## EPIC 7 – SSO Integration
**Goal:** Authenticate users via corporate SSO.

### Stories
- SSO integration (OIDC/SAML)
- User session handling
- Claims extraction
- Logout & token refresh handling

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 8             |
| With AI Tool | **5**         |

**Notes:**  
Security-sensitive; AI assists minimally beyond scaffolding.

---

## EPIC 8 – Secure Content Delivery
**Goal:** Ensure restricted content is not exposed to unauthorized users.

### Stories
- Server-side content delivery
- Authorization checks per request
- Version-aware content endpoints
- Error handling (403 / 404)

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 7             |
| With AI Tool | **5**         |

**Notes:**  
Critical for internal/private documentation compliance.

---

## EPIC 9 – CI/CD & Content Governance
**Goal:** Prevent broken docs and ensure content quality.

### Stories
- Markdoc build validation
- Frontmatter linting
- Broken link checker
- OpenAPI ↔ static doc cross-link validation
- PR preview build

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 8             |
| With AI Tool | **5**         |

---

## Overall Effort Summary

| Category | Effort       |
|--------|--------------|
| Original total | ~74 days     |
| With AI tooling | **~46 days** |
| Team size | 3 developers |
| Calendar time | **~7 weeks**      
