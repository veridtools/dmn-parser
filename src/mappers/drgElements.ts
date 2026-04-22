import type { MapContext } from '../context.js';
import type {
  BusinessKnowledgeModel,
  Decision,
  DecisionService,
  InformationItem,
  InputData,
  KnowledgeSource,
} from '../types.js';
import { asRecord, asRecordArray, asStr } from '../utils.js';
import { mapExpression, mapFunctionDefinition } from './expressions.js';
import { mapAuthorityReqs, mapHrefs, mapInfoReqs, mapKnowledgeReqs } from './requirements.js';

function mapInfoItem(raw: Record<string, unknown>): InformationItem {
  const el: InformationItem = { name: asStr(raw['@name']) ?? '' };
  const id = asStr(raw['@id']);
  if (id !== undefined) el.id = id;
  const typeRef = asStr(raw['@typeRef']);
  if (typeRef !== undefined) el.typeRef = typeRef;
  const label = asStr(raw['@label']);
  if (label !== undefined) el.label = label;
  return el;
}

export function mapDecisions(raw: unknown, ctx: MapContext): Decision[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: Decision = {
      id,
      name: asStr(r['@name']) ?? '',
      informationRequirements: mapInfoReqs(r.informationRequirement),
      knowledgeRequirements: mapKnowledgeReqs(r.knowledgeRequirement),
      authorityRequirements: mapAuthorityReqs(r.authorityRequirement),
      supportedObjectives: mapHrefs(r.supportedObjective),
      impactedPerformanceIndicators: mapHrefs(r.impactedPerformanceIndicator),
      decisionMakers: mapHrefs(r.decisionMaker),
      decisionOwners: mapHrefs(r.decisionOwner),
      usingProcesses: mapHrefs(r.usingProcess),
      usingTasks: mapHrefs(r.usingTask),
    };
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    const desc = asStr(r['@description']);
    if (desc !== undefined) el.description = desc;
    const question = asStr(r['@question']);
    if (question !== undefined) el.question = question;
    const allowedAnswers = asStr(r['@allowedAnswers']);
    if (allowedAnswers !== undefined) el.allowedAnswers = allowedAnswers;
    const varRaw = asRecord(r.variable);
    if (varRaw) el.variable = mapInfoItem(varRaw);
    const expr = mapExpression(r, ctx);
    if (expr !== undefined) el.expression = expr;
    if (id) ctx.index.set(id, el);
    return el;
  });
}

export function mapInputData(raw: unknown, ctx: MapContext): InputData[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: InputData = { id, name: asStr(r['@name']) ?? '' };
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    const desc = asStr(r['@description']);
    if (desc !== undefined) el.description = desc;
    const isCollection = r['@isCollection'];
    if (isCollection !== undefined)
      el.isCollection = isCollection === 'true' || isCollection === true;
    const varRaw = asRecord(r.variable);
    if (varRaw) el.variable = mapInfoItem(varRaw);
    if (id) ctx.index.set(id, el);
    return el;
  });
}

export function mapBusinessKnowledgeModels(
  raw: unknown,
  ctx: MapContext,
): BusinessKnowledgeModel[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: BusinessKnowledgeModel = {
      id,
      name: asStr(r['@name']) ?? '',
      knowledgeRequirements: mapKnowledgeReqs(r.knowledgeRequirement),
      authorityRequirements: mapAuthorityReqs(r.authorityRequirement),
    };
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    const desc = asStr(r['@description']);
    if (desc !== undefined) el.description = desc;
    const varRaw = asRecord(r.variable);
    if (varRaw) el.variable = mapInfoItem(varRaw);
    const encRaw = asRecord(r.encapsulatedLogic);
    if (encRaw) el.encapsulatedLogic = mapFunctionDefinition(encRaw, ctx);
    if (id) ctx.index.set(id, el);
    return el;
  });
}

export function mapKnowledgeSources(raw: unknown, ctx: MapContext): KnowledgeSource[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: KnowledgeSource = {
      id,
      name: asStr(r['@name']) ?? '',
      authorityRequirements: mapAuthorityReqs(r.authorityRequirement),
    };
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    const desc = asStr(r['@description']);
    if (desc !== undefined) el.description = desc;
    const type = asStr(r.type) ?? asStr(r['@type']);
    if (type !== undefined) el.type = type;
    const locationURI = asStr(r['@locationURI']);
    if (locationURI !== undefined) el.locationURI = locationURI;
    const ownerRaw = asRecord(r.owner);
    if (ownerRaw) el.owner = { href: asStr(ownerRaw['@href']) ?? '' };
    if (id) ctx.index.set(id, el);
    return el;
  });
}

export function mapDecisionServices(raw: unknown, ctx: MapContext): DecisionService[] {
  return asRecordArray(raw).map((r) => {
    const id = asStr(r['@id']) ?? '';
    const el: DecisionService = {
      id,
      name: asStr(r['@name']) ?? '',
      outputDecisions: mapHrefs(r.outputDecision),
      encapsulatedDecisions: mapHrefs(r.encapsulatedDecision),
      inputDecisions: mapHrefs(r.inputDecision),
      inputData: mapHrefs(r.inputData),
    };
    const label = asStr(r['@label']);
    if (label !== undefined) el.label = label;
    const desc = asStr(r['@description']);
    if (desc !== undefined) el.description = desc;
    const varRaw = asRecord(r.variable);
    if (varRaw) el.variable = mapInfoItem(varRaw);
    if (id) ctx.index.set(id, el);
    return el;
  });
}
