import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "SkyGo made our Cape Town trip absolutely magical! The attention to detail and personalized service was exceptional. Highly recommended!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      text: "Amazing experience with SkyGo. The Garden Route tour package was well-organized and the guides were knowledgeable. Will definitely book again!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Anita Patel",
      location: "Ahmedabad",
      rating: 5,
      text: "Our family trip to Kruger was perfectly planned. The accommodations were great and the itinerary was just right for our kids. Thank you SkyGo!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Vikram Singh",
      location: "Jaipur",
      rating: 5,
      text: "Exceptional service and great value for money. The Vietnam tour exceeded our expectations. The team is professional and caring.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Client's Reviews</h2>
          <p className="text-xl text-muted-foreground">Traveller's Testimonial</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground text-sm italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;