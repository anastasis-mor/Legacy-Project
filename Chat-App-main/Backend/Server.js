const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const main = require('./config/connection');

const chatRouter = require('./routers/chatRouters');
const userRouter = require('./routers/userRouters');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/chat", chatRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});