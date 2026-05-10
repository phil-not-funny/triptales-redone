# Build container - .NET 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG CERT_PASSWORD
WORKDIR /src

# Optimiert: Nur relevante Projektdateien kopieren
COPY TripTales.Application/ TripTales.Application/
COPY TripTales.Webapi/     TripTales.Webapi/

# Restore + Build + Publish
WORKDIR /src/TripTales.Webapi
RUN mkdir -p /https && dotnet dev-certs https -ep /https/aspnetapp.pfx -p ${CERT_PASSWORD}
RUN dotnet dev-certs https --trust
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Final container - .NET 8 Runtime (Alpine für kleineres Image!)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app

# Ports (optional: entferne EXPOSE wenn du's im Docker Compose regelst)
EXPOSE 80
EXPOSE 443

RUN mkdir -p /https

COPY --from=build /app/publish .
COPY --from=build /https/aspnetapp.pfx /https/aspnetapp.pfx

# Sauberer ENTRYPOINT
ENTRYPOINT ["dotnet", "Triptales.Webapi.dll"]
