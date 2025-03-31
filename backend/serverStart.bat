rd /S /Q .vs 2> nul
rd /S /Q TripTales.Application/.vs 2> nul
rd /S /Q TripTales.Application/bin 2> nul
rd /S /Q TripTales.Application/obj 2> nul
rd /S /Q TripTales.Webapi/.vs 2> nul
rd /S /Q TripTales.Webapi/bin 2> nul
rd /S /Q TripTales.Webapi/obj 2> nul


cd TripTales.Webapi
:start
dotnet watch run -c Debug
goto start