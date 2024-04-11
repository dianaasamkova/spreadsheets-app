import React, {createContext, useContext, useEffect, useState} from 'react';
import {ISheets} from "../definitions";

interface SheetsContextType {
    sheets: ISheets;
    selectedSheets: string[];
    setSheets: React.Dispatch<React.SetStateAction<ISheets>>;
    setSelectedSheets: React.Dispatch<React.SetStateAction<string[]>>;

}

const SheetsContext = createContext<SheetsContextType>({
    sheets: {},
    selectedSheets: [],
    setSheets: () => {
    },
    setSelectedSheets: () => {
    },
});

export const useSheets = () => {
    const context = useContext(SheetsContext);
    if (!context) {
        throw new Error('useSheets must be used within a SheetsProvider');
    }
    return context;
};

interface SheetsProviderProps {
    children: React.ReactNode;
}

export const SheetsProvider: React.FC<SheetsProviderProps> = ({children}) => {
    const [sheets, setSheets] = useState<ISheets>({});
    const [selectedSheets, setSelectedSheets] = useState<string[]>([]); // assuming selected sheets are managed in NavigationBar


    const fetchData = async () => {
        try {
            const response = await fetch('https://clinch-public-documents.s3.amazonaws.com/clinch-recruitment/spreadsheet.json');
            const jsonData = await response.json();
            const data: ISheets = JSON.parse(jsonData);
            setSheets(data);
        } catch (error) {
            console.log("Request has failed")
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SheetsContext.Provider value={{sheets, setSheets, selectedSheets, setSelectedSheets}}>
            {children}
        </SheetsContext.Provider>
    );
};
