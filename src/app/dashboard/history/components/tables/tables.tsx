import { useGetBeehivesData } from '@dashboard/shared/hooks'
import { BeehiveTable } from './beehive-table'
import { StationName } from '@dashboard/beehives/components/cards/interfaces'
import { Card, CardBody, Skeleton } from '@nextui-org/react'

export const Tables = () => {
  const { data, loading } = useGetBeehivesData()

  if (loading) {
    return (
      <Skeleton className='rounded-lg'>
        <div className='w-full h-64 flex items-center justify-center'>
          Cargando tablas...
        </div>
      </Skeleton>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardBody>No existe información en el momento</CardBody>
      </Card>
    )
  }

  return (
    <div className='grid gap-4'>
      {Object.entries(data?.beehiveStation ?? {}).map(
        ([stationName, stationData]) => (
          <BeehiveTable
            key={stationName}
            stationData={stationData}
            stationName={stationName as StationName}
          />
        )
      )}
    </div>
  )
}
