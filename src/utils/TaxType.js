export const convertToAnnualRate = (rate) => {
    const rateNum = (rate * 2080);
    return rateNum.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  
  export const convertToHourlyRate = (rate) => {
    const rateNum = (rate / 2080);
    return rateNum.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  
  export const calculateRateAfterTax = (rate, tax) => {
    if (!tax) return rate
    return parseFloat((rate - (tax / 100) * rate).toFixed(2));
  }
  