import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 20,
  },
  text: {
    color: COLORS.text.white,
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.family.inter.medium,
    fontWeight: "500",
  },
  text_btn: {
    color: COLORS.text.white,
    fontSize: FONTS.sizes.medium,
    fontFamily: FONTS.family.inter.semiBold,
    fontWeight: "600",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
});
