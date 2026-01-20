### 3) Authorization
#### (SecuritySchemes) UI + state

- AuthProvider (context/store)
  - stores credentials per scheme 
  - persists to localStorage/session (optional)

- AuthSection 
  - shows all schemes (like Redoc)

- AuthSchemeForm variants:
  - ApiKeyForm (header/query/cookie)
  - HttpBearerForm 
  - HttpBasicForm 
  - OAuth2Form (you can start with “paste token” before full flows)

- OperationSecurityBadges 
  - per op: shows required scheme(s) + scopes

- AuthApplier (pure function)
  - takes RequestModel and applies auth into headers/query/cookies

#### Important: in 3.0.1, the “what security applies” logic is:

- operation security overrides/extends global security (including empty array meaning “no auth”)