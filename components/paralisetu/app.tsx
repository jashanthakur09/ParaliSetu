'use client'

import { Calculator, ClipboardList, Factory, Map as MapIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookingPortal } from './booking-portal'
import { BuyerDashboard } from './buyer-dashboard'
import { ClusterRadar } from './cluster-radar'
import { CommandMap } from './command-map'
import { EconomicsSimulator } from './economics-simulator'
import { Header } from './header'
import { ImpactStrip } from './impact-strip'
import { ParaliProvider, useParali, type TabKey } from './provider'
import { VillageSheet } from './village-sheet'

function Shell() {
  const { tab, setTab, ready, lang } = useParali()

  return (
    <div className="min-h-screen bg-background" data-lang={lang}>
      <Header />
      <ImpactStrip />
      <main className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
            <TabsTrigger value="map" className="gap-1.5 px-3 py-1.5">
              <MapIcon /> Command Map
            </TabsTrigger>
            <TabsTrigger value="booking" className="gap-1.5 px-3 py-1.5">
              <ClipboardList /> Farmer Booking
            </TabsTrigger>
            <TabsTrigger value="buyers" className="gap-1.5 px-3 py-1.5">
              <Factory /> Buyer Dashboard
            </TabsTrigger>
            <TabsTrigger value="economics" className="gap-1.5 px-3 py-1.5">
              <Calculator /> Economics
            </TabsTrigger>
          </TabsList>

          {!ready ? (
            <div className="mt-4 h-[480px] animate-pulse rounded-2xl bg-muted" aria-label="Loading" />
          ) : (
            <>
              <TabsContent value="map" className="mt-4">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                  <CommandMap />
                  <ClusterRadar />
                </div>
              </TabsContent>
              <TabsContent value="booking" className="mt-4">
                <BookingPortal />
              </TabsContent>
              <TabsContent value="buyers" className="mt-4">
                <BuyerDashboard />
              </TabsContent>
              <TabsContent value="economics" className="mt-4">
                <EconomicsSimulator />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
      <VillageSheet />
    </div>
  )
}

export function App() {
  return (
    <ParaliProvider>
      <Shell />
    </ParaliProvider>
  )
}