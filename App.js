import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// URL de tu Google Apps Script vinculada a Google Sheets
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzQQxh-mSxocVAp8DjAq4X8CdUSr0xgSe-JVHFw8WTO73B6TNISfLE-ryNkWovTcPOj6Q/exec';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  
  // --- ESTADOS PARA EVALUACIÓN ---
  const [answers, setAnswers] = useState({});
  const [profiles, setProfiles] = useState({});
  
  // --- ESTADOS PARA REGULACIÓN ---
  const [regEmotion, setRegEmotion] = useState('');
  const [regIntensity, setRegIntensity] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regCompany, setRegCompany] = useState('');
  
  // --- ESTADOS PARA GAMIFICACIÓN ---
  const [streak, setStreak] = useState(0);

  // --- 1. DICCIONARIO DE PSICOEDUCACIÓN EMOCIONAL ---
  const emotionsData = {
    Felicidad: {
      funcion: "Motivarnos a repetir acciones beneficiosas y conectar con los demás.",
      cuerpo: "Sensación de ligereza, calor en el pecho, relajación muscular.",
      mente: "Pensamientos expansivos, optimismo, apertura a nuevas ideas.",
      ejercicio: "Respiración en 4 tiempos: Inhala 4s, sostén 4s, exhala 4s, sostén sin aire 4s. (Para anclar la calma)."
    },
    Miedo: {
      funcion: "Protegernos y prepararnos para reaccionar ante una amenaza o peligro.",
      cuerpo: "Taquicardia, respiración rápida, tensión muscular, sudoración.",
      mente: "Alerta máxima, pensamientos acelerados anticipando el futuro.",
      ejercicio: "Técnica de Anclaje 5-4-3-2-1: Nombra 5 cosas que veas, 4 que toques, 3 que escuches, 2 que huelas, 1 que saborees."
    },
    Rabia: {
      funcion: "Darnos energía para defendernos, poner límites o restaurar la justicia.",
      cuerpo: "Calor en el rostro, mandíbula apretada, energía en los brazos.",
      mente: "Enfoque de túnel en la ofensa, pensamientos rápidos y a la defensiva.",
      ejercicio: "Activación del Tono Vagal Ventral: Lávate la cara con agua fría o da 3 suspiros muy largos (exhalando lento)."
    },
    Tristeza: {
      funcion: "Ayudarnos a procesar una pérdida, asimilar cambios y pedir apoyo a otros.",
      cuerpo: "Pesadez corporal, baja energía, nudo en la garganta, llanto.",
      mente: "Pensamientos lentos, enfoque en el pasado, reflexión interna.",
      ejercicio: "Respiración Diafragmática Lenta: Pon una mano en tu abdomen, inhala profundo inflando la barriga y exhala muy suavemente."
    },
    Asco: {
      funcion: "Alejarnos de cosas, situaciones o personas que pueden ser tóxicas o dañinas.",
      cuerpo: "Tensión en el estómago, náuseas, arrugar la nariz.",
      mente: "Rechazo, juicio crítico, deseo de evadir.",
      ejercicio: "Técnica de Distracción Cognitiva: Cuenta hacia atrás desde 100 de 7 en 7 para cambiar el foco mental."
    },
    Sorpresa: {
      funcion: "Interrumpir lo que hacíamos para enfocar nuestra atención en algo nuevo o inesperado.",
      cuerpo: "Ojos muy abiertos, inhalación repentina, pausa temporal.",
      mente: "Mente en blanco por un segundo, reevaluación rápida del entorno.",
      ejercicio: "Respiración de Transición: Haz 3 respiraciones profundas y lentas para asimilar la nueva información."
    }
  };

  // --- 2. DICCIONARIO DE RETROALIMENTACIÓN DE HSE ---
  const feedbackData = {
    Autoconciencia: {
      Bajo: "Se observa dificultad para identificar lo que sientes y reconocer tus necesidades. Te sugerimos llevar un diario emocional.",
      Medio: "Reconoces tus emociones básicas, pero bajo estrés te cuesta entender tus reacciones. Practica la pausa activa antes de reaccionar.",
      Alto: "¡Excelente! Comprendes claramente tus emociones, tus fortalezas y tus áreas de mejora en el día a día."
    },
    Empatia: {
      Bajo: "Puede resultarte difícil conectar con las emociones de otros, lo que genera malentendidos. Intenta escuchar sin juzgar.",
      Medio: "Entiendes a los demás en situaciones familiares, pero te cuesta cuando piensan diferente a ti. Practica la toma de perspectiva.",
      Alto: "¡Gran capacidad empática! Muestras interés genuino y conectas profundamente con las personas de tu entorno."
    },
    Manejo_de_Conflictos: {
      Bajo: "Tiendes a evitar los problemas o a reaccionar a la defensiva. Intenta usar la comunicación asertiva ('Yo me siento... cuando tú...').",
      Medio: "Logras resolver conflictos leves, pero las discusiones fuertes te desequilibran. Trabaja en tu escucha activa.",
      Alto: "¡Muy bien! Abordas las diferencias como oportunidades, negocias y buscas soluciones colaborativas."
    },
    Agencia: {
      Bajo: "Sueles esperar a que otros actúen por ti y te cuesta integrarte a la comunidad. Empieza proponiendo pequeñas iniciativas.",
      Medio: "Tienes iniciativa en tareas conocidas, pero te cuesta interactuar con el entorno más amplio. Confía más en tu capacidad de aportar.",
      Alto: "¡Gran liderazgo! Asumes un rol activo, reconoces tu entorno y colaboras para generar transformaciones positivas."
    },
    Toma_de_Decisiones: {
      Bajo: "Tus decisiones suelen ser impulsivas o prefieres responsabilizar a otros. Intenta evaluar los pros y contras antes de elegir.",
      Medio: "Analizas bien las situaciones rutinarias, pero bajo presión te cuesta asumir las consecuencias. Confía en tu pensamiento crítico.",
      Alto: "¡Destacado! Eres responsable, evalúas la información creativamente y asumes con madurez los resultados de tus elecciones."
    }
  };

  // --- 3. BASE DE DATOS DE LOS 30 ÍTEMS ---
  const questions = [
    // Autoconciencia
    { id: 1, text: "Identifico con claridad las emociones que estoy sintiendo cuando afronto un momento difícil.", dim: "Autoconciencia", inv: false },
    { id: 2, text: "Me cuesta mucho trabajo notar qué tipo de emoción están experimentando las personas a mi alrededor.", dim: "Autoconciencia", inv: true },
    { id: 3, text: "Asumo mis propios errores con respeto y reconozco de forma realista cuáles son mis fortalezas.", dim: "Autoconciencia", inv: false },
    { id: 4, text: "Siento un fuerte rechazo hacia mis propias conductas cuando no logro los resultados ideales.", dim: "Autoconciencia", inv: true },
    { id: 5, text: "Confío plenamente en mis capacidades personales para lograr las metas y retos que me propongo.", dim: "Autoconciencia", inv: false },
    { id: 6, text: "Siento que soy incapaz de regular mis estados de ánimo cuando las circunstancias se vuelven estresantes.", dim: "Autoconciencia", inv: true },
    // Empatía
    { id: 7, text: "Me pongo con facilidad en el lugar de otras personas para comprender sus pensamientos y emociones.", dim: "Empatia", inv: false },
    { id: 8, text: "Me cuesta mucho entender las acciones de los demás cuando sus opiniones difieren de la mía.", dim: "Empatia", inv: true },
    { id: 9, text: "Expreso un interés genuino y sincero por el bienestar emocional de las personas con quienes interactúo.", dim: "Empatia", inv: false },
    { id: 10, text: "Mantengo una distancia emocional que me impide establecer vínculos basados en la escucha atenta.", dim: "Empatia", inv: true },
    { id: 11, text: "Realizo acciones conscientes orientadas a proteger y asegurar el bienestar general de mis compañeros.", dim: "Empatia", inv: false },
    { id: 12, text: "Suelo desentenderme de las necesidades de apoyo afectivo de las personas más cercanas a mí.", dim: "Empatia", inv: true },
    // Manejo de Conflictos
    { id: 13, text: "Escucho con atención plena y sin interrumpir a la otra persona cuando expresa un punto de vista.", dim: "Manejo_de_Conflictos", inv: false },
    { id: 14, text: "Tiendo a formular mis respuestas mentalmente en lugar de prestar atención a lo que el otro dice.", dim: "Manejo_de_Conflictos", inv: true },
    { id: 15, text: "Expreso mis posturas y necesidades de forma clara y respetuosa sin vulnerar a quienes me rodean.", dim: "Manejo_de_Conflictos", inv: false },
    { id: 16, text: "Manifiesto mis ideas de forma hiriente o agresiva cuando alguien contradice mis opiniones personales.", dim: "Manejo_de_Conflictos", inv: true },
    { id: 17, text: "Busco acuerdos mediante el diálogo colaborativo intentando que todas las partes satisfagan sus necesidades.", dim: "Manejo_de_Conflictos", inv: false },
    { id: 18, text: "Intento imponer mis propios intereses en una discusión sin ceder espacio para soluciones conjuntas.", dim: "Manejo_de_Conflictos", inv: true },
    // Agencia
    { id: 19, text: "Interactúo de manera consciente con mi contexto social valorando las diversas realidades culturales.", dim: "Agencia", inv: false },
    { id: 20, text: "Ignoro las características y necesidades del contexto comunitario al momento de planear mis acciones.", dim: "Agencia", inv: true },
    { id: 21, text: "Colaboro activamente en redes de apoyo mutuo reconociendo mi interdependencia con las demás personas.", dim: "Agencia", inv: false },
    { id: 22, text: "Actúo de manera completamente aislada sin integrarme en los esfuerzos de cooperación de mi grupo.", dim: "Agencia", inv: true },
    { id: 23, text: "Tomo la iniciativa de forma autónoma y responsable para resolver los problemas cotidianos que afronto.", dim: "Agencia", inv: false },
    { id: 24, text: "Espero a que otras personas generen soluciones o tomen decisiones antes de actuar por mí mismo.", dim: "Agencia", inv: true },
    // Toma de Decisiones
    { id: 25, text: "Evalúo minuciosamente la información y las emociones de una situación antes de tomar una elección.", dim: "Toma_de_Decisiones", inv: false },
    { id: 26, text: "Elijo cursos de acción basados únicamente en impulsos del momento sin examinar los datos disponibles.", dim: "Toma_de_Decisiones", inv: true },
    { id: 27, text: "Asumo con madurez las consecuencias personales y colectivas de las decisiones que decido adoptar.", dim: "Toma_de_Decisiones", inv: false },
    { id: 28, text: "Trato de responsabilizar a factores externos o a terceros cuando los resultados de mis elecciones fallan.", dim: "Toma_de_Decisiones", inv: true },
    { id: 29, text: "Genero alternativas novedosas y creativas para afrontar las situaciones complejas desde miradas distintas.", dim: "Toma_de_Decisiones", inv: false },
    { id: 30, text: "Recurro siempre a los mismos métodos tradicionales evitando buscar ideas originales para resolver problemas.", dim: "Toma_de_Decisiones", inv: true },
  ];

  // --- 4. FUNCIÓN PARA GUARDAR EN GOOGLE SHEETS ---
  const saveDataToSheets = async (scores) => {
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genero: "Registrado en la app", // Aquí podrías atar los estados sociodemográficos
          edad: "Registrada",
          area: "Registrada",
          autoconciencia: scores.Autoconciencia,
          empatia: scores.Empatia,
          manejoConflictos: scores.Manejo_de_Conflictos,
          agencia: scores.Agencia,
          tomaDecisiones: scores.Toma_de_Decisiones
        })
      });
      console.log("Datos enviados a Google Sheets con éxito.");
    } catch (error) {
      console.error("Error guardando en Sheets", error);
      Alert.alert("Error de conexión", "No se pudieron guardar los resultados en la base de datos.");
    }
  };

  // --- 5. LÓGICA DE LA ESCALA (EVALUAR) ---
  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateScore = () => {
    // Validar si respondió todas
    if (Object.keys(answers).length < 30) {
      Alert.alert("Atención", "Por favor responde los 30 ítems para generar tu perfil.");
      return;
    }

    let scores = { Autoconciencia: 0, Empatia: 0, Manejo_de_Conflictos: 0, Agencia: 0, Toma_de_Decisiones: 0 };
    
    questions.forEach(q => {
      let val = answers[q.id];
      if (q.inv) {
        val = 6 - val; // Inversión: 1->5, 2->4, 4->2, 5->1
      }
      scores[q.dim] += val;
    });

    // Clasificación de perfiles
    let newProfiles = {};
    for (const [key, value] of Object.entries(scores)) {
      if (value >= 6 && value <= 14) newProfiles[key] = "Bajo";
      else if (value >= 15 && value <= 22) newProfiles[key] = "Medio";
      else newProfiles[key] = "Alto";
    }
    
    setProfiles(newProfiles);
    saveDataToSheets(scores); // Ejecuta el guardado en la nube
    setCurrentScreen('EvalResult');
  };

  // --- 6. LÓGICA DE GAMIFICACIÓN (REGULAR) ---
  const completeRegulation = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    // Reiniciar variables de registro
    setRegEmotion(''); setRegIntensity(''); setRegLocation(''); setRegCompany('');
    
    if (newStreak > 0 && newStreak % 5 === 0) {
      Alert.alert("¡Felicidades! 🏆", `Has alcanzado una racha de ${newStreak} días. ¡Nuevo trofeo desbloqueado!`);
    } else {
      Alert.alert("¡Excelente trabajo!", "Has completado tu ejercicio de regulación de hoy.");
    }
    setCurrentScreen('Home');
  };

  const getTrophies = () => {
    const trophyCount = Math.floor(streak / 5);
    return trophyCount > 0 ? "🏆".repeat(trophyCount) : "Aún no hay trofeos";
  };


  // ==========================================
  // --- 7. RENDERIZADO DE VISTAS (PANTALLAS) ---
  // ==========================================

  // PANTALLA 1: INICIO
  if (currentScreen === 'Home') {
    return (
      <View style={styles.container}>
        <Text style={styles.titleMain}>Bienestar Socioemocional</Text>
        
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Racha de Regulación: {streak} días 🔥</Text>
          <Text style={styles.trophies}>{getTrophies()}</Text>
          <Text style={styles.streakSub}>Suma 5 días seguidos para ganar un trofeo.</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('Evaluar')}>
          <Text style={styles.buttonText}>Evaluar mis habilidades socioemocionales</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('RegularMenu')}>
          <Text style={styles.buttonText}>Regular mis emociones</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // PANTALLA 2: EVALUACIÓN DE HSE (TEST)
  if (currentScreen === 'Evaluar') {
    return (
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Evaluación de HSE</Text>
        <Text style={styles.instructions}>1 = Nunca | 5 = Siempre</Text>
        
        {questions.map((q) => (
          <View key={q.id} style={styles.questionBlock}>
            <Text style={styles.questionText}>{q.id}. {q.text}</Text>
            <View style={styles.buttonRow}>
              {[1, 2, 3, 4, 5].map(val => (
                <TouchableOpacity 
                  key={val} 
                  style={[styles.likertBtn, answers[q.id] === val && styles.likertBtnSelected]}
                  onPress={() => handleAnswer(q.id, val)}>
                  <Text style={[styles.likertText, answers[q.id] === val && styles.likertTextSelected]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.actionButton} onPress={calculateScore}>
          <Text style={styles.buttonText}>Finalizar y ver Perfil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => setCurrentScreen('Home')}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // PANTALLA 3: RESULTADOS DEL PERFIL
  if (currentScreen === 'EvalResult') {
    return (
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Tu Perfil Socioemocional</Text>
        
        {Object.entries(profiles).map(([dim, level]) => (
          <View key={dim} style={styles.feedbackBlock}>
            <Text style={styles.feedbackTitle}>{dim.replace(/_/g, " ").toUpperCase()} - Nivel: {level}</Text>
            <Text style={styles.feedbackText}>{feedbackData[dim][level]}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.actionButton} onPress={() => { setAnswers({}); setCurrentScreen('Home'); }}>
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // PANTALLA 4: MENÚ REGULAR EMOCIONES (REGISTRO)
  if (currentScreen === 'RegularMenu') {
    return (
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Registro Emocional</Text>
        
        <Text style={styles.label}>¿Qué emoción básica estás sintiendo?</Text>
        <View style={styles.optionsGrid}>
          {Object.keys(emotionsData).map(emo => (
            <TouchableOpacity key={emo} style={[styles.optionBtn, regEmotion === emo && styles.optionSelected]} onPress={() => setRegEmotion(emo)}>
              <Text style={[styles.optionText, regEmotion === emo && styles.optionTextSelected]}>{emo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>¿Cuál es la intensidad?</Text>
        <View style={styles.optionsRow}>
          {['Baja', 'Media', 'Alta'].map(int => (
            <TouchableOpacity key={int} style={[styles.optionBtn, regIntensity === int && styles.optionSelected]} onPress={() => setRegIntensity(int)}>
              <Text style={[styles.optionText, regIntensity === int && styles.optionTextSelected]}>{int}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>¿Dónde estás?</Text>
        <View style={styles.optionsGrid}>
          {['Casa', 'Colegio', 'Calle', 'Trabajo', 'Otro'].map(loc => (
            <TouchableOpacity key={loc} style={[styles.optionBtn, regLocation === loc && styles.optionSelected]} onPress={() => setRegLocation(loc)}>
              <Text style={[styles.optionText, regLocation === loc && styles.optionTextSelected]}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>¿Con quién estás?</Text>
        <View style={styles.optionsGrid}>
          {['Solo/a', 'Familia', 'Pareja', 'Profesor', 'Compañero', 'Jefe', 'Desconocido'].map(comp => (
            <TouchableOpacity key={comp} style={[styles.optionBtn, regCompany === comp && styles.optionSelected]} onPress={() => setRegCompany(comp)}>
              <Text style={[styles.optionText, regCompany === comp && styles.optionTextSelected]}>{comp}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, (!regEmotion || !regIntensity || !regLocation || !regCompany) && styles.disabledBtn]} 
          disabled={!regEmotion || !regIntensity || !regLocation || !regCompany}
          onPress={() => setCurrentScreen('RegularPsycho')}>
          <Text style={styles.buttonText}>Continuar a Ejercicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => setCurrentScreen('Home')}>
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // PANTALLA 5: PSICOEDUCACIÓN
  if (currentScreen === 'RegularPsycho') {
    const data = emotionsData[regEmotion];
    return (
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Comprendiendo tu {regEmotion}</Text>
        
        <View style={styles.psychoBlock}>
          <Text style={styles.psychoHeader}>🧠 Función:</Text>
          <Text style={styles.psychoText}>{data.funcion}</Text>
          
          <Text style={styles.psychoHeader}>🫀 En el cuerpo:</Text>
          <Text style={styles.psychoText}>{data.cuerpo}</Text>
          
          <Text style={styles.psychoHeader}>💭 En la mente:</Text>
          <Text style={styles.psychoText}>{data.mente}</Text>
        </View>

        <Text style={styles.labelExercise}>Ejercicio sugerido para ti:</Text>
        <Text style={styles.exerciseSuggestion}>{data.ejercicio}</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('RegularExercise')}>
          <Text style={styles.buttonText}>Iniciar Ejercicio Interactivo</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // PANTALLA 6: EJERCICIO ACTIVO
  if (currentScreen === 'RegularExercise') {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.title}>Modo Regulación</Text>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseFocus}>{emotionsData[regEmotion].ejercicio}</Text>
        </View>
        <Text style={styles.descriptionText}>Concéntrate en el momento presente. Realiza este ejercicio a tu propio ritmo. Cuando sientas que tu cuerpo ha vuelto a la calma, finaliza el ejercicio.</Text>
        
        <TouchableOpacity style={styles.successButton} onPress={completeRegulation}>
          <Text style={styles.buttonText}>¡Hecho, me siento mejor!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// --- ESTILOS VISUALES ---
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F0F4F8' },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F0F4F8' },
  scroll: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#F0F4F8' },
  
  titleMain: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#2C3E50' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#2C3E50' },
  instructions: { textAlign: 'center', marginBottom: 20, fontSize: 16, color: '#7F8C8D', fontStyle: 'italic' },
  descriptionText: { textAlign: 'center', marginVertical: 30, fontSize: 16, color: '#555', lineHeight: 24 },
  
  // Gamificación
  streakCard: { backgroundColor: '#FFF', padding: 25, borderRadius: 15, alignItems: 'center', marginBottom: 40, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },
  streakTitle: { fontSize: 20, fontWeight: 'bold', color: '#E74C3C' },
  trophies: { fontSize: 35, marginTop: 15 },
  streakSub: { color: '#7F8C8D', marginTop: 10, fontSize: 14 },
  
  // Botones
  primaryButton: { backgroundColor: '#3498DB', padding: 18, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3 },
  secondaryButton: { backgroundColor: '#2ECC71', padding: 18, borderRadius: 12, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 3 },
  actionButton: { backgroundColor: '#8E44AD', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 15 },
  successButton: { backgroundColor: '#27AE60', padding: 18, borderRadius: 12, width: '100%', alignItems: 'center', marginTop: 20 },
  cancelButton: { backgroundColor: '#95A5A6', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  disabledBtn: { backgroundColor: '#BDC3C7' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
  
  // Test Likert
  questionBlock: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, elevation: 2 },
  questionText: { fontSize: 16, marginBottom: 15, color: '#34495E', lineHeight: 22 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  likertBtn: { padding: 12, backgroundColor: '#F2F4F4', borderRadius: 8, width: 45, alignItems: 'center' },
  likertBtnSelected: { backgroundColor: '#3498DB' },
  likertText: { color: '#34495E', fontWeight: 'bold' },
  likertTextSelected: { color: '#FFF' },
  
  // Feedback HSE
  feedbackBlock: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15, borderLeftWidth: 6, borderLeftColor: '#3498DB', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, elevation: 2 },
  feedbackTitle: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 },
  feedbackText: { fontSize: 15, color: '#555', lineHeight: 22 },

  // Regulación
  label: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 12, color: '#2C3E50' },
  labelExercise: { fontSize: 20, fontWeight: 'bold', marginTop: 30, color: '#8E44AD', textAlign: 'center' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  optionBtn: { backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 25, margin: 5, borderWidth: 1, borderColor: '#BDC3C7' },
  optionSelected: { backgroundColor: '#2ECC71', borderColor: '#2ECC71' },
  optionText: { color: '#34495E', fontWeight: '600', fontSize: 15 },
  optionTextSelected: { color: '#FFF' },
  
  // Psicoeducación
  psychoBlock: { backgroundColor: '#FFF', padding: 25, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 3 },
  psychoHeader: { fontSize: 17, fontWeight: 'bold', color: '#34495E', marginTop: 15 },
  psychoText: { fontSize: 15, color: '#555', marginBottom: 5, marginTop: 5, lineHeight: 22 },
  exerciseSuggestion: { fontSize: 18, fontStyle: 'italic', color: '#2C3E50', textAlign: 'center', marginTop: 15, marginBottom: 30, paddingHorizontal: 10, lineHeight: 26 },
  
  // Ejercicio Activo
  exerciseCard: { backgroundColor: '#FFF', padding: 30, borderRadius: 15, width: '100%', shadowColor: '#E67E22', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  exerciseFocus: { fontSize: 22, fontWeight: 'bold', color: '#E67E22', textAlign: 'center', lineHeight: 32 }
});