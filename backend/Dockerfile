FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN ./mvnw clean install

FROM openjdk:17-jdk

COPY --from=build /app/target/helloworld-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT [ "java", "-jar", "/app.jar" ]
