# fragments
Welcome to the fragments project. If you want to get the project setup here are some important scripts you want to know about

### How to start the server
- You can start the sever using Node.js. just run the command:
```node /src/server.js```

- Alternatively, another you can start the server normally is using the start script. Just you the command:
```npm start```

- For additional convenience, you can use the dev command. It runs the server via nodemon watching over the src/ folder for any changes. As soon as a change is observed the server is restarted to observe the changes in the server.The command is:
```npm run dev```

### Debugging
- Ideal for debugging you can use the following command which is the same as the dev command but it starts the node inspector on port `9229` enabling a debugger to be attached. 

### Code Quality Check
- A convenient way to check your code for any obvious mistakes is to run the following command. It provides a list of issues and visual indicators to spot them.
```npm run lint```
