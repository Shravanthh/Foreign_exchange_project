export type CurrencyModel = {
    currencyCode: string,
    currencySymbol: string,
    displayName: string,
    rateAgainstUSD: number,
    lastUpdatedAt: number
}

export type CurrencyConversion = {
    sourceCurrencyCode: string,
    destinationCurrencyCode: string,
    conversionQuantity: number
}