import { isRecord } from '../utils.js';

// Tags whose DMNDI/extension content is stripped before mapping
const STRIP_KEYS = new Set(['DMNDI', 'extensionElements', 'DMNDiagram']);

// Child text elements promoted to attribute form so paths are uniform
const LIFT_FIELDS = [
  ['typeRef', '@typeRef'],
  ['description', '@description'],
  ['locationURI', '@locationURI'],
  ['question', '@question'],
  ['allowedAnswers', '@allowedAnswers'],
] as const;

export function normalizeNode(node: Record<string, unknown>, tagName: string): void {
  for (const key of STRIP_KEYS) delete node[key];

  // Promote child text elements → attribute form
  for (const [child, attr] of LIFT_FIELDS) {
    const raw = node[child];
    if (typeof raw === 'string' && !(attr in node)) {
      const val = raw.trim();
      if (val) node[attr] = val;
      delete node[child];
    }
  }

  // Trim string attributes
  for (const key of Object.keys(node)) {
    if (key.startsWith('@') && typeof node[key] === 'string') {
      node[key] = (node[key] as string).trim();
    }
  }

  if (tagName === 'decisionTable') {
    const hp = node['@hitPolicy'];
    node['@hitPolicy'] = hp ? String(hp).toUpperCase().trim() : 'UNIQUE';
    if (!node['@preferredOrientation']) node['@preferredOrientation'] = 'Rule-as-Row';
  }

  if (tagName === 'textAnnotation' && !node['@textFormat']) {
    node['@textFormat'] = 'text/plain';
  }

  if (tagName === 'association' && !node['@associationDirection']) {
    node['@associationDirection'] = 'None';
  }

  if (tagName === 'functionDefinition' || tagName === 'encapsulatedLogic') {
    if (!node['@kind']) node['@kind'] = 'FEEL';
  }

  if (tagName === 'itemDefinition' || tagName === 'itemComponent') {
    const ic = node['@isCollection'];
    node['@isCollection'] = ic === 'true' || ic === true;
  }

  // Normalize inputEntry wildcard: empty/missing → '-'
  if (tagName === 'inputEntry') {
    const t = node.text;
    if (t === undefined || t === null || t === '') {
      node.text = '-';
    } else if (typeof t === 'string') {
      node.text = t.trim() || '-';
    }
  }

  if (typeof node.text === 'string') node.text = (node.text as string).trim();

  for (const key of Object.keys(node)) {
    if (key.startsWith('@') || key === '#text' || key === 'text') continue;
    if (STRIP_KEYS.has(key)) continue;
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) if (isRecord(item)) normalizeNode(item, key);
    } else if (isRecord(child)) {
      normalizeNode(child, key);
    }
  }
}
