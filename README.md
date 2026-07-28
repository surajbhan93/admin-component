# admin creditianl

-POST http://localhost:3004/api/admin/create-super-admin

# No body required - Uses .env credentials
# 2. Admin Login

POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "email": "admin@modelingagency.com",
  "password": "Admin@123456"
}

# 3. GET http://localhost:3004/api/admin/profile/me
Authorization: Bearer <token>4. Change Admin Password

# 4. Change Admin Password
PUT http://localhost:5000/api/admin/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Admin@123456",
  "newPassword": "NewAdmin@123456"
}

# 5. Admin Logout
bash
POST http://localhost:5000/api/admin/logout
Authorization: Bearer <token>

- npm install express mongoose dotenv cors helmet express-rate-limit cookie-parser jsonwebtoken bcryptjs nodemon --save-dev
# ✅ Super Admin Creation Flow
Set ADMIN_EMAIL and ADMIN_PASSWORD in the .env file.
Start the server.
Send a POST request to /api/admin/create-super-admin.
The Super Admin account will be created successfully.
Log in using the configured email and password.
