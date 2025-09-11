import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity } from 'react-native';

import { COLORS } from '../../shared/constants/colors';
import { styles } from '../../shared/ui/styles/index';

export const WelcomeScreen = () => {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={COLORS.gradient.welcomeScreen as [string, string, ...string[]]}
      style={styles.background}
    >  
      <Image
        source={require('../../../assets/images/rounder_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>{t('welcome.title1')}</Text>
      <Text style={styles.text}>{t('welcome.title2')}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.text_btn}>{t('welcome.button')}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}