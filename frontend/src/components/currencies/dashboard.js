import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../index.css';

const Dashboard = () => {
    const [currencies, setCurrencies] = useState([]);
    const [conversionData, setConversionData] = useState({
        sourceCurrencyCode: '',
        destinationCurrencyCode: '',
        conversionQuantity: 1
    });
    const [newCurrency, setNewCurrency] = useState({
        currencyCode: '',
        currencySymbol: '',
        displayName: '',
        rateAgainstUSD: 1,
        lastUpdatedAt: Date.now()
    });
    const [updateCurrency, setUpdateCurrency] = useState({
        currencyCode: '',
        rateAgainstUSD: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const fetchCurrencies = async () => {
        try {
            const response = await axios.get('http://localhost:80/currencies', {
                withCredentials: true
            });
            setCurrencies(response.data);
        } catch (error) {
            console.error('Error fetching currencies:', error);
        }
    };

    const handleConversionChange = (e) => {
        setConversionData({ ...conversionData, [e.target.name]: e.target.value });
    };

    const handleNewCurrencyChange = (e) => {
        setNewCurrency({ ...newCurrency, [e.target.name]: e.target.value });
    };

    const handleUpdateCurrencyChange = (e) => {
        setUpdateCurrency({ ...updateCurrency, [e.target.name]: e.target.value });
    };

    const handleConversionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:80/currencies/conversions', conversionData, {
                withCredentials: true
            });
            setResult(response.data);
            setLoading(false);
        } catch (error) {
            setError('Conversion failed');
            setLoading(false);
        }
    };

    const handleNewCurrencySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:80/currencies', newCurrency, {
                withCredentials: true
            });
            fetchCurrencies();
        } catch (error) {
            console.error('Error adding new currency:', error);
        }
    };

    const handleUpdateCurrencySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:80/currencies/${updateCurrency.currencyCode}/rate`,
                { rateAgainstUSD: updateCurrency.rateAgainstUSD },
                { withCredentials: true });
            fetchCurrencies();
        } catch (error) {
            console.error('Error updating currency rate:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Currency Exchange Dashboard</h1>

            {/* Currency Conversion Form */}
            <div className="conversion-form">
                <h2>Convert Currency</h2>
                <form onSubmit={handleConversionSubmit}>
                    <select name="sourceCurrencyCode" value={conversionData.sourceCurrencyCode} onChange={handleConversionChange} required>
                        <option value="" disabled>Select source currency</option>
                        {currencies.map(currency => (
                            <option key={currency.currencyCode} value={currency.currencyCode}>{currency.displayName}</option>
                        ))}
                    </select>
                    <select name="destinationCurrencyCode" value={conversionData.destinationCurrencyCode} onChange={handleConversionChange} required>
                        <option value="" disabled>Select destination currency</option>
                        {currencies.map(currency => (
                            <option key={currency.currencyCode} value={currency.currencyCode}>{currency.displayName}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="conversionQuantity"
                        value={conversionData.conversionQuantity}
                        onChange={handleConversionChange}
                        min="1"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? <div className="loading-spinner"></div> : 'Convert'}
                    </button>
                </form>
                {result && <div>Conversion Result: {result.conversionResult}</div>}
                {error && <div className="error">{error}</div>}
            </div>

            {/* Add New Currency Form */}
            <div className="new-currency-form">
                <h2>Add New Currency</h2>
                <form onSubmit={handleNewCurrencySubmit}>
                    <input
                        type="text"
                        name="currencyCode"
                        placeholder="Currency Code"
                        value={newCurrency.currencyCode}
                        onChange={handleNewCurrencyChange}
                        required
                    />
                    <input
                        type="text"
                        name="currencySymbol"
                        placeholder="Currency Symbol"
                        value={newCurrency.currencySymbol}
                        onChange={handleNewCurrencyChange}
                        required
                    />
                    <input
                        type="text"
                        name="displayName"
                        placeholder="Display Name"
                        value={newCurrency.displayName}
                        onChange={handleNewCurrencyChange}
                        required
                    />
                    <input
                        type="number"
                        name="rateAgainstUSD"
                        placeholder="Rate Against USD"
                        value={newCurrency.rateAgainstUSD}
                        onChange={handleNewCurrencyChange}
                        step="0.0001"
                        required
                    />
                    <button type="submit">Add Currency</button>
                </form>
            </div>

            {/* Update Currency Rate Form */}
            <div className="update-currency-form">
                <h2>Update Currency Rate</h2>
                <form onSubmit={handleUpdateCurrencySubmit}>
                    <select name="currencyCode" value={updateCurrency.currencyCode} onChange={handleUpdateCurrencyChange} required>
                        <option value="" disabled>Select currency</option>
                        {currencies.map(currency => (
                            <option key={currency.currencyCode} value={currency.currencyCode}>{currency.displayName}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="rateAgainstUSD"
                        placeholder="New Rate Against USD"
                        value={updateCurrency.rateAgainstUSD}
                        onChange={handleUpdateCurrencyChange}
                        step="0.0001"
                        required
                    />
                    <button type="submit">Update Rate</button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
