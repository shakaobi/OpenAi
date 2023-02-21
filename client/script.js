import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element){
  if(element){
    element.textContent = ''
    //if this process will start every 300mili seconds
    loadInterval = setInterval(() =>{
      element.textContent += '.';

      if(element.textContext === '....') {
        element.textContent = '';
        }
    }, 300)
  }
}

//this will send each letter one by one

function typeText(element, text){
  let index = 0;

  let interval = setInterval(() =>{
    if(index < text.length){
      element.innerHTML += text.charAt(index);
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

  return `id-${timeStamp}-${hexadecimalString}`;
}
// function to differentiate between ai and user
function chatStripe(isAi, value, uniqueId){
  return(
    `
    <div class='wrapper ${isAi && 'ai'}'>
      <div class='chat'>
          <div class='profile'>
            <img
              src=${isAi ? bot: user}
              alt='${isAi ? 'bot': 'user'}'
            />
          </div>
        
        </div class='message' id=${uniqueId}>${value}</div>
      </div>
    </div>
    
  `
  )
}

//triggering the ai response
const handleSubmit = async(e)=>{
  e.preventDefault();
  const data = new FormData(form);
  //user chatstripe
  
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  
  // clear the form after it is typed
  form.reset();

  //make a chatstripe for the ai and make a unique id
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '', uniqueId);

  //make sure the page continuously scrolls as ai is typing
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  //turn on loader
  loader(messageDiv)
  //fetch data from server
  ///Another function after server for API calls
  const response = await fetch('http://localhost:5000',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  clearInterval(loadInterval)
  // empty string to await ....
  if(messageDiv){
    messageDiv.innerHTML = '';
    // parse data from backend after checking
    if(response.ok) {
      const data = await response.json();
      const parseData = data.bit.trim();
      console.log(parseData, "HERE")
      typeText(messageDiv, parseData)
    }else{
      const err = await response.text();
      messageDiv.innerHTML = 'Something went wrong'
      alert(err);
    }
  }
  


  // Another function for API response
}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup',(e)=>{
  if(e.key === 13){
    handleSubmit(e)
  }
})