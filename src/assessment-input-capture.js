const key='healthtech-assessment-inputs';
function load(){try{return JSON.parse(sessionStorage.getItem(key)||'{}')}catch{return{}}}
function save(title,value){if(!title||!value)return;const data=load();data[title]=value;sessionStorage.setItem(key,JSON.stringify(data))}
document.addEventListener('click',e=>{const b=e.target.closest('.question-screen .choice');if(!b)return;const q=document.querySelector('.question-screen h1');save(q?.textContent.trim(),b.querySelector('span')?.textContent.trim()||b.textContent.trim())},true);
document.addEventListener('change',e=>{if(!e.target.matches('.question-screen select'))return;const q=document.querySelector('.question-screen h1');save(q?.textContent.trim(),e.target.value)},true);
