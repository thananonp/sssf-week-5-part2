'use strict';

window.addEventListener('load', async () => {
    const ul = document.querySelector('ul');
    const refresh = document.querySelector('#refresh');
    const form = document.querySelector('form');
    const username = 'thananonp';
    const greeting = form.elements.greeting;
    // console.log('hello');

    // if ("serviceWorker" in navigator) {
    //     try {
    //         await navigator.serviceWorker.register("./sw.js");
    //         const registraton = await navigator.serviceWorker.ready;
    //         if ("sync" in registraton) {
    //             form.addEventListener("submit", async (event) => {
    //                 event.preventDefault();
    //                 const message = {
    //                     username,
    //                     greeting: greeting.value,
    //                 };
    //                 try {
    //                     saveChatData("outbox", message);
    //                     await registraton.sync.register("send-message");
    //                 } catch (e) {
    //                     console.error(e.message);
    //                 }
    //             });
    //         }
    //     } catch (e) {
    //         console.error(e.message);
    //     }
    // }
    if (navigator.serviceWorker) {
        try {
            await navigator.serviceWorker.register('./sw.js')
            const register = await navigator.serviceWorker.ready
            if (register.sync) {
                form.addEventListener("submit", async (event) => {
                    event.preventDefault();
                    const message = {
                        username,
                        greeting: greeting.value,
                    };
                    console.log("message",message)
                    try {
                        await saveChatData("outbox", message);
                        await register.sync.register("send-message");
                    } catch (e) {
                        console.error(e.message);
                    } finally {

                        await init()
                    }
                });
            }
        } catch (e) {
            console.error("Error", e)
        }
    }


    const init = async () => {
        const data = [];
        try {
            const greetings = await getGreetingsByUser(username);
            for (const message of greetings) {
                data.push(message);
            }
            ul.innerHTML = '';
            data.forEach(item => {
                ul.innerHTML += `<ul>${item.username}: ${item.greeting}</ul>`;
            });
        } catch (e) {
            console.log(e.message);
        }


    };

    await init()

    refresh.addEventListener('click', init);
});
