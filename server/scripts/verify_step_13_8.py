import sys
import uuid
from decimal import Decimal
from pathlib import Path

# Make `app` importable no matter where the script is run from.
# parents[1] is the `server/` folder.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy.orm import Session  # noqa: E402

from app.db.session import engine  # noqa: E402
from app.models import (  # noqa: E402
    Clause,
    Contract,
    ContractVersion,
    Organization,
    ProcessingJob,
    User,
)


def main() -> None:
    session = Session(engine)

    try:
        organization = Organization(
            name="STEP 13.8 Test Organization",
            slug=f"step138-{uuid.uuid4().hex[:12]}",
        )

        user = User(
            email=f"step138-{uuid.uuid4().hex[:12]}@example.com",
            password_hash="schema-test-only-not-a-real-hash",
            full_name="Processing Test User",
            role="EMPLOYEE",
            status="ACTIVE",
        )

        organization.users.append(user)
        session.add(organization)
        session.flush()

        contract = Contract(
            title="Test Confidentiality Agreement",
            contract_type="NDA",
            status="UPLOADED",
            organization=organization,
            creator=user,
        )

        session.add(contract)
        session.flush()

        version = ContractVersion(
            contract=contract,
            version_number=1,
            uploader=user,
            change_summary="Initial test version",
        )

        session.add(version)
        session.flush()

        job = ProcessingJob(
            contract_version=version,
            requester=user,
            job_type="FULL_ANALYSIS",
            status="QUEUED",
        )

        clause = Clause(
            contract_version=version,
            clause_index=0,
            clause_type="CONFIDENTIALITY",
            title="Confidential Information",
            text=(
                "The receiving party must protect "
                "confidential information."
            ),
            page_start=1,
            page_end=1,
            confidence_score=Decimal("0.9500"),
            extraction_method="RULE_BASED",
        )

        session.add_all([job, clause])
        session.flush()

        print("Contract:", version.contract.title)
        print("Version:", version.version_number)
        print("Processing job:", job.job_type, job.status)
        print("Job requester:", job.requester.email)
        print("Clause:", clause.clause_type)
        print("Clause confidence:", clause.confidence_score)
        print("Version has job:", job in version.processing_jobs)
        print("Version has clause:", clause in version.clauses)

        assert job in version.processing_jobs
        assert clause in version.clauses
        assert version.contract is contract
        assert job.requester is user

        print("STEP 13.8 relationship tests passed.")

    finally:
        session.rollback()
        session.close()


if __name__ == "__main__":
    main()