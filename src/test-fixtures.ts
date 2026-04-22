// Inline DMN XML fixtures for unit and integration tests.
// For full fixture coverage use @veridtools/dmn-fixtures in integration.test.ts.

export const SIMPLE_DECISION = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Loan" namespace="https://test.com">
  <decision id="d1" name="Approval">
    <variable id="v1" name="Approval" typeRef="string"/>
    <decisionTable id="dt1" hitPolicy="UNIQUE">
      <input id="ic1" label="Score">
        <inputExpression id="ie1" typeRef="number"><text>score</text></inputExpression>
      </input>
      <output id="oc1" name="result" typeRef="string"/>
      <rule id="r1">
        <inputEntry id="r1ie1"><text>&gt;= 700</text></inputEntry>
        <outputEntry id="r1oe1"><text>"approved"</text></outputEntry>
      </rule>
      <rule id="r2">
        <inputEntry id="r2ie1"><text>-</text></inputEntry>
        <outputEntry id="r2oe1"><text>"rejected"</text></outputEntry>
      </rule>
    </decisionTable>
  </decision>
</definitions>`;

export const LITERAL_EXPRESSION = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Score" namespace="https://test.com">
  <decision id="d1" name="Score">
    <variable id="v1" name="Score" typeRef="number"/>
    <literalExpression id="le1" typeRef="number">
      <text>age * 10</text>
    </literalExpression>
  </decision>
</definitions>`;

export const CONTEXT_EXPRESSION = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <decision id="d1" name="Risk">
    <context id="ctx1">
      <contextEntry id="ce1">
        <variable id="v1" name="score" typeRef="number"/>
        <literalExpression id="le1"><text>age * 2</text></literalExpression>
      </contextEntry>
    </context>
  </decision>
</definitions>`;

export const BKM_DEFINITION = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <businessKnowledgeModel id="bkm1" name="Risk Score">
    <variable id="v1" name="Risk Score" typeRef="number"/>
    <encapsulatedLogic id="fn1" kind="FEEL">
      <formalParameter id="fp1" name="age" typeRef="number"/>
      <literalExpression id="le1"><text>age * 0.5</text></literalExpression>
    </encapsulatedLogic>
  </businessKnowledgeModel>
</definitions>`;

export const ITEM_DEFINITION = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <itemDefinition id="it1" name="tStatus" isCollection="false">
    <typeRef>string</typeRef>
    <allowedValues><text>"active","inactive"</text></allowedValues>
  </itemDefinition>
</definitions>`;

export const ARTIFACTS = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <decision id="d1" name="D1">
    <literalExpression><text>1</text></literalExpression>
  </decision>
  <textAnnotation id="ann1"><text>A note</text></textAnnotation>
  <association id="assoc1" associationDirection="One">
    <sourceRef href="#d1"/>
    <targetRef href="#ann1"/>
  </association>
</definitions>`;

export const DMN11_NAMESPACE = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd"
  id="_def" name="Test" namespace="https://test.com">
  <decision id="d1" name="D1">
    <decisionTable id="dt1">
      <input id="ic1" label="A">
        <inputExpression id="ie1"><text>a</text></inputExpression>
      </input>
      <output id="oc1" name="result"/>
      <rule id="r1">
        <inputEntry id="r1i1"><text>1</text></inputEntry>
        <outputEntry id="r1o1"><text>"x"</text></outputEntry>
      </rule>
    </decisionTable>
  </decision>
</definitions>`;

export const EDGE_DEFAULT_HITPOLICY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <decision id="d1" name="D1">
    <decisionTable id="dt1">
      <input id="ic1" label="A">
        <inputExpression id="ie1"><text>a</text></inputExpression>
      </input>
      <output id="oc1" name="result"/>
      <rule id="r1">
        <inputEntry id="r1i1"><text>1</text></inputEntry>
        <outputEntry id="r1o1"><text>"x"</text></outputEntry>
      </rule>
    </decisionTable>
  </decision>
</definitions>`;

export const EDGE_WILDCARD_EMPTY = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <decision id="d1" name="D1">
    <decisionTable id="dt1">
      <input id="ic1" label="A">
        <inputExpression id="ie1"><text>a</text></inputExpression>
      </input>
      <output id="oc1" name="result"/>
      <rule id="r1">
        <inputEntry id="r1i1"></inputEntry>
        <outputEntry id="r1o1"><text>"x"</text></outputEntry>
      </rule>
    </decisionTable>
  </decision>
</definitions>`;

export const EDGE_CDATA = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <decision id="d1" name="D1">
    <literalExpression id="le1">
      <text><![CDATA[score > 700]]></text>
    </literalExpression>
  </decision>
</definitions>`;

export const DECISION_SERVICE = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20230324/MODEL/"
  id="_def" name="Test" namespace="https://test.com">
  <decision id="d1" name="D1">
    <literalExpression><text>1</text></literalExpression>
  </decision>
  <inputData id="in1" name="Score"/>
  <decisionService id="ds1" name="MyService">
    <outputDecision href="#d1"/>
    <inputData href="#in1"/>
  </decisionService>
</definitions>`;
