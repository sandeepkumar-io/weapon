'use client'

import ModelHero from './ModelHero'
import { Rifle } from './RifleScene'

// Drop a real sniper model here: frontend/public/models/sniper-rifle.glb
const MODEL_URL = '/models/sniper-rifle.glb'

export default function SniperScene() {
  return <ModelHero url={MODEL_URL} fallback={<Rifle />} />
}
