import React, {useEffect, useState} from 'react';
import '../../index.css';
import {
    createNewCurrencyApi,
    currencyConversionApi,
    fetchCurrenciesApi,
    updateCurrenciesApi
} from "../../api/currencies";

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
    const [isNewCurrencyPopupVisible, setIsNewCurrencyPopupVisible] = useState(false);
    const [isUpdateCurrencyPopupVisible, setIsUpdateCurrencyPopupVisible] = useState(false);

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const fetchCurrencies = async () => {
        try {
            const response = await fetchCurrenciesApi();
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
        setError('')
        setLoading(true);
        try {
            const response = await currencyConversionApi(conversionData);
            setResult(response.data);
            setLoading(false);
        } catch (error) {
            setError('Conversion failed');
            setLoading(false);
        }
    };

    const handleNewCurrencySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createNewCurrencyApi(newCurrency);
            await fetchCurrencies();
            setLoading(false);
            setIsNewCurrencyPopupVisible(false);
        } catch (error) {
            console.error('Error adding new currency:', error);
            setLoading(false);
        }
    };

    const handleUpdateCurrencySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateCurrenciesApi(updateCurrency);
            await fetchCurrencies();
            setLoading(false);
            setIsUpdateCurrencyPopupVisible(false);
        } catch (error) {
            console.error('Error updating currency rate:', error);
            setLoading(false);
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
                {result && <div>Conversion Result: {result.conversionRate}</div>}
                {error && <div className="error">{error}</div>}
            </div>

            {/* Buttons to show popups */}
            <div className="action-buttons">
                <button onClick={() => setIsNewCurrencyPopupVisible(true)}>Add New Currency</button>
                <button onClick={() => setIsUpdateCurrencyPopupVisible(true)}>Update Currency Rate</button>
            </div>

            {/* Add New Currency Popup */}
            {isNewCurrencyPopupVisible && (
                <div className="popup">
                    <div className="popup-inner">
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
                            <button type="submit">{loading ? <div className="loading-spinner"></div> : 'Add Currency'}</button>
                            <button type="button" onClick={() => setIsNewCurrencyPopupVisible(false)}>Close</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Currency Rate Popup */}
            {isUpdateCurrencyPopupVisible && (
                <div className="popup">
                    <div className="popup-inner">
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
                            <button type="submit">{loading ? <div className="loading-spinner"></div> : 'Update Rate'}</button>
                            <button type="button" onClick={() => setIsUpdateCurrencyPopupVisible(false)}>Close</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
