'use client'

import ModelHero from './ModelHero'
import { Jet } from './JetScene'

// Drop your SR-71 Blackbird model here: frontend/public/models/sr71-blackbird.glb
const MODEL_URL = '/models/sr71-blackbird.glb'

export default function BlackbirdScene() {
  return <ModelHero url={MODEL_URL} fallback={<Jet />} />
}
