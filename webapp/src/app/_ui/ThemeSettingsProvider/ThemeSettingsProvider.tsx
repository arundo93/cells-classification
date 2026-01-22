'use client';

import {type Theme, ThemeProvider} from '@gravity-ui/uikit';
import {createContext, useContext, useState} from 'react';

type ThemeSettingsContextType = {
	theme: Theme;
	setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const ThemeSettingsContext = createContext<ThemeSettingsContextType | null>(
	null,
);

export function useThemeSettingsContext() {
	const context = useContext(ThemeSettingsContext);
	if (!context) {
		throw new Error('no available ThemeSettingsContext');
	}

	return context;
}

type ThemeSettingsProviderProps = React.PropsWithChildren<{
	defaultTheme: Theme;
}>;

export function ThemeSettingsProvider(props: ThemeSettingsProviderProps) {
	const {children, defaultTheme} = props;
	const [theme, setTheme] = useState<Theme>(defaultTheme ?? 'light');

	return (
		<ThemeSettingsContext.Provider value={{theme, setTheme}}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</ThemeSettingsContext.Provider>
	);
}
