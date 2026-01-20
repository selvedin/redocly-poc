### 5) Schema renderer
#### (the right-panel magic)

For 3.0.1 schema objects, you need:

- SchemaViewer 
  - entry point for schema rendering 
- SchemaTree / SchemaNode 
  - object properties (required highlight)
  - arrays (items)
  - oneOf/anyOf/allOf 
  - enum, default, nullable, format, constraints 
- SchemaRefLink 
  - jump to referenced schema section 
  - optional hover preview 
- ExampleRenderer 
  - chooses examples in this priority:
    1. example 
    2. examples 
    3. synthesize from schema (best-effort)