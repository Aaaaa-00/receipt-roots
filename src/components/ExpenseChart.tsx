import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartData {
  month: string;
  amount: number;
}

interface ExpenseChartProps {
  data: ChartData[];
  period: "month" | "year";
}

const ExpenseChart = ({ data, period }: ExpenseChartProps) => {
  // For yearly view, aggregate the data by quarters
  const yearlyData = [
    { quarter: "Q1", amount: data.slice(0, 3).reduce((sum, month) => sum + month.amount, 0) },
    { quarter: "Q2", amount: data.slice(3, 6).reduce((sum, month) => sum + month.amount, 0) },
    { quarter: "Q3", amount: data.slice(6, 9).reduce((sum, month) => sum + month.amount, 0) },
    { quarter: "Q4", amount: data.slice(9, 12).reduce((sum, month) => sum + month.amount, 0) },
  ];

  const chartData = period === "month" ? data : yearlyData;
  const xKey = period === "month" ? "month" : "quarter";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-medium p-3">
          <p className="font-medium text-card-foreground">{`${label}`}</p>
          <p className="text-expense font-semibold">
            {`Amount: $${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (period === "month") {
    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--expense))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--expense))" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey={xKey} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--expense))"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              className="transition-all duration-300"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey={xKey} 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="amount"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            className="transition-all duration-300 hover:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;