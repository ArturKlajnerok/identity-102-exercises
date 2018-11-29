By doing `app.use(auth())` you are requiring authentication in every route.

The purpose of this exercise is to allow the user to request the homepage even if they are not logged in yet.

You need the `.env` file as in the previous exercise.

Change the `require` statement to import the `requiresAuth` middleware:

```javascript
const { auth, requiresAuth } = require('express-openid-connect');
```

Also, remove the `app.use(auth())` line from server.js and change the `/user` route to this:

```javascript
app.get('/user', requiresAuth(), (req, res) => {
  res.render('user', { user: req.session.user });
});
```

In addition we will change the `views/home.ejs` file to show a login or logout link depending in the state of the session:

```html
<h1>Home Page</h1>
<% if(locals.user) {%>
  <p>Hello <%= user.nickname %></p>
  <a href="/logout">Logout</a>
<% } else { %>
  <a href="/login">Login</a>
<% } %>
```

Start the application and open the browser in http://localhost:3000. Verify the home page looks different depending if you are logged in or not.
