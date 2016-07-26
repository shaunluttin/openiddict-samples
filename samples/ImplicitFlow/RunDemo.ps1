

# Authorization Server
Push-Location "./AuthorizationServer"
dotnet restore
dotnet build --no-incremental #rebuild

Pop-Location
Start-Process dotnet -ArgumentList "run" -WorkingDirectory "./AuthorizationServer"

# Aurelia Application
Push-Location "./AureliaApp"
npm install -y
typings install -y

Pop-Location
Start-Process au -ArgumentList "run" -WorkingDirectory "./AureliaApp"