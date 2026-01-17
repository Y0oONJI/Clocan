# Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app/backend

# Copy Gradle wrapper and configuration files
COPY backend/gradlew .
COPY backend/gradle ./gradle
COPY backend/build.gradle .
COPY backend/settings.gradle .
COPY backend/gradle.properties* ./

# Make gradlew executable
RUN chmod +x ./gradlew

# Copy source code
COPY backend/src ./src

# Build the application (Cloud Type 자동 빌드 방지)
RUN ./gradlew clean bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/backend/build/libs/*.jar app.jar

# Expose the port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

