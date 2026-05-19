export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    isAdmin?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    slug: string;
    name: string;
    image: string;
}

export interface Design {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
    images: string[];
    videos: string[];
    documents: string[];
    featured: boolean;
    createdAt: string;
}

export interface CartItem {
    design: Design;
    quantity: number;
}

export interface OrderItem {
    product: string;
    title: string;
    price: number;
    quantity: number;
    documents?: string[];
}

export interface Order {
    id: string;
    user: string | { id: string; name: string; email: string; phone?: string };
    items: OrderItem[];
    customerEmail?: string;
    paymentMethod: string;
    subtotal: number;
    total: number;
    status: string;
    statusHistory: { status: string; timestamp: string; note: string }[];
    isPaid: boolean;
    createdAt: string;
}
