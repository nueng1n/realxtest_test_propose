import { createContext, FC } from 'react';
import axios, { AxiosResponse } from 'axios';

import {CoreContextType, CoreProviderProps, Order, PostsResponse, TagOption} from '../interface/core'

const baseUrl:string = "http://127.0.0.1:3000"
const CoreContext = createContext<CoreContextType | null>(null);

const CoreProvider: FC<CoreProviderProps> = ({ children }) => {


    const loginFunc = async (username: string, password: string) => {

        try {

            const data = JSON.stringify({
                "username": username,
                "password": password
            });

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: baseUrl+'/user/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const response = await axios.request(config);
            const token = response.data.token


            localStorage.setItem('token', token);

        } catch (error) {
            throw error;
        }
    };



    const getPosts = async (token: string, currentPage: number, search: string, filterTag: string, orders: Order[]): Promise<PostsResponse> => {


        try {

            let data = JSON.stringify({
                "currentPage": currentPage,
                "search": search,
                "filterTag": filterTag,
                "orders": orders
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: baseUrl+'/post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data: data
            };

            const response: AxiosResponse = await axios.request(config);
            return response.data

        } catch (error) {
            throw error;
        }
    };




    const getTags = async (token: string): Promise<TagOption[]> => {


        try {

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: baseUrl+'/tag',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };

            const response: AxiosResponse = await axios.request(config);
            return response.data

        } catch (error) {
            throw error;
        }
    };



    return (
        <CoreContext.Provider value={{ loginFunc, getPosts, getTags }}>
            {children}
        </CoreContext.Provider>
    );
};

export { CoreProvider };
export default CoreContext;



