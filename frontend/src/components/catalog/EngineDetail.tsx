'use client';

import Link from 'next/link';
import {
  LuArrowLeft,
  LuAtom,
  LuBookOpen,
  LuBoxes,
  LuExternalLink,
  LuFactory,
  LuFlame,
  LuFuel,
  LuGauge,
  LuHistory,
  LuLayers,
  LuMicrochip,
  LuMoveDiagonal,
  LuRuler,
  LuScale,
  LuThermometer,
  LuVideo,
  LuWind,
  LuWrench,
  LuZap,
} from 'react-icons/lu';
import HeroCarousel from './HeroCarousel';
import EngineCard from './EngineCard';
import {
  ChipList,
  ChipSection,
  ComponentGrid,
  Prose,
  Section,
  SpecGrid,
  rows,
  youTubeId,
} from './DetailPrimitives';
import {
  engineImages,
  formatCost,
  formatHours,
  formatKelvin,
  formatKg,
  formatMassFlow,
  formatMetres,
  formatNumber,
  formatRatio,
  formatRpm,
  formatSfc,
  formatStages,
  formatThrustKN,
  generationLabel,
  maxThrust,
  type EngineDetailItem,
  type EngineListItem,
} from '@/lib/engineFormat';

const yesNo = (value?: boolean | null) => (value === true ? 'Yes' : value === false ? 'No' : null);

const year = (value?: number | null) => (value ? String(value) : null);

export default function EngineDetail({
  engine,
  related,
  basePath = '/jet-engines',
}: {
  engine: EngineDetailItem;
  related: EngineListItem[];
  basePath?: string;
}) {
  const {
    thrust,
    performance,
    compressor,
    combustor,
    turbine,
    afterburner,
    nozzle,
    controlSystem,
    maintenance,
    operational,
    parts,
    materials,
    technology,
    development,
    media,
  } = engine;

  const componentImages = media?.componentImages || {};
  const videoId = youTubeId(media?.videoUrl);

  const headlineStats = [
    { icon: LuFlame, label: 'Max thrust', value: maxThrust(thrust) },
    { icon: LuGauge, label: 'Dry thrust', value: formatThrustKN(thrust?.dryThrustKN) },
    { icon: LuScale, label: 'Thrust:weight', value: formatRatio(thrust?.thrustToWeightRatio) },
    { icon: LuWind, label: 'Pressure ratio', value: formatRatio(performance?.overallPressureRatio) },
  ];

  const overviewRows = rows([
    { label: 'Manufacturer', value: engine.manufacturer || null },
    { label: 'Designer', value: engine.designer || null },
    { label: 'Origin', value: engine.originCountry || null },
    { label: 'Type', value: engine.engineType || null },
    { label: 'Generation', value: engine.generation || null },
    { label: 'Status', value: engine.status || null },
    { label: 'Programme', value: engine.programName || null },
    { label: 'First run', value: year(engine.firstRunYear) },
    { label: 'Introduced', value: year(engine.introducedYear) },
  ]);

  const dimensionRows = rows([
    { label: 'Length', value: formatMetres(engine.dimensions?.lengthM) },
    { label: 'Diameter', value: formatMetres(engine.dimensions?.diameterM) },
    { label: 'Dry weight', value: formatKg(engine.dimensions?.dryWeightKg) },
    { label: 'Fan diameter', value: formatMetres(compressor?.fanDiameterM) },
  ]);

  const thrustRows = rows([
    { label: 'Dry thrust', value: formatThrustKN(thrust?.dryThrustKN) },
    { label: 'Afterburning thrust', value: formatThrustKN(thrust?.afterburningThrustKN) },
    { label: 'Thrust-to-weight', value: formatRatio(thrust?.thrustToWeightRatio) },
    { label: 'SFC (dry)', value: formatSfc(thrust?.specificFuelConsumptionDryKgPerKNPerHour) },
    {
      label: 'SFC (afterburning)',
      value: formatSfc(thrust?.specificFuelConsumptionAfterburningKgPerKNPerHour),
    },
  ]);

  const performanceRows = rows([
    { label: 'Bypass ratio', value: formatRatio(performance?.bypassRatio) },
    { label: 'Overall pressure ratio', value: formatRatio(performance?.overallPressureRatio) },
    { label: 'Air mass flow', value: formatMassFlow(performance?.airMassFlowKgPerSecond) },
    { label: 'Maximum rpm', value: formatRpm(performance?.maximumRpm) },
    { label: 'Supercruise capable', value: yesNo(performance?.supercruiseCapable) },
  ]);

  const compressorRows = rows([
    { label: 'Type', value: compressor?.type || null },
    { label: 'Fan stages', value: formatNumber(compressor?.fanStages) },
    { label: 'Low-pressure stages', value: formatNumber(compressor?.lowPressureStages) },
    { label: 'High-pressure stages', value: formatNumber(compressor?.highPressureStages) },
    {
      label: 'Stage layout',
      value: formatStages(
        compressor?.fanStages,
        compressor?.lowPressureStages,
        compressor?.highPressureStages,
      ),
    },
    { label: 'Fan pressure ratio', value: formatRatio(compressor?.fanPressureRatio) },
    { label: 'Blade material', value: compressor?.bladeMaterial || null },
    { label: 'Fan blade type', value: compressor?.fanBladeType || null },
    { label: 'Fan blade material', value: compressor?.fanBladeMaterial || null },
  ]);

  const combustorRows = rows([
    { label: 'Type', value: combustor?.type || null },
    { label: 'Fuel injection', value: combustor?.fuelInjectionType || null },
    { label: 'Liner material', value: combustor?.linerMaterial || null },
  ]);

  const turbineRows = rows([
    { label: 'High-pressure stages', value: formatNumber(turbine?.highPressureStages) },
    { label: 'Low-pressure stages', value: formatNumber(turbine?.lowPressureStages) },
    { label: 'Inlet temperature', value: formatKelvin(turbine?.inletTemperatureK) },
    { label: 'Blade material', value: turbine?.bladeMaterial || null },
    { label: 'Blade cooling', value: turbine?.bladeCoolingType || null },
  ]);

  const afterburnerRows = rows([
    { label: 'Type', value: afterburner?.type || null },
    { label: 'Flame holder', value: afterburner?.flameHolderType || null },
    { label: 'Liner material', value: afterburner?.linerMaterial || null },
    { label: 'Maximum temperature', value: formatKelvin(afterburner?.maximumTemperatureK) },
    { label: 'Screech suppression', value: afterburner?.screechSuppression || null },
  ]);

  const nozzleRows = rows([
    { label: 'Type', value: nozzle?.type || null },
    { label: 'Thrust vectoring', value: yesNo(nozzle?.thrustVectoring) },
    { label: 'Vectoring axes', value: nozzle?.vectoringAxes || null },
    {
      label: 'Maximum deflection',
      value: nozzle?.maximumDeflectionDegrees ? `${nozzle.maximumDeflectionDegrees}°` : null,
    },
  ]);

  const controlRows = rows([
    { label: 'Type', value: controlSystem?.type || null },
    { label: 'Manufacturer', value: controlSystem?.manufacturer || null },
    { label: 'FADEC generation', value: controlSystem?.fadecGeneration || null },
  ]);

  const partsRows = rows([
    { label: 'Modules', value: formatNumber(parts?.moduleCount) },
    { label: 'Bearings', value: formatNumber(parts?.bearingCount) },
    { label: 'Gearbox', value: parts?.gearboxType || null },
    { label: 'Starting system', value: parts?.startingSystem || null },
    { label: 'Fuel system', value: parts?.fuelSystem || null },
    { label: 'Lubrication', value: parts?.lubricationSystem || null },
    { label: 'Ignition', value: parts?.ignitionSystem || null },
  ]);

  const materialRows = rows([
    { label: 'Fan blades', value: materials?.fanBladeMaterial || null },
    { label: 'Compressor case', value: materials?.compressorCaseMaterial || null },
    { label: 'Turbine discs', value: materials?.turbineDiscMaterial || null },
    { label: 'Thermal barrier coating', value: materials?.thermalBarrierCoating || null },
    { label: 'Single-crystal blades', value: yesNo(materials?.singleCrystalBlades) },
  ]);

  const technologyRows = rows([
    { label: 'Adaptive cycle', value: yesNo(technology?.adaptiveCycle) },
  ]);

  const developmentRows = rows([
    { label: 'Development start', value: year(development?.developmentStartYear) },
    { label: 'Certified', value: year(development?.certificationYear) },
    { label: 'Development cost', value: formatCost(development?.developmentCostUsd) },
    { label: 'Predecessor', value: development?.predecessorEngine || null },
    { label: 'Successor', value: development?.successorEngine || null },
  ]);

  const maintenanceRows = rows([
    { label: 'Time between overhauls', value: formatHours(maintenance?.timeBetweenOverhaulHours) },
    {
      label: 'Hot-section inspection',
      value: formatHours(maintenance?.hotSectionInspectionHours),
    },
    { label: 'Service life', value: formatHours(maintenance?.serviceLifeHours) },
    {
      label: 'Mean time between failures',
      value: formatHours(maintenance?.meanTimeBetweenFailuresHours),
    },
  ]);

  const productionRows = rows([
    { label: 'Number built', value: formatNumber(operational?.numberBuilt) },
    { label: 'Unit cost', value: formatCost(operational?.unitCostUsd) },
    { label: 'Production start', value: year(operational?.productionStartYear) },
    { label: 'Production end', value: year(operational?.productionEndYear) },
  ]);

  const generation = generationLabel(engine.generationTier);
  const metaLine = [engine.manufacturer, engine.originCountry, engine.engineType]
    .filter(Boolean)
    .join(' · ');

  const hasTechnology =
    technologyRows.length > 0 ||
    technology?.keyTechnologies?.length ||
    technology?.coolingTechnology ||
    technology?.healthMonitoringSystem ||
    technology?.stealthFeatures ||
    technology?.noiseReduction;

  const hasMaterials =
    materialRows.length > 0 ||
    materials?.compositeComponents?.length ||
    materials?.additiveManufacturedParts?.length;

  const hasDevelopment =
    developmentRows.length > 0 ||
    development?.history ||
    development?.developmentPartners?.length;

  return (
    <main className="min-h-screen overflow-x-hidden pt-16">
      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-primary"
        >
          <LuArrowLeft className="h-4 w-4" /> All engines
        </Link>
      </div>

      <div className="mt-6">
        <HeroCarousel
          images={engineImages(engine)}
          name={engine.name}
          badge={generation || engine.statusGroup}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Engine dossier</p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl">
          {engine.name}
        </h1>
        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {metaLine}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {generation && (
            <span className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              {generation}
            </span>
          )}
          {nozzle?.thrustVectoring && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              <LuMoveDiagonal className="h-3 w-3" /> Thrust vectoring
            </span>
          )}
          {performance?.supercruiseCapable && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
              <LuZap className="h-3 w-3" /> Supercruise
            </span>
          )}
          {engine.statusGroup && (
            <span className="rounded-md border border-border bg-[#0f0f0f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {engine.statusGroup}
            </span>
          )}
        </div>

        {/* Headline figures */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {headlineStats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-border bg-background/50 p-4">
              <span className="mb-4 block text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
              <strong className="mt-1 block text-sm">{value || '—'}</strong>
            </div>
          ))}
        </div>

        {(engine.description || overviewRows.length > 0) && (
          <Section title="Overview" icon={LuFlame}>
            {engine.description && (
              <p className="max-w-3xl leading-8 text-muted-foreground">{engine.description}</p>
            )}
            {engine.applications && engine.applications.length > 0 && (
              <div className="mt-6">
                <ChipList items={engine.applications} tone="primary" />
              </div>
            )}
            <ChipSection label="Also known as" items={engine.alsoKnownAs} />
            <div className="mt-6">
              <SpecGrid items={overviewRows} />
            </div>
          </Section>
        )}

        {dimensionRows.length > 0 && (
          <Section title="Dimensions & weight" icon={LuRuler}>
            <SpecGrid items={dimensionRows} />
          </Section>
        )}

        {thrustRows.length > 0 && (
          <Section title="Thrust & fuel burn" icon={LuFuel}>
            <SpecGrid items={thrustRows} />
          </Section>
        )}

        {performanceRows.length > 0 && (
          <Section title="Cycle performance" icon={LuGauge}>
            <SpecGrid items={performanceRows} />
          </Section>
        )}

        {compressorRows.length > 0 && (
          <Section title="Fan & compressor" icon={LuWind}>
            <SpecGrid items={compressorRows} />
          </Section>
        )}

        {combustorRows.length > 0 && (
          <Section title="Combustor" icon={LuFlame}>
            <SpecGrid items={combustorRows} />
          </Section>
        )}

        {turbineRows.length > 0 && (
          <Section title="Turbine" icon={LuThermometer}>
            <SpecGrid items={turbineRows} />
          </Section>
        )}

        {afterburnerRows.length > 0 && (
          <Section title="Afterburner" icon={LuZap}>
            <SpecGrid items={afterburnerRows} />
          </Section>
        )}

        {nozzleRows.length > 0 && (
          <Section title="Nozzle" icon={LuMoveDiagonal}>
            <SpecGrid items={nozzleRows} />
          </Section>
        )}

        {controlRows.length > 0 && (
          <Section title="Control system" icon={LuMicrochip}>
            <SpecGrid items={controlRows} />
          </Section>
        )}

        {(partsRows.length > 0 || parts?.majorModules?.length) && (
          <Section title="Modules & systems" icon={LuBoxes}>
            <SpecGrid items={partsRows} />
            <ComponentGrid
              label="Major modules"
              names={parts?.majorModules}
              images={componentImages.majorModules}
            />
          </Section>
        )}

        {hasMaterials && (
          <Section title="Materials" icon={LuAtom}>
            <SpecGrid items={materialRows} />
            <ChipSection label="Composite components" items={materials?.compositeComponents} />
            <ChipSection
              label="Additively manufactured parts"
              items={materials?.additiveManufacturedParts}
            />
          </Section>
        )}

        {hasTechnology && (
          <Section title="Technology" icon={LuZap}>
            <SpecGrid items={technologyRows} />
            <ChipSection
              label="Key technologies"
              items={technology?.keyTechnologies}
              tone="primary"
            />
            <Prose label="Cooling" value={technology?.coolingTechnology} />
            <Prose label="Health monitoring" value={technology?.healthMonitoringSystem} />
            <Prose label="Stealth features" value={technology?.stealthFeatures} />
            <Prose label="Noise reduction" value={technology?.noiseReduction} />
          </Section>
        )}

        {maintenanceRows.length > 0 && (
          <Section title="Maintenance" icon={LuWrench}>
            <SpecGrid items={maintenanceRows} />
          </Section>
        )}

        {hasDevelopment && (
          <Section title="Development" icon={LuHistory}>
            <SpecGrid items={developmentRows} />
            <Prose label="History" value={development?.history} />
            <ChipSection label="Partners" items={development?.developmentPartners} />
          </Section>
        )}

        {engine.variants && engine.variants.length > 0 && (
          <Section title="Variants" icon={LuLayers}>
            <ComponentGrid
              label={`${engine.variants.length} variants`}
              names={engine.variants}
              images={componentImages.variants}
            />
          </Section>
        )}

        {engine.applications && engine.applications.length > 0 && (
          <Section title="Powers" icon={LuLayers}>
            <ComponentGrid
              label={`${engine.applications.length} aircraft`}
              names={engine.applications}
              images={componentImages.applications}
            />
          </Section>
        )}

        {(productionRows.length > 0 || operational?.operators?.length) && (
          <Section title="Service & production" icon={LuFactory}>
            <SpecGrid items={productionRows} />
            <ChipSection
              label={`Operators (${operational?.operators?.length || 0})`}
              items={operational?.operators}
            />
          </Section>
        )}

        {videoId && (
          <Section title="Footage" icon={LuVideo}>
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-[#0a0a0a]">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`${engine.name} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </Section>
        )}

        {engine.sources && engine.sources.length > 0 && (
          <Section title="Sources" icon={LuBookOpen}>
            <ul className="grid gap-2">
              {engine.sources.map((source) => (
                <li key={source}>
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 break-all text-sm text-muted-foreground transition hover:text-primary"
                  >
                    <LuExternalLink className="h-3.5 w-3.5 shrink-0" />
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {related.length > 0 && (
          <Section title="More engines" icon={LuFlame}>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <EngineCard key={item._id} engine={item} basePath={basePath} index={index} />
              ))}
            </div>
          </Section>
        )}
      </div>
    </main>
  );
}
