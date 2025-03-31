#!/bin/sh

rm -rf .vs
rm -rf TripTales.Application/.vs
rm -rf TripTales.Application/bin
rm -rf TripTales.Application/obj
rm -rf TripTales.Webapi/.vs
rm -rf TripTales.Webapi/bin
rm -rf TripTales.Webapi/obj


cd TripTales.Webapi
dotnet watch run -c Debug
