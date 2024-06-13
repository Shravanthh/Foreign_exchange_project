import axios from 'axios';

export const login = async (formData) => {
    try {
        return await axios.post('http://shravanth.evivelabs.com/authentication/login', formData, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            withCredentials: true
        });
    } catch (error) {
        console.error(error);
    }
};


export const signIn = async (formData) => {
    try{
        return await axios.put('http://shravanth.evivelabs.com/authentication/signUp', formData, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            withCredentials: true
        })
    } catch (error) {
        console.log(error)
    }
}