import json
import urllib.request
import urllib.parse

def post(url, data=None, headers={}):
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

def get(url, headers={}):
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

status, body = post("http://127.0.0.1:8000/api/users/login", data=urllib.parse.urlencode({"username": "alice", "password": "password"}).encode(), headers={"Content-Type": "application/x-www-form-urlencoded"})
if status != 200:
    print("Login failed:", body)
    exit(1)
token = body["access_token"]
headers = {"Authorization": f"Bearer {token}"}

status, convs = get("http://127.0.0.1:8000/api/conversations", headers=headers)
groups = [c for c in convs if c["type"] == "group"]
if not groups:
    print("No groups found for user")
    exit(1)
group = groups[0]
print(f"Group {group['id']} has {len(group['members'])} members")

status, body = post(f"http://127.0.0.1:8000/api/groups/{group['id']}/members", data=json.dumps({"user_id": 2}).encode(), headers={**headers, "Content-Type": "application/json"})
print("Add member status:", status)
if status == 200:
    print(f"Group now has {len(body['members'])} members")
else:
    print("Failed:", body)
