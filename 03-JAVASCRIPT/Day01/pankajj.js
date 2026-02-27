// 1. Ask the user for their name
let userName = prompt("What is your name?");

// 2. Check if they actually typed something
if (userName) {
    // 3. Change the entire webpage background and text
    document.body.innerHTML = `<h1>Hello, ${userName}!</h1><p>You just hijacked this website with one line of code.</p>`;
    document.body.style.backgroundColor = "rebeccapurple";
    document.body.style.color = "white";
    document.body.style.textAlign = "center";
    document.body.style.paddingTop = "100px";
}