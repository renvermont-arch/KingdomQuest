const dust = Array.from({ length: 22 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 19) % 100}%`,
  size: index % 4 === 0 ? 6 : 4,
  delay: `${(index % 8) * 1.3}s`,
  duration: `${9 + (index % 5) * 2.5}s`,
}));

const ants = Array.from({ length: 9 }, (_, index) => ({
  left: `${(index * 11 + 6) % 100}%`,
  duration: `${16 + (index % 5) * 4}s`,
  delay: `${(index % 7) * 2.6}s`,
  wiggle: `${(index % 2 === 0 ? 1 : -1) * (10 + (index % 4) * 6)}px`,
  scale: 0.75 + (index % 4) * 0.12,
  carriesCrumb: index % 3 === 0,
}));

function PixelAnt({ carriesCrumb }) {
  return (
    <svg viewBox="0 -8 24 52" width="24" height="52" shapeRendering="crispEdges">
      {carriesCrumb && <rect x="8" y="-6" width="8" height="6" fill="#f6dfc9" />}
      <rect x="7" y="2" width="3" height="5" fill="#b98aab" />
      <rect x="14" y="2" width="3" height="5" fill="#b98aab" />
      <rect x="6" y="6" width="12" height="10" fill="#b98aab" />
      <rect x="8" y="18" width="8" height="8" fill="#c79ab8" />
      <rect x="5" y="28" width="14" height="12" fill="#b98aab" />
      <rect x="0" y="20" width="8" height="3" fill="#b98aab" />
      <rect x="16" y="20" width="8" height="3" fill="#b98aab" />
      <rect x="0" y="26" width="8" height="3" fill="#b98aab" />
      <rect x="16" y="26" width="8" height="3" fill="#b98aab" />
      <rect x="0" y="32" width="8" height="3" fill="#b98aab" />
      <rect x="16" y="32" width="8" height="3" fill="#b98aab" />
      <rect x="8" y="8" width="8" height="3" fill="#e2c2d7" />
      <rect x="8" y="30" width="8" height="3" fill="#e2c2d7" />
    </svg>
  );
}

export default function PixelDirtBackground() {
  return (
    <div className="pixel-dirt" aria-hidden="true">
      <svg className="pixel-dirt-canvas" width="100%" height="100%" shapeRendering="crispEdges">
        <defs>
          <pattern id="dirt-tile" width="64" height="64" patternUnits="userSpaceOnUse">
            <rect width="64" height="64" fill="#f4e6f1" />
            <rect x="0" y="0" width="16" height="16" fill="#ffe3ee" />
            <rect x="32" y="0" width="16" height="16" fill="#e8e7ff" />
            <rect x="16" y="16" width="16" height="16" fill="#f7e8f5" />
            <rect x="48" y="16" width="16" height="16" fill="#dff3ef" />
            <rect x="0" y="32" width="16" height="16" fill="#efe2f7" />
            <rect x="32" y="32" width="16" height="16" fill="#fdeaf1" />
            <rect x="16" y="48" width="16" height="16" fill="#e4eaff" />
            <rect x="48" y="48" width="16" height="16" fill="#f5e9df" />
            <rect x="24" y="8" width="8" height="8" fill="#ffffff" />
            <rect x="56" y="40" width="8" height="8" fill="#ffffff" />
            <rect x="8" y="56" width="8" height="8" fill="#d7c7dc" />
            <rect x="40" y="24" width="8" height="8" fill="#d7c7dc" />
          </pattern>

          <pattern id="dirt-deep" width="48" height="48" patternUnits="userSpaceOnUse">
            <rect width="48" height="48" fill="#e8e7ff" />
            <rect x="0" y="0" width="12" height="12" fill="#f4dff0" />
            <rect x="24" y="12" width="12" height="12" fill="#d9f6ec" />
            <rect x="12" y="24" width="12" height="12" fill="#ffe8f0" />
            <rect x="36" y="36" width="12" height="12" fill="#d5dcf7" />
          </pattern>

          <g id="fossil-long">
            <rect x="8" y="0" width="16" height="8" fill="#fffafd" />
            <rect x="0" y="8" width="32" height="8" fill="#f7e9f5" />
            <rect x="8" y="16" width="16" height="8" fill="#e6d9f0" />
            <rect x="24" y="8" width="32" height="8" fill="#f7e9f5" />
            <rect x="48" y="0" width="16" height="8" fill="#fffafd" />
            <rect x="48" y="8" width="16" height="8" fill="#f7e9f5" />
            <rect x="48" y="16" width="16" height="8" fill="#e6d9f0" />
            <rect x="16" y="8" width="32" height="4" fill="#ffffff" opacity="0.7" />
          </g>

          <g id="fossil-rib">
            <rect x="0" y="0" width="8" height="24" fill="#f7e9f5" />
            <rect x="8" y="16" width="8" height="8" fill="#f7e9f5" />
            <rect x="16" y="24" width="8" height="8" fill="#f0e2f6" />
            <rect x="24" y="32" width="8" height="8" fill="#f0e2f6" />
            <rect x="32" y="40" width="8" height="8" fill="#e6d9f0" />
            <rect x="0" y="0" width="4" height="20" fill="#fffafd" opacity="0.75" />
          </g>

          <g id="fossil-skull">
            <rect x="8" y="0" width="32" height="8" fill="#fffafd" />
            <rect x="0" y="8" width="48" height="32" fill="#f7e9f5" />
            <rect x="48" y="16" width="16" height="16" fill="#f0e2f6" />
            <rect x="8" y="16" width="12" height="12" fill="#a98aa4" />
            <rect x="28" y="16" width="12" height="12" fill="#a98aa4" />
            <rect x="20" y="32" width="8" height="8" fill="#a98aa4" />
            <rect x="0" y="40" width="48" height="8" fill="#e6d9f0" />
            <rect x="4" y="12" width="40" height="4" fill="#ffffff" opacity="0.6" />
          </g>

          <g id="fossil-vertebra">
            <rect x="0" y="8" width="16" height="16" fill="#f7e9f5" />
            <rect x="4" y="0" width="8" height="8" fill="#fffafd" />
            <rect x="4" y="24" width="8" height="8" fill="#e6d9f0" />
            <rect x="16" y="12" width="8" height="8" fill="#f0e2f6" />
          </g>

          <g id="trex-skull">
            <rect x="0" y="16" width="24" height="24" fill="#f0e2f6" />
            <rect x="8" y="8" width="24" height="8" fill="#fffafd" />
            <rect x="0" y="40" width="24" height="8" fill="#e6d9f0" />
            <rect x="24" y="16" width="96" height="16" fill="#f7e9f5" />
            <rect x="24" y="8" width="48" height="8" fill="#fffafd" />
            <rect x="72" y="16" width="48" height="8" fill="#fdf2fb" />
            <rect x="112" y="24" width="16" height="8" fill="#f0e2f6" />
            <rect x="24" y="16" width="12" height="12" fill="#a98aa4" />
            <rect x="96" y="20" width="8" height="4" fill="#a98aa4" />
            <rect x="40" y="32" width="12" height="8" fill="#c1a7c4" />
            <rect x="48" y="32" width="6" height="8" fill="#fffafd" />
            <rect x="64" y="32" width="6" height="8" fill="#fffafd" />
            <rect x="80" y="32" width="6" height="8" fill="#fffafd" />
            <rect x="96" y="32" width="6" height="8" fill="#fffafd" />
            <rect x="112" y="32" width="6" height="6" fill="#fffafd" />
            <rect x="8" y="40" width="16" height="16" fill="#e6d9f0" />
            <rect x="24" y="48" width="88" height="8" fill="#f0e2f6" />
            <rect x="32" y="56" width="64" height="4" fill="#e6d9f0" />
            <rect x="52" y="44" width="6" height="6" fill="#fffafd" />
            <rect x="68" y="44" width="6" height="6" fill="#fffafd" />
            <rect x="84" y="44" width="6" height="6" fill="#fffafd" />
            <rect x="100" y="44" width="6" height="6" fill="#fffafd" />
            <rect x="32" y="12" width="64" height="4" fill="#ffffff" opacity="0.7" />
          </g>
        </defs>

        <rect className="dirt-scroll" x="-128" y="0" width="100%" height="100%" fill="url(#dirt-tile)" />
        <rect className="dirt-deep" x="-64" y="72%" width="110%" height="28%" fill="url(#dirt-deep)" opacity="0.72" />

        <g className="fossil fossil-long-a"><use href="#fossil-long" /></g>
        <g className="fossil fossil-long-b"><use href="#fossil-long" /></g>
        <g className="fossil fossil-long-c"><use href="#fossil-long" /></g>
        <g className="fossil fossil-rib-a"><use href="#fossil-rib" /></g>
        <g className="fossil fossil-rib-b"><use href="#fossil-rib" /></g>
        <g className="fossil fossil-skull"><use href="#fossil-skull" /></g>
        <g className="fossil fossil-trex"><use href="#trex-skull" /></g>
        <g className="fossil fossil-vertebra-a"><use href="#fossil-vertebra" /></g>
        <g className="fossil fossil-vertebra-b"><use href="#fossil-vertebra" /></g>
      </svg>

      <div className="pixel-scrim" />
      <div className="dust-motes">
        {dust.map((mote, index) => (
          <span
            key={index}
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              animationDelay: mote.delay,
              animationDuration: mote.duration,
            }}
          />
        ))}
      </div>
      <div className="ant-trail">
        {ants.map((ant, index) => (
          <span
            key={index}
            className="pixel-ant"
            style={{
              left: ant.left,
              animationDuration: ant.duration,
              animationDelay: ant.delay,
              "--wiggle": ant.wiggle,
              "--scale": ant.scale,
            }}
          >
            <PixelAnt carriesCrumb={ant.carriesCrumb} />
          </span>
        ))}
      </div>
    </div>
  );
}
