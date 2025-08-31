# Language partner

This app helps you to practice a set of conversations with an AI person, because who wants to practice boring conversations with you again and again?
Beware, this app is dumb, do not expect too much, but you will get the practice you need.

## Installation

- Make sure you have Node JS installed. The easiest way is via [nvm](https://github.com/nvm-sh/nvm).
- After installing `nvm`, run `nvm install` in the project root directory to install the correct node version.
- Then run `npm install` at the root directory to install all dependencies.
- You need to use your own OpenAI API key that has credits in it. Follow the instructions from the [OpenAI docs](https://platform.openai.com/docs/libraries) to export your API keys in your environment.
- Change the config of the app at [config.ts](api/config.ts) to suit your needs, most importantly the language you want to learn.

## Starting the app

In two different terminals:

```
# First terminal
cd ui
npm run dev
# Second terminal
cd api
npm run start
```

## How to use the UI

- You create a group of conversations called **lessons**. Each conversation in a lesson needs to be separated with a blank line in between. For example, for two conversations:

```
Hi! How are you?
I am fine thanks! And you?
I am good too.

Hi! What's your name?
My name is Alan. What's your name?
My name is Nancy.
```

- Then pick the lessons you want to practice in this session by ticking the checkboxes. A random conversation will be drawn from the lessons you have picked. Have fun!
