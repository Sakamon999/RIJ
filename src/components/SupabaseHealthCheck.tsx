import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, Database, Shield } from 'lucide-react';
import { checkSupabaseHealth, type HealthCheckResult } from '../lib/supabase';

export default function SupabaseHealthCheck() {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const runHealthCheck = async () => {
      try {
        const result = await checkSupabaseHealth();
        if (mounted) {
          setHealth(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Health check failed:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    runHealthCheck();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
        <Loader className="w-4 h-4 text-emerald-400 animate-spin" />
        <span className="text-sm text-gray-400">Checking Supabase connection...</span>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-900/20 rounded-lg border border-red-500/30">
        <XCircle className="w-4 h-4 text-red-400" />
        <span className="text-sm text-red-400">Health check unavailable</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
        {health.ok ? (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400" />
        )}
        <span className="text-sm text-gray-300">
          Supabase Status: <span className={health.ok ? 'text-emerald-400' : 'text-red-400'}>
            {health.ok ? 'Connected' : 'Issues Detected'}
          </span>
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-medium text-white">Authentication</h4>
          </div>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Connected:</span>
              <span className={health.auth.connected ? 'text-emerald-400' : 'text-red-400'}>
                {health.auth.connected ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Session:</span>
              <span className={health.auth.hasSession ? 'text-emerald-400' : 'text-gray-500'}>
                {health.auth.hasSession ? 'Yes' : 'No'}
              </span>
            </div>
            {health.auth.userId && (
              <div className="flex justify-between">
                <span>User ID:</span>
                <span className="text-emerald-400 font-mono truncate max-w-[150px]">
                  {health.auth.userId.slice(0, 8)}...
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-medium text-white">Database</h4>
          </div>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Connected:</span>
              <span className={health.database.connected ? 'text-emerald-400' : 'text-red-400'}>
                {health.database.connected ? 'Yes' : 'No'}
              </span>
            </div>
            {health.database.error && (
              <div className="mt-2 text-xs text-gray-500 italic">
                {health.database.error}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Last checked: {new Date(health.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
