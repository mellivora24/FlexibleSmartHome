import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { dashboardStyle } from './style/dashboardStyle';

export const DashboardScreen = () => {
    return (
        <SafeAreaView style={dashboardStyle.container}>
            <ScrollView>
                <Text style={dashboardStyle.title}>Dashboard</Text>
                <View style={dashboardStyle.card}>
                    <Text style={dashboardStyle.cardTitle}>Card Title 1</Text>
                    <Text style={dashboardStyle.cardContent}>This is some content for card 1.</Text>
                </View>
                <View style={dashboardStyle.card}>
                    <Text style={dashboardStyle.cardTitle}>Card Title 2</Text>
                    <Text style={dashboardStyle.cardContent}>This is some content for card 2.</Text>
                </View>
                <View style={dashboardStyle.card}>
                    <Text style={dashboardStyle.cardTitle}>Card Title 3</Text>
                    <Text style={dashboardStyle.cardContent}>This is some content for card 3.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}