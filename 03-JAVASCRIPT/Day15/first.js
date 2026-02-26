// function handleClick(){
//     const element = document.getElementById("first");
//     element.textContent = "Strike is Coming";
// }


const element = document.getElementById("first");
// element.onclick = function handleClick(){
// //    element.textContent = "Strike is Coming";
//     element.style.backgroundColor="pink";
// }

// element.onclick = function handleClick(){
//    element.textContent = "I am the best";
// }

// element.addEventListener('click',()=>{
//     element.textContent = "Strike is Coming";
// })

// element.addEventListener('click',()=>{
//     element.style.backgroundColor="brown";
// })

// const child1 = document.getElementById("child1");
// child1.addEventListener('click',()=>{
//     child1.textContent = "I am clicked";
// })

const parent = document.getElementById("parent");
// console.log(parent.children);

function handleClick(e){
   e.target.textContent = "I am Clicked";
   parent.removeEventListener('click',handleClick);
}

parent.addEventListener('click',handleClick)





// for(let child of parent.children){
//     console.log(child);
//     child.addEventListener('click',()=>{
//         child.textContent = "I am Clicked";
//     })
// }

// const grandparent = document.getElementById("grandparent");
// grandparent.addEventListener('click',(e)=>{
//     console.log(e.target);
//     // console.log("GrandParent is clicked");
// })

// const parent = document.getElementById("parent");
// parent.addEventListener('click',(e)=>{
//     // console.log(e);
//     // console.log("Parent is clicked");
// })

// const child = document.getElementById("child");
// child.addEventListener('click',(e)=>{
//     // console.log(e);
//     // e.stopPropagation();
//     // console.log("child is clicked");
// })

// capture phase on hai: Top se down aaoge: Us time pe event ko trigger kar diya jaayega
// capture phase off hai: Event hai usko down to up(Bubbling phase bolte hai, tab trigger kiya jaayega)


