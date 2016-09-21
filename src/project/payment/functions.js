export const getPaymentAmmount = (msg) => {
  let _currency = JSON.parse(msg.parts[0].content).currency
  let _ammount = JSON.parse(msg.parts[0].content).amount;
  if (_ammount * 1.015 - _ammount < 50){
  	_ammount += 50;	
  }else{
  	_ammount = Math.round(_ammount * 1.015);
  }
}