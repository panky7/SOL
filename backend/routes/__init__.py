import os
import boto3
from boto3.dynamodb.conditions import Key, Attr

# Check if we are running in mock database mode for local tests
MOCK_DB = os.environ.get('MOCK_DB') == 'true'

class MockQuery:
    def __init__(self, items):
        self.items = items
        self.sort_key = None
        self.sort_desc = False
        self.limit_val = None

    def sort(self, key, direction=-1):
        self.sort_key = key
        self.sort_desc = (direction == -1)
        return self

    def limit(self, limit):
        self.limit_val = limit
        return self

    async def to_list(self, limit=None):
        items = list(self.items)
        if self.sort_key:
            items.sort(key=lambda x: x.get(self.sort_key, ""), reverse=self.sort_desc)
        limit = limit or self.limit_val
        if limit:
            items = items[:limit]
        return items

class MockTable:
    def __init__(self, name):
        self.name = name
        self.items = []

    async def insert_one(self, item):
        item = dict(item)
        if "_id" in item:
            item["_id"] = str(item["_id"])
        self.items.append(item)
        return item

    async def find_one(self, query, projection=None):
        for item in self.items:
            match = True
            for k, v in query.items():
                val = str(item.get(k)) if k == "_id" else item.get(k)
                target_val = str(v) if k == "_id" else v
                if val != target_val:
                    match = False
                    break
            if match:
                res = dict(item)
                if projection and projection.get("_id") == 0:
                    res.pop("_id", None)
                return res
        return None

    def find(self, query={}, projection=None):
        matched = []
        for item in self.items:
            match = True
            for k, v in query.items():
                val = str(item.get(k)) if k == "_id" else item.get(k)
                target_val = str(v) if k == "_id" else v
                if val != target_val:
                    match = False
                    break
            if match:
                res = dict(item)
                if projection and projection.get("_id") == 0:
                    res.pop("_id", None)
                matched.append(res)
        return MockQuery(matched)

    async def update_one(self, filter_query, update_doc):
        set_data = update_doc.get("$set", {})
        for item in self.items:
            match = True
            for k, v in filter_query.items():
                val = str(item.get(k)) if k == "_id" else item.get(k)
                target_val = str(v) if k == "_id" else v
                if val != target_val:
                    match = False
                    break
            if match:
                item.update(set_data)
                class UpdateResult:
                    matched_count = 1
                    modified_count = 1
                return UpdateResult()
        class UpdateResultZero:
            matched_count = 0
            modified_count = 0
        return UpdateResultZero()

    async def delete_one(self, filter_query):
        for idx, item in enumerate(self.items):
            match = True
            for k, v in filter_query.items():
                val = str(item.get(k)) if k == "_id" else item.get(k)
                target_val = str(v) if k == "_id" else v
                if val != target_val:
                    match = False
                    break
            if match:
                self.items.pop(idx)
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class DeleteResultZero:
            deleted_count = 0
        return DeleteResultZero()

    async def create_index(self, *args, **kwargs):
        pass


class DynamoQuery:
    def __init__(self, table, query_filter=None, query_key=None, index_name=None):
        self.table = table
        self.query_filter = query_filter
        self.query_key = query_key
        self.index_name = index_name
        self.sort_key = None
        self.sort_desc = False
        self.limit_val = None

    def sort(self, key, direction=-1):
        self.sort_key = key
        self.sort_desc = (direction == -1)
        return self

    def limit(self, limit):
        self.limit_val = limit
        return self

    async def to_list(self, limit=None):
        limit = limit or self.limit_val
        params = {}
        if limit:
            params['Limit'] = limit

        if self.index_name:
            params['IndexName'] = self.index_name

        items = []
        if self.query_key:
            params['KeyConditionExpression'] = self.query_key
            response = self.table.query(**params)
            items = response.get('Items', [])
        else:
            if self.query_filter:
                params['FilterExpression'] = self.query_filter
            response = self.table.scan(**params)
            items = response.get('Items', [])

        if self.sort_key:
            items.sort(key=lambda x: x.get(self.sort_key, ""), reverse=self.sort_desc)

        return items


class DynamoTable:
    def __init__(self, table_name, hash_key_name):
        self.table_name = table_name
        self.hash_key_name = hash_key_name
        self.dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION', 'eu-west-3'))
        self.table = self.dynamodb.Table(table_name)

    async def insert_one(self, item):
        item = dict(item)
        if "_id" in item:
            item["_id"] = str(item["_id"])
        self.table.put_item(Item=item)
        return item

    async def find_one(self, query, projection=None):
        if len(query) == 1 and self.hash_key_name in query:
            key_val = query[self.hash_key_name]
            key_val = str(key_val)
            response = self.table.get_item(Key={self.hash_key_name: key_val})
            item = response.get('Item')
            if item:
                if projection and projection.get("_id") == 0:
                    item.pop("_id", None)
                return item
        
        filter_expr = None
        for k, v in query.items():
            val = str(v) if k == "_id" else v
            expr = Attr(k).eq(val)
            filter_expr = filter_expr & expr if filter_expr else expr

        params = {}
        if filter_expr:
            params['FilterExpression'] = filter_expr

        response = self.table.scan(**params)
        items = response.get('Items', [])
        if items:
            item = items[0]
            if projection and projection.get("_id") == 0:
                item.pop("_id", None)
            return item
        return None

    def find(self, query={}, projection=None):
        if self.table_name == "sophielamour-blog-posts" and "slug" in query:
            slug_val = query["slug"]
            return DynamoQuery(
                table=self.table,
                query_key=Key("slug").eq(slug_val),
                index_name="slug-index"
            )

        filter_expr = None
        for k, v in query.items():
            val = str(v) if k == "_id" else v
            expr = Attr(k).eq(val)
            filter_expr = filter_expr & expr if filter_expr else expr

        return DynamoQuery(table=self.table, query_filter=filter_expr)

    async def update_one(self, filter_query, update_doc):
        item = await self.find_one(filter_query)
        if not item:
            class UpdateResultZero:
                matched_count = 0
                modified_count = 0
            return UpdateResultZero()

        set_data = update_doc.get("$set", {})
        item.update(set_data)
        self.table.put_item(Item=item)
        
        class UpdateResult:
            matched_count = 1
            modified_count = 1
        return UpdateResult()

    async def delete_one(self, filter_query):
        item = await self.find_one(filter_query)
        if not item:
            class DeleteResultZero:
                deleted_count = 0
            return DeleteResultZero()

        self.table.delete_item(Key={self.hash_key_name: item[self.hash_key_name]})
        
        class DeleteResult:
            deleted_count = 1
        return DeleteResult()

    async def create_index(self, *args, **kwargs):
        pass


class Database:
    def __init__(self):
        if MOCK_DB:
            self.users = MockTable("sophielamour-users")
            self.blog_posts = MockTable("sophielamour-blog-posts")
            self.testimonials = MockTable("sophielamour-testimonials")
            self.contact_requests = MockTable("sophielamour-contact-requests")
            self.uploads = MockTable("sophielamour-uploads")
            self.social_share_queue = MockTable("sophielamour-social-share-queue")
        else:
            self.users = DynamoTable("sophielamour-users", "email")
            self.blog_posts = DynamoTable("sophielamour-blog-posts", "id")
            self.testimonials = DynamoTable("sophielamour-testimonials", "id")
            self.contact_requests = DynamoTable("sophielamour-contact-requests", "id")
            self.uploads = DynamoTable("sophielamour-uploads", "file_id")
            self.social_share_queue = DynamoTable("sophielamour-social-share-queue", "id")

db = Database()
