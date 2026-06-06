FROM maven:3.9.5-eclipse-temurin-21-alpine
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
ENTRYPOINT ["java","-jar","target/api-1.0.jar"]
