#   MVP Epics & Estimates

## Overview
This document outlines the proposed epics, user stories, and effort estimates for building an internal OpenAPI 3.0.1 documentation platform (Redocly-like).

**Team**
- 3 developers total
- 1 developer experienced with React & Node.js
- 2 developers new to React & Node.js

**Tooling**
- React + TypeScript
- Node.js (proxy for Try-It)
- GitHub Copilot (Agentic)

**Scope**
- MVP only (core documentation, auth, Try-It, code samples, versioning)
- Not full Redocly feature parity

---

## EPIC 1 – OpenAPI Spec Engine
**Goal:** Load, resolve, and normalize OpenAPI 3.0.1 specs into a render-ready `DocModel`.

### Stories
- SpecLoader (JSON/YAML loading from URL or file)
- Internal `$ref` resolver with cycle detection
- Spec normalization (paths → operations, parameter merging, media types)
- Stable anchor & ID generation for deep linking

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 9             |
| With AI Tool | **5**         |

**Notes:**  
Copilot accelerates boilerplate and typing, but OpenAPI semantics and edge cases still require manual reasoning.

---

## EPIC 2 – Documentation UI Shell & Navigation
**Goal:** Redoc-like layout with sidebar navigation, scroll sync, and search.

### Stories
- Documentation layout (sidebar + content)
- Sidebar navigation (tags & operations)
- ScrollSpy and deep-link routing
- Client-side search (operations & schemas)

| Estimate Type | Effort (Days) |
|--------------|-------------|
| Original     | 8           |
| With AI Tool | **4**       |

**Notes:**  
High productivity gains due to Copilot generating React components and layout scaffolding.

---

## EPIC 3 – Authorization (SecuritySchemes)
**Goal:** Support API Key, Bearer Token, and Basic Auth for documentation, Try-It, and code samples.

### Stories
- AuthProvider (state management & persistence)
- AuthSection UI (scheme-specific forms)
- AuthApplier (inject credentials into requests)

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 6             |
| With AI Tool | **3**         |

**Notes:**  
AI speeds up UI and form generation, but security logic must be reviewed carefully.

---

## EPIC 4 – RequestModel Builder
**Goal:** Create a canonical request model used by both Try-It and code samples.

### Stories
- RequestModel definition
- RequestModelBuilder from OpenAPI operation + user state
- Basic validation (required params, body presence)

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 4             |
| With AI Tool | **2**         |

**Notes:**  
Well-defined data model; Copilot performs strongly here.

---

## EPIC 5 – Try-It (Interactive API Calls)
**Goal:** Allow users to execute API calls directly from the documentation.

### Stories
- Try-It panel UI
- Request builder (params & body editor)
- Fetch-based Try-It client
- Node.js proxy to avoid CORS
- Response viewer (status, headers, body)

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 10            |
| With AI Tool | **5**         |

**Notes:**  
Proxy setup and correctness checks dominate this epic; AI mainly helps with scaffolding.

---

## EPIC 6 – Code Samples (Multi-Language)
**Goal:** Generate request samples from the RequestModel.

### Stories
- Code samples panel (tabs + copy)
- cURL snippet
- JavaScript (fetch / axios)
- Python (requests)
- Extensible snippet architecture

| Estimate Type | Effort (Days) |
|--------------|--------------|
| Original     | 4            |
| With AI Tool | **2**        |

**Notes:**  
Copilot significantly accelerates snippet template generation.

---

## EPIC 7 – Spec Versioning
**Goal:** Support multiple OpenAPI versions with routing and caching.

### Stories
- Spec registry (version metadata)
- Version selector UI
- Routing and spec caching per version

| Estimate Type | Effort (Days) |
|--------------|---------------|
| Original     | 5             |
| With AI Tool | **3**         |

**Notes:**  
Mostly configuration and routing; limited complexity.

---

## EPIC 8 – Stabilization & Hardening
**Goal:** Make the platform reliable across real-world OpenAPI specs.

### Stories
- Test against complex specs (Stripe, synthetic test spec)
- Bug fixes & UX polish
- Performance optimizations for large specs

| Estimate Type | Effort (Days) |
|--------------|-------------|
| Original     | 10          |
| With AI Tool | **5**       |

**Notes:**  
This work is largely non-automatable; AI offers minimal reduction.

---

## Overall Summary

| Metric                | Value          |
|-----------------------|----------------|
| Original total effort | ~56 days       |
| With AI Help          | **~29 days**   |
| Team size             | 3 developers   |
| Calendar duration     | **~5-6 weeks** |

---

#### Why not less than 5 weeks?

- 2 devs are new to React/Node
- Integration + correctness work cannot be parallelized fully
- Bugs appear after everything looks done

### Build vs Redocly – manager-friendly comparison

{% table %}
* Solution
* Pros
* Cons
---
* Build (this proposal)
* Full control (branding, auth, proxy, internal APIs)
* ~2–2.5 months initial investment
---
* Build (this proposal)
* No per-API or per-seat licensing
* Ongoing maintenance (≈10–20% dev time)
---
* Build (this proposal)
* Can evolve into internal platform
* Advanced features (OAuth flows, diffing) are extra
---
* Redocly subscription
* Instant maturity
* Recurring cost
---
* Redocly subscription
* OAuth flows, diffing, search, hosting solved
* Limited customization
---
* Redocly subscription
* Support & updates
* Vendor lock-in
---
* Redocly subscription
* 
* Proxy & auth flows may not fit internal needs
{% /table %}


## Conclusion

Early prototyping with GitHub Copilot shows very strong productivity.

Based on current progress, we expect Copilot to reduce delivery time by ~35–40%.

The proposed MVP is realistically achievable within **5–6 weeks** while maintaining correctness, maintainability, and extensibility.

This provides a strong internal alternative to a Redocly subscription, with the trade-off of ongoing maintenance and delayed access to advanced features such as OAuth flows and spec diffing.

