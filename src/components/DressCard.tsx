import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle } from "lucide-react";

const DressCard = ({ dress, onViewDetails }) => {
  const isAvailable = dress.status === "Available";

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in renting the "${dress.dressTitle}" from The Missing Fit.`;
    window.open(
      `https://wa.me/917225994009?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="group card-elegant overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={dress.images?.[0]?.url || "/placeholder-dress.jpg"}
          alt={dress.dressTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Availability */}
        <div className="absolute top-3 left-3">
          <Badge
            className={
              isAvailable
                ? "bg-accent text-primary"
                : "bg-burgundy text-cream"
            }
          >
            {isAvailable ? "Available" : "Rented"}
          </Badge>
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className="bg-card/80 backdrop-blur-sm capitalize"
          >
            {dress.category}
          </Badge>
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <div className="w-full flex gap-2">
            <Button
              variant="hero"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(dress)}
            >
              View
            </Button>
            <Button
              variant="whatsapp"
              size="sm"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-foreground mb-2 line-clamp-1">
          {dress.dressTitle}
        </h3>

        {/* Pricing */}
        <div className="space-y-1 text-sm mb-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Without Jewelry</span>
            <span className="font-medium">
              ₹{dress.withoutJewelryPrice?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">With Jewelry</span>
            <span className="font-semibold text-accent">
              ₹{dress.withJewelryPrice?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Rental info */}
        {!isAvailable && dress.currentRental && (
          <div className="mt-2 p-2 bg-secondary/60 rounded-lg flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Available after{" "}
              <span className="font-medium text-foreground">
                {new Date(dress.currentRental.endDate).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "short" }
                )}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DressCard;
