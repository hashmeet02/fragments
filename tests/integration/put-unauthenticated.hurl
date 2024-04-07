# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This is a test fragment`

# 2. Confirm that the server returns a 201
HTTP/1.1 201
[Captures]
url: header "Location"

# 3. Unauthenticated PUT request
PUT {{url}}
```This is an updated test fragment```

# 4. Confirm that the server returns a 401
HTTP/1.1 401
