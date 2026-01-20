### 7) Multi-language 
#### request samples

- CodeSamplesPanel 
  - language tabs + copy
- SnippetService 
  - renders from the same RequestModel used by Try-it
- Snippet renderers (start with these)
  - curl 
  - JavaScript fetch 
  - Node axios 
  - Python requests 
  - C# HttpClient 
  - Java OkHttp 
  - Go net/http

**Key rule** : do not generate snippets directly from the OpenAPI op.

Generate from RequestModel (so it reflects user-entered params + auth + server)