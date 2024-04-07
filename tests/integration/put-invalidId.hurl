# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`This is a test fragment`

# 2.Server should return a 201
HTTP/1.1 201
[Captures]
url: header "Location"
fragment_id: jsonpath "$.fragment.id"

# 3. authenticated PUT request
PUT {{url}}
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`This is an updated test fragment`

# 4. Server should return a 200
HTTP/1.1 200

# 5. GET updated fragment info with invalid id
GET {{url}}invalid
[BasicAuth]
user1@email.com:password1

# 6. Server should return expected response
HTTP/1.1 404

# 7. GET updated fragment data with valid id
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 8. Confirm that the server returns expected response
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
`This is an updated test fragment`
