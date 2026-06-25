// ─────────────────────────────────────────────
// components/CategoryDropdown.tsx
// Selector tipo "dropdown" para elegir una categoría
// de una lista fija, sin necesidad de escribirla.
// Implementado con un Modal + FlatList (sin librerías
// externas) para mantener control total del estilo.
// ─────────────────────────────────────────────

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface CategoryDropdownProps {
  label: string;
  selected: string;
  options: readonly string[];
  onSelect: (value: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  label,
  selected,
  options,
  onSelect,
}) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>

      {/* Caja que muestra la selección actual y abre el modal */}
      <TouchableOpacity
        style={[styles.box, { borderColor: colors.border, backgroundColor: colors.background }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: selected ? colors.text : colors.textSecondary }}>
          {selected || "Selecciona una categoría"}
        </Text>
        <Text style={{ color: colors.textSecondary }}>▾</Text>
      </TouchableOpacity>

      {/* Modal con la lista de opciones */}
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={[styles.menu, { backgroundColor: colors.surface }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={{
                      color: item === selected ? colors.primary : colors.text,
                      fontWeight: item === selected ? "700" : "400",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: colors.border }} />
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  menu: {
    borderRadius: 14,
    maxHeight: 320,
    paddingVertical: 6,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
});

export default CategoryDropdown;