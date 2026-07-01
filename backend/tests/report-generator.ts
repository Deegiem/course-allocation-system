import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  suite: string;
  tests: {
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
  }[];
  passed: number;
  failed: number;
  total: number;
  duration: number;
}

export function generateTestReport(results: TestResult[]): string {
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const passRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

  let report = '📊 TEST EXECUTION REPORT\n';
  report += '='.repeat(50) + '\n\n';

  report += `📅 Date: ${new Date().toISOString()}\n`;
  report += `⏱️ Total Tests: ${totalTests}\n`;
  report += `✅ Passed: ${totalPassed}\n`;
  report += `❌ Failed: ${totalFailed}\n`;
  report += `📈 Pass Rate: ${passRate.toFixed(2)}%\n\n`;

  report += '-' .repeat(50) + '\n\n';

  for (const suite of results) {
    report += `📁 ${suite.suite}\n`;
    report += `   ⏱️ Duration: ${suite.duration}ms\n`;
    report += `   ✅ ${suite.passed} passed | ❌ ${suite.failed} failed | 📊 ${suite.total} total\n\n`;

    for (const test of suite.tests) {
      const icon = test.passed ? '✅' : '❌';
      report += `   ${icon} ${test.name} (${test.duration}ms)\n`;
      if (test.error) {
        report += `      Error: ${test.error}\n`;
      }
    }
    report += '\n';
  }

  report += '=' .repeat(50) + '\n';
  report += `🏆 Overall Pass Rate: ${passRate.toFixed(2)}%\n`;
  report += `📊 Status: ${passRate >= 90 ? 'PASSED ✅' : 'FAILED ❌'}\n`;

  return report;
}

export function saveTestReport(report: string) {
  const reportDir = path.join(__dirname, '../../reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(reportDir, `test-report-${timestamp}.txt`);
  fs.writeFileSync(filePath, report);
  
  console.log(`📄 Test report saved to: ${filePath}`);
  return filePath;
}