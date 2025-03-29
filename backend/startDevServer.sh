#!/bin/sh

dotnet build ProxrealProject.Webapi --no-incremental --force
dotnet watch run -c Debug --project ProxrealProject.Webapi
