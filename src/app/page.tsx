'use client';

import Header from '@/components/Header';
import OrizonBanner from '@/components/OrizonBanner';
import Waves from '@/components/Waves';
import LockedScrollServices from '@/components/LockedScrollServices';

export default function Home() {

  return (
    <div className="min-h-screen bg-secondary p-0">
      <div className="relative min-h-screen bg-primary border border-orizon-secondary rounded-lg overflow-hidden m-2">
     
        {/* Header + Waves + Banner - Full Screen Height */}
        <div className="h-screen flex flex-col">
          {/* Header Section - Fixed small height */}
          <div className="h-16 md:h-20 flex-shrink-0">
            <Header />
          </div>
         
          {/* Waves Section - Takes 60% of remaining height */}
          <div className="bg-primary border-t border-b border-orizon-secondary -mt-px flex-shrink-0" style={{ height: 'calc((100vh - 4rem) * 0.7)' }}>
              <Waves
                lineColor="#f8e800"
                backgroundColor="#272860"
                waveSpeedX={0.025}
                waveSpeedY={0.012}
                waveAmpX={50}
                waveAmpY={25}
                friction={0.92}
                tension={0.025}
                maxCursorMove={100}
                xGap={15}
                yGap={45}
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(248, 232, 0, 0.3))'
                }}
                className="waves-enhanced"
              />
          </div>
         
          {/* Banner Section - Takes remaining 40% */}
          <div className="flex-1 min-h-0">
            <OrizonBanner />
          </div>
        </div>

        {/* ScrollStack Services Section - Below the fold */}
        <LockedScrollServices />
      </div>
    </div>
  );
}