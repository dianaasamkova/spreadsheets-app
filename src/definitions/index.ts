export interface ISheets {
    [sheetName: string]: number[][];
}

export interface ThemeSettings {
    color: string;
    backgroundColor: string;
}

export interface Settings {
    evenRows: ThemeSettings;
    oddRows: ThemeSettings;
    evenCellValues: ThemeSettings;
    oddCellValues: ThemeSettings;
}
