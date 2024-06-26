import React, {useCallback, useEffect, useState} from 'react';
import styles from './styles/Modal.module.css';
import {Settings, ThemeSettings} from "../definitions";
import {useTheme} from "../providers/theme";

interface ModalProps {
    onClose: () => void;
}

const defaultSettings: Settings = {
    evenRows: {color: '', backgroundColor: ''},
    oddRows: {color: '', backgroundColor: ''},
    evenCellValues: {color: '', backgroundColor: ''},
    oddCellValues: {color: '', backgroundColor: ''}
}
const Modal: React.FC<ModalProps> = ({onClose}) => {
    const {themeSettings, setThemeSettings} = useTheme();
    const [themeInputs, setThemeInputs] = useState<Settings>(defaultSettings);
    const [isInputInitialized, setIsInputInitialized] = useState<boolean>(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceApplyingTheme = useCallback(debounce((category: keyof Settings, property: keyof ThemeSettings, value: string) => {
        setThemeSettings(prevSettings => ({
            ...prevSettings,
            [category]: {
                ...prevSettings[category],
                [property]: value
            }
        }))
    }, 1000), []);

    const handleChange = (category: keyof Settings, property: keyof ThemeSettings, value: string) => {
        setThemeInputs(prevSettings => ({
            ...prevSettings,
            [category]: {
                ...prevSettings[category],
                [property]: value
            }
        }));
        debounceApplyingTheme(category, property, value)
    };

    useEffect(() => {
        if(!isInputInitialized) {
            setThemeInputs(themeSettings)
            setIsInputInitialized(true)
        }
    }, [themeSettings, isInputInitialized])

    return (
        <div className={styles.modal}>
            <div className={styles.closeButton} onClick={onClose}>
                X
            </div>
            <div className={styles.modalContent}>
                <h2>Change Table Theme</h2>
                {Object.entries(themeInputs).map(([category, settings]) => (
                    <div className={styles.row} key={category}>
                        <div className={styles.category}>{category}:</div>
                        <div>Color:</div>
                        <div>
                            <input type="text" value={settings.color}
                                   onChange={(e) => handleChange(category as keyof Settings, 'color', e.target.value)}
                                   placeholder="Color"/>
                        </div>
                        <div/>
                        <div>Background Color:</div>
                        <div>
                            <input type="text" value={settings.backgroundColor}
                                   onChange={(e) => handleChange(category as keyof Settings, 'backgroundColor', e.target.value)}
                                   placeholder="Background Color"/>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Modal;

function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        const context = this;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}
