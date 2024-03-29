import { Patch } from '@useid/movejs';
import { VOC_CONSENT, VOC_TRAVEL_PREFERENCE } from '../vocabulary';

/**
 * Generates a patch document for the employee of the PTO.
 *
 * @param azp The azp which is requesting access.
 * @returns A patch document.
 */
export const patchForCommuter = (azp: string, allowedSubjectUri: string): Patch => ({
  'conditions': {
    'tos_uri': 'https://example.com/tos',
    'policy_uri': 'https://example.com/policy',
    'legal_basis_uri': [
      'https://example.com/legal-basis',
    ],
    'purpose_uri': [
      'https://example.com/purpose',
    ],
  },
  'add': {
    'access': {
      'subject_type_combo': [
        {
          'applies_to_subject_uri': '{auth-request-subject}',
          'applies_to_type_uri': VOC_CONSENT,
          'allowed_subject_uri': '{auth-request-subject}',
          'allowed_azp_uri': azp,
          'allowed_issuer_uri': '*',
          'allowed_access_mode': 'create',
          'storage': '*',
        },
        {
          'applies_to_subject_uri': '{auth-request-subject}',
          'applies_to_type_uri': VOC_TRAVEL_PREFERENCE,
          'allowed_subject_uri': allowedSubjectUri,
          'allowed_azp_uri': azp,
          'allowed_issuer_uri': '*',
          'allowed_access_mode': 'read',
          'storage': '*',
        },
        {
          'applies_to_subject_uri': '{auth-request-subject}',
          'applies_to_type_uri': VOC_TRAVEL_PREFERENCE,
          'allowed_subject_uri': allowedSubjectUri,
          'allowed_azp_uri': azp,
          'allowed_issuer_uri': '*',
          'allowed_access_mode': 'write',
          'storage': '*',
        },
        {
          'applies_to_subject_uri': '{auth-request-subject}',
          'applies_to_type_uri': VOC_TRAVEL_PREFERENCE,
          'allowed_subject_uri': allowedSubjectUri,
          'allowed_azp_uri': azp,
          'allowed_issuer_uri': '*',
          'allowed_access_mode': 'create',
          'storage': '*',
        },
        {
          'applies_to_subject_uri': '{auth-request-subject}',
          'applies_to_type_uri': VOC_TRAVEL_PREFERENCE,
          'allowed_subject_uri': '{auth-request-subject}',
          'allowed_azp_uri': azp,
          'allowed_issuer_uri': '*',
          'allowed_access_mode': 'read',
          'storage': '*',
        },
        {
          'applies_to_subject_uri': '{auth-request-subject}',
          'applies_to_type_uri': VOC_TRAVEL_PREFERENCE,
          'allowed_subject_uri': '{auth-request-subject}',
          'allowed_azp_uri': azp,
          'allowed_issuer_uri': '*',
          'allowed_access_mode': 'write',
          'storage': '*',
        },
        {
          'applies_to_subject_uri': '{auth-request-subject}',
          'applies_to_type_uri': VOC_TRAVEL_PREFERENCE,
          'allowed_subject_uri': '{auth-request-subject}',
          'allowed_azp_uri': azp,
          'allowed_issuer_uri': '*',
          'allowed_access_mode': 'create',
          'storage': '*',
        },
      ],
      'resource': [],
    },
  },
  'remove': {
    'access': {
      'subject_type_combo': [],
      'resource': [],
    },
  },
});
