'use client'
import React, { useEffect } from 'react'
import axios from 'axios'

function useGetMe(enabled : boolean){
    if(!enabled) {
        return
    }
    useEffect(()=>{
        const getMe = async ()=> {
            const {data} = await axios.get("/api/user/me")
            console.log(data)
        }
        getMe()
    }, [])
}
export default useGetMe