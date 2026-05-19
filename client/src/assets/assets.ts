import { TruckIcon, LeafIcon, ClockIcon, ShieldCheckIcon, MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";
import { SiFacebook, SiX, SiInstagram } from "@icons-pack/react-simple-icons";

export const assets = {
    hero_bg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600",
    delivery_truck: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
};

/** Browse categories — centered home section + navbar dropdown */
export const categoriesData = [
    { slug: "bungalows", name: "Bungalows", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800" },
    { slug: "maisonettes", name: "Maisonettes", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" },
    { slug: "villas", name: "Villas", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" },
    { slug: "modern-homes", name: "Modern Homes", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" },
    { slug: "luxury-homes", name: "Luxury Homes", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" },
    { slug: "apartments", name: "Apartments", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800" },
];

export const heroSectionData = {
    description: "Discover premium architectural designs and house plans tailored for the Kenyan market. Download blueprints instantly and start building your dream home.",
    hero_image: assets.hero_bg,
    hero_features: [
        { icon: TruckIcon, title: "Instant Delivery", desc: "Download instantly" },
        { icon: LeafIcon, title: "Premium Quality", desc: "Detailed blueprints" },
        { icon: ClockIcon, title: "24/7 Support", desc: "Always here for you" },
        { icon: ShieldCheckIcon, title: "Secure Pay", desc: "Safe checkout" },
    ],
};

export const appPromoBannerData = {
    title: "Start building your dream today",
    description: "Browse our collection of expertly designed house plans, complete with all the documents you need for construction.",
};

export const footerData = {
    brand: {
        name: "KEPlans",
        description: "Premium architectural house plans and designs tailored for the Kenyan landscape. Your dream home starts here.",
        socials: [
            { icon: SiFacebook, link: "#" },
            { icon: SiX, link: "#" },
            { icon: SiInstagram, link: "#" },
        ],
    },

    sections: [
        {
            title: "Quick Links",
            links: [
                { label: "All Designs", to: "/products" },
                { label: "Track Order", to: "/orders" },
            ],
        },
        {
            title: "Customer Service",
            links: [
                { label: "My Account", to: "#" },
                { label: "Order History", to: "#" },
                { label: "Help Center", href: "#" },
            ],
        },
    ],

    contact: [
        { icon: MapPinIcon, text: "Nairobi, Kenya" },
        { icon: PhoneIcon, text: "+254 700 000000" },
        { icon: MailIcon, text: "hello@keplans.com" },
    ],

    bottom: {
        copyright: "© 2026 KEPlans. All rights reserved.",
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
        ],
    },
};

export const statusColors: Record<string, string> = {
    "Pending Confirmation": "bg-amber-100 text-amber-800",
    Approved: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
};
