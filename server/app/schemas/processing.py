"""Backward-compatible processing schema exports.

Processing job response models are defined with document schemas because
document upload and processing share the same job resource.  This module
keeps the historical ``app.schemas.processing`` import path valid.
"""

from app.schemas.contract_document import ProcessingJobResponse

__all__ = ["ProcessingJobResponse"]
