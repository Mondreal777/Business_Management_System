# ⚙️ Server for Business Management System

This is the server-side application for the Business Management System, built with Node.js and Express.js. It handles API requests, user authentication, and database interactions.

## 🚀 Features
- **RESTful API**: Provides endpoints for managing inventory, customers, orders, and reports.
- **User Authentication**: Secure token-based authentication using JSON Web Tokens (JWT).
- **Database Interaction**: Connects to MySQL Workbench for data storage and retrieval.

## 🛠️ Technologies
- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework for building APIs.
- **MySQL**: NoSQL database for storing data.
- **JSON Web Tokens (JWT)**: For secure authentication.

## 📦 Installation

To run the server-side application locally, follow these steps:

1. **Navigate to the server directory**:
    ```bash
    cd server
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Configure Environment Variables**:
    Create a `.env` file in the `server` directory with the following content:
    ```
    environment=development
    productionMode=false

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=root
    DB_NAME=online_pos
    DB_PORT=3306
    TIMEZONE=utc

    SERVER_NAME=http://localhost:8085
    ```

4. **Run the server**:
    ```bash
    npm run dev
    ```

5. **Access the API**:
    The server will be running at `http://localhost:8085`.

## 📝 Usage
- The server exposes various endpoints to handle requests from the client.
- Refer to the API documentation (if available) for detailed usage instructions.

## 🤝 Contributing
Contributions are welcome! Please follow the same steps as outlined in the main project README for contributing.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact
For any questions or feedback, please reach out to:
- **Earlmond Ross** - [mondreal777](https://github.com/Mondreal777)
