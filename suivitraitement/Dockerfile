# Étape 1 : Construire l’application
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copier le code source et le fichier Maven
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

# Compiler et générer le jar
RUN mvn clean package -DskipTests

# Étape 2 : Image d’exécution
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copier le jar généré depuis l’étape précédente
COPY --from=build /app/target/*.jar app.jar

# Exposer le port 8002
EXPOSE 8002

# Démarrer l’application
ENTRYPOINT ["java", "-jar", "app.jar"]
