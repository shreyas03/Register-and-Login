# Register-and-Login
A web application where the user can register, log in and upload files to the database

I used MongoDB, Express, Node.js, Mongoose, Handlebars, HTML, CSS and Bootstrap in this project.

Initially, the user is directed to the login page where they can signup (if not registered). The user provides their details on the signup page. The details are then stored in the database, where the password of the user is encrypted.

The signup page then redirects to the login page, where the user should provide their credentials. The username is checked against the database, and the password is compared to the encrypted version; if they match, the user is redirected to the homepage.

In the homepage, the user can upload their file. The file will be stored in the directory of the app, and unique binary data to recognise the file is sent to the database, and the user is sent a response that their file has been uploaded successfully.

I used bcrypt to encrypt the password and used jwt and cookie-parser to create tokens and cookies.
