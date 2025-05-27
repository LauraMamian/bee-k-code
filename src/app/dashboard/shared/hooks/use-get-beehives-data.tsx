import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { realtimeDB } from '../../../../firebase/firebase.config'
import { IFirebaseData } from '@dashboard/beehives/components/cards/interfaces'

export const useGetBeehivesData = () => {
  const [data, setData] = useState<IFirebaseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dataRef = ref(realtimeDB)

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val()
      setData(data as IFirebaseData)
      setLoading(false)
    })

    return () => off(dataRef, 'value', unsubscribe)
  }, [])

  return { data, loading }
}
