import axios from 'axios';

export const login = async (formData) => {
    try {
        return await axios.post('http://localhost:80/authentication/login', formData, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
    } catch (error) {
        console.error(error);
    }
};

export const signIn = async (formData) => {
    try{
        return await axios.put('http://localhost:80/authentication/signUp', formData, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
    } catch (error) {
        console.log(error)
    }
}