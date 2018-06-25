### Neighborhood Map Using React

# Table of Contents
* * *

##  Introduction

- Neighborhood Map is a simple web based application which is built using React framework.
- The aim of this project is to display point of interests whatever user likes to see.
- User can view all included landmarks and when selected additional information can be viewed from FOURSQUARE.

## How to use the application

1. Type the place in the filter box/search box which are being displayed and this option is optional.
2.  Click on the locations names directly to view the information, and the information is retrieved from FOURSQUARE API.
3.   User can also directly click on the marker and view the information.
4.   The list of information that are shown in the information window are likes and tips.
5.  The above mentioned are the various ways to view the locations which that are displayed on the web page as my point of interests.

## How to run the application

- Download or the clone the repository  
    -If you wish to clone the repository use the command `git clone git@github.com:bharathparsam/Neighborhood-Map.git`
    - Now Install node modules using command `npm install`.
    - Launch the application using the command `npm start`.
-    A new browser window open automatically displaying the web application.  
-   The app will launch at [http://localhost:3000/](http://localhost:3000/)

>   Note that the application can be cached only when it is being processed in production mode

* * *

## Run the project in production Mode

- Clone the repository
- `npm run build`
- `cd build`
- `python -m http.server 2000`

The app will launch at `http://localhost:2000`
