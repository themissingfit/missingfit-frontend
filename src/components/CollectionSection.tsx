import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import DressCard from "./DressCard";
import DressDetailModal from "./DressDetailModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CollectionSection = () => {
  const [dresses, setDresses] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedDress, setSelectedDress] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

  /* ================= FETCH DRESSES ================= */
  useEffect(() => {
    const fetchDresses = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/dress`);
        setDresses(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch dresses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDresses();
  }, [API]);

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    const unique = [...new Set(dresses.map((d) => d.category))];
    return [{ id: "all", name: "All" }, ...unique.map((c) => ({ id: c, name: c }))];
  }, [dresses]);

  /* ================= FILTER ================= */
  const filteredDresses =
    activeCategory === "all"
      ? dresses
      : dresses.filter((d) => d.category === activeCategory);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-muted-foreground">Loading collection...</p>
      </section>
    );
  }

  return (
    <section id="collection" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Our <span className="text-gradient-gold">Curated Collection</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Discover outfits that make every moment memorable.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={activeCategory === category.id ? "gold" : "outline"}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredDresses.map((dress) => (
            <DressCard
              key={dress._id}
              dress={dress}
              onViewDetails={setSelectedDress}
            />
          ))}
        </div>

        {/* Empty */}
        {filteredDresses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No dresses found in this category.
            </p>
          </div>
        )}

        {/* Explore More Button */}
        <div className="flex justify-center mt-12">
          <Button
            size="lg"
            variant="gold"
            onClick={() => navigate("/dresses")}
          >
            Explore More
          </Button>
        </div>

        {/* Modal */}
        <DressDetailModal
          dress={selectedDress}
          isOpen={!!selectedDress}
          onClose={() => setSelectedDress(null)}
        />
      </div>
    </section>
  );
};

export default CollectionSection;
