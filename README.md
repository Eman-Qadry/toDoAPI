Clone the repository:
git clone https://github.com/Eman-Qadry/toDoAPI.git
cd todoapi
-Install dependencies:
=npm install

Set up MongoDB:
Make sure you have MongoDB installed and running on your machine.

Create a .env file in the root directory of the project and configure the necessary environment variables.
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/todoapi

# Port on which the server will run
PORT=4000

# JWT secret key for authentication
JWT_SECRET=your_jwt_secret

# JWT expiration time (e.g., 1h, 2d)
JWT_EXPIRES=1h
API Endpoints
The API provides the following endpoints:

Authentication
POST /api/auth/signup
Register a new user.
Request body: { "name": "eman ", "age":"18", "address":"assuit",email": "johndoe@example.com", "password": "password123" }

POST /api/auth/login
Log in a user.
Request body: { "email": "johndoe@example.com", "password": "password123" }
POST /api/auth/forgotpassword
create new paasword if forgot your paasword
Request body: { "email": "johndoe@example.com" }

PUT /api/auth//users/profile
edit user information
POST /api/auth//users/password
recreat your password
Request body: { "oldpassword": "pawword12","newpassword":"passwordnow" }



Todos
GET /api/todos

Get all todos for the authenticated user.
Headers: Authorization: Bearer <token>

POST /api/tasks
Create a new todo.
Request body: { "title": "New Todo", "description": "This is a new todo" }
Headers: Authorization: Bearer <token>

GET /api/tasks/:id
Get a single todo by ID.
Headers: Authorization: Bearer <token>

PATCH /api/tasks/:id
Update a todo by ID.
Request body: { "title": "Updated Title", "description": "Updated description" ,"startdate":"start day","endDate":"end day","priority":"high-low-medium"}
Headers: Authorization: Bearer <token>

DELETE /api/tasks/:id

Delete a todo by ID.
Headers: Authorization: Bearer <token>
