<script setup lang="ts">
import { parse } from '@veridtools/dmn-parser';
import { computed, ref } from 'vue';

const EXAMPLES: Record<string, { label: string; xml: string }> = {
  'decision-table': {
    label: 'Decision Table',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="loan" name="Loan Approval" namespace="https://example.com/loan">

  <inputData id="creditScore" name="Credit Score"/>

  <decision id="approval" name="Loan Approval">
    <informationRequirement>
      <requiredInput href="#creditScore"/>
    </informationRequirement>
    <decisionTable id="dt1" hitPolicy="UNIQUE">
      <input id="in1" label="Credit Score">
        <inputExpression id="ie1" typeRef="integer">
          <text>creditScore</text>
        </inputExpression>
      </input>
      <output id="out1" name="approved" typeRef="string" label="Decision"/>
      <rule id="r1">
        <inputEntry id="r1ie1"><text>&gt;= 700</text></inputEntry>
        <outputEntry id="r1oe1"><text>"approved"</text></outputEntry>
      </rule>
      <rule id="r2">
        <inputEntry id="r2ie1"><text>[500..700)</text></inputEntry>
        <outputEntry id="r2oe1"><text>"manual"</text></outputEntry>
      </rule>
      <rule id="r3">
        <inputEntry id="r3ie1"><text>&lt; 500</text></inputEntry>
        <outputEntry id="r3oe1"><text>"rejected"</text></outputEntry>
      </rule>
    </decisionTable>
  </decision>

</definitions>`,
  },

  'literal-expression': {
    label: 'Literal Expression',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="dti" name="Debt to Income" namespace="https://example.com/dti">

  <inputData id="income" name="Monthly Income"/>
  <inputData id="payment" name="Monthly Payment"/>

  <decision id="ratio" name="DTI Ratio">
    <informationRequirement><requiredInput href="#income"/></informationRequirement>
    <informationRequirement><requiredInput href="#payment"/></informationRequirement>
    <literalExpression id="le1" typeRef="number">
      <text>Monthly Payment / Monthly Income</text>
    </literalExpression>
  </decision>

</definitions>`,
  },

  context: {
    label: 'Context',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="risk" name="Risk Profile" namespace="https://example.com/risk">

  <inputData id="age"    name="Age"/>
  <inputData id="income" name="Annual Income"/>

  <decision id="profile" name="Risk Profile">
    <informationRequirement><requiredInput href="#age"/></informationRequirement>
    <informationRequirement><requiredInput href="#income"/></informationRequirement>
    <context id="ctx1">
      <contextEntry id="ce1">
        <variable name="score" typeRef="number"/>
        <literalExpression id="le1"><text>if Age &lt; 25 then 30 else 60</text></literalExpression>
      </contextEntry>
      <contextEntry id="ce2">
        <variable name="category" typeRef="string"/>
        <literalExpression id="le2"><text>if Annual Income &gt; 50000 then "low" else "medium"</text></literalExpression>
      </contextEntry>
    </context>
  </decision>

</definitions>`,
  },

  invocation: {
    label: 'BKM + Invocation',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="bkm-example" name="BKM Example" namespace="https://example.com/bkm">

  <inputData id="income"  name="Monthly Income"/>
  <inputData id="payment" name="Loan Payment"/>

  <businessKnowledgeModel id="bkm1" name="Calculate DTI">
    <variable name="Calculate DTI" typeRef="number"/>
    <encapsulatedLogic id="fd1" kind="FEEL">
      <formalParameter id="fp1" name="monthly income" typeRef="number"/>
      <formalParameter id="fp2" name="loan payment"   typeRef="number"/>
      <literalExpression id="le1">
        <text>loan payment / monthly income</text>
      </literalExpression>
    </encapsulatedLogic>
  </businessKnowledgeModel>

  <decision id="dti" name="DTI Ratio">
    <informationRequirement><requiredInput href="#income"/></informationRequirement>
    <informationRequirement><requiredInput href="#payment"/></informationRequirement>
    <knowledgeRequirement><requiredKnowledge href="#bkm1"/></knowledgeRequirement>
    <invocation id="inv1">
      <literalExpression id="le2"><text>Calculate DTI</text></literalExpression>
      <binding id="b1">
        <parameter name="monthly income" typeRef="number"/>
        <literalExpression id="le3"><text>Monthly Income</text></literalExpression>
      </binding>
      <binding id="b2">
        <parameter name="loan payment" typeRef="number"/>
        <literalExpression id="le4"><text>Loan Payment</text></literalExpression>
      </binding>
    </invocation>
  </decision>

</definitions>`,
  },

  conditional: {
    label: 'Conditional',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="cond-example" name="Conditional Example" namespace="https://example.com/cond">

  <inputData id="score" name="Credit Score"/>

  <decision id="cat" name="Risk Category">
    <informationRequirement><requiredInput href="#score"/></informationRequirement>
    <conditional id="cond1">
      <if>
        <literalExpression id="le1"><text>Credit Score &gt;= 700</text></literalExpression>
      </if>
      <then>
        <literalExpression id="le2"><text>"low"</text></literalExpression>
      </then>
      <else>
        <literalExpression id="le3"><text>if Credit Score &gt;= 500 then "medium" else "high"</text></literalExpression>
      </else>
    </conditional>
  </decision>

</definitions>`,
  },
};

const activeExample = ref<string>('decision-table');
const xml = ref(EXAMPLES['decision-table']!.xml);
// biome-ignore lint/correctness/noUnusedVariables: used in template
const activeTab = ref<'summary' | 'json' | 'index'>('summary');
const error = ref<string | null>(null);

// biome-ignore lint/correctness/noUnusedVariables: used in template
function loadExample(key: string) {
  const ex = EXAMPLES[key];
  if (!ex) return;
  activeExample.value = key;
  xml.value = ex.xml;
}

const result = computed(() => {
  try {
    error.value = null;
    return parse(xml.value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
    return null;
  }
});

// biome-ignore lint/correctness/noUnusedVariables: used in template
const summaryOutput = computed(() => {
  if (!result.value) return '';
  const m = result.value;
  const lines = [
    `DMN version:    ${m.dmnVersion}`,
    `id:             ${m.id}`,
    `name:           ${m.name}`,
    `namespace:      ${m.namespace}`,
    '',
    `decisions:               ${m.decisions.length}`,
    `inputData:               ${m.inputData.length}`,
    `businessKnowledgeModels: ${m.businessKnowledgeModels.length}`,
    `knowledgeSources:        ${m.knowledgeSources.length}`,
    `decisionServices:        ${m.decisionServices.length}`,
    `itemDefinitions:         ${m.itemDefinitions.length}`,
    `indexed elements:        ${m.index.size}`,
  ];
  if (m.decisions.length > 0) {
    lines.push('', 'Decisions:');
    for (const d of m.decisions) {
      lines.push(`  ${d.id}  "${d.name}"  → ${d.expression?.type ?? 'none'}`);
    }
  }
  return lines.join('\n');
});

// biome-ignore lint/correctness/noUnusedVariables: used in template
const jsonOutput = computed(() => {
  if (!result.value) return '';
  const { index: _index, ...rest } = result.value;
  return JSON.stringify(rest, null, 2);
});

// biome-ignore lint/correctness/noUnusedVariables: used in template
const indexOutput = computed(() => {
  if (!result.value) return '';
  return [...result.value.index.keys()].sort().join('\n');
});

// biome-ignore lint/correctness/noUnusedVariables: used in template
function loadFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    xml.value = e.target?.result as string;
    activeExample.value = '';
  };
  reader.readAsText(file);
  (event.target as HTMLInputElement).value = '';
}
</script>

<template>
  <div class="playground">
    <div class="playground-toolbar">
      <span class="toolbar-label">Examples:</span>
      <button
        v-for="(ex, key) in EXAMPLES"
        :key="key"
        class="btn-example"
        :class="{ active: activeExample === key }"
        @click="loadExample(key)"
      >{{ ex.label }}</button>
      <label class="btn-upload">
        Upload .dmn / .xml
        <input type="file" accept=".dmn,.xml,text/xml,application/xml" @change="loadFile($event)" />
      </label>
    </div>

    <textarea
      v-model="xml"
      class="editor-textarea"
      spellcheck="false"
      placeholder="Paste DMN XML here…"
    />

    <div v-if="error" class="error-banner">
      <strong>Parse error:</strong> {{ error }}
    </div>

    <div v-if="result" class="output-section">
      <div class="output-tabs">
        <button
          v-for="tab in ['summary', 'json', 'index'] as const"
          :key="tab"
          class="tab-btn"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >{{ tab }}</button>
      </div>
      <pre class="output-pre"><code>{{ activeTab === 'summary' ? summaryOutput : activeTab === 'json' ? jsonOutput : indexOutput }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.playground { display: flex; flex-direction: column; gap: 1rem; }

.playground-toolbar {
  display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;
}
.toolbar-label {
  font-size: 0.8rem; color: var(--vp-c-text-2); margin-right: 0.1rem; white-space: nowrap;
}

.btn-example {
  padding: 0.25rem 0.65rem; border: 1px solid var(--vp-c-border);
  border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-2);
  cursor: pointer; font-size: 0.8rem; transition: background 0.15s, color 0.15s;
}
.btn-example:hover { background: var(--vp-c-bg-mute); color: var(--vp-c-text-1); }
.btn-example.active {
  background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1); font-weight: 600;
}

.btn-upload {
  padding: 0.25rem 0.65rem; border: 1px solid var(--vp-c-border);
  border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-2);
  cursor: pointer; font-size: 0.8rem; margin-left: auto;
}
.btn-upload:hover { background: var(--vp-c-bg-mute); }
.btn-upload input { display: none; }

.editor-textarea {
  width: 100%; height: 360px; padding: 0.75rem;
  font-family: var(--vp-font-family-mono); font-size: 0.78rem; line-height: 1.5;
  border: 1px solid var(--vp-c-border); border-radius: 8px;
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-1);
  resize: vertical; outline: none; box-sizing: border-box;
}
.editor-textarea:focus { border-color: var(--vp-c-brand-1); }

.error-banner {
  padding: 0.75rem 1rem; border-radius: 8px;
  background: var(--vp-custom-block-danger-bg); color: var(--vp-custom-block-danger-text);
  border: 1px solid var(--vp-custom-block-danger-border); font-size: 0.875rem;
}

.output-section { display: flex; flex-direction: column; gap: 0.75rem; }
.output-tabs { display: flex; gap: 0.25rem; border-bottom: 1px solid var(--vp-c-border); }
.tab-btn {
  padding: 0.4rem 0.9rem; border: none; border-bottom: 2px solid transparent;
  background: none; color: var(--vp-c-text-2); cursor: pointer; font-size: 0.85rem; margin-bottom: -1px;
}
.tab-btn:hover { color: var(--vp-c-text-1); }
.tab-btn.active { color: var(--vp-c-brand-1); border-bottom-color: var(--vp-c-brand-1); font-weight: 600; }

.output-pre {
  margin: 0; padding: 1rem; border-radius: 8px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-border);
  font-size: 0.8rem; line-height: 1.6; overflow-x: auto;
  white-space: pre-wrap; word-break: break-word; max-height: 500px; overflow-y: auto;
}
</style>
