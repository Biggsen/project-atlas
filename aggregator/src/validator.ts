import Ajv from 'ajv';
import { Manifest } from './types';

const ajv = new Ajv();

// Manifest schema v1
const manifestSchema = {
  type: 'object',
  required: [
    'schemaVersion',
    'projectId',
    'name',
    'repo',
    'visibility',
    'status',
    'domain',
    'type',
    'lastUpdated',
    'links',
    'tags',
  ],
  properties: {
    schemaVersion: { type: 'number', const: 1 },
    projectId: { type: 'string' },
    name: { type: 'string' },
    repo: { type: 'string' },
    visibility: { type: 'string', enum: ['public', 'staging', 'private'] },
    status: { type: 'string', enum: ['active', 'mvp', 'paused', 'archived'] },
    domain: { type: 'string', enum: ['music', 'minecraft', 'management', 'other'] },
    type: {
      type: 'string',
      enum: ['webapp', 'microservice', 'tool', 'cli', 'library', 'other'],
    },
    lastUpdated: { type: 'string' },
    links: {
      type: 'object',
      required: ['prod', 'staging'],
      properties: {
        prod: { type: ['string', 'null'] },
        staging: { type: ['string', 'null'] },
      },
    },
    tags: { type: 'array', items: { type: 'string' } },
  },
  additionalProperties: true, // Allow higher schema versions to include extra fields
};

const validate = ajv.compile(manifestSchema);

export function validateManifest(data: unknown): {
  valid: boolean;
  manifest?: Manifest;
  errors?: string[];
} {
  const valid = validate(data);
  if (valid) {
    return { valid: true, manifest: data as unknown as Manifest };
  }

  const errors = validate.errors?.map((err) => {
    return `${err.instancePath} ${err.message}`;
  }) || ['Unknown validation error'];

  return { valid: false, errors };
}
