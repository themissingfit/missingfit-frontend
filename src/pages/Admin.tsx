import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const Admin = () => {
  const [dresses, setDresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [addDressOpen, setAddDressOpen] = useState(false);
  const [rentalOpen, setRentalOpen] = useState(false);
  const [selectedDress, setSelectedDress] = useState<any>(null);

  const [dressForm, setDressForm] = useState({
    dressTitle: "",
    category: "",
    withJewelryPrice: "",
    withoutJewelryPrice: "",
    images: [] as File[],
  });

  const [rentalForm, setRentalForm] = useState({
    startDate: "",
    endDate: "",
    customerName: "",
  });

  /* ================= FETCH ================= */
  const fetchDresses = async () => {
    try {
      const res = await axios.get(`${API}/dress`);
      setDresses(res.data.data || []);
    } catch {
      toast.error("Failed to load dresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDresses();
  }, []);

  /* ================= ADD DRESS ================= */
  const handleAddDress = async () => {
  try {
    if (!dressForm.dressTitle || dressForm.images.length === 0) {
      toast.error("Title and images required");
      return;
    }

    const formData = new FormData();

    formData.append("dressTitle", dressForm.dressTitle);
    formData.append("category", dressForm.category);
    formData.append("withJewelryPrice", dressForm.withJewelryPrice);
    formData.append("withoutJewelryPrice", dressForm.withoutJewelryPrice);

    // ✅ SAFE: images is File[]
    dressForm.images.forEach((img: File) => {
      formData.append("images", img);
    });

    await axios.post(`${API}/dress/upload-dress`, formData);

    toast.success("Dress added");
    setAddDressOpen(false);

    setDressForm({
      dressTitle: "",
      category: "",
      withJewelryPrice: "",
      withoutJewelryPrice: "",
      images: [],
    });

    fetchDresses();
  } catch {
    toast.error("Failed to add dress");
  }
};


  /* ================= ADD RENTAL ================= */
  const handleAddRental = async () => {
    try {
      await axios.post(`${API}/dress/rentals`, {
        dressId: selectedDress._id,
        ...rentalForm,
      });

      toast.success("Rental added");
      setRentalOpen(false);
      setRentalForm({ startDate: "", endDate: "", customerName: "" });
      fetchDresses();
    } catch {
      toast.error("Rental failed");
    }
  };

  /* ================= REMOVE RENTAL ================= */
  const handleRemoveRental = async (dressId: string) => {
    try {
      await axios.delete(`${API}/dress/${dressId}/rental`);
      toast.success("Rental removed");
      fetchDresses();
    } catch {
      toast.error("Failed to remove rental");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-primary text-cream sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logo} className="h-12 w-12 rounded-full" />
            <div>
              <h1 className="font-display text-xl">Admin Dashboard</h1>
              <p className="text-cream/60 text-sm">Manage rentals & inventory</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="heroOutline" size="sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <h2 className="font-display text-2xl">Dress Inventory</h2>

          <Dialog open={addDressOpen} onOpenChange={setAddDressOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <Plus className="h-4 w-4" /> Add Dress
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Dress</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  placeholder="Dress title"
                  value={dressForm.dressTitle}
                  onChange={(e) =>
                    setDressForm({ ...dressForm, dressTitle: e.target.value })
                  }
                />
                <Input
                  placeholder="Category"
                  value={dressForm.category}
                  onChange={(e) =>
                    setDressForm({ ...dressForm, category: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="With jewelry price"
                  onChange={(e) =>
                    setDressForm({
                      ...dressForm,
                      withJewelryPrice: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Without jewelry price"
                  onChange={(e) =>
                    setDressForm({
                      ...dressForm,
                      withoutJewelryPrice: e.target.value,
                    })
                  }
                />
                <Input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setDressForm({
                      ...dressForm,
                      images: Array.from(e.target.files || []),
                    })
                  }
                />

                <Button variant="gold" onClick={handleAddDress}>
                  Save Dress
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Rental</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dresses.map((dress) => (
              <TableRow key={dress._id}>
                <TableCell>
                  <img
                    src={dress.images?.[0]?.url}
                    className="w-16 h-20 rounded object-cover"
                  />
                </TableCell>

                <TableCell>
                  <p className="font-medium">{dress.dressTitle}</p>
                  <p className="text-sm">
                    ₹{dress.withJewelryPrice} with jewelry
                  </p>
                </TableCell>

                <TableCell>
                  <Badge
                    className={
                      dress.status === "Available"
                        ? "bg-accent text-primary"
                        : "bg-burgundy text-cream"
                    }
                  >
                    {dress.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  {dress.currentRental ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(
                          dress.currentRental.startDate
                        ).toDateString()}{" "}
                        -{" "}
                        {new Date(
                          dress.currentRental.endDate
                        ).toDateString()}
                      </div>
                      <p className="text-muted-foreground">
                        Rented by{" "}
                        <strong>
                          {dress.currentRental.customerName || "Guest"}
                        </strong>
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRental(dress._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      No active rental
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => {
                      setSelectedDress(dress);
                      setRentalOpen(true);
                    }}
                  >
                    Add Rental
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      {/* RENTAL MODAL */}
      <Dialog open={rentalOpen} onOpenChange={setRentalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Rental</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              type="date"
              onChange={(e) =>
                setRentalForm({ ...rentalForm, startDate: e.target.value })
              }
            />
            <Input
              type="date"
              onChange={(e) =>
                setRentalForm({ ...rentalForm, endDate: e.target.value })
              }
            />
            <Input
              placeholder="Customer name"
              onChange={(e) =>
                setRentalForm({
                  ...rentalForm,
                  customerName: e.target.value,
                })
              }
            />
            <Button variant="gold" onClick={handleAddRental}>
              Save Rental
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
