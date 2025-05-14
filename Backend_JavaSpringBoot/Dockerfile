# STAGE 1 : BUILD
FROM eclipse-temurin:23.0.2_7-jdk-alpine AS build
WORKDIR /opt/app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ["./mvnw", "dependency:go-offline"]
COPY ./src ./src
RUN ["./mvnw", "clean", "install"]

# STAGE 2 : APP FINALE
FROM eclipse-temurin:23.0.2_7-jre-alpine AS final
WORKDIR /opt/app
EXPOSE 8181
COPY --from=build /opt/app/target/*.jar /opt/app/*.jar
ENTRYPOINT ["java", "-jar", "/opt/app/*.jar"]