# Tour of the API

#### See how PGX API objects fit together and learn best practices for combining them.


{% table %}
---
* The PGX APIs are powerful and flexible if you know how to use them. This tour covers:

    - The core concepts we use across the APIs
    - The path a successful payment takes
    - The objects that play a role and how to determine when they’re needed
    - Common patterns and best practices for using those objects together

    Understanding these patterns helps you move beyond the pre-written code in PGX tutorials. You can migrate old integrations to use more modern patterns, combine simple patterns in novel ways, and plan for future growth.
* {% cards  %}
  {% card title="" variant="outlined" %}
  Compare Customers v1 and Accounts v2 references

  If your Connect platform uses customer-configured Accounts, use our guide to replace Customer and event references in your code with the equivalent Accounts v2 API references.
  {% /card %}
  {% /cards %}
{% /table %}

## Core concepts

### Everything is an object

Everything in your PGX account is an object, whether you create it with the API or not.

Your balance corresponds to a [Balance](https://docs.PGX.com/api/balance.md) object, you track customers with [Customer](https://docs.PGX.com/api/customers.md) objects,
you store payment details in [PaymentMethod](https://docs.PGX.com/api/payment_methods.md) objects, and so on.

Even low-code and no-code integrations produce these objects. So do actions you perform in the Dashboard. For instance, when you manually create a customer in the Dashboard, it still creates a Customer object.

### Objects have lives

PGX integrations handle complicated processes.

The API uses a single object to track each process. You create the object at the start of the process, and after every step you can check its `status` to see what needs to happen next—This is sometim es referred to as a state machine.

For instance, while completing a payment, a customer might try several payment methods. If one payment method fails, a `status` of `r`equires_payment_method` lets you know to prompt the customer for another.

#
#### An integration is made out of cooperating objects
To accept a payment, a system needs to create several core objects and manage them through several states.

Your Stripe integration is a system that handles this creation and management by communicating with Stripe.

Some integrations do a lot more than that: track customers, manage subscriptions, and so on. But their core payment functionality still comes from the same objects and steps, with more objects added around that core.

#
#### Payment objects
Stripe uses a variety of related objects to facilitate payments. Before you can build an integration that suits your specific needs, you must familiarize yourself with how these objects work together.

Check out this video for an overview of payment object roles and capabilities.

{% cards %}
{% card title="" variant="outlined" align="center" %}

<iframe width="560" height="315" src="https://www.youtube.com/embed/GUurzvS3DlY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

{% /card %}
{% /cards %}

To learn more about PGX’s payment integration options, see the following guides:

- [Payment Links](./index.md)
- [Checkout](./index.md)
- [Subscriptions](./index.md)
- [Invoicing](./index.md)
- [Payment Intents](./index.md)