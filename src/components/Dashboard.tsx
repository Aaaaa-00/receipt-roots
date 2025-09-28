import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, TrendingUp, TrendingDown, Calendar, Building2 } from "lucide-react";
import InvoiceUpload from "./InvoiceUpload";
import ExpenseChart from "./ExpenseChart";
import EntityManager from "./EntityManager";
import InvoiceList from "./InvoiceList";

// Mock data - in real app this would come from a database
const mockData = {
  entities: [
    { id: 1, name: "Tech Solutions Inc", totalExpenses: 12500, color: "#3B82F6" },
    { id: 2, name: "Marketing Pro LLC", totalExpenses: 8900, color: "#10B981" },
    { id: 3, name: "Design Studio Co", totalExpenses: 6750, color: "#F59E0B" },
  ],
  categories: [
    { name: "Office Supplies", amount: 3200, percentage: 12 },
    { name: "Software", amount: 8500, percentage: 30 },
    { name: "Travel", amount: 4800, percentage: 17 },
    { name: "Marketing", amount: 6200, percentage: 22 },
    { name: "Equipment", amount: 2800, percentage: 10 },
    { name: "Other", amount: 2650, percentage: 9 },
  ],
  monthlyData: [
    { month: "Jan", amount: 4200 },
    { month: "Feb", amount: 3800 },
    { month: "Mar", amount: 5100 },
    { month: "Apr", amount: 4600 },
    { month: "May", amount: 6200 },
    { month: "Jun", amount: 5800 },
    { month: "Jul", amount: 7200 },
    { month: "Aug", amount: 6900 },
    { month: "Sep", amount: 5400 },
    { month: "Oct", amount: 6800 },
    { month: "Nov", amount: 7500 },
    { month: "Dec", amount: 8200 },
  ]
};

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">("month");
  const [showUpload, setShowUpload] = useState(false);

  const totalExpenses = mockData.entities.reduce((sum, entity) => sum + entity.totalExpenses, 0);
  const averageMonthly = mockData.monthlyData.reduce((sum, month) => sum + month.amount, 0) / 12;
  const currentMonth = mockData.monthlyData[mockData.monthlyData.length - 1];
  const previousMonth = mockData.monthlyData[mockData.monthlyData.length - 2];
  const monthlyChange = ((currentMonth.amount - previousMonth.amount) / previousMonth.amount) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Invoice Management</h1>
            <p className="text-muted-foreground">Track expenses across all your entities</p>
          </div>
          <Button 
            onClick={() => setShowUpload(true)}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-medium"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Invoice
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <TrendingUp className="h-4 w-4 text-expense" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">${totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all entities</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Average</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${Math.round(averageMonthly).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">12-month average</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-expense" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentMonth.amount.toLocaleString()}</div>
              <p className={`text-xs ${monthlyChange >= 0 ? 'text-success' : 'text-expense'}`}>
                {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Entities</CardTitle>
              <Building2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{mockData.entities.length}</div>
              <p className="text-xs text-muted-foreground">Business entities</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Entity Breakdown */}
              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Entity Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockData.entities.map((entity) => (
                    <div key={entity.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entity.color }}
                        />
                        <span className="font-medium">{entity.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-expense">${entity.totalExpenses.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {((entity.totalExpenses / totalExpenses) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Expense Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockData.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">${category.amount.toLocaleString()}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Monthly Chart */}
            <Card className="bg-gradient-card border-0 shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Expense Trends
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPeriod === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod("month")}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={selectedPeriod === "year" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod("year")}
                    >
                      Yearly
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ExpenseChart 
                  data={mockData.monthlyData} 
                  period={selectedPeriod}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entities">
            <EntityManager entities={mockData.entities} />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoiceList />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Detailed Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Advanced analytics features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Upload Modal */}
        {showUpload && (
          <InvoiceUpload 
            onClose={() => setShowUpload(false)}
            onUpload={(files) => {
              console.log('Files uploaded:', files);
              setShowUpload(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;