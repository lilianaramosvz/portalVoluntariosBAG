import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../styles/screens/voluntario/HistorialStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { HeaderBack } from "../../components/headerTitle";

export default function HistorialScreen() {
  const navigation = useNavigation();


  //Aqui tendria que ir la logica de como tendra los datos
  const historial = [
    {
        fecha: "Jueves, 4 de septiembre de 2025",
        entradas :[{ hora: "12:30", tipo: "Entrada" }, { hora: "14:00", tipo: "Entrada" }],
    },
    {
        fecha: "Viernes, 5 de septiembre de 2025", 
        entradas: [{hora: "11:15" ,tipo: "Entrada"} , { hora: "14:00", tipo: "Entrada" }],
    },

        {
        fecha: "Miercoles, 3 de septiembre de 2025", 
        entradas: [{hora: "09:24" ,tipo: "Entrada"} , { hora: "06:23", tipo: "Entrada" }],
    },
]

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "space-between", padding: 18 }}>
        <HeaderBack
          title="Historial de asistencias"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.divisorline} />
  
        <View style={styles.form}>
          <Text style={styles.number}>2</Text>
          <Text style={styles.description}>Días de voluntariado registrados</Text>
        </View>

        <ScrollView style={styles.scrollContainer}>
            {historial.map((dia,index) => (
                <View key={index} style={styles.formDia}>
                    <View style={styles.row}>
                        <Ionicons name="calendar-clear-outline" size={18} style={styles.icon}/>
                        <Text style={[styles.description, { marginLeft: 5 }]}>{dia.fecha}</Text>
                    </View>
                    {dia.entradas.map((entrada,idx) => (
                        <View key={idx} style={styles.formGray}>
                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Ionicons name="time-outline" size={18} style={styles.icon}/>
                                    <Text style={[styles.hora, { marginLeft: 5 }]}>{entrada.hora}</Text>
                                </View>
                                <View style={styles.formEntrada}>
                                    <Text style={styles.entrada}>{entrada.tipo}</Text>
                                 </View>

                            </View>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>

        {/* Última caja */}
        <View style={styles.formGreen}>
          <Text style={styles.titleGreen}>Estadísticas</Text>
          <Text style={styles.number}>4</Text>
          <Text style={styles.subtitleGreen}>Total Entradas</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
