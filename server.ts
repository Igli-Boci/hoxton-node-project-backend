import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());

const prisma = new PrismaClient();

const SecretCode = process.env.SecretCode!;

const port = 3001;

async function getCurrentUser(token: string) {
  const data = jwt.verify(token, SecretCode);
  const user = await prisma.user.findUnique({
    //@ts-ignore
    where: { id : data.id },
    include: { offers: true },
  });
  return user
}

function getToken(id: number) {
  return jwt.sign({ id: id }, SecretCode, {
    expiresIn: "1 day",
  });
}

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { offers: true },
  });
  res.send(users)
});

app.post("/sign-in", async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (user && bcrypt.compareSync(data.password, user.password)) {
      res.send({ user: user, token: getToken(user.id) });
    } else {
      res
        .status(404)
        .send({ error: "The email/password you entered is wrong!" });
    }
  } catch (error) {
    //@ts-ignore
    res.status(404).send({ error: error.message });
  }
});

app.post("/sign-up", async (req, res) => {
  const data = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    name: req.body.name,
    number: req.body.number,
  };
  try {
    const checkUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (checkUser) {
      res.status(400).send({ error: "This email alredy exists" });
    }
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        number: data.number,
      },
    });

    res.send({ user: user, token: getToken(user.id) });
  } catch (error) {
    //@ts-ignore
    res.status(404).send({ error: error.message });
  }
});

app.get("/validate", async (req, res) => {
  try {
    if (req.headers.authorization) {
      const user = await getCurrentUser(req.headers.authorization);
      //@ts-ignore
      res.send({ user: user, token: getToken(user.id) });
    }
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ error: error.message });
  }
});

app.get("/offers", async (req, res) => {
  try {
    //@ts-ignore
    const user = await getCurrentUser(req.headers.authorization);
    //@ts-ignore
    res.send(user.offers);
  } catch (error) {
    //@ts-ignore
    res.status(400).send({ error: error.message });
  }
});

app.get("/all-offers" , async (req,res) => {
    const offers = await prisma.offer.findMany({})
    res.send(offers)
})

app.listen(port, () => {
  console.log(`App running: http:/localhost:${port}`);
});
