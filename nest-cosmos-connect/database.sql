-- Nest Cosmos Connect PostgreSQL schema draft

CREATE TABLE communities (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE roles (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL
);

CREATE TABLE users (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  role_id int REFERENCES roles(id),
  name text NOT NULL,
  email text,
  mobile text,
  password_hash text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE flats (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  block text NOT NULL,
  floor int NOT NULL,
  flat_no text NOT NULL,
  owner_user_id uuid REFERENCES users(id),
  tenant_user_id uuid REFERENCES users(id)
);

CREATE TABLE vehicles (
  id uuid PRIMARY KEY,
  flat_id uuid REFERENCES flats(id),
  type text NOT NULL,
  registration_no text NOT NULL,
  parking_slot text,
  rfid_tag text
);

CREATE TABLE maintenance_bills (
  id uuid PRIMARY KEY,
  flat_id uuid REFERENCES flats(id),
  bill_month date NOT NULL,
  amount numeric(12,2) NOT NULL,
  due_date date NOT NULL,
  late_fee numeric(12,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'pending'
);

CREATE TABLE payments (
  id uuid PRIMARY KEY,
  bill_id uuid REFERENCES maintenance_bills(id),
  amount numeric(12,2) NOT NULL,
  method text NOT NULL,
  gateway_ref text,
  status text NOT NULL,
  paid_at timestamptz,
  receipt_url text
);

CREATE TABLE complaints (
  id uuid PRIMARY KEY,
  flat_id uuid REFERENCES flats(id),
  category text NOT NULL,
  title text NOT NULL,
  description text,
  priority text NOT NULL,
  status text NOT NULL,
  assigned_to uuid REFERENCES users(id),
  eta timestamptz,
  rating int,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE complaint_media (
  id uuid PRIMARY KEY,
  complaint_id uuid REFERENCES complaints(id),
  media_type text NOT NULL,
  url text NOT NULL
);

CREATE TABLE visitors (
  id uuid PRIMARY KEY,
  flat_id uuid REFERENCES flats(id),
  name text NOT NULL,
  mobile text,
  visitor_type text NOT NULL,
  vehicle_no text,
  status text NOT NULL,
  entry_time timestamptz,
  exit_time timestamptz,
  photo_url text
);

CREATE TABLE facilities (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  name text NOT NULL,
  requires_approval boolean DEFAULT true,
  fee numeric(12,2) DEFAULT 0
);

CREATE TABLE facility_bookings (
  id uuid PRIMARY KEY,
  facility_id uuid REFERENCES facilities(id),
  flat_id uuid REFERENCES flats(id),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL
);

CREATE TABLE notices (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  title text NOT NULL,
  body text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  published_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE documents (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  title text NOT NULL,
  category text NOT NULL,
  url text NOT NULL,
  visibility text NOT NULL DEFAULT 'residents'
);

CREATE TABLE polls (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  question text NOT NULL,
  closes_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE poll_votes (
  poll_id uuid REFERENCES polls(id),
  user_id uuid REFERENCES users(id),
  option_text text NOT NULL,
  PRIMARY KEY (poll_id,user_id)
);

CREATE TABLE staff_tasks (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  assigned_to uuid REFERENCES users(id),
  title text NOT NULL,
  status text NOT NULL,
  due_at timestamptz
);

CREATE TABLE expenses (
  id uuid PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  category text NOT NULL,
  amount numeric(12,2) NOT NULL,
  expense_date date NOT NULL,
  vendor text,
  attachment_url text
);

CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  community_id uuid REFERENCES communities(id),
  actor_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  created_at timestamptz DEFAULT now()
);
