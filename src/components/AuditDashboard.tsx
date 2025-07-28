import React, { useState, useEffect } from 'react';
import { seoAuditor } from '../utils/seoAudit';
import { accessibilityAuditor } from '../utils/accessibilityAudit';
import { analytics } from '../utils/analytics';

interface AuditDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuditDashboard: React.FC<AuditDashboardProps> = ({ isOpen, onClose }) => {
  const [seoResults, setSeoResults] = useState<any>(null);
  const [accessibilityResults, setAccessibilityResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'seo' | 'accessibility' | 'combined'>('combined');

  useEffect(() => {
    if (isOpen && !seoResults && !accessibilityResults) {
      runAudits();
    }
  }, [isOpen, seoResults, accessibilityResults]);

  const runAudits = async () => {
    setIsRunning(true);
    try {
      const [seoAudit, a11yAudit] = await Promise.all([
        seoAuditor.auditCurrentPage(),
        accessibilityAuditor.auditCurrentPage()
      ]);
      
      setSeoResults(seoAudit);
      setAccessibilityResults(a11yAudit);
      
      // Track audit completion
      analytics.trackEvent({
        event_name: 'audit_completed',
        category: 'seo_accessibility',
        action: 'completed',
        custom_parameters: {
          seo_score: seoAudit.score,
          a11y_score: a11yAudit.score,
          wcag_level: a11yAudit.level
        }
      });
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const refreshAudits = () => {
    setSeoResults(null);
    setAccessibilityResults(null);
    runAudits();
  };

  const downloadReport = () => {
    if (!seoResults || !accessibilityResults) return;
    
    const seoReport = seoAuditor.generateReport(seoResults);
    const a11yReport = accessibilityAuditor.generateReport(accessibilityResults);
    
    const combinedReport = `${seoReport}\n\n---\n\n${a11yReport}`;
    
    const blob = new Blob([combinedReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    analytics.trackEvent({
      event_name: 'report_downloaded',
      category: 'audit',
      action: 'download',
      label: 'combined'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              SEO & Accessibility Audit
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive analysis of current page compliance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshAudits}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isRunning ? 'Running...' : 'Refresh'}
            </button>
            <button
              onClick={downloadReport}
              disabled={!seoResults || !accessibilityResults}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Download Report
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'combined', label: 'Overview' },
            { key: 'seo', label: 'SEO Audit' },
            { key: 'accessibility', label: 'Accessibility Audit' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isRunning ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Running comprehensive audit...</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {activeTab === 'combined' && (
                <CombinedView seoResults={seoResults} accessibilityResults={accessibilityResults} />
              )}
              {activeTab === 'seo' && (
                <SEOView results={seoResults} />
              )}
              {activeTab === 'accessibility' && (
                <AccessibilityView results={accessibilityResults} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CombinedView: React.FC<{ seoResults: any; accessibilityResults: any }> = ({ 
  seoResults, 
  accessibilityResults 
}) => {
  if (!seoResults || !accessibilityResults) {
    return <div className="text-center text-gray-500">No audit data available</div>;
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const totalIssues = seoResults.issues.length + accessibilityResults.issues.length;
  const criticalIssues = [...seoResults.issues, ...accessibilityResults.issues]
    .filter((issue: any) => issue.type === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg border ${getScoreBgColor(seoResults.score)}`}>
          <h3 className="text-lg font-semibold text-gray-900">SEO Score</h3>
          <div className={`text-3xl font-bold mt-2 ${getScoreColor(seoResults.score)}`}>
            {seoResults.score}/100
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {seoResults.issues.length} issues found
          </p>
        </div>

        <div className={`p-6 rounded-lg border ${getScoreBgColor(accessibilityResults.score)}`}>
          <h3 className="text-lg font-semibold text-gray-900">Accessibility Score</h3>
          <div className={`text-3xl font-bold mt-2 ${getScoreColor(accessibilityResults.score)}`}>
            {accessibilityResults.score}/100
          </div>
          <p className="text-sm text-gray-600 mt-1">
            WCAG {accessibilityResults.level} Level
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-blue-100 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Issues</h3>
          <div className="text-3xl font-bold mt-2 text-blue-600">
            {totalIssues}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {criticalIssues} critical issues
          </p>
        </div>
      </div>

      {/* Critical Issues */}
      {criticalIssues > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Critical Issues Requiring Immediate Attention</h3>
          <div className="space-y-3">
            {[...seoResults.issues, ...accessibilityResults.issues]
              .filter((issue: any) => issue.type === 'critical')
              .slice(0, 5)
              .map((issue: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-red-100 rounded-full p-1">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{issue.message}</p>
                    <p className="text-sm text-gray-600">{issue.fix}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Page Metadata */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Page Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Word Count:</span>
            <span className="ml-2 font-medium">{seoResults.metadata.wordCount}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Images:</span>
            <span className="ml-2 font-medium">{seoResults.metadata.imageCount}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Links:</span>
            <span className="ml-2 font-medium">{seoResults.metadata.linkCount}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Headings:</span>
            <span className="ml-2 font-medium">{accessibilityResults.metadata.headingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SEOView: React.FC<{ results: any }> = ({ results }) => {
  if (!results) return <div className="text-center text-gray-500">No SEO data available</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issues */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Issues ({results.issues.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.issues.map((issue: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    issue.type === 'critical' ? 'bg-red-100 text-red-800' :
                    issue.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {issue.type}
                  </span>
                  <span className="text-xs text-gray-500">{issue.category}</span>
                </div>
                <p className="font-medium mt-2">{issue.message}</p>
                <p className="text-sm text-gray-600 mt-1">{issue.fix}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recommendations ({results.recommendations.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.recommendations.map((rec: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority}
                  </span>
                  <span className="text-xs text-gray-500">{rec.category}</span>
                </div>
                <p className="font-medium mt-2">{rec.title}</p>
                <p className="text-sm text-gray-600 mt-1">{rec.implementation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AccessibilityView: React.FC<{ results: any }> = ({ results }) => {
  if (!results) return <div className="text-center text-gray-500">No accessibility data available</div>;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800">WCAG {results.level} Compliance Level</h3>
        <p className="text-sm text-blue-600 mt-1">
          This page meets WCAG 2.1 Level {results.level} accessibility standards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issues */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Issues ({results.issues.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.issues.map((issue: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    issue.type === 'critical' ? 'bg-red-100 text-red-800' :
                    issue.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    WCAG {issue.level}
                  </span>
                  <span className="text-xs text-gray-500">{issue.category}</span>
                </div>
                <p className="font-medium mt-2">{issue.message}</p>
                <p className="text-sm text-gray-600 mt-1">{issue.fix}</p>
                <p className="text-xs text-gray-500 mt-2">{issue.wcagReference}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Passed Checks */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Passed Checks ({results.passed.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.passed.map((check: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">{check.description}</p>
                  <p className="text-xs text-green-600">{check.wcagReference}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;
