import { CircleCheck, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PainLimitNote({ pain, limit }: { pain: number | null; limit: number }) {
  if (pain == null) return null;
  return pain <= limit ? (
    <Alert variant="success" className="mt-2 text-[.9rem]">
      <CircleCheck />
      <AlertDescription>Inom din gräns på {limit}/10. Fortsätt som vanligt.</AlertDescription>
    </Alert>
  ) : (
    <Alert variant="danger" className="mt-2 text-[.9rem]">
      <TriangleAlert />
      <AlertTitle>Över din gräns på {limit}/10.</AlertTitle>
      <AlertDescription>Ta det lugnare nästa pass. Håller det i sig, skriv till Erik.</AlertDescription>
    </Alert>
  );
}
