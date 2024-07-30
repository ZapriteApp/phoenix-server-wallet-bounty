## Wallet UI Application

This guide provides instructions for setting up and running the Wallet UI application. The application can be run using Docker and Docker Compose, or directly on your local machine without Docker. Additionally, it includes steps for configuring the application to connect with the Phoenix ACINQ server and daemon.
Prerequisites

# Before you begin, ensure you have the following installed:

    Docker: Install Docker, which includes Docker Compose, from Docker's official website.
    Git: If you need to clone the repository, install Git from Git's official website.
    Phoenix ACINQ Server and Daemon: Ensure that the Phoenix ACINQ server and its daemon are running. The Wallet UI application depends on these services to function properly.

# Creating the .env File

To configure the Wallet UI application with Phoenix ACINQ server details, you need to create a .env file in the root of your project directory.

    Create the .env File

    In your project's root directory, create a file named .env.

    Add Configuration Details

    Open the .env file in a text editor and add the following lines, replacing the placeholders with your actual Phoenix configuration details:

    PHOENIX_API_URL=http://localhost:8080   # URL of the Phoenix ACINQ server
    PHOENIX_HTTP_PASSWORD=your_api_secret_here # API secret for authentication (if required)

    Replace the placeholder values with the actual API URL, key, and secret for your Phoenix ACINQ server.

# Running the Application with Docker

git clone <repository-url>
cd <repository-directory>

# Build and Run the Application

Build the Docker image and start the application using Docker Compose:

css

docker-compose up --build

This command will:

    Build the Docker image as specified in the Dockerfile.

    Start the application in development mode using npm run start:dev.

    Map port 5000 on your host machine to port 5000 in the Docker container.

# Access the Application

Open your web browser and go to: http://localhost:5000

You should see the Wallet UI application running.



# Running the Application Without Docker

If you prefer not to use Docker, you can run the application directly on your local machine. Ensure that Node.js and npm are installed.

# Clone the Repository

git clone <repository-url>

cd <repository-directory>

Install Dependencies

# Install the required dependencies using npm:

npm install

Start the Application

# Run the application in development mode:


npm run start:dev

This command starts the development server and provides live reloading of changes.

## Access the Application

Open your web browser and navigate to: http://localhost:5000

You should see the Wallet UI application running.

# Troubleshooting


Node.js Version: Ensure your Node.js version matches the one specified in the Dockerfile or required by the project.

Port Conflicts: If port 5000 is in use on your machine, adjust the port mapping in docker-compose.yml or choose a different port when running locally.

File Changes Not Reflecting: Verify Docker volumes are correctly configured for live reloading, or check file watchers in your local setup.

Phoenix ACINQ Server and Daemon: Confirm that the Phoenix ACINQ server and daemon are running. The application requires these services to operate correctly.

# Additional Information

Customizing Configuration: Modify the Dockerfile and docker-compose.yml as needed for your specific development or deployment requirements.

Environment Variables: Set necessary environment variables in the .env file or your local environment.

# License

... TBC
