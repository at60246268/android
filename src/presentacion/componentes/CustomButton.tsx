import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[styles.text, variant === "secondary" && styles.textSecondary]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    backgroundColor: "#ea580c",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 6,
    width: "100%",
  },
  secondary: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  danger: {
    backgroundColor: "#dc2626",
  },
  text: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  textSecondary: {
    color: "#334155",
  },
});
