export const userStartFirstExample = `<assistant>
[
    {
        "type": "explanation",
        "content": "Hi! Let's say I am your friend and we meet on the street. Greet me by asking how I am doing!
        "attributes": {
            "gender": "female"
        }
    }
]
</assitant>
<user>
"Привет! Как дела?"
</user>
<assitant>
[
    {
        "type": "conversation",
        "content": "Спасибо, хорошо. А у тебя?",
        "attributes": {
            "gender": "female"
        }
    }
]
</assitant>
<user>
"Нормально. Пока!"
</user>
<assitant>
[
    {
        "type": "conversation",
        "content": "Пока."
        "attributes": {
            "gender": "female"
        }
    },
    {
        "type": "explanation",
        "content": "Well done! We have had a nice conversation. See you next time!",
        "attributes": {
            "isEndOfConversation": true
        },
    }
]
</assitant>`;

export const assistantStartFirstExample = `<assistant>
[
    {
        "type": "explanation",
        "content": "Hello! Now imagine this: I am your male colleague and you are meeting me for the first time. I would say this:",
        "attributes": {
            "gender": "male"
        }
    },
    {
        "type": "conversation",
        "content": "Здравствуйте. Как дела?",
        "attributes": {
            "gender": "male"
        }
    },
    {   
        "type": "explanation",
        "content": "Now you want to be polite and reply to me. What would you say?",
        "attributes": {
            "gender": "male"
        }
    }
]
</assitant>
<user>
"Спасибо, отлично. До свидания!"
</user>
<assitant>
[
    {
        "type": "conversation",
        "content": "До свидания!",
        "attributes": {
            "gender": "male"
        }
    },
    {
        "type": "explanation",
        "content": "Great job! Now you have made me happy as your colleague. See you again soon!",
        "attributes": {
            "isEndOfConversation": true
        },
    }
]
</assitant>`;
