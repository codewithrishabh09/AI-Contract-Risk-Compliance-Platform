from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class AnalysisDomain:
    key: str
    label: str
    query: str


ANALYSIS_DOMAINS = (
    AnalysisDomain(
        key="PAYMENT",
        label="Payment Obligations",
        query=(
            "payment obligations, invoice terms, payment deadlines, "
            "fees, pricing, late payment, taxes, refunds"
        ),
    ),
    AnalysisDomain(
        key="TERMINATION",
        label="Termination",
        query=(
            "termination rights, termination notice period, "
            "termination for convenience, termination for cause"
        ),
    ),
    AnalysisDomain(
        key="LIABILITY",
        label="Liability",
        query=(
            "liability limitations, liability caps, exclusions, "
            "direct damages, indirect damages, consequential damages"
        ),
    ),
    AnalysisDomain(
        key="INDEMNIFICATION",
        label="Indemnification",
        query=(
            "indemnification obligations, indemnity, third-party claims, "
            "defense obligations"
        ),
    ),
    AnalysisDomain(
        key="CONFIDENTIALITY",
        label="Confidentiality",
        query=(
            "confidential information, confidentiality obligations, "
            "disclosure restrictions, confidentiality exceptions"
        ),
    ),
    AnalysisDomain(
        key="INTELLECTUAL_PROPERTY",
        label="Intellectual Property",
        query=(
            "intellectual property ownership, licenses, work product, "
            "copyright, inventions, software ownership"
        ),
    ),
    AnalysisDomain(
        key="DATA_PROTECTION",
        label="Data Protection",
        query=(
            "personal data, data protection, privacy, data processing, "
            "security obligations, data breach"
        ),
    ),
    AnalysisDomain(
        key="RENEWAL",
        label="Renewal",
        query=(
            "contract renewal, automatic renewal, renewal notice, "
            "renewal period"
        ),
    ),
    AnalysisDomain(
        key="DISPUTE_RESOLUTION",
        label="Dispute Resolution",
        query=(
            "dispute resolution, arbitration, courts, jurisdiction, "
            "claims, mediation"
        ),
    ),
    AnalysisDomain(
        key="GOVERNING_LAW",
        label="Governing Law",
        query=(
            "governing law, applicable law, jurisdiction, legal venue"
        ),
    ),
)