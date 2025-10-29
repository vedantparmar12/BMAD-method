# BMAD Development Cycle - Detailed Examples

## Example 1: Complete Authentication Epic

### Context
E-commerce SaaS application needs user authentication. Planning docs specify JWT-based auth with email/password.

### Story 1: User Registration

#### SM Phase - Story Creation

**Activate:** `bmad_activate_agent({ agentName: "sm" })`

**SM Output:** `docs/stories/story-001-user-registration.md`

```markdown
# Story 001: User Registration

## User Story
As a new user, I want to register for an account so that I can access the platform.

## Acceptance Criteria
- [ ] User can register with email and password
- [ ] Email must be unique and validated
- [ ] Password must meet strength requirements (8+ chars, 1 uppercase, 1 number)
- [ ] User receives confirmation email after registration
- [ ] Successful registration redirects to dashboard

## Implementation Tasks

### Task 1: Create User Model
- Define User schema with fields: id, email, password_hash, created_at
- Add email validation
- Set up database migration

### Task 2: Implement Password Hashing
- Use bcrypt for password hashing
- Create hashPassword utility function
- Create comparePassword utility function

### Task 3: Create Registration API Endpoint
- POST /api/auth/register
- Validate input (email format, password strength)
- Check for existing email
- Hash password and create user
- Return JWT token

### Task 4: Build Registration Form Component
- Create RegistrationForm.tsx
- Email and password input fields
- Client-side validation
- Submit handler with error handling
- Success redirect to dashboard

### Task 5: Write Unit Tests
- Test User model validation
- Test password hashing functions
- Test email uniqueness check

### Task 6: Write Integration Tests
- Test full registration flow
- Test duplicate email rejection
- Test weak password rejection
- Test successful registration and token generation

## Dependencies
- Database setup complete
- JWT auth library installed
- Email validation library available

## Estimated Effort
6 hours
```

#### Dev Phase - Implementation

**Activate:** `bmad_activate_agent({ agentName: "dev", initialCommand: "*implement-story story-001" })`

**Developer Process:**

**Task 1 - User Model:**
```typescript
// File: src/models/User.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Invalid email format'
    }
  },
  passwordHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = model('User', userSchema);
```

**Status:** Task 1 ✓ Complete

**Task 2 - Password Hashing:**
```typescript
// File: src/utils/password.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number');
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

**Status:** Task 2 ✓ Complete

**Task 3 - Registration API:**
```typescript
// File: src/routes/auth.ts
import { Router } from 'express';
import { User } from '../models/User';
import { hashPassword } from '../utils/password';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = new User({ email, passwordHash });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

export default router;
```

**Status:** Task 3 ✓ Complete

**Task 4 - Registration Form:**
```typescript
// File: src/components/RegistrationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain an uppercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain a number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      const { token } = await response.json();
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      {error && <div className="error">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Register</button>
    </form>
  );
}
```

**Status:** Task 4 ✓ Complete

**Task 5 - Unit Tests:**
```typescript
// File: src/models/__tests__/User.test.ts
import { User } from '../User';

describe('User Model', () => {
  it('should validate email format', () => {
    const user = new User({
      email: 'invalid-email',
      passwordHash: 'hash'
    });

    const error = user.validateSync();
    expect(error?.errors.email).toBeDefined();
  });

  it('should require email', () => {
    const user = new User({ passwordHash: 'hash' });
    const error = user.validateSync();
    expect(error?.errors.email).toBeDefined();
  });
});

// File: src/utils/__tests__/password.test.ts
import { hashPassword, comparePassword } from '../password';

describe('Password Utils', () => {
  it('should hash password', async () => {
    const hash = await hashPassword('Password123');
    expect(hash).toBeDefined();
    expect(hash).not.toBe('Password123');
  });

  it('should reject weak passwords', async () => {
    await expect(hashPassword('weak')).rejects.toThrow();
    await expect(hashPassword('nouppercase1')).rejects.toThrow();
    await expect(hashPassword('NONUMBER')).rejects.toThrow();
  });

  it('should compare passwords correctly', async () => {
    const password = 'Password123';
    const hash = await hashPassword(password);

    expect(await comparePassword(password, hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });
});
```

**Status:** Task 5 ✓ Complete

**Task 6 - Integration Tests:**
```typescript
// File: src/routes/__tests__/auth.integration.test.ts
import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/User';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.userId).toBeDefined();

    const user = await User.findById(response.body.userId);
    expect(user?.email).toBe('test@example.com');
  });

  it('should reject duplicate email', async () => {
    await User.create({
      email: 'test@example.com',
      passwordHash: 'hash'
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('already registered');
  });

  it('should reject weak password', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'weak'
      });

    expect(response.status).toBe(400);
  });
});
```

**Status:** Task 6 ✓ Complete

**All tasks complete!** Dev marks story as ready for QA.

#### QA Phase - Validation

**Activate:** `bmad_activate_agent({ agentName: "qa" })`

**QA Checklist Execution:**

✅ **Acceptance Criteria Review:**
- User can register with email and password ✓
- Email validated and unique ✓
- Password meets strength requirements ✓
- Successful registration returns token ✓
- (Email confirmation - not yet implemented, noted for follow-up)

✅ **Test Execution:**
```
npm test
> All tests passing (12/12) ✓
```

✅ **Code Quality:**
- Clean, readable code ✓
- Proper error handling ✓
- Security best practices (password hashing) ✓
- Input validation ✓

✅ **Manual Testing:**
- Tested registration with valid data ✓
- Tested duplicate email rejection ✓
- Tested weak password rejection ✓
- Tested invalid email format ✓
- Confirmed token generation ✓

**QA Result: PASS**

**Notes:**
- Email confirmation (acceptance criterion 4) not implemented - consider follow-up story
- Consider rate limiting for registration endpoint
- Overall quality excellent

**Story 001: COMPLETE ✓**

---

## Example 2: E-commerce Product Catalog

### Story: Display Product List

#### SM Creates Story

```markdown
# Story 005: Display Product List

## User Story
As a customer, I want to browse available products so that I can find items to purchase.

## Acceptance Criteria
- [ ] Products displayed in grid layout
- [ ] Each product shows image, name, price, rating
- [ ] Products load on page mount
- [ ] Loading state shown while fetching
- [ ] Error handling for failed requests
- [ ] Products are sorted by popularity

## Implementation Tasks

### Task 1: Create Product API Client
- Create getProducts() function
- Handle API errors
- Return typed Product array

### Task 2: Create Product Card Component
- Display product image, name, price, rating
- Responsive design
- Click handler for product detail navigation

### Task 3: Create Product Grid Component
- Fetch products on mount
- Display loading state
- Display error state
- Render ProductCard components in grid
- Implement responsive grid layout

### Task 4: Write Component Tests
- Test ProductCard rendering
- Test ProductGrid loading states
- Test ProductGrid error handling
- Test click navigation

## Dependencies
- Product API endpoint available
- Product type defined
```

#### Dev Implements

**Task 1 - API Client:**
```typescript
// src/api/products.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch('/api/products?sort=popularity');

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}
```

**Task 2 - Product Card:**
```tsx
// src/components/ProductCard.tsx
import { Product } from '../api/products';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <div className="rating">
        {'★'.repeat(Math.floor(product.rating))}
        {'☆'.repeat(5 - Math.floor(product.rating))}
        <span>({product.rating})</span>
      </div>
    </div>
  );
}
```

**Task 3 - Product Grid:**
```tsx
// src/components/ProductGrid.tsx
import { useState, useEffect } from 'react';
import { getProducts, Product } from '../api/products';
import { ProductCard } from './ProductCard';

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={loadProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Task 4 - Tests:**
```tsx
// src/components/__tests__/ProductCard.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  imageUrl: '/test.jpg',
  rating: 4.5
};

it('renders product details', () => {
  const { getByText } = render(<ProductCard product={mockProduct} />);
  expect(getByText('Test Product')).toBeInTheDocument();
  expect(getByText('$29.99')).toBeInTheDocument();
});

it('navigates on click', () => {
  const navigate = jest.fn();
  // ... test navigation
});
```

#### QA Validates

- All acceptance criteria met ✓
- Tests passing ✓
- Manual testing successful ✓
- Responsive design works ✓

**Story 005: COMPLETE ✓**

---

## Pattern: Handling QA Failures

### Story: User Login - Failed QA

#### QA Finds Issues:

1. **Critical:** Login endpoint doesn't validate empty email/password
2. **High:** No rate limiting on login attempts
3. **Medium:** Error messages expose whether email exists
4. **Low:** Missing loading spinner on submit

**QA Result: FAIL**

#### Fix Cycle:

**Reactivate Dev with issues:**
```
"QA found 4 issues with the login implementation. Please fix:
1. [Critical] Add validation for empty email/password
2. [High] Implement rate limiting (5 attempts per 15 min)
3. [Medium] Use generic error message 'Invalid credentials'
4. [Low] Add loading spinner during authentication"
```

**Dev Fixes:**
```typescript
// Fix 1: Validation
if (!email || !password) {
  return res.status(400).json({ error: 'Email and password required' });
}

// Fix 2: Rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});
router.post('/login', rateLimiter, ...);

// Fix 3: Generic error
// Changed from specific errors to:
return res.status(401).json({ error: 'Invalid credentials' });

// Fix 4: Loading spinner
const [loading, setLoading] = useState(false);
// ... show spinner when loading
```

**QA Re-validates:**
- All issues fixed ✓
- Tests updated and passing ✓
- Manual testing confirms fixes ✓

**QA Result: PASS**

**Story: COMPLETE ✓**

---

These examples demonstrate the complete BMAD development cycle with realistic code, proper testing, and quality validation.
