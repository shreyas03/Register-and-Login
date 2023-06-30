# User Post and View
A web application where the user can register, log in, post and view images 

I used MongoDB, Express, Node.js, Mongoose, Handlebars, HTML, CSS and Bootstrap in this project.

Initially, the user is directed to the login page where they can signup (if not registered). The user provides their details on the signup page. The details are then stored in the database, where the password of the user is encrypted.

The signup page then redirects to the login page, where the user should provide their credentials. The username is checked against the database, and the password is compared to the encrypted version; if they match, a cookie is created to store the user data, and the user is sent to the homepage.

The homepage has two main actions a user can perform, post or view.

If the user selects "post", they will be authenticated using the auth middleware, which verifies the user token from the cookie. Then, the user is sent to the upload page where they can upload an image (less than 10MB in size) along with a title and a description. The data of the image is converted into buffer data and is stored in the database along with the name and description. The entry in the database will be referenced to the user collection to add their ID to the entry. The image itself will be stored on local storage with a unique name.

If the user selects "view", they will be authenticated by the auth middleware. The user ID is obtained, and a search is run through the collection to find images uploaded by the user. The file name is retrieved, and the file itself is retrieved from the local storage and displayed on the webpage.

Every time a user is redirected, their ID is sent as a URL parameter to increase render times. So, every time an API is called which involves authentication, the URL parameters are checked first and then the cookie is checked for the token.

The user can also navigate to the homepage or log out from any page in the application.

When a user is logged out, the cookie is cleared of their unique token to avoid anyone stealing the token and using the user's identity for authentication.

This project has been deployed at: https://post-w9o7.onrender.com
