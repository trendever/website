export const getPaymentAmmount = (msg) => {
  let _currency = JSON.parse(msg.parts[0].content).currency
  let _ammount = JSON.parse(msg.parts[0].content).amount;
  if (_currency === 2){
    return Math.round(_ammount * 1.015/100);
  }else{
    return Math.round(_ammount * 1.015);
  }
}