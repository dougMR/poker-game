//////////////////////////
// Modal Prompts Stuff
//////////////////////////

const showPrompt = (message, callback, showTextInput) => {
    // !! Doesn't need to be async.  Promise doesn't hold up execution of the caller
    // promptDialog.classList.remove("hidden");
    console.log("prompt()");
    promptDialog.showModal(); //.show()
    // promptDialog.querySelector(".ok").focus();
    setTimeout(() => {
        promptDialog.focus();
    }, 10);
    if (showTextInput) {
        promptDialog.querySelector(".answer").classList.remove("hidden");
    } else {
        promptDialog.querySelector(".answer").classList.add("hidden");
    }
    promptDialog.querySelector(".message").textContent = message;
    promptDialog.callback = callback;
    // const confirm = () => {
    //     return new Promise((resolve) => {
    //         promptDialog.addEventListener("close", () => {
    //             resolve(promptDialog.returnValue);
    //         });
    //     });
    // };
    // return await confirm();
};

const handlePrompt = (event) => {
    console.log("handlePrompt()");
    if (promptDialog.callback) {
        if (
            !promptDialog.querySelector(".answer").classList.contains("hidden")
        ) {
            // console.log('callback with argument',promptDialog.querySelector(".answer").value)
            promptDialog.callback(promptDialog.querySelector(".answer").value);
        } else {
            // console.log('callback without argument')
            promptDialog.callback();
        }
    }

    // resolve(true);
    promptDialog.returnValue = true;
    // promptDialog.classList.add("hidden");
    promptDialog.close();
};

const promptDialog = document.getElementById("prompt-modal");

// OK
promptDialog
    .querySelector("button.ok")
    .addEventListener("pointerdown", handlePrompt);

// Cancel
promptDialog
    .querySelector("button.cancel")
    .addEventListener("pointerdown", () => {
        // resolve(false);
        promptDialog.returnValue = false;
        promptDialog.close();
    });

promptDialog.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        promptDialog
            .querySelector(".ok")
            .dispatchEvent(new PointerEvent("pointerdown"));
    }
});

export { showPrompt };

// function confirm(message) {
//     // Create the confirm dialog.
//     const dialog = document.createElement("dialog");
//     dialog.classList.add("confirm");

//     // Create the confirm message.
//     const messageElement = document.createElement("div");
//     messageElement.textContent = message;

//     // Create the confirm buttons.
//     const okButton = document.createElement("button");
//     okButton.textContent = "OK";
//     okButton.addEventListener("click", () => {
//         dialog.close();
//         // resolve(true);
//         promptDialog.returnValue = true;
//     });

//     const cancelButton = document.createElement("button");
//     cancelButton.textContent = "Cancel";
//     cancelButton.addEventListener("click", () => {
//         dialog.close();
//         // resolve(false);
//         promptDialog.returnValue = false;
//     });

//     // Add the message and buttons to the dialog.
//     dialog.appendChild(messageElement);
//     dialog.appendChild(okButton);
//     dialog.appendChild(cancelButton);

//     // Show the dialog.
//     dialog.showModal();

//     // Return a promise that resolves to the user's choice.
//     return new Promise((resolve) => {
//         dialog.addEventListener("close", () => {
//             resolve(dialog.returnValue);
//         });
//     });
// }
