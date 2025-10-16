import * as React from "react";
import {StyleSheet, View, Text, Pressable, Image, ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QrDisplay from '../../components/QrDisplay';
import { createAccessToken } from '../../services/qrFunctions';
import { StackNavigationProp } from '@react-navigation/stack';
import {useNavigation, ParamListBase} from "@react-navigation/native";

const VistaQR = () => {
  	const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
        const [token, setToken] = React.useState<string | null>(null);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState<string | null>(null);
    
        async function fetchToken() {
            setLoading(true);
            setError(null);
            try {
                const data = await createAccessToken();
                setToken(data.token);
                // Clear token after 5 minutes + small buffer
                setTimeout(() => setToken(null), 300 * 1000 + 1000);
            } catch (e) {
                setError('No se pudo generar el QR');
            } finally {
                setLoading(false);
            }
        }

        React.useEffect(() => {
            fetchToken();
            return () => setToken(null);
        }, []);
    
    return (
        <SafeAreaView style={styles.vistaQr}>
        <View style={styles.view}>
                    <View style={[styles.formLogIn, styles.formLayout]} />
                    <Pressable style={styles.button} onPress={() => fetchToken()}>
                <Text style={styles.vistaQrButton}>Renovar código QR</Text>
                                </Pressable>
                            <Text style={styles.tuCdigoDe}>Tu código de asistencia</Text>
                <Text style={[styles.id1Presenta, styles.id1PresentaTypo]}>{`ID: 1

                Presenta este código al guardia para registrar tu entrada`}</Text>
                    <View style={[styles.vistaQrFormLogIn, styles.formLayout]} />
                    <Text style={[styles.tiempoRestantePara, styles.id1PresentaTypo]}>Tiempo restante para expiración</Text>
            <Text style={styles.text}>5:00</Text>
            {/* decorative asset removed or handled elsewhere */}
                        <View style={{ top: 120, left: 0, right: 0, alignItems: 'center' }}>
                            {!loading && token && <QrDisplay value={token} />}
                            {!loading && !token && <Text style={{ color: '#999' }}>No hay código</Text>}
                            {error && <Text style={{ color: 'red' }}>{error}</Text>}
                        </View>

                        {/* overlay while generating */}
                        {loading && (
                            <View style={styles.overlay}>
                                <ActivityIndicator size="large" color="#009951" />
                            </View>
                        )}
                    <Pressable style={styles.arrowBack} onPress={() => navigation.goBack()}>
                <Image style={styles.icon} resizeMode="cover" />
                    </Pressable>
                    <Text style={[styles.cdigoDeAsistencia, styles.childPosition]}>Código de asistencia</Text>
                    </View>
                    </SafeAreaView>);
                    };
                    
                    const styles = StyleSheet.create({
                            vistaQr: {
                                flex: 1
                            },
                            formLayout: {
                                minWidth: 320,
                                borderColor: "#d9d9d9",
                                elevation: 4,
                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                width: 320,
                                borderWidth: 1,
                                borderStyle: "solid",
                                backgroundColor: "#fff",
                                borderRadius: 8,
                                left: 37,
                                position: "absolute"
                            },
                            id1PresentaTypo: {
                                lineHeight: 22,
                                width: 272,
                                textAlign: "center",
                                left: 61,
                                color: "#1e1e1e",
                                fontFamily: "Inter-Regular",
                                fontSize: 16,
                                position: "absolute"
                            },
                            childPosition: {
                                left: "50%",
                                position: "absolute"
                            },
                            view: {
                                height: 917,
                                overflow: "hidden",
                                width: "100%",
                                flex: 1
                            },
                            formLogIn: {
                                top: 310,
                                height: 406
                            },
                            button: {
                                top: 757,
                                borderColor: "#14ae5c",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 12,
                                width: 320,
                                borderWidth: 1,
                                borderStyle: "solid",
                                backgroundColor: "#fff",
                                borderRadius: 8,
                                left: 37,
                                position: "absolute",
                                overflow: "hidden"
                            },
                            vistaQrButton: {
                                lineHeight: 16,
                                textAlign: "left",
                                color: "#1e1e1e",
                                fontFamily: "Inter-Regular",
                                fontSize: 16
                            },
                            tuCdigoDe: {
                                top: 343,
                                lineHeight: 24,
                                width: 272,
                                left: 61,
                                textAlign: "center",
                                fontSize: 20,
                                color: "#1e1e1e",
                                fontFamily: "Inter-Regular",
                                position: "absolute"
                            },
                            id1Presenta: {
                                top: 604
                            },
                            vistaQrFormLogIn: {
                                top: 153,
                                height: 125
                            },
                            tiempoRestantePara: {
                                top: 228
                            },
                            text: {
                                top: 182,
                                left: 127,
                                fontSize: 24,
                                letterSpacing: -0.5,
                                lineHeight: 29,
                                fontWeight: "600",
                                fontFamily: "Inter-SemiBold",
                                color: "#009951",
                                width: 139,
                                textAlign: "center",
                                position: "absolute"
                            },
                            child: {
                                marginLeft: -162,
                                top: 118,
                                maxHeight: "100%",
                                width: 324,
                                color: "#000"
                            },
                            arrowBack: {
                                left: 38,
                                top: 68,
                                width: 28,
                                height: 28,
                                position: "absolute"
                            },
                            icon: {
                                height: '100%',
                                color: '#1d1b20',
                                width: '100%'
                            },
                            overlay: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,255,255,0.6)'
                            },
                            cdigoDeAsistencia: {
                                marginLeft: -122,
                                top: 71,
                                lineHeight: 22,
                                color: "#02542d",
                                fontSize: 20,
                                left: "50%",
                                textAlign: "left",
                                fontFamily: "Inter-Regular"
                            }
                    });
                    
                    export default VistaQR;
                    