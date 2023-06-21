import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AdminContext = createContext({})

export function AdminContextProvider(props) {
    const [admin, setAdmin] = useState(null)
    const [ready, setReady] = useState(false)

    return (
        <AdminContext.Provider value={{ admin, setAdmin, ready }}>
            {props.children}
        </AdminContext.Provider>
    )
}