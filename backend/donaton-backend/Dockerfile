FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Asumiendo que queremos desplegar el ms-gateway por defecto en el puerto 8080
COPY ms-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
