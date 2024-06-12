import express from "express";
import {
    batchCreateCurrencies,
    createCurrency, currencyConversion,
    getAllCurrency, getCurrency,
    updateCurrencyRate
} from "../controllers/currencyController";


const router = express.Router();

router.post('/', createCurrency);
router.patch('/:currencyCode/rate', updateCurrencyRate);
router.get('/', getAllCurrency)
router.get('/:currencyCode', getCurrency)
router.post('/batch', batchCreateCurrencies)
router.post('/conversions', currencyConversion)

export default router