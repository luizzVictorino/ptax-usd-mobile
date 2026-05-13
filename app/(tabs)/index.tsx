import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import {
  createObjectiveOutput,
  normalizeDateInput,
  parseBrazilianDate,
  queryPtaxForDate,
  queryPtaxRange,
  type QueryMode,
} from "@/lib/ptax";

const TODAY = new Date();
const TODAY_BR = `${String(TODAY.getDate()).padStart(2, "0")}/${String(TODAY.getMonth() + 1).padStart(2, "0")}/${TODAY.getFullYear()}`;

function Field({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(normalizeDateInput(text))}
        placeholder={placeholder}
        placeholderTextColor="#8A94A6"
        keyboardType="number-pad"
        maxLength={10}
        returnKeyType="done"
        className="h-14 rounded-2xl border border-border bg-surface px-4 text-lg text-foreground"
        accessibilityLabel={label}
      />
    </View>
  );
}

export default function HomeScreen() {
  const [mode, setMode] = useState<QueryMode>("single");
  const [singleDate, setSingleDate] = useState(TODAY_BR);
  const [startDate, setStartDate] = useState("01/05/2026");
  const [endDate, setEndDate] = useState(TODAY_BR);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Informe a data e consulte a PTAX USD/BRL oficial.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (mode === "single") return singleDate.length === 10;
    return startDate.length === 10 && endDate.length === 10;
  }, [endDate, loading, mode, singleDate, startDate]);

  async function handleSubmit() {
    setError("");
    setOutput("");

    const parsedSingle = parseBrazilianDate(singleDate);
    const parsedStart = parseBrazilianDate(startDate);
    const parsedEnd = parseBrazilianDate(endDate);

    if (mode === "single" && !parsedSingle) {
      setError("Use uma data válida no formato dd/mm/aaaa.");
      return;
    }

    if (mode === "range" && (!parsedStart || !parsedEnd)) {
      setError("Use datas válidas no formato dd/mm/aaaa.");
      return;
    }

    setLoading(true);
    setStatus("Consultando dados oficiais do BACEN...");

    try {
      const lines =
        mode === "single" && parsedSingle
          ? await queryPtaxForDate(parsedSingle)
          : await queryPtaxRange(parsedStart!, parsedEnd!);

      const objectiveOutput = createObjectiveOutput(lines);
      setOutput(objectiveOutput);
      setStatus(lines.some((line) => line.isPartial) ? "Cotação parcial identificada." : "PTAX fechada disponível.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível consultar o BACEN agora.");
      setStatus("Falha na consulta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer className="px-5 pb-4" containerClassName="bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 28 }}
        >
          <View className="gap-6 pt-3">
            <View className="gap-3">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                <Text className="text-xl font-black text-white">$</Text>
              </View>
              <View className="gap-1">
                <Text className="text-4xl font-bold tracking-tight text-foreground">PTAX USD</Text>
                <Text className="text-base leading-6 text-muted">
                  Consulta objetiva da cotação USD/BRL usando a API oficial do Banco Central do Brasil.
                </Text>
              </View>
            </View>

            <View className="rounded-3xl border border-border bg-surface p-2">
              <View className="flex-row gap-2">
                {(["single", "range"] as QueryMode[]).map((item) => {
                  const selected = mode === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={0.78}
                      onPress={() => setMode(item)}
                      className={`flex-1 rounded-2xl px-3 py-3 ${selected ? "bg-primary" : "bg-transparent"}`}
                    >
                      <Text className={`text-center text-sm font-bold ${selected ? "text-white" : "text-muted"}`}>
                        {item === "single" ? "Data única" : "Intervalo"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View className="gap-4 rounded-3xl border border-border bg-surface p-5 shadow-sm">
              {mode === "single" ? (
                <Field label="Data específica" value={singleDate} onChangeText={setSingleDate} placeholder="dd/mm/aaaa" />
              ) : (
                <>
                  <Field label="Data inicial" value={startDate} onChangeText={setStartDate} placeholder="dd/mm/aaaa" />
                  <Field label="Data final" value={endDate} onChangeText={setEndDate} placeholder="dd/mm/aaaa" />
                </>
              )}

              <TouchableOpacity
                activeOpacity={0.82}
                disabled={!canSubmit}
                onPress={handleSubmit}
                className={`h-14 items-center justify-center rounded-2xl ${canSubmit ? "bg-primary" : "bg-border"}`}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-bold text-white">Consultar PTAX</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              <Text className="text-sm font-semibold uppercase tracking-wide text-muted">Resultado</Text>
              <View className="min-h-40 rounded-3xl border border-border bg-surface p-5">
                {output ? (
                  <Text className="font-mono text-base leading-7 text-foreground">{output}</Text>
                ) : (
                  <Text className="text-base leading-6 text-muted">A saída aparecerá aqui no formato objetivo solicitado.</Text>
                )}
              </View>
            </View>

            <View className="rounded-2xl bg-surface px-4 py-3">
              <Text className="text-sm leading-5 text-muted">{status}</Text>
              {error ? <Text className="mt-2 text-sm font-semibold leading-5 text-error">{error}</Text> : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
