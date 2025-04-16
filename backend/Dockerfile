# Build container - .NET 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Optimiert: Nur relevante Projektdateien kopieren
COPY TripTales.Application/ TripTales.Application/
COPY TripTales.Webapi/     TripTales.Webapi/

# Restore + Build + Publish
WORKDIR /src/TripTales.Webapi
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Final container - .NET 8 Runtime (Alpine für kleineres Image!)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app

# Ports (optional: entferne EXPOSE wenn du's im Docker Compose regelst)
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .

# Sauberer ENTRYPOINT
ENTRYPOINT ["dotnet", "Triptales.Webapi.dll"]
