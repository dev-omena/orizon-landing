'use client';

import Header from '@/components/Header';
import OrizonBanner from '@/components/OrizonBanner';
import Waves from '@/components/Waves';
import LockedScrollServices from '@/components/LockedScrollServices';

export default function Home() {

  return (
    <div className="h-screen bg-secondary p-0 overflow-auto">
      <div className="relative min-h-screen bg-primary border-4 border-orizon-secondary rounded-lg overflow-hidden m-4">
     
        <div>
          <Header />
        </div>
        
        <div className="bg-primary border-t border-b border-orizon-secondary h-[50vh] min-h-[300px]">
            <Waves
              lineColor="#f8e800"
              backgroundColor="#272860"
              waveSpeedX={0.025}
              waveSpeedY={0.012}
              waveAmpX={25}
              waveAmpY={12}
              friction={0.92}
              tension={0.025}
              maxCursorMove={60}
              xGap={12}
              yGap={35}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(248, 232, 0, 0.2))'
              }}
              className="waves-enhanced"
            />
        </div>
        
        <div>
          <OrizonBanner />
        </div>

        {/* New Locked Scroll Services Section */}
        <LockedScrollServices />
      </div>
    </div>
  );
}