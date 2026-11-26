import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TEXT_SIZES, useApp } from "@/state/app-context";

export function SettingsPage() {
  const { textSize, setTextSize } = useApp();
  return (
    <div className="mx-auto grid max-w-2xl gap-4.5 px-[max(3vw,16px)] pt-6 pb-10">
      <h1>Inställningar</h1>
      <Card>
        <CardHeader>
          <CardTitle>Textstorlek</CardTitle>
          <CardDescription>Gäller hela appen, både patientappen och fysioterapeutens vy.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={String(textSize)} onValueChange={(v) => setTextSize(Number(v))} aria-label="Textstorlek" className="grid-cols-2 sm:grid-cols-4">
            {TEXT_SIZES.map((s, i) => (
              <FieldLabel key={s.value} htmlFor={`text-size-${i}`}>
                <Field orientation="horizontal">
                  <RadioGroupItem value={String(i)} id={`text-size-${i}`} />
                  <FieldContent>
                    {/* Fixed px so each option previews its own size, whatever is selected. */}
                    <span aria-hidden="true" className="leading-none font-extrabold" style={{ fontSize: `${(parseFloat(s.value) / 100) * 22}px` }}>
                      Aa
                    </span>
                    <FieldTitle className="font-medium">{s.label}</FieldTitle>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          <Alert variant="brand" className="mt-4">
            <AlertTitle>Förhandsvisning</AlertTitle>
            <AlertDescription>Hej Olof! Du har 2 pass kvar den här veckan.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
