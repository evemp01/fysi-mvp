import { useParams } from 'react-router'
import { PhysioThread } from '@/components/fysio/PhysioThread'
import { usePatient } from '@/state/app-context'

export function PatientMessagesTab() {
  const patient = usePatient(useParams().patientId)
  return (
    <div className="max-w-[760px]">
      <PhysioThread patient={patient} />
    </div>
  )
}
