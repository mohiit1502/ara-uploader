import { createSlice } from "@reduxjs/toolkit"

export interface HomeState {}

const initialState: HomeState = {}

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    increment: (state) => {},
  },
  extraReducers: (builder) => {},
})

export const { increment } = homeSlice.actions

export default homeSlice.reducer
