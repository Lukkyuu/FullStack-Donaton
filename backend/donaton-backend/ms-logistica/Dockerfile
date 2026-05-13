FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
ARG JAR_FILE=target/ms-logistica-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
