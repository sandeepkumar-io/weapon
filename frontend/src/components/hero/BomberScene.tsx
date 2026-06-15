'use client'

import ModelHero from './ModelHero'
import { Jet } from './JetScene'

// Drop a real bomber model here: frontend/public/models/bomber.glb
const MODEL_URL = '/models/bomber.glb'

export default function BomberScene() {
  return <ModelHero url={MODEL_URL} fallback={<Jet />} />
}
