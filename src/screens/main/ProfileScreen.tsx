// ─────────────────────────────────────────────
// screens/main/ProfileScreen.tsx
// Pantalla de perfil del usuario.
// Muestra los datos reales del usuario autenticado (Supabase),
// permite cerrar sesión de verdad y cambiar el tema claro/oscuro.
// ─────────────────────────────────────────────

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useAppSelector } from "../../store/hooks";

// Componente auxiliar para mostrar cada estadística
const StatBox: React.FC<{ value: string | number; label: string; color: string; labelColor: string }> = (
  { value, label, color, labelColor }
) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: labelColor }]}>{label}</Text>
  </View>
);

// Componente auxiliar para cada fila de información
const InfoRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  borderColor: string;
  labelColor: string;
  valueColor: string;
}> = ({ icon, label, value, borderColor, labelColor, valueColor }) => (
  <View style={[styles.infoRow, { borderBottomColor: borderColor }]}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View>
      <Text style={[styles.infoLabel, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
    </View>
  </View>
);

const ProfileScreen: React.FC = () => {
  // Usuario real autenticado en Supabase
  const { user, signOut } = useAuth();
  // Tema activo y función para alternarlo
  const { colors, mode, toggleTheme } = useTheme();
  // Cantidad de artículos publicados por este usuario (desde Redux)
  const articles = useAppSelector((state) => state.articles.items);
  const myArticlesCount = articles.filter((a) => a.user_id === user?.id).length;

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || "Usuario";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Sección de avatar y nombre */}
        <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
          {/* Avatar generado con iniciales (sin imagen de red) */}
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={[styles.avatarText, { color: colors.surface }]}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.surface }]}>{displayName}</Text>
          <Text style={[styles.userLocation, { color: colors.primaryLight }]}>
            📍 Honduras
          </Text>
        </View>

        {/* Estadísticas del usuario */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
          <StatBox value={myArticlesCount} label="Publicados" color={colors.primary} labelColor={colors.textSecondary} />
          <StatBox value={0} label="Recibidos" color={colors.primary} labelColor={colors.textSecondary} />
          <StatBox value="0kg" label="CO₂ ahorrado" color={colors.primary} labelColor={colors.textSecondary} />
        </View>

        {/* Información personal del usuario */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Información personal
          </Text>
          <InfoRow
            icon="✉️"
            label="Correo"
            value={user?.email ?? "—"}
            borderColor={colors.border}
            labelColor={colors.textSecondary}
            valueColor={colors.textPrimary}
          />
        </View>

        {/* Preferencias: modo oscuro */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Preferencias
          </Text>
          <View style={styles.switchRow}>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
              Modo oscuro
            </Text>
            <Switch
              value={mode === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        {/* Botón de cierre de sesión real */}
        <View style={styles.logoutContainer}>
          <CustomButton
            title="Cerrar sesión"
            onPress={signOut}
            variant="outline"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
  },
  userLocation: {
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
});

export default ProfileScreen;
