import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat-container');

let loadInterval;

function loader(element){
  element.textContent ='';
  //if this process will start every 300mili seconds
  loadInterval = setInterval(() =>{
    element.textContent += '.';

    if(element.textContent === '....') {
      element.textContent = '';
      }
  }, 300)
}

//this will send each letter one by one

function typeText(element, text){
  let index = 0;

  let interval = setInterval(() =>{
    if(index <text.length){
      element.innerHTML = text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  },20)
}

//generate unique id for each element by current time and date plus random
function generateUniqueId(){
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `is-${timeStamp}-${hexadecimalString}`;
}
