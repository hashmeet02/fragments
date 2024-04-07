# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{
    "fragment_id": 1,
    "content": "This is a test fragment of type json"
}

# 2. Server should return 201
HTTP/1.1 201
[Captures]
url: header "Location"
fragment_id: jsonpath "$.fragment.id"

# 3. GET the newly created fragment info
GET {{url}}/info
[BasicAuth]
user1@email.com:password1

# Server should return the expected response
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment_id}}
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.created" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.updated" matches /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 79

# 4. GET json fragment as txt
GET {{url}}.txt
[BasicAuth]
user1@email.com:password1

# Server should return the expected response
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
Content-Length: 66
[Asserts]
{
    "fragment_id": 1,
    "content": "This is a test fragment of type json"
}
