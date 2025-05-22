import React, { useState } from 'react'
import PostingPets from './PostingPets'
import AdoptingRequests from './AdoptingRequests'
import AdoptedHistory from './AdoptedHistory'
import ApprovedRequests from './ApprovedRequests'
import Dashboard from './Dashboard'

const AdminScreen = () => {
  const [screen, setScreen] = useState('dashboard')

  return (
    <div className='admin-screen-container'>
      <div className='admin-screen-left'>
        <div>
          <p onClick={() => setScreen('dashboard')}>Bord</p>
          <p onClick={() => setScreen('postingPet')}>Cereri de adopție pentru animale de companie</p>
          <p onClick={() => setScreen('approvedRequests')}>Animale de companie aprobate</p>
          <p onClick={() => setScreen('adoptingPet')}>Cereri de adopție</p>
          <p onClick={() => setScreen('adoptedHistory')}>Istoric adopții</p>
        </div>
      </div>
      <div className='admin-screen-right'>
        {screen === 'dashboard' && <Dashboard />}
        {screen === 'postingPet' && <PostingPets />}
        {screen === 'approvedRequests' && <ApprovedRequests />}
        {screen === 'adoptingPet' && <AdoptingRequests />}
        {screen === 'adoptedHistory' && <AdoptedHistory />}
      </div>
    </div>
  )
}

export default AdminScreen
