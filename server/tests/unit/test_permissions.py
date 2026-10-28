from app.core.permissions import Permission, ROLE_PERMISSIONS


def test_super_admin_has_all_permissions():
    permissions = ROLE_PERMISSIONS["SUPER_ADMIN"]

    assert permissions == set(Permission)


def test_org_admin_has_administrative_permissions():
    permissions = ROLE_PERMISSIONS["ORG_ADMIN"]

    assert Permission.CONTRACT_READ in permissions
    assert Permission.CONTRACT_CREATE in permissions
    assert Permission.CONTRACT_UPLOAD in permissions
    assert Permission.ANALYSIS_READ in permissions
    assert Permission.USER_READ in permissions
    assert Permission.USER_MANAGE in permissions


def test_employee_can_read_contracts():
    permissions = ROLE_PERMISSIONS["EMPLOYEE"]

    assert Permission.CONTRACT_READ in permissions


def test_employee_can_read_analysis():
    permissions = ROLE_PERMISSIONS["EMPLOYEE"]

    assert Permission.ANALYSIS_READ in permissions


def test_employee_can_read_findings():
    permissions = ROLE_PERMISSIONS["EMPLOYEE"]

    assert Permission.FINDING_READ in permissions


def test_employee_cannot_create_contracts():
    permissions = ROLE_PERMISSIONS["EMPLOYEE"]

    assert Permission.CONTRACT_CREATE not in permissions


def test_employee_cannot_request_analysis():
    permissions = ROLE_PERMISSIONS["EMPLOYEE"]

    assert Permission.ANALYSIS_REQUEST not in permissions


def test_compliance_officer_can_read_audit_logs():
    permissions = ROLE_PERMISSIONS["COMPLIANCE_OFFICER"]

    assert Permission.AUDIT_READ in permissions


def test_compliance_officer_cannot_manage_users():
    permissions = ROLE_PERMISSIONS["COMPLIANCE_OFFICER"]

    assert Permission.USER_MANAGE not in permissions


def test_legal_reviewer_can_request_analysis():
    permissions = ROLE_PERMISSIONS["LEGAL_REVIEWER"]

    assert Permission.ANALYSIS_REQUEST in permissions


def test_legal_reviewer_can_update_findings():
    permissions = ROLE_PERMISSIONS["LEGAL_REVIEWER"]

    assert Permission.FINDING_UPDATE in permissions