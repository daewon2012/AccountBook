import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function HomeScreen() { return <SafeAreaView style={styles.safe}><StatusBar style="auto"/><View style={styles.content}><Text accessibilityRole="header" style={styles.title}>AccountBook</Text><Text>모바일 앱 준비가 완료되었습니다.</Text></View></SafeAreaView>; }
const styles=StyleSheet.create({safe:{flex:1},content:{flex:1,padding:24,justifyContent:'center'},title:{fontSize:28,fontWeight:'700',marginBottom:12}});
