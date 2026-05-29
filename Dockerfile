FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["Checkiski.sln", "./"]
COPY ["Checkiski.WebApi/Checkiski.WebApi.csproj", "Checkiski.WebApi/"]
COPY ["Checkiski.Application/Checkiski.Application.csproj", "Checkiski.Application/"]
COPY ["Checkiski.Domain/Checkiski.Domain.csproj", "Checkiski.Domain/"]
COPY ["Checkiski.Infrastructure/Checkiski.Infrastructure.csproj", "Checkiski.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Checkiski.WebApi/Checkiski.WebApi.csproj"

# Copy the rest of the source code
COPY . .

# Build and publish
WORKDIR "/src/Checkiski.WebApi"
RUN dotnet publish "Checkiski.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port (Render sets PORT env variable, .NET 8/9/10 listens on 8080 by default)
EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080

ENTRYPOINT ["dotnet", "Checkiski.WebApi.dll"]
