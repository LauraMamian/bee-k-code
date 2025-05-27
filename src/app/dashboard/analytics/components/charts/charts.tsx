import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Button, Card, CardBody, Skeleton, Tabs, Tab } from '@nextui-org/react'
import { useGetBeehivesData } from '@dashboard/shared/hooks'
import {
  TempChart,
  HumidityChart,
  BeesActivityChart,
  RainChart,
  SunChart
} from './components'
import { icons } from '@dashboard/shared/components/measure-icons'
import { StationName } from './interfaces/firebase-data.interface'
import { formatSelectedDate } from '@dashboard/shared/utils'

export const Charts: React.FC = () => {
  const { data, loading } = useGetBeehivesData()
  const [selectedDateIndex, setSelectedDateIndex] = useState(0)

  const availableDates = useMemo(() => {
    if (!data) return []
    const datesSet = new Set<string>()

    Object.values(data.beehiveStation).forEach((records) => {
      records.forEach((record) => {
        const dateStr = format(new Date(record.createdAt), 'yyyy-MM-dd')
        datesSet.add(dateStr)
      })
    })

    return Array.from(datesSet).sort().reverse()
  }, [data])

  const selectedDate = availableDates[selectedDateIndex]

  const filteredData = useMemo(() => {
    if (!data || !selectedDate) return null

    const filtered: typeof data.beehiveStation = Object.keys(
      data.beehiveStation
    ).reduce(
      (acc, key) => {
        acc[key as keyof typeof data.beehiveStation] = []
        return acc
      },
      {} as typeof data.beehiveStation
    )

    Object.entries(data.beehiveStation).forEach(([stationName, records]) => {
      const recordsForDate = records.filter(
        (r) => format(new Date(r.createdAt), 'yyyy-MM-dd') === selectedDate
      )
      if (recordsForDate.length > 0) {
        filtered[stationName as keyof typeof data.beehiveStation] =
          recordsForDate
      }
    })

    return { beehiveStation: filtered }
  }, [data, selectedDate])

  if (loading) {
    return (
      <Skeleton className='rounded-lg'>
        <div className='w-full h-96 flex items-center justify-center'>
          Cargando gráficos...
        </div>
      </Skeleton>
    )
  }

  if (!filteredData || !selectedDate) {
    return (
      <Card>
        <CardBody>No existe información en el momento</CardBody>
      </Card>
    )
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      {/* Selector de fechas */}
      <div className='flex items-center justify-between'>
        <Button
          isDisabled={selectedDateIndex >= availableDates.length - 1}
          onClick={() => setSelectedDateIndex((prev) => prev + 1)}
        >
          ← Día anterior
        </Button>
        <span className='text-lg font-semibold'>
          {formatSelectedDate(selectedDate)}
        </span>

        <Button
          isDisabled={selectedDateIndex <= 0}
          onClick={() => setSelectedDateIndex((prev) => prev - 1)}
        >
          Día siguiente →
        </Button>
      </div>

      <Tabs aria-label='Opciones'>
        <Tab
          key='temp'
          title={
            <div className='flex items-center gap-2'>
              {icons['temperature']}Temperatura
            </div>
          }
        >
          <div className='grid gap-4'>
            {Object.entries(filteredData.beehiveStation).map(
              ([stationName, stationData]) => (
                <TempChart
                  key={stationName}
                  stationData={stationData}
                  stationName={stationName as StationName}
                />
              )
            )}
          </div>
        </Tab>
        <Tab
          key='humidity'
          title={
            <div className='flex items-center gap-2'>
              {icons['humidity']}Humedad
            </div>
          }
        >
          <div className='grid gap-4'>
            {Object.entries(filteredData.beehiveStation).map(
              ([stationName, stationData]) => (
                <HumidityChart
                  key={stationName}
                  stationData={stationData}
                  stationName={stationName as StationName}
                />
              )
            )}
          </div>
        </Tab>
        <Tab
          key='bees'
          title={
            <div className='flex items-center gap-2'>
              {icons['beesPerMinute']}Abejas por minuto
            </div>
          }
        >
          <div className='grid gap-4'>
            {Object.entries(filteredData.beehiveStation).map(
              ([stationName, stationData]) => (
                <BeesActivityChart
                  key={stationName}
                  stationData={stationData}
                  stationName={stationName as StationName}
                />
              )
            )}
          </div>
        </Tab>
        <Tab
          key='rain'
          title={
            <div className='flex items-center gap-2'>{icons['rain']}Lluvia</div>
          }
        >
          <div className='grid gap-4'>
            {Object.entries(filteredData.beehiveStation).map(
              ([stationName, stationData]) => (
                <RainChart
                  key={stationName}
                  stationData={stationData}
                  stationName={stationName as StationName}
                />
              )
            )}
          </div>
        </Tab>
        <Tab
          key='sun'
          title={
            <div className='flex items-center gap-2'>{icons['sun']}Sol</div>
          }
        >
          <div className='grid gap-4'>
            {Object.entries(filteredData.beehiveStation).map(
              ([stationName, stationData]) => (
                <SunChart
                  key={stationName}
                  stationData={stationData}
                  stationName={stationName as StationName}
                />
              )
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}
