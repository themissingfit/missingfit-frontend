import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const AllDresses = () => {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/dress`)
      .then((res) => setDresses(res.data.data || []))
      .finally(() => setLoading(false));
  }, [API]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30">
        <p className="text-muted-foreground">Loading dresses...</p>
      </div>
    );
  }
  const requestCall = ()=>{} 

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background py-20">
      <Navbar onRequestCall={requestCall}/>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Explore Our Collection
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse our complete range of premium rental outfits
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Content Wrapper */}
        <div className="bg-card/70 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-sm">
          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {dresses.map((dress) => (
              <div
                key={dress._id}
                className="group rounded-2xl overflow-hidden bg-background shadow hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={dress.images?.[0]?.url || "/placeholder-dress.jpg"}
                    alt={dress.dressTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={
                        dress.status === "Available"
                          ? "bg-accent text-primary"
                          : "bg-burgundy text-cream"
                      }
                    >
                      {dress.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium text-sm md:text-base line-clamp-1">
                    {dress.dressTitle}
                  </h3>

                  <p className="text-xs text-muted-foreground mt-1">
                    ₹{dress.withJewelryPrice?.toLocaleString()} with jewelry
                  </p>

                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {dress.category}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {dresses.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No dresses found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDresses;
