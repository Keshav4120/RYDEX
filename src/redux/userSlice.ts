import { IUser } from '@/models/user.model'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface UserState {
  userData: IUser | null
}

// Define the initial state using that type
const initialState: UserState = {
  userData: null
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // state target to initial state 
    // action help to get the data through payload
    setUserData:(state , action)=>{
        state.userData=action.payload
    }
  },
})

export const {setUserData} = userSlice.actions

export default userSlice.reducer