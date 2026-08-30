import { catchAsync } from '../utils/catchAsync.js';
import { getGovernmentKPIs, getChartData } from '../services/analytics/analyticsService.js';

export const getKPIs = catchAsync(async (_req, res) => {
  const kpis = await getGovernmentKPIs();
  res.status(200).json({ success: true, data: kpis });
});

export const getAnalytics = catchAsync(async (_req, res) => {
  const data = await getChartData();
  res.status(200).json({ success: true, data });
});

export const getDashboard = catchAsync(async (_req, res) => {
  const data = await getChartData();
  res.status(200).json({ success: true, data });
});
