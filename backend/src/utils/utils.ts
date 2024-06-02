import moment from 'moment';

export const getCurrentEpochPlusOneDay = (): number => {
    const currentMoment = moment();
    const oneDayLater = currentMoment.clone().add(1, 'day');
    return oneDayLater.unix();
};

export const isExpired = (expiresAt: number): boolean => {
    const currentEpoch = moment().unix(); // Get current time in epoch format
    return expiresAt < currentEpoch;
};