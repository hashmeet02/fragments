# Health Check Test
GET http://localhost:8080/wrong-route

# We should get back an HTTP 1.1 200 response
HTTP/1.1 404
