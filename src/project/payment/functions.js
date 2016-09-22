export const getPaymentAmmount = (msg) => {
  let _currency = JSON.parse(msg.parts[0].content).currency
  let amount = JSON.parse(msg.parts[0].content).amount;
  if (_currency === 2){
    amount = amount / 100;
  }
  
  if (amount * 1.015 - amount < 50){
  	amount += 50;	
  }else{
  	amount = amount * 1.015;
  }
  
  return Math.round(amount);
}