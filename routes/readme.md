# Assignment for Backend Developer Intern # 


## Project Overview

This project is a **Node.js** application that provides a **REST API** for managing users and admins in an assignment system. It uses **MongoDB** for data storage and integrates **JWT-based authentication** for securing routes. Additionally, **bcrypt** is used for password hashing, and **Zod** is used for input validation.

The application has two primary modules:

- **User module**: For users to register, login, upload assignments, and interact with the system.
- **Admin module**: For admins to register, login, view assignments, accept, or reject tasks.

### Key Features:
- **User registration and login** with hashed passwords using `bcrypt`.
- **JWT-based authentication** for secure login and token validation.
- **Admin role-based access** to view and manage assignments.
- **Assignment management** for admins to accept or reject tasks.
- **Input validation** using the `Zod` library to ensure the correct data format.

## Project Structure


## Installation

### Prerequisites

- Node.js >= 14.x
- MongoDB

### Steps to Install

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-folder>


