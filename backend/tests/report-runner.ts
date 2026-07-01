import { generateTestReport, saveTestReport } from './report-generator';
import * as fs from 'fs';

// Read the test results from jest
try {
  const results = JSON.parse(fs.readFileSync('test-results.json', 'utf-8'));
  
  // Parse results into our format
  const parsedResults = results.testResults.map((suite: any) => ({
    suite: suite.name,
    tests: suite.assertionResults.map((test: any) => ({
      name: test.title,
      passed: test.status === 'passed',
      duration: test.duration || 0,
      error: test.failureMessages?.[0],
    })),
    passed: suite.assertionResults.filter((t: any) => t.status === 'passed').length,
    failed: suite.assertionResults.filter((t: any) => t.status === 'failed').length,
    total: suite.assertionResults.length,
    duration: suite.endTime - suite.startTime,
  }));

  const report = generateTestReport(parsedResults);
  const filePath = saveTestReport(report);
  console.log(report);
} catch (error) {
  console.error('Error generating test report:', error);
}