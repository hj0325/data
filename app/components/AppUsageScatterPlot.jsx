'use client'

import React, { useState, useMemo } from 'react';

const AppUsageScatterPlot = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
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
  
  // 앱별 총 사용시간 계산 및 정렬
  const appTotals = useMemo(() => {
    const totals = {};
    realAppData.forEach(item => {
      totals[item.app] = (totals[item.app] || 0) + item.time;
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([app]) => app);
  }, []);
  
  // 날짜를 숫자로 변환
  const parseDate = (dateStr) => {
    return new Date(dateStr).getTime();
  };
  
  const minDate = Math.min(...realAppData.map(d => parseDate(d.date)));
  const maxDate = Math.max(...realAppData.map(d => parseDate(d.date)));
  
  // 색상 매핑
  const getCategoryColor = (category) => {
    const colors = {
      '생산성 및 금융': '#4169E1',
      '기타': '#FF8C00',
      '소셜 미디어': '#00CED1',
      '엔터테인먼트': '#FFD700'
    };
    return colors[category] || '#888888';
  };
  
  // SVG 크기
  const width = 1400;
  const height = 800;
  const margin = { top: 80, right: 80, bottom: 60, left: 150 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // 스케일 계산
  const getX = (date) => {
    const t = (parseDate(date) - minDate) / (maxDate - minDate);
    return margin.left + t * plotWidth;
  };
  
  const getY = (app, time) => {
    const appIndex = appTotals.indexOf(app);
    const baseY = margin.top + (appIndex / (appTotals.length - 1)) * plotHeight;
    // 약간의 랜덤 지터 추가
    const jitter = (Math.random() - 0.5) * 15;
    return baseY + jitter;
  };
  
  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center p-8">
      {/* 제목 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          앱 사용 시간 분석 (10/27 - 11/02)
        </h1>
        <p className="text-sm text-gray-600">
          각 점은 하루 동안의 앱 사용을 나타냅니다 • 총 {realAppData.length}개 데이터 포인트
        </p>
      </div>
      
      {/* SVG 차트 */}
      <div className="relative bg-white shadow-lg rounded-lg p-4">
        <svg width={width} height={height}>
          {/* 그리드 라인 */}
          {appTotals.map((app, index) => {
            const y = margin.top + (index / (appTotals.length - 1)) * plotHeight;
            return (
              <line
                key={`grid-${app}`}
                x1={margin.left}
                y1={y}
                x2={width - margin.right}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            );
          })}
          
          {/* 데이터 포인트 */}
          {realAppData.map((item, index) => {
            const x = getX(item.date);
            const y = getY(item.app, item.time);
            const isHovered = hoveredPoint === index;
            
            // 사용 시간에 비례하는 반지름 (2~12 범위)
            const baseRadius = Math.max(2, Math.min(12, item.time / 20));
            const radius = isHovered ? baseRadius + 2 : baseRadius;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={radius}
                fill={getCategoryColor(item.category)}
                opacity={isHovered ? 1 : 0.6}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
          
          {/* Y축 레이블 (앱 이름) */}
          {appTotals.map((app, index) => {
            const y = margin.top + (index / (appTotals.length - 1)) * plotHeight;
            const total = realAppData
              .filter(d => d.app === app)
              .reduce((sum, d) => sum + d.time, 0);
            const hours = Math.floor(total / 60);
            const mins = total % 60;
            
            return (
              <g key={`label-${app}`}>
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs font-medium fill-gray-700"
                >
                  {app}
                </text>
                <text
                  x={margin.left - 10}
                  y={y + 16}
                  textAnchor="end"
                  className="text-xs fill-gray-400"
                >
                  ({hours}h {mins}m)
                </text>
              </g>
            );
          })}
          
          {/* X축 레이블 (날짜) */}
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date(minDate + i * (maxDate - minDate) / 6);
            const x = getX(date.toISOString().split('T')[0]);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            
            return (
              <text
                key={`date-${i}`}
                x={x}
                y={height - margin.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {dateStr}
              </text>
            );
          })}
          
          {/* Y축 제목 */}
          <text
            x={30}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 30, ${height / 2})`}
            className="text-sm font-semibold fill-gray-700"
          >
            애플리케이션 (사용시간 많은 순)
          </text>
          
          {/* X축 제목 */}
          <text
            x={width / 2}
            y={height - 20}
            textAnchor="middle"
            className="text-sm font-semibold fill-gray-700"
          >
            날짜
          </text>
        </svg>
        
        {/* 호버 정보 */}
        {hoveredPoint !== null && (
          <div className="absolute top-4 right-4 bg-white border-2 border-gray-300 text-gray-900 px-4 py-3 rounded-lg shadow-xl z-20">
            <div className="text-sm font-bold mb-1">{realAppData[hoveredPoint].app}</div>
            <div className="text-xs space-y-0.5 text-gray-700">
              <div>날짜: {realAppData[hoveredPoint].date.substring(5)}</div>
              <div>시간: {Math.floor(realAppData[hoveredPoint].time / 60)}시간 {realAppData[hoveredPoint].time % 60}분</div>
              <div>카테고리: {realAppData[hoveredPoint].category}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* 범례 */}
      <div className="mt-8 flex gap-6 justify-center">
        {['생산성 및 금융', '기타', '소셜 미디어', '엔터테인먼트'].map(cat => (
          <div key={cat} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: getCategoryColor(cat) }}
            />
            <span className="text-sm text-gray-700">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppUsageScatterPlot;


