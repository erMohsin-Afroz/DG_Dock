
import { useEffect, useState } from "react";
import type { FormConfiguration } from "../types";
import { defaultConfiguration } from "../types";

const STORAGE_KEY = "dg-dock-dynamic-form-builder";

interface SavedBuilderData {
  configuration: FormConfiguration;
}

export function useFormPersistence() {
  const [configuration, setConfiguration] =
    useState<FormConfiguration>(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return defaultConfiguration;

        const parsed = JSON.parse(saved) as SavedBuilderData;

        if (
          !parsed.configuration ||
          !Array.isArray(parsed.configuration.fields)
        ) {
          return defaultConfiguration;
        }

        return parsed.configuration;
      } catch {
        return defaultConfiguration;
      }
    });

  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setIsSaved(false);

    const timeout = window.setTimeout(() => {
      try {
        const data: SavedBuilderData = { configuration };

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(data),
        );

        setIsSaved(true);
      } catch {
        setIsSaved(false);
      }
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [configuration]);

  return {
    configuration,
    setConfiguration,
    isSaved,
  };
}
