
# Community Solar Backend

This is the Spring Boot backend for the Community Solar Platform.

## Overview

This backend provides RESTful API endpoints for the Community Solar Platform, including:

- User authentication and profile management
- Provider registration and management
- Community creation and joining
- Solar data collection and plan generation
- Installation tracking
- Energy monitoring and reporting

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven
- PostgreSQL (for production) or H2 (for development)

### Running the Application

1. Clone this repository
2. Navigate to the project directory
3. Run the following command:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`.

### Development Environment

For development, the application uses an in-memory H2 database. You can access the H2 console at `http://localhost:8080/api/h2-console` with these credentials:

- JDBC URL: `jdbc:h2:mem:communitysolardb`
- Username: `sa`
- Password: `password`

### API Documentation

The API provides the following main endpoints:

- `/auth/**` - Authentication endpoints (signup, login, profile)
- `/providers/**` - Provider management
- `/communities/**` - Community management
- `/data/**` - Data collection and solar potential assessment
- `/plans/**` - Solar plan generation
- `/installations/**` - Installation tracking
- `/monitoring/**` - Energy monitoring and reporting

## Production Deployment

For production deployment:

1. Update the `application.properties` file with your production database credentials
2. Set the appropriate JWT secret key
3. Configure CORS settings for your production domain
4. Build the application with:

```bash
mvn clean package
```

5. Run the JAR file:

```bash
java -jar target/community-solar-backend-0.0.1-SNAPSHOT.jar
```

## Security

The application uses JWT for authentication. A JWT token is returned on successful login, which should be included in the `Authorization` header for subsequent API calls.

## Database Schema

The database schema includes the following main entities:

- Users and Roles
- Providers and Reviews
- Communities and Community Members
- Addresses and Solar Plans
- Installations and Milestones
- Payments
- Energy Data

## Technologies Used

- Spring Boot 3.2.3
- Spring Security with JWT
- Spring Data JPA
- H2 Database (development)
- PostgreSQL (production)
- JUnit and Mockito for testing

## License

This project is licensed under the MIT License.
