# Text reuse project repository

This the repository for the text reuse project. It consists of a React and Flask application.

### Requirements

1. Install [Docker](https://docs.docker.com/install/) on your computer
2. Install [Docker-compose](https://docs.docker.com/compose/install/)

Most likely you will also want to:

3. Install [Node](https://nodejs.org/en/download/)
4. Install [Yarn](https://yarnpkg.com/en/docs/install)
5. Run `yarn install` in `frontend`

### Running the application

To run the application, go to the root folder and execute
```
docker-compose up --build
```

Or you can go separately to the `frontend` and `backend` folders and `run yarn` and `yarn start` in both of them. Might be easier both should work.

You might need to add the root folder to Docker in: ` Docker -> Preferences -> File sharing`

After running this command, the UI should be running at `localhost:3000`, graphql API at `localhost:8000`, database should be remote.
