FROM postgres:alpine
COPY ./sql/ /docker-entrypoint-initdb.d/
ENV POSTGRES_DB=geodb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
