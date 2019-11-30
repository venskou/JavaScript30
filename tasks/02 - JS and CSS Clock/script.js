const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

function setDate() {
  const now = new Date();

  const seconds = now.getSeconds();
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  if (secondsDegrees === 90) secondHand.style.transition = 'all 0s';
  else secondHand.style.transition = 'all 0.05s';
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

  const mins = now.getMinutes();
  const minsDegrees = ((mins / 60) * 360) + 90;
  if (minsDegrees === 90) minsHand.style.transition = 'all 0s';
  else minsHand.style.transition = 'all 0.05s';
  minsHand.style.transform = `rotate(${minsDegrees}deg)`;

  const hours = now.getHours();
  const hoursDegrees = ((hours / 12) * 360) + 90;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
}

setInterval(setDate, 1000);