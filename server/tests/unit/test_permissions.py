from app.core.permissions import Permission, ROLE_PERMISSIONS


def test_admin_has_all_permissions():
    admin_permissions = ROLE_PERMISSIONS["ADMIN"]

    for permission in Permission:
        assert permission in admin_permissions


def test_viewer_can_read_contracts():
    viewer_permissions = ROLE_PERMISSIONS["VIEWER"]

    assert Permission.CONTRACT_READ in viewer_permissions


def test_viewer_cannot_create_contracts():
    viewer_permissions = ROLE_PERMISSIONS["VIEWER"]

    assert Permission.CONTRACT_CREATE not in viewer_permissions


def test_viewer_cannot_request_analysis():
    viewer_permissions = ROLE_PERMISSIONS["VIEWER"]

    assert Permission.ANALYSIS_REQUEST not in viewer_permissions


def test_analyst_can_request_analysis():
    analyst_permissions = ROLE_PERMISSIONS["ANALYST"]

    assert Permission.ANALYSIS_REQUEST in analyst_permissions


def test_analyst_cannot_read_audit_logs():
    analyst_permissions = ROLE_PERMISSIONS["ANALYST"]

    assert Permission.AUDIT_READ not in analyst_permissions


def test_legal_reviewer_can_approve_contract():
    reviewer_permissions = ROLE_PERMISSIONS["LEGAL_REVIEWER"]

    assert Permission.CONTRACT_APPROVE in reviewer_permissions