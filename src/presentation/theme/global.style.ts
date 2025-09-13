import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({


    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }, scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    formContainer: {
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    eyeButton: {
        padding: 10,
    },
    eyeText: {
        color: '#007AFF',
        fontSize: 14,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 18,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonDisabled: {
        backgroundColor: '#99c2ff',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        color: '#666',
        fontSize: 14,
    },
    signupLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    socialLoginContainer: {
        alignItems: 'center',
    },
    socialLoginText: {
        color: '#666',
        marginBottom: 15,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 50,
        padding: 15,
        marginHorizontal: 10,
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    presable: {
        backgroundColor: '#0073ffff',
        marginHorizontal: 2,
        marginTop: 10,
        borderRadius: 1,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        borderTopEndRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopStartRadius: 20,
        borderBottomEndRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomStartRadius: 20,

        margin: 20
    },
    row: {
        flexDirection: 'row',  // Para colocar los elementos en línea horizontal
        justifyContent: 'space-between',  // Para colocar el texto a la izquierda y el icono a la derecha
        alignItems: 'center',  // Alinear verticalmente ambos elementos
        paddingHorizontal: 40,
        marginHorizontal: 30  // Espaciado interno horizontal
    },
    textoBoton: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#625353', // Cambiar color del texto a blanco
    },
    icon: {
        color: '#100303',  // Icono blanco para que coincida con el texto
    },
    texto: {
        textAlign: 'left',
        fontSize: 12, // Hacer el texto un poco más grande
        lineHeight: 20, // Espaciado de líneas más agradable
        paddingVertical: 6,
        paddingHorizontal: 12, // Aumentar el padding horizontal
        color: '#262626', // Color más suave que el negro puro
        marginHorizontal: 15, // Ajustar márgenes para mayor simetría
        // backgroundColor: '#d5d0d0', // Fondo claro para resaltar el texto
        borderRadius: 3, // Bordes redondeados

        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        // elevation: 1,
    },


    imagen: {
        width: '100%',  // Hace que la imagen ocupe el ancho completo del contenedor
        height: 300,    // Ajusta la altura a un tamaño más manejable
        resizeMode: 'contain',  // Asegura que la imagen mantenga su proporción y se ajuste dentro del contenedor
        marginVertical: 10,  // Márgenes verticales
        borderRadius: 10,  // Opcional, para darle bordes redondeados
        backgroundColor: '#f0f0f0', // Color de fondo opcional para cuando no se carga la imagen
        marginBottom: 0
    },
    fecha: {
        fontSize: 12,
        textAlign: 'left',
        margin: 10

    },

})