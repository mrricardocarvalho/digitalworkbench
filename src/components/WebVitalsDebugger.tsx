import React, { useEffect, useState } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface WebVitalsDebuggerProps {
  onMetricReceived?: (metric: Metric) => void;
}

const WebVitalsDebugger: React.FC<WebVitalsDebuggerProps> = ({ onMetricReceived }) => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().substr(11, 8);
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-9), logMessage]); // Keep last 10 logs
    console.log(logMessage);
  };

  useEffect(() => {
    addLog('🔍 WebVitalsDebugger: Initializing direct web-vitals monitoring...');

    const handleMetric = (metric: Metric) => {
      addLog(`📊 ${metric.name}: ${metric.value}ms (ID: ${metric.id})`);
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric.value
      }));
      
      if (onMetricReceived) {
        onMetricReceived(metric);
      }
    };

    try {
      // Direct web-vitals registration
      onCLS(handleMetric);
      onINP(handleMetric);
      onFCP(handleMetric);
      onLCP(handleMetric);
      onTTFB(handleMetric);
      
      addLog('✅ All web-vitals callbacks registered successfully');
    } catch (error) {
      addLog(`❌ Error registering web-vitals: ${error}`);
    }

    // Trigger some events to try to capture metrics
    const timer = setTimeout(() => {
      addLog('⏰ 5 seconds passed - some metrics should be available by now');
    }, 5000);

    return () => clearTimeout(timer);
  }, [onMetricReceived]);

  const triggerInteraction = () => {
    addLog('👆 Manual interaction triggered');
    
    // Create a visible button to trigger INP
    const button = document.createElement('button');
    button.textContent = 'Test INP';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.zIndex = '10000';
    button.style.padding = '20px';
    button.style.backgroundColor = '#007acc';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    
    button.onclick = () => {
      // Force a small layout shift to trigger CLS
      const div = document.createElement('div');
      div.style.height = '5px';
      div.style.backgroundColor = 'transparent';
      div.style.transition = 'height 0.1s';
      document.body.appendChild(div);
      
      setTimeout(() => {
        div.style.height = '10px';
        setTimeout(() => {
          document.body.removeChild(div);
          document.body.removeChild(button);
          addLog('🔄 Layout shift and interaction completed');
        }, 100);
      }, 50);
    };
    
    document.body.appendChild(button);
    addLog('📍 Click the blue button in the center to trigger INP and CLS');
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: '#000', 
      color: '#0f0', 
      padding: '10px', 
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        🧪 Web Vitals Debugger
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Captured Metrics:</strong><br />
        {Object.entries(metrics).map(([name, value]) => (
          <div key={name}>
            {name}: {typeof value === 'number' ? 
              (name === 'CLS' ? value.toFixed(3) : `${Math.round(value)}ms`) : 
              'N/A'
            }
          </div>
        )) || <div>No metrics captured yet</div>}
      </div>

      <button 
        onClick={triggerInteraction}
        style={{ 
          background: '#333', 
          color: '#fff', 
          border: '1px solid #666', 
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Trigger Test Interaction
      </button>

      <div style={{ fontSize: '10px' }}>
        <strong>Logs:</strong><br />
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default WebVitalsDebugger;
