import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Calendar } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DressDetailModal = ({ dress, isOpen, onClose }) => {
  if (!dress) return null;

  const isAvailable = dress.status === "Available";

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in renting the "${dress.dressTitle}" from The Missing Fit.`;
    window.open(
      `https://wa.me/917225994009?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl sm:text-2xl">
            {dress.dressTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* IMAGE SLIDER */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="rounded-xl overflow-hidden"
            >
              {dress.images?.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="aspect-[3/4] max-h-[70vh] sm:max-h-none">
                    <img
                      src={img.url}
                      alt={`${dress.dressTitle} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* BADGES */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
              <Badge
                className={
                  isAvailable
                    ? "bg-accent text-primary"
                    : "bg-burgundy text-cream"
                }
              >
                {isAvailable ? "Available" : "Rented"}
              </Badge>

              <Badge
                variant="outline"
                className="bg-card/80 backdrop-blur-sm capitalize"
              >
                {dress.category}
              </Badge>
            </div>
          </div>

          {/* DETAILS */}
          <div className="space-y-5">
            {/* PRICING */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <h4 className="font-display text-lg">Rental Pricing</h4>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Outfit Only</span>
                <span className="font-semibold">
                  ₹{dress.withoutJewelryPrice?.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">With Jewelry</span>
                <span className="font-semibold text-accent">
                  ₹{dress.withJewelryPrice?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* RENTAL STATUS */}
            {!isAvailable && dress.currentRental && (
              <div className="bg-burgundy/10 rounded-xl p-4 flex gap-3">
                <Calendar className="h-5 w-5 text-burgundy mt-1" />
                <div>
                  <p className="font-medium">Currently Rented</p>
                  <p className="text-sm text-muted-foreground">
                    Available after{" "}
                    {new Date(
                      dress.currentRental.endDate
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="whatsapp"
                size="lg"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-5 w-5" />
                Book via WhatsApp
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  (window.location.href = "tel:+917225994009")
                }
              >
                <Phone className="h-5 w-5" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DressDetailModal;
