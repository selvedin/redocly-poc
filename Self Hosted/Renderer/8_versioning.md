### 8) OpenAPI doc versioning

- SpecRegistry 
  - list of versions: {id, label, specUrl, deprecated?, defaultServer?}
- VersionSelector (top bar)
- VersionedDocsRouter 
  - /docs/:api/:version/... 
- SpecCache 
  - caches ResolvedSpec + DocModel per version
- Optional: ChangelogPanel / “Compare” view