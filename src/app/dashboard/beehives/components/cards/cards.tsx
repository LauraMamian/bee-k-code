import { Card, CardBody, Skeleton } from '@nextui-org/react'
import { ColmenaCard } from './components'

import { StationName } from './interfaces/firebase-data.interface'

import { useGetBeehivesData } from '@dashboard/shared/hooks'

export const Cards: React.FC = () => {
  const { data, loading } = useGetBeehivesData()

  if (loading) {
    return (
      <Skeleton className='rounded-lg'>
        <div className='w-full h-64 flex items-center justify-center'>
          Cargando colmenas...
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
    <div className='flex flex-col gap-3'>
      <div className='grid gap-3 grid-cols-[repeat(auto-fill,minmax(350px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]'>
        {Object.entries(data?.lastRecords ?? {}).map(
          ([stationName, stationData]) => (
            <ColmenaCard
              key={stationName}
              stationData={stationData}
              stationName={stationName as StationName}
            />
          )
        )}
      </div>
    </div>
  )
}
