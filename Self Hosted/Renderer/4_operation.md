### 4) Operation renderer
#### (the main content)

A Redoc-like operation block/page generally needs:

- OperationCard / OperationSection 
  - OperationHeader (method badge, path, summary, deprecated)
  - OperationDescription (Markdown)
  - ParametersTable (path/query/header/cookie)
  - RequestBodyPanel 
    - media type tabs 
    - schema view + example view 
  - ResponsesPanel 
    - status accordions 
    - media type tabs 
    - schema + examples 
  - CallbacksPanel (optional)
  - LinksPanel (optional)
  - CodeSamplesPanel ✅ 
  - TryItPanel ✅