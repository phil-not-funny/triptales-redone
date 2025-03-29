#!/bin/sh

rm -rf .vs
rm -rf ProxrealProject.Application/.vs
rm -rf ProxrealProject.Application/bin
rm -rf ProxrealProject.Application/obj
rm -rf ProxrealProject.Webapi/.vs
rm -rf ProxrealProject.Webapi/bin
rm -rf ProxrealProject.Webapi/obj


cd ProxrealProject.Webapi
dotnet watch run -c Debug
