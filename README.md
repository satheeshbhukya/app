# Fastify Prisma Contact Management App

## Description

This application is a Fastify web service that manages customer contact information using Prisma as the ORM for a PostgreSQL database. It provides an endpoint to consolidate contact information for customers.

## Features

- Fastify framework for building the web service
- Prisma for database management
- RESTful API endpoint `/identify` for handling customer contact information

## Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL database
- npm (Node package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/satheeshbhukya/app.git
   cd app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   Create a `.env` file in the root directory and add your database URL:

   ```plaintext
   DATABASE_URL=your_postgresql_database_url
   ```

4. Run Prisma migrations:

   ```bash
   npm run prisma:migrate
   ```

## Running the Application

To start the application, run:

```bash
npm start
```

The server will start, and you can access the API at `http://localhost:3000`.

## API Usage

### Example Requests and Responses

1. **Request**: `{ email: 'mcfly@hillvalley.edu', phoneNumber: '123456' }`
   - **Response**:
   ```json
   {
     "contact": {
       "primaryContatctId": 1,
       "emails": [
         "mcfly@hillvalley.edu"
       ],
       "phoneNumbers": [
         "123456"
       ],
       "secondaryContactIds": []
     }
   }
   ```

2. **Request**: `{ email: 'lorraine@hillvalley.edu', phoneNumber: null }`
   - **Response**:
   ```json
   {
     "contact": {
       "primaryContatctId": 2,
       "emails": [
         "lorraine@hillvalley.edu"
       ],
       "phoneNumbers": [],
       "secondaryContactIds": []
     }
   }
   ```

3. **Request**: `{ email: null, phoneNumber: '123456' }`
   - **Response**:
   ```json
   {
     "contact": {
       "primaryContatctId": 1,
       "emails": [
         "mcfly@hillvalley.edu"
       ],
       "phoneNumbers": [
         "123456"
       ],
       "secondaryContactIds": []
     }
   }
   ```

4. **Request**: `{ email: 'biffsucks@hillvalley.edu', phoneNumber: '717171' }`
   - **Response**:
   ```json
   {
     "contact": {
       "primaryContatctId": 3,
       "emails": [
         "biffsucks@hillvalley.edu",
         "george@hillvalley.edu"
       ],
       "phoneNumbers": [
         "717171"
       ],
       "secondaryContactIds": [
         6
       ]
     }
   }
   ```

5. **Request**: `{ email: 'george@hillvalley.edu', phoneNumber: '717171' }`
   - **Response**:
   ```json
   {
     "contact": {
       "primaryContatctId": 3,
       "emails": [
         "biffsucks@hillvalley.edu",
         "george@hillvalley.edu"
       ],
       "phoneNumbers": [
         "717171"
       ],
       "secondaryContactIds": [
         6
       ]
     }
   }
   ```

6. **Request**: `{ email: null, phoneNumber: null }`
   - **Response**:
   ```json
   {
     "error": "At least one of email or phoneNumber is required."
   }
   ```

## Deployment

To deploy the application, run:

```bash
npm run build
```

Then follow your deployment platform's instructions to deploy the contents of the `build` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
