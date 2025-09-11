import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';

import { COLORS } from '../../shared/constants/colors';
import { styles } from '../../shared/ui/styles/login';

export const LoginScreen = () => {
    const { t } = useTranslation();  // eslint-disable-line @typescript-eslint/no-unused-vars

    return (
        <LinearGradient
        colors={COLORS.gradient.loginScreen as [string, string, ...string[]]}
        style={styles.background}
        >  
        <Image
            source={require('../../../assets/images/rounder_logo.png')}
            style={styles.logo}
        />
        
        
        </LinearGradient>
    );
}