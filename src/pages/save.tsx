import Button from '@components/ui/Button'
import { Input } from '@components/ui/Input'
import { useConnection } from '@solana/wallet-adapter-react'
import { saveEventToDb } from '@utils/events'
import React, { useState } from 'react'

type Props = {}

const Save = (props: Props) => {
  const [tx,setTx] = useState<string>("")
  const {connection} = useConnection();
  return (
    <div>
      <Input label='enter tx signature' value={tx} onChange={e=>setTx(e.target.value)}/>
      <Button onClick={()=>saveEventToDb(tx,connection)} className=''>
        Save
      </Button>
    </div>
  )
}

export default Save