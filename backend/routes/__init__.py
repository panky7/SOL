import os

mongo_url = os.environ.get('MONGO_URL', '')
if os.environ.get('MOCK_DB') == 'true':
    from mongomock_motor import AsyncMongoMockClient
    client = AsyncMongoMockClient()
else:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(mongo_url)

db = client[os.environ.get('DB_NAME', 'sophielamour')]
