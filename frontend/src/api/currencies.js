import axios from "axios";

export async function currencyConversionApi(conversionData) {
    return await axios.post('http://shravanth.evivelabs.com/currencies/conversions', conversionData, {
        withCredentials: true
    });
}

export async function fetchCurrenciesApi() {
    return await axios.get('http://shravanth.evivelabs.com/currencies', {
        withCredentials: true
    });
}

export async function createNewCurrencyApi(newCurrency) {
    await axios.post('http://shravanth.evivelabs.com/currencies', newCurrency, {
        withCredentials: true
    });
}

export async function updateCurrenciesApi(updateCurrency) {
    await axios.patch(`http://shravanth.evivelabs.com/currencies/${updateCurrency.currencyCode}/rate`,
        {rateAgainstUSD: updateCurrency.rateAgainstUSD},
        {withCredentials: true});
}