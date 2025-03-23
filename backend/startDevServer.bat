:start
dotnet build ProxrealProject.Webapi --no-incremental --force
dotnet watch run -c Debug --project ProxrealProject.Webapi
goto start