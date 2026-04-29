// From provider we can access the redux from all app
'use client'
import React,{ReactNode} from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

function reduxProvider({children} : {children : ReactNode}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default reduxProvider