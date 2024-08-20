from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://juanrengifo912:4212@cluster0.6ajkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

mongo_client = client #MongoClient('mongodb://localhost:27017/')
db = mongo_client['migration_db']
credentials_collection = db['credentials']

# Insert credentials
credentials = [
    {
        "platform": "spotify",
        "client_id": "fbf1afe870c14dc1822779c3392a70ae",
        "client_secret": "e88eb639ce504530866228344f908038",
        "redirect_uri": "http://localhost:5000/spotify-callback"
    },
    {
        "platform": "youtube",
        "client_id": "73822577014-h76prmqhjbttvhhtib8c8kpclqdjpmrf.apps.googleusercontent.com",
        "client_secret": "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",
        "redirect_uri": "http://localhost:5000/youtube-callback"
    },
    {
        "platform": "tidal",
        "client_id": "MJiS7r0A0wrcnbuY",
        "client_secret": "4MAvCtt7qQqtVLHjRVbpaAmYwJKnOHPCX8C468qi2MI=",
        "redirect_uri": "http://localhost:5000/tidal-callback"
    },
    {
        "platform": "soundcloud",
        "client_id": 'VgctLM9VC8rTv60ZYPcbml5sdpOnUwpC',
        "client_secret": 'GuDFSbgqgJEPZWd3h61Tp8mlG909HCQj',
        "redirect_uri": 'http://localhost:5000/callback'
    }
]

# Clear existing data and insert new data
credentials_collection.delete_many({})
credentials_collection.insert_many(credentials)
print("Credentials successfully inserted.")