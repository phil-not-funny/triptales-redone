:start
dotnet build TripTales.Webapi --no-incremental --force
dotnet watch run -c Debug --project TripTales.Webapi
goto start