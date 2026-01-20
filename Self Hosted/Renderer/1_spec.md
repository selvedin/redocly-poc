### 1) Spec engine components
#### (3.0.1)
These are not UI, but they drive everything:

- SpecLoader
    - load from URL/file/string, JSON/YAML, errors

- RefResolver
    - resolve internal $ref (and external if you choose)
    - cycle detection + “max depth”

- SpecNormalizer → produces a DocModel
    - tags -> operations
    - merge params (path-level + operation-level)
    - normalize requestBody/mediaTypes/examples
    - normalize responses/status/mediaTypes/examples
    - collect schemas from components.schemas

- AnchorBuilder
    - stable ids for tags/ops/schemas (for deep links)

#### Output models you’ll need

- DocModel (title, description, tags, operations, schemas, securitySchemes, servers)
- OperationModel (method, path, summary, description, params, requestBodies, responses, security, tags)
- SchemaModel (name + schema object + description + refs)
- RequestModel (canonical request structure; used by Try-it + Snippets)