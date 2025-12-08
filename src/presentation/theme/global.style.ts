import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    menuContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    userCard: {
        marginBottom: 15,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    pressableCard: {
        borderRadius: 15,
    },
    userCardContent: {
        padding: 20,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    userInfoContainer: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7f8c8d',
        width: 80,
        marginRight: 10,
    },
    infoValue: {
        fontSize: 14,
        color: '#2c3e50',
        flex: 1,
        lineHeight: 20,
    },



    // Agrega esto a tus estilos
    coloredCard: {
        backgroundColor: '#3498db',
    },
    coloredText: {
        color: '#ffffff',
    },
    coloredLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
    },

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
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },

    menuCard: {
        borderRadius: 15,
        marginBottom: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statsContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 15,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#3498db',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#7f8c8d',
        textAlign: 'center',
    },

})

export const globalStylesLista = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#7f8c8d',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    errorBanner: {
        backgroundColor: '#e74c3c',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 8,
    },
    errorBannerText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 20,
    },
    item: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 6,
    },
    itemDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 12,
        lineHeight: 20,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ebf5fb',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    userText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3498db',
        marginLeft: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#95a5a6',
    },
    arrowContainer: {
        marginLeft: 8,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#3498db',
        borderRadius: 28,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    archivoButton: {
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3498db',
        marginHorizontal: 4,
    },
    archivoContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    archivoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3498db',
        marginLeft: 4,
    },


})

export const globalStylesTusPropuestas = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centrado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    textoVacio: {
        fontSize: 18,
        color: '#7f8c8d',
        marginTop: 16,
        textAlign: 'center',
    },
    textoVacioSub: {
        fontSize: 14,
        color: '#bdc3c7',
        marginTop: 8,
        textAlign: 'center',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    item: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 6,
    },
    itemDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 12,
        lineHeight: 20,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffeaea',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    voteText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#e74c3c',
        marginLeft: 4,
    },
    arrowContainer: {
        marginLeft: 8,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#3498db',
        borderRadius: 28,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },


})

export const globalStylesDepartamentoPropuestas = StyleSheet.create({

    container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
    flex: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },

    })