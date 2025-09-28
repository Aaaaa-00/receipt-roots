import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, FileText, Calendar, Building2, DollarSign, Eye, Download, Trash2 } from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  vendor: string;
  entity: string;
  category: string;
  amount: number;
  date: string;
  status: "pending" | "processed" | "approved" | "rejected";
  filename: string;
}

// Mock invoice data
const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    number: "INV-2024-001",
    vendor: "Office Depot",
    entity: "Tech Solutions Inc",
    category: "Office Supplies",
    amount: 245.50,
    date: "2024-01-15",
    status: "approved",
    filename: "office_supplies_jan.pdf"
  },
  {
    id: "INV-002", 
    number: "INV-2024-002",
    vendor: "Adobe Inc",
    entity: "Design Studio Co",
    category: "Software",
    amount: 599.00,
    date: "2024-01-20",
    status: "processed",
    filename: "adobe_license.pdf"
  },
  {
    id: "INV-003",
    number: "INV-2024-003", 
    vendor: "Delta Airlines",
    entity: "Marketing Pro LLC",
    category: "Travel",
    amount: 1250.75,
    date: "2024-01-22",
    status: "pending",
    filename: "flight_booking_confirmation.pdf"
  },
  {
    id: "INV-004",
    number: "INV-2024-004",
    vendor: "Google Ads",
    entity: "Marketing Pro LLC", 
    category: "Marketing",
    amount: 850.00,
    date: "2024-01-25",
    status: "approved",
    filename: "google_ads_invoice.pdf"
  },
  {
    id: "INV-005",
    number: "INV-2024-005",
    vendor: "Best Buy",
    entity: "Tech Solutions Inc",
    category: "Equipment", 
    amount: 1899.99,
    date: "2024-01-28",
    status: "rejected",
    filename: "laptop_purchase.pdf"
  }
];

const InvoiceList = () => {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEntity, setFilterEntity] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const entities = Array.from(new Set(invoices.map(inv => inv.entity)));
  const categories = Array.from(new Set(invoices.map(inv => inv.category)));
  const statuses = ["pending", "processed", "approved", "rejected"];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.filename.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntity = !filterEntity || invoice.entity === filterEntity;
    const matchesStatus = !filterStatus || invoice.status === filterStatus;
    const matchesCategory = !filterCategory || invoice.category === filterCategory;

    return matchesSearch && matchesEntity && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "success";
      case "processed": return "default";
      case "pending": return "warning";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = getStatusColor(status) as any;
    return (
      <Badge variant={variant} className="capitalize">
        {status}
      </Badge>
    );
  };

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const approvedAmount = filteredInvoices
    .filter(inv => inv.status === "approved")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Invoice Management</h2>
          <p className="text-muted-foreground">View and manage all your uploaded invoices</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{filteredInvoices.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.length !== invoices.length && `of ${invoices.length} total`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-expense" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current view</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${approvedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => inv.status === "approved").length} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {filteredInvoices.filter(inv => inv.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Invoice number, vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entity</label>
              <Select value={filterEntity} onValueChange={setFilterEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All entities</SelectItem>
                  {entities.map(entity => (
                    <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterEntity("");
                  setFilterStatus("");
                  setFilterCategory("");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Invoices ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No invoices found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterEntity || filterStatus || filterCategory 
                  ? "Try adjusting your filters or search terms"
                  : "Upload your first invoice to get started"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-background/50">
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{invoice.vendor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{invoice.entity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {invoice.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-expense">
                        ${invoice.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceList;