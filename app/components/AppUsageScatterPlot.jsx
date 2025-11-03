'use client'

import React, { useState, useMemo } from 'react';

const AppUsageScatterPlot = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [pinnedPoint, setPinnedPoint] = useState(null);
  
  // 실제 앱 사용 데이터
  const realAppData = [
    // 11월 2일 (어제)
    { date: '2024-11-02', app: 'Figma', time: 172, category: '생산성 및 금융' },
    { date: '2024-11-02', app: 'Google Chrome', time: 114, category: '기타' },
    { date: '2024-11-02', app: '카카오톡', time: 68, category: '소셜 미디어' },
    { date: '2024-11-02', app: 'Cursor', time: 49, category: '생산성 및 금융' },
    { date: '2024-11-02', app: 'Finder', time: 2, category: '기타' },
    { date: '2024-11-02', app: '스티커', time: 1, category: '기타' },
    
    // 11월 1일 (토요일)
    { date: '2024-11-01', app: 'Cursor', time: 169, category: '생산성 및 금융' },
    { date: '2024-11-01', app: 'Google Chrome', time: 72, category: '기타' },
    { date: '2024-11-01', app: 'Figma', time: 46, category: '생산성 및 금융' },
    { date: '2024-11-01', app: '카카오톡', time: 46, category: '소셜 미디어' },
    { date: '2024-11-01', app: 'Finder', time: 2, category: '기타' },
    
    // 10월 31일 (금요일)
    { date: '2024-10-31', app: 'Figma', time: 210, category: '생산성 및 금융' },
    { date: '2024-10-31', app: 'Cursor', time: 156, category: '생산성 및 금융' },
    { date: '2024-10-31', app: 'Google Chrome', time: 77, category: '기타' },
    { date: '2024-10-31', app: '카카오톡', time: 76, category: '소셜 미디어' },
    { date: '2024-10-31', app: 'Finder', time: 25, category: '기타' },
    
    // 10월 30일 (목요일)
    { date: '2024-10-30', app: 'Figma', time: 209, category: '생산성 및 금융' },
    { date: '2024-10-30', app: 'Cursor', time: 132, category: '생산성 및 금융' },
    { date: '2024-10-30', app: 'Google Chrome', time: 125, category: '기타' },
    { date: '2024-10-30', app: 'us.zoom.videomeetings', time: 63, category: '생산성 및 금융' },
    { date: '2024-10-30', app: '카카오톡', time: 56, category: '소셜 미디어' },
    
    // 10월 29일 (수요일)
    { date: '2024-10-29', app: 'Figma', time: 448, category: '생산성 및 금융' },
    { date: '2024-10-29', app: 'YouTube', time: 54, category: '엔터테인먼트' },
    { date: '2024-10-29', app: 'Google Chrome', time: 53, category: '기타' },
    { date: '2024-10-29', app: '카카오톡', time: 46, category: '소셜 미디어' },
    { date: '2024-10-29', app: 'Cursor', time: 13, category: '생산성 및 금융' },
    
    // 10월 28일 (화요일)
    { date: '2024-10-28', app: 'Cursor', time: 130, category: '생산성 및 금융' },
    { date: '2024-10-28', app: 'Google Chrome', time: 102, category: '기타' },
    { date: '2024-10-28', app: 'Figma', time: 55, category: '생산성 및 금융' },
    { date: '2024-10-28', app: '카카오톡', time: 16, category: '소셜 미디어' },
    
    // 10월 27일 (월요일)
    { date: '2024-10-27', app: 'Google Chrome', time: 145, category: '기타' },
    { date: '2024-10-27', app: 'Cursor', time: 142, category: '생산성 및 금융' },
    { date: '2024-10-27', app: 'Figma', time: 76, category: '생산성 및 금융' },
    { date: '2024-10-27', app: '카카오톡', time: 47, category: '소셜 미디어' },
    { date: '2024-10-27', app: '메모', time: 49, category: '생산성 및 금융' },
  ];
  
  // 날짜 리스트 (가장 이른 날짜 → 가장 늦은 날짜)
  const dateList = useMemo(() => {
    return Array.from(new Set(realAppData.map(d => d.date))).sort();
  }, []);

  // 앱별 총 사용시간 (범례/보조 텍스트용)
  const appTotals = useMemo(() => {
    const totals = {};
    realAppData.forEach(item => {
      totals[item.app] = (totals[item.app] || 0) + item.time;
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([app]) => app);
  }, []);

  // 색상 매핑 (호버/핀 강조 색)
  const getCategoryColor = (category) => {
    const colors = {
      '생산성 및 금융': '#4169E1',
      '기타': '#FF8C00',
      '소셜 미디어': '#00CED1',
      '엔터테인먼트': '#FFD700'
    };
    return colors[category] || '#888888';
  };

  // 크기 및 중심점 (이미지 레퍼런스처럼 왼쪽 치우친 원형 레이아웃)
  const width = 1200;
  const height = 900;
  const cx = 260;
  const cy = Math.floor(height * 0.55);

  // 각도 범위 (왼쪽에서 오른쪽으로 펼쳐지는 부채꼴)
  const startDeg = -36; // 위쪽으로 약간
  const endDeg = 36; // 아래쪽으로 약간
  const startRad = (Math.PI / 180) * startDeg;
  const endRad = (Math.PI / 180) * endDeg;

  // 반지름 스케일: 사용 시간(분) → r(px)
  const maxTime = useMemo(() => Math.max(...realAppData.map(d => d.time)), []);
  const innerR = 40;
  const outerR = 560; // 가장 바깥 원 반지름
  const timeToR = (m) => innerR + (m / maxTime) * (outerR - innerR);

  // 날짜별 각도 매핑
  const angleForDate = (date) => {
    const idx = dateList.indexOf(date);
    const t = dateList.length > 1 ? idx / (dateList.length - 1) : 0.5;
    return startRad + t * (endRad - startRad);
  };

  // 헬퍼: 극좌표 → 직교좌표
  const polarToXY = (r, a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });

  // 원형 눈금 (60분 단위)
  const tickMinutes = useMemo(() => {
    const ticks = [];
    for (let m = 60; m <= Math.ceil(maxTime / 60) * 60; m += 60) ticks.push(m);
    return ticks;
  }, [maxTime]);
  
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center p-8">
      

      {/* SVG 차트 */}
      <div className="relative bg-white shadow-lg rounded-lg p-4">
        <svg width={width} height={height}>
          {/* 바깥 큰 원 (배경 느낌) */}
          <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#e5e7eb" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={outerR * 1.35} fill="none" stroke="#f1f5f9" strokeWidth={1} />

          {/* 반지름 눈금 원 */}
          {tickMinutes.map((m, i) => {
            const r = timeToR(m);
            return (
              <g key={`tick-r-${m}`}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={1} />
                {/* 눈금 라벨: 부채꼴의 끝(오른쪽) 근처에 배치 */}
                {(() => {
                  const a = endRad; // 라벨을 오른쪽 끝 각도에
                  const p = polarToXY(r, a);
                  const label = m % 60 === 0 ? `${m / 60}h` : `${m}m`;
                  return (
                    <text x={p.x + 10} y={p.y} className="text-xs fill-gray-400" dominantBaseline="middle">
                      {label}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* 날짜별 방사형 가이드 라인 */}
          {dateList.map((d) => {
            const a = angleForDate(d);
            const p1 = polarToXY(innerR, a);
            const p2 = polarToXY(outerR, a);
            return (
              <line key={`date-line-${d}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="2 4" />
            );
          })}

          {/* 부채꼴 경계선 */}
          {(() => {
            const pStart = polarToXY(outerR, startRad);
            const pEnd = polarToXY(outerR, endRad);
            return (
              <g>
                <line x1={cx} y1={cy} x2={pStart.x} y2={pStart.y} stroke="#d1d5db" strokeWidth={1} />
                <line x1={cx} y1={cy} x2={pEnd.x} y2={pEnd.y} stroke="#d1d5db" strokeWidth={1} />
              </g>
            );
          })()}

          {/* 데이터 포인트 (흑점 기반, 호버/핀 시 색 강조) */}
          {realAppData.map((item, index) => {
            const baseAngle = angleForDate(item.date);
            const angleJitter = (Math.random() - 0.5) * (Math.PI / 180) * 1.2; // ±1.2°
            const rJitter = (Math.random() - 0.5) * 8; // ±8px
            const r = Math.max(innerR, timeToR(item.time) + rJitter);
            const a = baseAngle + angleJitter;
            const { x, y } = polarToXY(r, a);

            const isHovered = hoveredPoint === index;
            const isPinned = pinnedPoint === index;
            const active = isHovered || isPinned;

            const pointFill = active ? getCategoryColor(item.category) : '#111827';
            const pointOpacity = active ? 1 : 0.65;
            const pointRadius = active ? 5 : 3;

            return (
              <g key={`pt-${index}`}>
                {/* 활성화 시 가이드 라인 */}
                {active && (
                  <line x1={cx} y1={cy} x2={x} y2={y} stroke={getCategoryColor(item.category)} strokeOpacity={0.35} strokeWidth={1} />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={pointRadius}
                  fill={pointFill}
                  opacity={pointOpacity}
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setPinnedPoint((p) => (p === index ? null : index))}
                />
              </g>
            );
          })}

          {/* 중심점 라벨 */}
          <text x={cx - 8} y={cy - 8} textAnchor="end" className="text-[10px] fill-gray-500">Center</text>
        </svg>

        {/* 정보 패널 (호버 우선, 핀 있으면 핀 표시) */}
        {(hoveredPoint !== null || pinnedPoint !== null) && (() => {
          const idx = hoveredPoint !== null ? hoveredPoint : pinnedPoint;
          const d = realAppData[idx];
          return (
            <div className="absolute top-28 right-4 bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-md shadow-md z-20 min-w-[220px]">
              <div className="text-sm font-semibold mb-1" style={{ color: getCategoryColor(d.category) }}>{d.app}</div>
              <div className="text-xs space-y-0.5 text-gray-700">
                <div>날짜: {d.date.substring(5)}</div>
                <div>시간: {Math.floor(d.time / 60)}시간 {d.time % 60}분</div>
                <div>카테고리: {d.category}</div>
                {pinnedPoint !== null && hoveredPoint === null && (
                  <div className="pt-2 text-[11px] text-gray-500">고정됨 • 클릭하면 해제</div>
                )}
              </div>
            </div>
          );
        })()}
        {/* 상위 앱 리스트: 우측 상단 고정 */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/85 backdrop-blur rounded-md border border-gray-200 shadow-sm px-4 py-3">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-700">
              {appTotals.slice(0, 6).map(app => (
                <div key={app} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-800" />
                  <span className="font-medium text-gray-800">{app}</span>
                  <span className="text-gray-400">총 {Math.floor(realAppData.filter(d => d.app === app).reduce((s, d) => s + d.time, 0) / 60)}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default AppUsageScatterPlot;


