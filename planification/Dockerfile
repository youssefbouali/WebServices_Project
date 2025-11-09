# Étape 1 : Build avec Maven + JDK 21
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image runtime légère avec JRE 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# COPIE LE JAR DEPUIS LE STAGE 'build'
COPY --from=build /app/target/planification-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]