---
layout: home

hero:
  name: "@veridtools/dmn-parser"
  text: DMN XML parser
  tagline: Converts any DMN 1.1→1.5 file into a typed, normalized TypeScript model. One function call, zero platform dependencies.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: CLI reference
      link: /guide/cli
    - theme: alt
      text: Playground
      link: /playground

features:
  - title: Fully typed model
    details: Every element — Decision, DecisionTable, Rule, InputClause, ItemDefinition — is a TypeScript interface. IDE autocomplete and type safety from the first import.
  - title: Normalized output
    details: hitPolicy defaults to UNIQUE, isCollection to false, empty inputEntry to "-", CDATA and XML entities produce identical output. No surprises.
  - title: DMN 1.1 → 1.5
    details: All five namespace variants recognized automatically. DMN 1.4+ Conditional/Filter/Iterator and DMN 1.5 typeConstraint supported out of the box.
  - title: O(1) index
    details: Every element with an @id is registered in model.index — resolve any href in constant time without traversing the tree.
  - title: safeParse — never throws
    details: Use parse() for direct access or safeParse() for a discriminated union result — catch malformed files gracefully without try/catch.
  - title: Single runtime dependency
    details: Only fast-xml-parser at runtime. No platform SDKs, no network calls, works in Node, Bun, and browser (via bundler).
---
