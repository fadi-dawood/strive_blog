import React, { createContext, useState } from "react";


export const URLSContext = createContext("/");


export default function URLSContextProvider({ children }) {
    const APIURL = "http://localhost:3001/"


    const value = {
        APIURL
    }

    return (
        <URLSContext.Provider value={value}>{children}</URLSContext.Provider>
    )
}