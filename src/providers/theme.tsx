import React, {createContext, useContext, useState} from 'react';

interface ThemeSettings {
    evenRows: { color: string; backgroundColor: string };
    oddRows: { color: string; backgroundColor: string };
    evenCellValues: { color: string; backgroundColor: string };
    oddCellValues: { color: string; backgroundColor: string };
}

interface ThemeContextType {
    themeSettings: ThemeSettings;
    setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}

const ThemeContext = createContext<ThemeContextType>({
    themeSettings: {
        evenRows: {color: '', backgroundColor: ''},
        oddRows: {color: '', backgroundColor: ''},
        evenCellValues: {color: '', backgroundColor: ''},
        oddCellValues: {color: '', backgroundColor: ''}
    },
    setThemeSettings: () => {
    }
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
    const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
        evenRows: {color: '', backgroundColor: ''},
        oddRows: {color: '', backgroundColor: ''},
        evenCellValues: {color: '', backgroundColor: ''},
        oddCellValues: {color: '', backgroundColor: ''}
    });

    /**
     * we could fetch setting from API here using useEffect
     */

    return (
        <ThemeContext.Provider value={{themeSettings, setThemeSettings}}>
            {children}
        </ThemeContext.Provider>
    );
};
