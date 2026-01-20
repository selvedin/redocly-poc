## Core architecture

- Spec Engine: OpenAPI(3.0.1) -> ResolvedSpec -> DocModel
- Runtime (interactive): AuthState + ServerState + RequestModel -> TryIt + Snippets
- UI Renderer: DocModel -> React components (scroll + deep links)

