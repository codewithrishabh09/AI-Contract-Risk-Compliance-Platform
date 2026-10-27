import os

# Keep pytest completely isolated from the development database.
# This must run before the application imports its Settings singleton.
os.environ["DB_NAME"] = "contract_intelligence_test"