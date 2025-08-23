import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface HealthData {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

interface MetricsData {
  timestamp: string;
  uptime: {
    seconds: number;
    formatted: string;
  };
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
  };
  database: {
    status: string;
    type: string;
    database: string;
  };
  performance: {
    memoryUsagePercent: number;
    uptimeHours: number;
  };
}

export const HealthStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const [healthData, metricsData] = await Promise.all([
          apiService.healthCheck(),
          apiService.getMetrics()
        ]);
        
        setHealth(healthData);
        setMetrics(metricsData);
        setError(null);
      } catch (err) {
        setError('Failed to connect to backend service');
        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Service Unavailable</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">System Health</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            health?.status === 'ok' ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
          <span className="text-sm font-medium text-gray-600 capitalize">
            {health?.status || 'unknown'}
          </span>
        </div>
      </div>

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{health.service}</div>
            <div className="text-sm text-gray-500">Service</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{health.version}</div>
            <div className="text-sm text-gray-500">Version</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {new Date(health.timestamp).toLocaleTimeString()}
            </div>
            <div className="text-sm text-gray-500">Last Check</div>
          </div>
        </div>
      )}

      {metrics && (
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Performance Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{metrics.uptime.formatted}</div>
                <div className="text-xs text-gray-500">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{metrics.performance.memoryUsagePercent}%</div>
                <div className="text-xs text-gray-500">Memory Usage</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{metrics.memory.heapUsed}</div>
                <div className="text-xs text-gray-500">Heap Used</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold ${
                  metrics.database.status === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics.database.status}
                </div>
                <div className="text-xs text-gray-500">Database</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 