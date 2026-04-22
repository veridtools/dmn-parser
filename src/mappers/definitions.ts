import type { MapContext } from '../context.js';
import type { DMNModel, DMNVersion } from '../types.js';
import { asRecord, asStr } from '../utils.js';
import { mapAssociations, mapGroups, mapTextAnnotations } from './artifacts.js';
import {
  mapElementCollections,
  mapOrganizationUnits,
  mapPerformanceIndicators,
} from './businessContext.js';
import { mapDMNDI } from './dmndi.js';
import {
  mapBusinessKnowledgeModels,
  mapDecisionServices,
  mapDecisions,
  mapInputData,
  mapKnowledgeSources,
} from './drgElements.js';
import { mapImports } from './imports.js';
import { mapItemDefinitions } from './itemDefinitions.js';

export function mapDefinitions(
  raw: Record<string, unknown>,
  version: DMNVersion,
  ctx: MapContext,
): DMNModel {
  const id = asStr(raw['@id']) ?? '';
  const model: DMNModel = {
    id,
    name: asStr(raw['@name']) ?? '',
    namespace: asStr(raw['@namespace']) ?? asStr(raw['@targetNamespace']) ?? '',
    dmnVersion: version,
    decisions: mapDecisions(raw.decision, ctx),
    inputData: mapInputData(raw.inputData, ctx),
    businessKnowledgeModels: mapBusinessKnowledgeModels(raw.businessKnowledgeModel, ctx),
    knowledgeSources: mapKnowledgeSources(raw.knowledgeSource, ctx),
    decisionServices: mapDecisionServices(raw.decisionService, ctx),
    itemDefinitions: mapItemDefinitions(raw.itemDefinition, ctx),
    elementCollections: mapElementCollections(raw.elementCollection, ctx),
    performanceIndicators: mapPerformanceIndicators(raw.performanceIndicator, ctx),
    organizationUnits: mapOrganizationUnits(raw.organizationUnit, ctx),
    textAnnotations: mapTextAnnotations(raw.textAnnotation, ctx),
    associations: mapAssociations(raw.association, ctx),
    groups: mapGroups(raw.group, ctx),
    imports: mapImports(raw.import),
    index: ctx.index,
  };
  const exprLang = asStr(raw['@expressionLanguage']);
  if (exprLang !== undefined) model.expressionLanguage = exprLang;
  const typeLang = asStr(raw['@typeLanguage']);
  if (typeLang !== undefined) model.typeLanguage = typeLang;
  const desc = asStr(raw['@description']);
  if (desc !== undefined) model.description = desc;
  const exporter = asStr(raw['@exporter']);
  if (exporter !== undefined) model.exporter = exporter;
  const exporterVersion = asStr(raw['@exporterVersion']);
  if (exporterVersion !== undefined) model.exporterVersion = exporterVersion;
  if (ctx.includeDMNDI && raw.DMNDI) {
    const dmndi = mapDMNDI(asRecord(raw.DMNDI));
    if (dmndi !== undefined) model.dmndi = dmndi;
  }
  if (id) ctx.index.set(id, model);
  return model;
}
