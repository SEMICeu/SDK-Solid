/**
 * Describes a patch document.
 */
export interface Patch {
  conditions: {
    tos_uri:         string;
    policy_uri:      string;
    legal_basis_uri: string[];
    purpose_uri:     string[];
  };
  add:        { access: AccessRule };
  remove:     { access: AccessRule };
}

/**
 * Describes an access rule.
 */
export interface AccessRule {
  subject_type_combo: {
    applies_to_subject_uri: string;
    applies_to_type_uri:    string;
    allowed_subject_uri:    string;
    allowed_azp_uri:        string;
    allowed_issuer_uri:     string;
    allowed_access_mode:    string;
    storage:                string;
  }[];
  resource:           string[];
}
