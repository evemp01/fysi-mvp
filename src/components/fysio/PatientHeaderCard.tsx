import { FileText, MessageCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Patient } from "@/data/types";
import { formatShort, fromKey } from "@/lib/dates";
import { initials } from "@/lib/patient";
import { patientStatus, programWeek } from "@/lib/stats";
import { JournalDialog } from "./JournalDialog";

export function PatientHeaderCard({ patient }: { patient: Patient }) {
  const [journalOpen, setJournalOpen] = useState(false);
  const [status, tone] = patientStatus(patient);
  return (
    <Card className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto]">
      <InitialsAvatar className="size-14 text-[1.1rem]">{initials(patient)}</InitialsAvatar>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-[1.6rem]">{patient.name}</h1>
          <Badge variant={tone === "brand" ? "default" : tone}>{status}</Badge>
        </div>
        <p className="text-[.9rem] text-muted-foreground">
          {patient.age} år · {patient.diagnosis}
          {patient.program.items.length > 0 && ` · Vecka ${programWeek(patient)} av ${patient.weeks}`} · Nästa besök {formatShort(fromKey(patient.nextVisit))}
        </p>
      </div>
      <div className="col-span-full flex flex-wrap gap-2 md:col-span-1">
        <Button asChild size="sm">
          <Link to="messages">
            <MessageCircle className="size-4.5" />
            Meddelande
          </Link>
        </Button>
        <Button size="sm" onClick={() => setJournalOpen(true)}>
          <FileText className="size-4.5" />
          Exportera till journal
        </Button>
        <Button asChild size="sm" variant="default">
          <Link to="program">
            <Pencil className="size-4.5" />
            Justera program
          </Link>
        </Button>
      </div>
      {journalOpen && <JournalDialog patient={patient} onClose={() => setJournalOpen(false)} />}
    </Card>
  );
}
