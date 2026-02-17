-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Public user data, linked to Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Posts Table (Travel Diary/Blog)
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    location TEXT, -- e.g., "Paris, France"
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Comments Table (User interactions)
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Menu Items Table (For the Menu Page)
CREATE TABLE public.menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    time_estimate TEXT, -- e.g., "15 mins"
    category TEXT NOT NULL, -- 'Starters', 'Global Pizza', etc.
    image_url TEXT,
    is_veg BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Reservations Table (For the Reservation Page)
CREATE TABLE public.reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    passenger_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    pax_count INTEGER NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    trip_type TEXT, -- 'Casual', 'Birthday', 'Date Night'
    special_requests TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Events Table (For Events Page)
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price_range TEXT, -- e.g., "Starting from ₹12,000"
    image_url TEXT,
    features JSONB, -- Array of features like ["Decor", "Buffet"]
    event_type TEXT, -- 'Economy Plus', 'Business Class', 'Private Jet'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies (Examples)
-- Public read access for Menu, Events, Posts
CREATE POLICY "Public menu access" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public events access" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public posts access" ON public.posts FOR SELECT USING (true);

-- Insert access for Reservations (Anyone can reserve)
CREATE POLICY "Public reservations" ON public.reservations FOR INSERT WITH CHECK (true);

-- Profiles readable by everyone, editable by owner
CREATE POLICY "Public profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
