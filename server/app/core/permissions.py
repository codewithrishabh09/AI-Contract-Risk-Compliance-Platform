from enum import Enum


class Permission(str, Enum):
    CONTRACT_READ = "contract:read"
    CONTRACT_CREATE = "contract:create"
    CONTRACT_UPDATE = "contract:update"
    CONTRACT_UPLOAD = "contract:upload"

    ANALYSIS_REQUEST = "analysis:request"
    ANALYSIS_READ = "analysis:read"

    FINDING_READ = "finding:read"
    FINDING_UPDATE = "finding:update"

    AUDIT_READ = "audit:read"

    USER_READ = "user:read"
    USER_MANAGE = "user:manage"

    CONTRACT_APPROVE = "contract:approve"


ROLE_PERMISSIONS: dict[str, set[Permission]] = {
    # Full platform access.
    "SUPER_ADMIN": {
        Permission.CONTRACT_READ,
        Permission.CONTRACT_CREATE,
        Permission.CONTRACT_UPDATE,
        Permission.CONTRACT_UPLOAD,
        Permission.ANALYSIS_REQUEST,
        Permission.ANALYSIS_READ,
        Permission.FINDING_READ,
        Permission.FINDING_UPDATE,
        Permission.AUDIT_READ,
        Permission.USER_READ,
        Permission.USER_MANAGE,
        Permission.CONTRACT_APPROVE,
    },

    # Organization-level administration.
    "ORG_ADMIN": {
        Permission.CONTRACT_READ,
        Permission.CONTRACT_CREATE,
        Permission.CONTRACT_UPDATE,
        Permission.CONTRACT_UPLOAD,
        Permission.ANALYSIS_REQUEST,
        Permission.ANALYSIS_READ,
        Permission.FINDING_READ,
        Permission.FINDING_UPDATE,
        Permission.AUDIT_READ,
        Permission.USER_READ,
        Permission.USER_MANAGE,
        Permission.CONTRACT_APPROVE,
    },

    # Legal review and contract lifecycle.
    "LEGAL_REVIEWER": {
        Permission.CONTRACT_READ,
        Permission.CONTRACT_UPDATE,
        Permission.CONTRACT_UPLOAD,
        Permission.ANALYSIS_REQUEST,
        Permission.ANALYSIS_READ,
        Permission.FINDING_READ,
        Permission.FINDING_UPDATE,
        Permission.AUDIT_READ,
        Permission.CONTRACT_APPROVE,
    },

    # Compliance-focused access.
    "COMPLIANCE_OFFICER": {
        Permission.CONTRACT_READ,
        Permission.ANALYSIS_READ,
        Permission.FINDING_READ,
        Permission.FINDING_UPDATE,
        Permission.AUDIT_READ,
    },

    # Standard employee read access.
    "EMPLOYEE": {
        Permission.CONTRACT_READ,
        Permission.ANALYSIS_READ,
        Permission.FINDING_READ,
    },
}