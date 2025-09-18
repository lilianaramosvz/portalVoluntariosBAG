//frontend\src\screens\auth\AvisoPrivacidadScreen.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../styles/screens/auth/AvisoPrivacidadStyles";

const AvisoPrivacidadScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.title}>Aviso de privacidad</Text>
        </TouchableOpacity>

        <View style={styles.divisorline} />

        <View style={styles.form}>
          <Text style={styles.text}>
            En cumplimiento con la legislación aplicable en materia de
            protección de datos personales, Banco de Alimentos de Guadalajara
            (BAG) pone a su disposición el presente Aviso de Privacidad,
            mediante el cual informamos sobre la forma en que se recaban,
            utilizan y resguardan sus datos al registrarse como voluntario en
            nuestra aplicación.
          </Text>
          <Text style={styles.text}>
            El BAG, con domicilio en Hda. de La Calerilla 360, Santa María
            Tequepexpan, 45601 San Pedro Tlaquepaque, Jal., es responsable del
            uso y protección de los datos personales que usted nos proporcione.
            Únicamente se solicitarán aquellos datos necesarios para gestionar
            su participación como voluntario, entre ellos: nombre completo,
            correo electrónico, número de contacto, contraseña de acceso
            (cifrada en nuestros sistemas) y la información generada durante sus
            asistencias y actividades de voluntariado. Es importante señalar que
            en ningún momento se le solicitarán datos personales considerados
            sensibles por la normativa aplicable.
          </Text>
          <Text style={styles.text}>
            La finalidad del tratamiento de sus datos es permitir la creación y
            administración de su cuenta como voluntario, verificar su identidad,
            gestionar su registro, generar el código QR de acceso a las
            instalaciones y llevar un control de sus asistencias. Asimismo, los
            datos podrán ser utilizados para mantener comunicación con usted
            respecto a actividades de voluntariado y para la elaboración de
            reportes estadísticos de carácter interno, en los cuales no se
            identificará de manera individual a los participantes.
          </Text>
          <Text style={styles.text}>
            Todos los datos personales recabados serán tratados con estricta
            confidencialidad. El BAG implementa medidas de seguridad
            administrativas, técnicas y físicas que garantizan la protección de
            su información y que tienen como objetivo evitar su alteración,
            pérdida, uso indebido, acceso no autorizado o divulgación. Estas
            acciones se encuentran alineadas con los principios de
            ciberseguridad establecidos en el proyecto y en la normativa
            vigente.
          </Text>
          <Text style={styles.text}>
            El BAG no compartirá sus datos con terceros ajenos a la institución.
            Únicamente podrán ser transferidos en los casos previstos por la ley
            o cuando así lo requiera alguna autoridad competente. En todo
            momento, usted conservará el derecho de acceder a sus datos
            personales, rectificarlos cuando sean inexactos, cancelarlos si
            considera que no son necesarios para las finalidades aquí señaladas
            u oponerse a su uso para fines específicos. Estos derechos,
            conocidos como ARCO, podrán ejercerse enviando una solicitud al
            correo electrónico procurador3@bdalimentos.org, donde será atendida
            conforme a los plazos y procedimientos previstos por la normativa.
          </Text>
          <Text style={styles.text}>
            El presente Aviso de Privacidad podrá ser modificado en cualquier
            momento para atender actualizaciones legales, mejoras en nuestros
            procesos de protección de datos o la implementación de nuevas
            medidas de seguridad. Cualquier cambio será publicado y estará
            disponible a través de esta aplicación.
          </Text>
          <Text style={styles.text}>
            Al registrarse en la aplicación y crear su cuenta de voluntario,
            usted manifiesta su consentimiento y expresa que ha leído y acepta
            el presente Aviso de Privacidad, autorizando el tratamiento de sus
            datos personales conforme a lo establecido en este documento y a la
            normatividad vigente.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AvisoPrivacidadScreen;
