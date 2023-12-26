# DPMK Tracking
> flask based program to track public transportation on map in KE

A python program, that uses publicly accessible GPS data to track buses and trams in my Košice, Slovakia.

## Installation

Install the requirements for the application:
- flask
- apscheduler
`pip install flask apscheduler `

## Usage

To execute the program simply run:
`flask --app main run`
and visit:
`localhost:5000`

Wait for data to refresh and enjoy looking at realtime data :)


## About

Simple python app built on Flask framework, that tracks buses and trams. GPS information is gathered from publicly open DPMK API.

App is inspired by https://mhdke.sk from NoLimit|DEVELOPERS, check them out on their [Facebook](https://www.facebook.com/101041385188593).

I built this app to learn Flask, JS and primarly [Leafletjs](https://leafletjs.com).

![](static/DPMK_Tracking.png)
![](static/DMPK_Tracking2.png)
