from pymongo.mongo_client import MongoClient
import pymongo,time,json
from pymongo.database import Database as db_type
uri = open("mongo_url").read()

client = MongoClient(uri)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    exit()

class connection:
    def __init__(self,collection) -> None:
        self.collection=collection
    def get(self,key):
        return collection_get(self.collection,key)
    def set(self,key,content):
        return collection_set(self.collection,key,content)
    def delete(self,key):
        return collection_delete(key,self.collection)
    def clear_collection(self):
        return collection_clear_all(self.collection)
    def get_all(self):
        return collection_get_all(self.collection)
    def append(self,key,string):
        return append_string(self.collection,key,string)

def append_string(database: db_type,key,string):
    database.update_one(
        {"_id" :key},[{"$set":{"val":{"$concat":["$val",string]}}}]
    )

def get_conn(database):
    db=client[database.replace(".db","")]
    collection=db["keyval"]
    return connection(collection)

def collection_set(collection,key,val):
    if collection_get(collection,key)==None:
        collection.insert_one({"_id":key,"val":json.dumps(val)})
    else:
        collection.update_one({"_id":key},{"$set":{"val":json.dumps(val)}})

def collection_get(collection,key):
    res=collection.find_one({"_id":key})
    if res==None:
        return None
    val=res["val"]
    try:
        return json.loads(val)
    except:
        return val

def collection_get_all(collection):
    collection_find=list(collection.find())
    return collection_find

def collection_clear_all(collection):
    collection.delete_many({})

def collection_delete(key,collection):
    collection.delete_many({"_id":key})