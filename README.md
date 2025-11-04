# Triptales Redone

## Description
Welcome to **TripTales**! Our social media app allows you to capture your most beautiful vacation moments. Post pictures or videos from your travels, save them, and sort them easily by trip and tag. Share your experiences with others and get inspired by their adventures!

The project is built with **Next.js** for the frontend and **C#** for the backend.

---

## Setup

How much are you expecting to see here.

Make sure to use `node ~24.10.0`, it should be enforced by npm.

If you don't have that version, you can install it via [nvm](https://github.com/nvm-sh/nvm) (my personal favorite).

```
nvm install 24
nvm use 24 
```

Now, with the correct node version:

```
cd ./frontend
npm ci
```

**Changes to _package-lock.json_ and _package.json_ may only be done with a PR!**
(Which you shuld do with every change btw)

## Starting the Application

### Frontend

To start the frontend, run the following command in the terminal:


```
cd ./frontend
npm run dev
```

The frontend will be available by default at [http://localhost:3000](http://localhost:3000).

### Backend

To start the backend server, use the provided script:

Linux:

```
cd ./backend
sh startDevServer.sh
```

Windows:

```
cd ./backend
startDevServer.bat
```

The backend will be available by default at [http://localhost:5001](http://localhost:5001).

To use swagger, go to [http://localhost:5001/swagger/index.html](http://localhost:5001/swagger/index.html).

---

## Technologies
- **Frontend**: Next.js / TailwindCSS / shadcn
- **Backend**: C#

## Troubleshooting

### (Frontend) Styles not loading

This bug might occur whenever tailwind or a CSS package is updated.
Sometimes tailwind gets confused. (everyone can make mistakes, right?)

To fix:
- delete the `node_modules` folder
- run `npm ci`

This should fix it.