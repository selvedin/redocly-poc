---
title: AWS Cost Estimate – Self-Hosted Documentation
---

# AWS Cost Estimate – Self-Hosted Documentation (PSP-style)

This page provides a **rough-order-of-magnitude monthly cost estimate** for hosting a **public, read-heavy documentation portal** (similar to well-known Payment Service Provider documentation) on **AWS**, using a **containerized architecture**.

{% admonition type="info" name="Scope & assumptions" %}
- Region: e**EU**  
- Traffic profile: **read-heavy, highly cacheable**  
- Availability: **24/7**, highly available  
- Content: Markdown + OpenAPI-based documentation
{% /admonition %}

---

## Reference Architecture

Users
↓
Route 53
↓
CloudFront (CDN, HTTPS, caching)
↓
Application Load Balancer (ALB)
↓
ECS Fargate (2 tasks, HA)


---

## Monthly Cost Breakdown

{% cards %}
{% card title="ECS Fargate (Compute)" %}
**Assumptions**
- 2 tasks (High Availability)
- 0.5 vCPU / 1 GB RAM per task
- Always on (≈ 730h/month)

**Estimated cost:**  
**€30 – €60 / month**

_CPU usage for documentation portals is typically very low; most of the cost comes from keeping tasks running._
{% /card %}

{% card title="Application Load Balancer" %}
**Assumptions**
- Low concurrency
- ~1 LCU most of the time

**Estimated cost**
- ALB hours: €18 – €25  
- LCU usage: €5 – €10  

**Total:** **€25 – €35 / month**
{% /card %}
{% /cards %}

---

## CloudFront (Major Cost Lever)

{% admonition type="success" name="Strongly recommended" %}
CloudFront significantly reduces load on ECS and ALB and keeps costs predictable.
{% /admonition %}

**Typical docs portal traffic**
- 20–100 GB data out / month
- 1–2 million requests / month

{% tabs %}
{% tab label="Pay-as-you-go" %}
- Data transfer: **€2 – €8**
- Requests: **€1 – €3**

**Total:** **€3 – €11 / month**
{% /tab %}

{% tab label="CloudFront plan" %}
- Free or **Pro (€15/month)**

**Total:** **€0 – €15 / month**
{% /tab %}
{% /tabs %}

---

## Supporting Services

{% cards %}
{% card title="Route 53 (DNS)" %}
- Hosted zone: €0.50 / month  
- DNS queries: mostly free via Alias records

**Total:** **~€1 / month**
{% /card %}

{% card title="Amazon ECR" %}
**Assumptions**
- 1–2 container images
- < 1 GB total storage
- Infrequent pulls

**Total:** **< €1 / month**
{% /card %}

{% card title="Logs & Monitoring (CloudWatch)" %}
**Assumptions**
- Application logs
- Access / load balancer logs
- Short retention

**Total:** **€2 – €10 / month**
{% /card %}
{% /cards %}

---

## Networking Considerations

{% admonition type="warning" name="NAT Gateway cost trap" %}
If ECS tasks run in **private subnets**, a NAT Gateway alone can cost **€30 – €70 / month**.
{% /admonition %}

### Recommended approach
- Run ECS tasks in **public subnets**
- Place them **behind an ALB**
- No outbound internet access required after startup

### Public IPv4 charges
- ALB + ECS ENIs
- **€2 – €6 / month**

---

## Total Monthly Cost Summary

{% tabs %}
{% tab label="Recommended setup" %}
**CloudFront enabled, no NAT Gateway**

👉 **€65 – €120 / month**
{% /tab %}

{% tab label="With NAT Gateway" %}
**Private subnets + NAT Gateway**

👉 **€100 – €180 / month**
{% /tab %}
{% /tabs %}

---

## High-Traffic Scenarios

{% admonition type="info" name="Scalability" %}
Even with **millions of users per month**, total cost usually stays **below €300/month**, unless you introduce:
- Very high bandwidth usage
- Heavy AWS WAF rules
- Long log retention or high log volume
{% /admonition %}

---

## Summary

{% table %}

- Design choice {% width="40%" %}
- Cost impact {% width="60%" %}

---

- CloudFront enabled
- Major cost reduction

---

- NAT Gateway
- Significant cost increase

---

- ECS always-on
- Predictable baseline

---

- Docs-style traffic
- Very cost-efficient

{% /table %}


This architecture provides a **scalable, predictable, and cost-effective** way to host public documentation comparable to major PSP documentation portals.

