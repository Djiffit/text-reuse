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

You might need to add the root folder to Docker in: ` Docker -> Preferences -> File sharing`

After running this command, the UI should be running at `localhost:3000`, database running at `bolt://localhost:7687` with UI access at `http://localhost:7474/` using credentials `neo4j:test` and the API at `localhost:5000`