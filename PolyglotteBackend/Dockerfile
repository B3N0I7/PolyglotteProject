# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["Polyglotte.API/Polyglotte.API.csproj", "Polyglotte.API/"]
COPY ["Polyglotte.Application/Polyglotte.Application.csproj", "Polyglotte.Application/"]
COPY ["Polyglotte.Domain/Polyglotte.Domain.csproj", "Polyglotte.Domain/"]
COPY ["Polyglotte.Infrastructure/Polyglotte.Infrastructure.csproj", "Polyglotte.Infrastructure/"]

# Restore dependencies
RUN dotnet restore Polyglotte.API/Polyglotte.API.csproj
RUN dotnet restore Polyglotte.Application/Polyglotte.Application.csproj
RUN dotnet restore Polyglotte.Domain/Polyglotte.Domain.csproj
RUN dotnet restore Polyglotte.Infrastructure/Polyglotte.Infrastructure.csproj

# Copy all source code
COPY Polyglotte.API/ Polyglotte.API/
COPY Polyglotte.Application/ Polyglotte.Application/
COPY Polyglotte.Domain/ Polyglotte.Domain/
COPY Polyglotte.Infrastructure/ Polyglotte.Infrastructure/

# Build
RUN dotnet build "Polyglotte.API/Polyglotte.API.csproj" -c Release -o /app/build
RUN dotnet build "Polyglotte.Application/Polyglotte.Application.csproj" -c Release -o /app/build
RUN dotnet build "Polyglotte.Domain/Polyglotte.Domain.csproj" -c Release -o /app/build
RUN dotnet build "Polyglotte.Infrastructure/Polyglotte.Infrastructure.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Polyglotte.API/Polyglotte.API.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .

# Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:5236/health || exit 1

EXPOSE 5236

ENTRYPOINT ["dotnet", "Polyglotte.API.dll"]
