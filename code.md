### Code example

{% code-snippet
  file="./examples/code-example.yaml"
  language="yaml"
  from=1
  to=10
  title="code-example.yaml"
/%}

{% tabs %}
  {% tab label="Cards tab"%}
    Content in the first tab
    {% cards %}
    {% card title="First card" icon="images/pie-chart.svg" %}
        I'm a **card**.
    {% /card %}
    {% card title="Second card" icon="images/business.svg" %}
    I'm a card, _too_.
    {% /card %}
    {% card title="Third card" icon="images/calendar.svg" %}
        I'm actually a brochure.
    {% /card %}
    {% /cards %}
  {% /tab %}
  {% tab label="Json Schema"%}
    Artifact
    {% json-schema
      schema={
        "title": "Artifact",
        "type": "object",
        "properties": {
          "artifactId": {
            "type": "string",
            "description": "Unique artifact identifier."
          },
          "name": {
            "type": "string",
            "description": "Name of the artifact."
          },
          "yearCreated": {
            "type": "integer",
            "description": "Approximate year the artifact comes from.",
          }
        }
      }
    /%}
  {% /tab %}
  {% tab label="Replay Openapi"%}
    {% replay-openapi
      descriptionFile="./openapi/payments.yaml"
      operationId="createPayment"
    /%}
  {% /tab %}
{% /tabs %}