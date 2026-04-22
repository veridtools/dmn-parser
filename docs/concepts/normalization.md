# Normalization

The parser applies several normalizations before mapping to the typed model. This ensures consistent output regardless of how the DMN file was produced.

## CDATA and entities

`<![CDATA[> 700]]>` and `&gt; 700` produce identical `text` values. Both are normalized to the entity form before parsing.

## Defaults

| Attribute | Default | Applied to |
|---|---|---|
| `@hitPolicy` | `UNIQUE` | `decisionTable` |
| `@preferredOrientation` | `Rule-as-Row` | `decisionTable` |
| `@isCollection` | `false` | `itemDefinition`, `itemComponent` |
| `@textFormat` | `text/plain` | `textAnnotation` |
| `@associationDirection` | `None` | `association` |
| `@kind` | `FEEL` | `functionDefinition`, `encapsulatedLogic` |

## Wildcard inputEntry

An empty `<inputEntry>` and one containing `<text>-</text>` are both normalized to `text: '-'`.

## Field promotion

Some tools write child text elements instead of attributes:

```xml
<!-- Both forms produce the same model -->
<variable name="score" typeRef="number"/>
<variable name="score"><typeRef>number</typeRef></variable>
```

The parser promotes `typeRef`, `description`, and `locationURI` child elements to their attribute form.

## UTF-8 BOM

A UTF-8 BOM (`﻿`) at the start of the file is silently stripped before parsing.

## DMNDI

DMNDI diagram elements are excluded by default. Pass `{ includeDMNDI: true }` to include them in `model.dmndi`.
