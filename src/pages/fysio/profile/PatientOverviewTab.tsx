import { ClipboardTextIcon, WarningIcon } from '@phosphor-icons/react'
import { Link, useParams } from 'react-router'
import { PainChart } from '@/components/charts/PainChart'
import { WeekGoalChart } from '@/components/charts/WeekGoalChart'
import { FlagList } from '@/components/fysio/FlagList'
import { PhysioNotes } from '@/components/fysio/PhysioNotes'
import { RecentSessionsTable } from '@/components/fysio/RecentSessionsTable'
import { PainMap } from '@/components/pain/PainMap'
import { ExerciseProgressList } from '@/components/progress/ExerciseProgressList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { adherence, painInfo } from '@/lib/stats'
import { usePatient } from '@/state/app-context'

export function PatientOverviewTab() {
  const patient = usePatient(useParams().patientId)

  if (!patient.program.items.length)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClipboardTextIcon />
          </EmptyMedia>
          <EmptyTitle>{patient.firstName} har inget program ännu</EmptyTitle>
          <EmptyDescription>Skapa ett program så kan du följa träning och smärta här.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="default">
            <Link to="program">Skapa program</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )

  const a = adherence(patient)
  const pain = painInfo(patient)
  const pct = a.pct ?? 0

  return (
    <>
      {pain && pain.last.pain > patient.painLimit && (
        <Alert variant="danger">
          <WarningIcon />
          <AlertTitle>Smärtan ligger över gränsen {patient.painLimit}/10</AlertTitle>
          <AlertDescription>Senast {pain.last.pain}/10. Överväg att sänka belastningen eller byta övning.</AlertDescription>
          <Button asChild size="sm" variant="default" className="col-start-2 mt-2 w-fit">
            <Link to="program">Justera program</Link>
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-3 md:[&>:last-child]:col-span-full lg:[&>:last-child]:col-span-1">
        <Card>
          <CardHeader className="mb-0">
            <CardTitle>Följsamhet</CardTitle>
            <CardDescription>Pass per vecka mot målet {patient.program.perWeek}</CardDescription>
            <CardAction>
              <Badge variant={pct < 60 ? 'danger' : pct < 85 ? 'warning' : 'success'}>{pct < 60 ? 'Låg' : pct < 85 ? 'Sjunkande' : 'Bra'}</Badge>
            </CardAction>
          </CardHeader>
          <div className="mt-1.5 flex items-center gap-2">
            <strong className="text-[2rem]">{a.pct} %</strong>
            <span className="text-[.9rem] text-muted-foreground">{a.done} av {a.plan} pass, 14 dagar<br />Snitt {a.volume ?? '–'} % av ordinerad mängd</span>
          </div>
          <WeekGoalChart patient={patient} />
        </Card>
        <Card>
          <CardHeader className="mb-0">
            <CardTitle>Smärta (VAS 0–10)</CardTitle>
            <CardDescription>Efter varje pass, 28 dagar</CardDescription>
            <CardAction>{pain && pain.trend > 0.5 ? <Badge variant="danger">Ökar</Badge> : pain && pain.trend < -0.5 ? <Badge variant="success">Minskar</Badge> : null}</CardAction>
          </CardHeader>
          <PainChart patient={patient} />
          <p className="text-[.9rem] text-muted-foreground">
            <span className="mr-1.5 inline-block w-4 border-t-2 border-dashed border-warning align-middle" />Smärtgräns {patient.painLimit}/10
          </p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Smärtkarta</CardTitle>
            <CardDescription>14 dagar, från pass och meddelanden</CardDescription>
          </CardHeader>
          <PainMap patient={patient} />
        </Card>
      </div>

      <PhysioNotes patient={patient} />

      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card className="content-start">
          <CardHeader>
            <CardTitle>Att titta på</CardTitle>
            <CardDescription>Bara det {patient.firstName} har flaggat eller kommenterat, senaste 3 veckorna</CardDescription>
          </CardHeader>
          <FlagList patient={patient} />
        </Card>
        <Card>
          <CardHeader className="mb-1">
            <CardTitle>Per övning</CardTitle>
            <CardDescription>Andel av ordinerad mängd, 14 dagar</CardDescription>
          </CardHeader>
          <ExerciseProgressList patient={patient} />
        </Card>
      </div>

      <RecentSessionsTable patient={patient} />
    </>
  )
}
