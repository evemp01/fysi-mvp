import { ArrowLeftIcon } from '@phosphor-icons/react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { PatientHeaderCard } from '@/components/fysio/PatientHeaderCard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePatient } from '@/state/app-context'

export function PatientProfileLayout() {
  const patient = usePatient(useParams().patientId)
  const navigate = useNavigate()
  const tab = useLocation().pathname.split('/')[4] ?? ''
  const tabs = [
    { value: '', label: 'Översikt' },
    { value: 'program', label: 'Träningsprogram' },
    { value: 'messages', label: `Meddelanden${patient.unread ? ` (${patient.unread})` : ''}` },
  ]

  return (
    <>
      <Button asChild variant="link" size="inline" className="justify-self-start pl-0">
        <Link to="/fysio/patients">
          <ArrowLeftIcon className="size-4.5" /> Patienter
        </Link>
      </Button>
      <PatientHeaderCard patient={patient} />
      <Tabs value={tab} onValueChange={(v) => navigate(`/fysio/patients/${patient.id}${v ? `/${v}` : ''}`)}>
        <TabsList variant="line" className="h-auto w-full justify-start gap-1 rounded-none border-b-2 p-0">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="-mb-0.5 min-h-12 flex-none rounded-none border-0 border-b-[3px] border-transparent px-3.5 py-3 text-base font-bold text-muted-foreground after:hidden data-active:border-brand data-active:text-brand"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Outlet />
    </>
  )
}
