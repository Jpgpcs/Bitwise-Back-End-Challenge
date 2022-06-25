# Bitwise-Back-End-Challenge

CRUD Restful API with data mapping from GitHub API, authentication and automated tests

This API does:

-Perform the user registration
  A endpoint to register the user with the entity information below and get a token to access others routes

-Perform the user registration with GitHub
  A endpoint to register the user passing only the GitHub username ( mapping data from GitHub API to this API ) and get a token to access others routes

-Perform the user login
  A endpoint to login the user and get a token to access others routes

-Perform user data update
  A endpoint to update user data

-Consult registered data in the database
  A endpoint to consult user data and get data mapped from the GitHub API: followers quantity, following quantity, public repository quantity and public url to this user profile in GitHub

-Delete user
  A endpoint to delete the user
  
The entity:

- username
- name
- lastName
- profileImageUrl
- bio
- email
- gender

Made this project to study:

-NodeJs

-Express

-MongoDB

-JWT

-Jest

The project is hosted in heroku

The documentation was made in swagger

API Documentation link: https://crud-restfull-api-bitwise.herokuapp.com/
