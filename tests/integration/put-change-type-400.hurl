# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`This is a testing fragment`

# 2. Server should return a 201
HTTP/1.1 201
[Captures]
url: header "Location"

# 3. authenticated PUT request
PUT {{url}}
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`## This is an updated test fragment of type markdown`

# 4. Confirm that the server returns a 400
HTTP/1.1 400
