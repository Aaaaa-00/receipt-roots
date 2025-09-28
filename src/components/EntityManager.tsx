import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Edit, Trash2, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Entity {
  id: number;
  name: string;
  totalExpenses: number;
  color: string;
}

interface EntityManagerProps {
  entities: Entity[];
}

const EntityManager = ({ entities: initialEntities }: EntityManagerProps) => {
  const [entities, setEntities] = useState<Entity[]>(initialEntities);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6"
  });
  const { toast } = useToast();

  const colors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#F97316", "#06B6D4", "#84CC16"
  ];

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid entity name.",
        variant: "destructive"
      });
      return;
    }

    if (editingEntity) {
      setEntities(prev => prev.map(entity => 
        entity.id === editingEntity.id 
          ? { ...entity, name: formData.name, color: formData.color }
          : entity
      ));
      toast({
        title: "Entity updated",
        description: `${formData.name} has been updated successfully.`
      });
    } else {
      const newEntity: Entity = {
        id: Math.max(...entities.map(e => e.id)) + 1,
        name: formData.name,
        totalExpenses: 0,
        color: formData.color
      };
      setEntities(prev => [...prev, newEntity]);
      toast({
        title: "Entity added",
        description: `${formData.name} has been added successfully.`
      });
    }

    setFormData({ name: "", color: "#3B82F6" });
    setEditingEntity(null);
    setShowAddDialog(false);
  };

  const handleEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setFormData({ name: entity.name, color: entity.color });
    setShowAddDialog(true);
  };

  const handleDelete = (entityId: number) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity && entity.totalExpenses > 0) {
      toast({
        title: "Cannot delete entity",
        description: "Entity has existing expenses. Please reassign or delete expenses first.",
        variant: "destructive"
      });
      return;
    }

    setEntities(prev => prev.filter(e => e.id !== entityId));
    toast({
      title: "Entity deleted",
      description: "Entity has been removed successfully."
    });
  };

  const totalExpenses = entities.reduce((sum, entity) => sum + entity.totalExpenses, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Entity Management</h2>
          <p className="text-muted-foreground">Manage your business entities and track their expenses</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-primary hover:opacity-90"
              onClick={() => {
                setEditingEntity(null);
                setFormData({ name: "", color: "#3B82F6" });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entity
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-card border-0 shadow-strong">
            <DialogHeader>
              <DialogTitle>
                {editingEntity ? "Edit Entity" : "Add New Entity"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Entity Name</Label>
                <Input
                  id="name"
                  placeholder="Enter entity name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        formData.color === color ? 'border-foreground scale-110' : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-gradient-primary hover:opacity-90">
                  {editingEntity ? "Update" : "Add"} Entity
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entities</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{entities.length}</div>
            <p className="text-xs text-muted-foreground">Active business entities</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Combined Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-expense" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">RM{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all entities</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average per Entity</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM{entities.length > 0 ? Math.round(totalExpenses / entities.length).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">Average expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Entity List */}
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Entities ({entities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entities.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No entities yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first business entity to start tracking expenses
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Entity
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entities.map((entity) => (
                <Card key={entity.id} className="bg-background/50 border hover:shadow-medium transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: entity.color }}
                        />
                        <h3 className="font-semibold text-sm truncate">{entity.name}</h3>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(entity)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entity.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Total Expenses</span>
                        <Badge variant={entity.totalExpenses > 0 ? "destructive" : "secondary"} className="text-xs">
                          RM{entity.totalExpenses.toLocaleString()}
                        </Badge>
                      </div>
                      
                      {totalExpenses > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Share</span>
                            <span className="text-xs font-medium">
                              {((entity.totalExpenses / totalExpenses) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(entity.totalExpenses / totalExpenses) * 100}%`,
                                backgroundColor: entity.color
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntityManager;