rd /S /Q .vs 2> nul
rd /S /Q ProxrealProject.Application/.vs 2> nul
rd /S /Q ProxrealProject.Application/bin 2> nul
rd /S /Q ProxrealProject.Application/obj 2> nul
rd /S /Q ProxrealProject.Webapi/.vs 2> nul
rd /S /Q ProxrealProject.Webapi/bin 2> nul
rd /S /Q ProxrealProject.Webapi/obj 2> nul


cd ProxrealProject.Webapi
:start
dotnet watch run -c Debug
goto start