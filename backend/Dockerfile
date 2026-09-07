# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build 
WORKDIR /src

# Copy project file and restore packages
COPY ["CatFacts.Api.csproj", "./"] 
RUN dotnet restore "CatFacts.Api.csproj"

# Copy everything else and build
COPY . . 
RUN dotnet publish "CatFacts.Api.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 
WORKDIR /app 
COPY --from=build /app/publish . 
EXPOSE 8080 
ENTRYPOINT ["dotnet", "CatFacts.Api.dll"]