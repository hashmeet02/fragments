# # Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# Sending a plain text fragment
Content-Type: multipart/form-data; boundary=something
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# 1. We expect to get back an HTTP 415
HTTP/1.1 415

