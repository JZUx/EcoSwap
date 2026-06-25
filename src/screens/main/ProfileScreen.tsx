// ─────────────────────────────────────────────
// screens/main/ProfileScreen.tsx
// Pantalla de perfil del usuario.
// Muestra los datos reales del usuario autenticado (Supabase),
// permite cerrar sesión, cambiar tema, y ahora también
// editar teléfono + ubicación (departamento/ciudad), que se
// reutilizan automáticamente en todas sus publicaciones.
// ─────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import CategoryDropdown from "../../components/CategoryDropdown";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyProfile, saveMyProfile } from "../../store/profileSlice";
import { HONDURAS_DEPARTMENTS } from "../../utils/honduras";

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
  const { user, signOut } = useAuth();
  const { colors, mode, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  const articles = useAppSelector((state) => state.articles.items);
  const myArticlesCount = articles.filter((a) => a.user_id === user?.id).length;

  // Perfil (teléfono + ubicación) desde Redux
  const { data: profile, loading: profileLoading } = useAppSelector((state) => state.profile);

  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || "Usuario";

  // Al entrar a la pantalla, traemos el perfil real del usuario
  useEffect(() => {
    if (user) dispatch(fetchMyProfile(user.id));
  }, [dispatch, user]);

  // Cuando llega el perfil desde Supabase, precargamos el formulario
  useEffect(() => {
    if (profile) {
      setPhone(profile.phone ?? "");
      setDepartment(profile.department ?? "");
      setCity(profile.city ?? "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const result = await dispatch(
      saveMyProfile({ id: user.id, phone: phone.trim(), department, city: city.trim() })
    );
    setSaving(false);

    if (saveMyProfile.rejected.match(result)) {
      Alert.alert("No se pudo guardar", String(result.payload));
      return;
    }
    Alert.alert("Listo", "Tu información de contacto se actualizó correctamente.");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Sección de avatar y nombre */}
        <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={[styles.avatarText, { color: colors.surface }]}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.surface }]}>{displayName}</Text>
          <Text style={[styles.userLocation, { color: colors.primaryLight }]}>
            📍 {city && department ? `${city}, ${department}` : "Honduras"}
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

        {/* Información de contacto: teléfono + ubicación */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Información de contacto
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 14 }}>
            Esta información se mostrará a otros usuarios interesados en tus artículos.
          </Text>

          <CustomInput
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            placeholder="Ej. 9999-9999"
            keyboardType="phone-pad"
          />

          <CategoryDropdown
            label="Departamento"
            selected={department}
            options={HONDURAS_DEPARTMENTS}
            onSelect={setDepartment}
          />

          <CustomInput
            label="Ciudad"
            value={city}
            onChangeText={setCity}
            placeholder="Ej. San Pedro Sula"
          />

          <CustomButton
            title="Guardar información"
            onPress={handleSaveProfile}
            loading={saving || profileLoading}
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