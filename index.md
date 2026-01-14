---
title: Markdoc + Redocly (minimal demo)
---

# Markdoc + Redocly

This is a minimal Redocly project that renders **Markdoc tag syntax**.

Navigate:
- [About](./about.md)

{% admonition type="info" name="Markdoc works" %}
This block uses a Redocly Markdoc tag (`admonition`).
{% /admonition %}

## Another example

{% admonition type="warning" name="Heads up" %}
If you use root links like `/about`, you may end up hitting your backend router instead of the Realm preview.
Use relative links like `./about.md`.
{% /admonition %}
