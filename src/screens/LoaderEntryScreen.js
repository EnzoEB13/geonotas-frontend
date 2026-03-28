import React, { useEffect } from "react";
import LoaderScreen from "../components/LoaderScreen";

export default function LoaderEntryScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace("MainTabs");
    }, 1200);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return <LoaderScreen message="Preparando la aplicación..." />;
}