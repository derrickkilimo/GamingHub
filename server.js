// server.js
const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt')
app.use(express.json())
const users =[{name:'name'}]


app.get('/users', (req, res )=>{
    res.json(users)
})

app.post('/users', async (req, res)=>{

    try{
        const salt = await bcrypt.genSalt()
        const hashedpassword = await bcrypt.hash(req.body.password, salt)

        const user = {name: req.body.name, password: hashedpassword}
        console.log(salt)
        console.log(hashedpassword)
        users.push(user)
        res.status(201).send()
    } catch{
        res.status(500).send()
    }

})

app.post('/users/login', async (req, res) => {
    const user = users.find((user) => user.name === req.body.name);
    if (user == null) {
      return res.status(400).send('User not found');
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success');
      } else {
        res.send('Not Allowed Here');
      }
    } catch {
      res.status(500).send();
    }
  });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.listen(port, () =>{
    console.log(`Server running on http://localhost:${port}`)
})






























// // Middleware to parse incoming JSON data
// app.use(express.json());

// // Sample user data (for demonstration purposes)
// const users = [
//   { username: 'user1', password: 'password1' },
//   { username: 'user2', password: 'password2' },
//   // Add more users as needed
// ];

// // Route to handle user login
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Check if the provided username and password match any user in the users array
//   const user = users.find((user) => user.username === username && user.password === password);

//   if (user) {
//     // If the user is found, you can add further authentication logic here
//     // For example, generate and send a JWT token for client-side authentication

//     res.json({ message: 'Login successful' });
//   } else {
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });