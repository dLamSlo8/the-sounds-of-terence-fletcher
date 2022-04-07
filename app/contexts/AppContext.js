import { useState, createContext } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [soundPlaying, setSoundPlaying] = useState(false);

    return (
        <AppContext.Provider value={{
            soundPlaying, setSoundPlaying
        }}>
            { children }
        </AppContext.Provider>
    )
}

export default AppContext;