import useCore from '../hooks/use-core';
import { useState, useEffect } from 'react';

import useNavigation from '../hooks/use-navigation';

import {NavigationContextType} from '../interface/navigation'
import {CoreContextType} from '../interface/core'


function LoginPage() {

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate("/post")
        } 
    }, []);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    const { navigate } = useNavigation() as NavigationContextType;


    const handleUsernameChange = (event: any) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };
    const { loginFunc } = useCore() as CoreContextType;


    const handleSubmit = async (event: any) => {
        event.preventDefault();

        try {
            await loginFunc(username, password); 
            setUsername('');
            setPassword('');
            setLoginError(false);

            navigate("/post")
        } catch (error) {
            
            setLoginError(true);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <label className="font-bold text-lg mb-2 block" htmlFor="term">
                    Login
                </label>
                <input
                    className="border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 px-4 py-2 w-full mb-4"
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username} onChange={handleUsernameChange}
                />
                <input
                    className="border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 px-4 py-2 w-full mb-4"
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password} onChange={handlePasswordChange}
                />
                {loginError && <p className="text-red-500">Invalid username or password</p>}
                <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
                >
                    Login
                </button>
            </form>
        </div>
    )

}


export default LoginPage