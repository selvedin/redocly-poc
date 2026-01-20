### 6) Try-it (interactive runtime)
#### required components

- TryItProvider 
  - state: selected server, param values, body draft, last response 
- RequestBuilder 
  - ServerSelector 
  - ParamEditor (grouped)
  - BodyEditor (per media type)
- RequestPreview 
  - final URL + headers + body + curl preview
- SendRequestButton
- ResponseViewer 
  - status, time, headers, body (json/text)
- TryItClient 
  - fetch mode + optional proxy mode (recommended for CORS)