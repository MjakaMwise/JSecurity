import type { BlogPost } from './blog'
import type { Review } from './reviews'
import type { TeamMember } from './team'
import type { Service } from './services'
import type { User } from './users'
import type { AuditLog } from './audit'

// ── In-memory stores ──────────────────────────────────────────────────────────

let blogPosts: BlogPost[] = [
  {
    id: 1, title: 'Top 5 Corporate Security Tips for 2024', slug: 'top-5-corporate-security-tips',
    content: 'Security is paramount in today\'s corporate environment. Here are our top tips...',
    excerpt: 'Essential security practices every Nairobi business should implement.',
    category: 'Corporate Security', author: 'James Mwangi', read_time: '5 min',
    tags: ['corporate', 'tips', 'security'], published: true,
    published_at: '2024-01-15T08:00:00Z', created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z', created_by_id: 1,
  },
  {
    id: 2, title: 'Understanding Access Control Systems', slug: 'understanding-access-control',
    content: 'Access control is the first line of defence for any secure facility...',
    excerpt: 'A comprehensive guide to modern access control technology.',
    category: 'Technology', author: 'Grace Achieng', read_time: '8 min',
    tags: ['access control', 'technology'], published: true,
    published_at: '2024-02-01T08:00:00Z', created_at: '2024-01-28T08:00:00Z',
    updated_at: '2024-02-01T08:00:00Z', created_by_id: 2,
  },
  {
    id: 3, title: 'CCTV Best Practices for Retail Stores', slug: 'cctv-best-practices-retail',
    content: 'Retail theft costs Kenyan businesses millions each year...',
    excerpt: 'How to deploy CCTV effectively in your retail environment.',
    category: 'CCTV', author: 'Peter Kamau', read_time: '6 min',
    tags: ['cctv', 'retail', 'surveillance'], published: false,
    published_at: null, created_at: '2024-03-05T08:00:00Z',
    updated_at: '2024-03-05T08:00:00Z', created_by_id: 1,
  },
]

let reviews: Review[] = [
  {
    id: 1, name: 'David Kariuki', role: 'CEO, TechHub Nairobi',
    quote: 'JSecurity transformed our office security. Professional, reliable, and highly responsive.',
    rating: 5, service: 'Corporate Security', verified: true,
    date: '2024-01-20', created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 2, name: 'Amina Hassan', role: 'Operations Manager, SafariMall',
    quote: 'Their CCTV installation was seamless. The team was knowledgeable and efficient.',
    rating: 5, service: 'CCTV Installation', verified: true,
    date: '2024-02-10', created_at: '2024-02-10T10:00:00Z',
  },
  {
    id: 3, name: 'Robert Odhiambo', role: 'Property Manager',
    quote: 'Excellent residential security solutions. Our tenants feel much safer now.',
    rating: 4, service: 'Residential Security', verified: false,
    date: '2024-03-01', created_at: '2024-03-01T10:00:00Z',
  },
]

let teamMembers: TeamMember[] = [
  {
    id: 1, name: 'Colonel (Rtd) John Njoroge', position: 'CEO & Founder',
    department: 'Executive', email: 'john@jsecurity.co.ke', phone: '+254 700 000001',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2, name: 'Grace Achieng', position: 'Operations Director',
    department: 'Operations', email: 'grace@jsecurity.co.ke', phone: '+254 700 000002',
    created_at: '2023-01-15T00:00:00Z',
  },
  {
    id: 3, name: 'James Mwangi', position: 'Head of Corporate Security',
    department: 'Corporate', email: 'james@jsecurity.co.ke', phone: '+254 700 000003',
    created_at: '2023-02-01T00:00:00Z',
  },
  {
    id: 4, name: 'Peter Kamau', position: 'CCTV & Technology Lead',
    department: 'Technology', email: 'peter@jsecurity.co.ke', phone: '+254 700 000004',
    created_at: '2023-03-01T00:00:00Z',
  },
]

let services: Service[] = [
  {
    id: 1, name: 'Corporate Security', description: 'Comprehensive security solutions for offices and business premises.',
    category: 'Corporate', features: ['Uniformed guards', 'Access control', 'Visitor management', '24/7 coverage'],
    is_active: true, created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2, name: 'CCTV & Surveillance', description: 'State-of-the-art CCTV installation and monitoring services.',
    category: 'Technology', features: ['HD cameras', 'Remote monitoring', 'Night vision', 'Cloud storage'],
    is_active: true, created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 3, name: 'Residential Security', description: 'Protecting Nairobi homes with professional security personnel.',
    category: 'Residential', features: ['Home patrols', 'Estate security', 'Emergency response'],
    is_active: true, created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 4, name: 'Event Security', description: 'Crowd management and security for events of all sizes.',
    category: 'Events', features: ['Crowd control', 'VIP protection', 'Access control', 'Emergency planning'],
    is_active: false, created_at: '2023-06-01T00:00:00Z',
  },
]

let users: User[] = [
  {
    id: 1, username: 'superadmin', email: 'super@jsecurity.co.ke', role: 'super_admin',
    mfa_enabled: true, is_active: true, created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2, username: 'admin', email: 'admin@jsecurity.co.ke', role: 'admin',
    mfa_enabled: false, is_active: true, created_at: '2023-01-15T00:00:00Z', updated_at: '2023-01-15T00:00:00Z',
  },
  {
    id: 3, username: 'editor', email: 'editor@jsecurity.co.ke', role: 'editor',
    mfa_enabled: false, is_active: true, created_at: '2023-02-01T00:00:00Z', updated_at: '2023-02-01T00:00:00Z',
  },
]

let auditLogs: AuditLog[] = [
  {
    id: 1, user_id: 1, action: 'CREATE', entity_type: 'BlogPost', entity_id: 1,
    new_values: { title: 'Top 5 Corporate Security Tips for 2024' },
    timestamp: '2024-01-10T08:05:00Z', ip_address: '127.0.0.1',
  },
  {
    id: 2, user_id: 2, action: 'UPDATE', entity_type: 'Service', entity_id: 1,
    old_values: { is_active: false }, new_values: { is_active: true },
    timestamp: '2024-01-12T14:30:00Z', ip_address: '127.0.0.1',
  },
  {
    id: 3, user_id: 1, action: 'DELETE', entity_type: 'Review', entity_id: 5,
    old_values: { name: 'Spam Review' },
    timestamp: '2024-01-18T09:15:00Z', ip_address: '127.0.0.1',
  },
]

let nextId = { blog: 4, reviews: 4, team: 5, services: 5, users: 4, audit: 4 }

function now() { return new Date().toISOString() }

function paginate<T>(items: T[], skip: number, limit: number) {
  return { items: items.slice(skip, skip + limit), total: items.length, skip, limit }
}

function addAudit(action: AuditLog['action'], entity_type: string, entity_id: number, old_values?: any, new_values?: any) {
  auditLogs.unshift({
    id: nextId.audit++, user_id: 1, action, entity_type, entity_id,
    old_values, new_values, timestamp: now(), ip_address: '127.0.0.1',
  })
}

// ── Route handler ──────────────────────────────────────────────────────────────

export function mockRequest(method: string, path: string, body?: any): any {
  // strip query string for routing
  const [pathname, qs] = path.split('?')
  const params = new URLSearchParams(qs || '')
  const skip = Number(params.get('skip') || 0)
  const limit = Number(params.get('limit') || 10)

  // ── Blog ──────────────────────────────────────────────────────────────────
  if (pathname === '/blog') {
    if (method === 'GET') {
      const cat = params.get('category')
      const filtered = cat ? blogPosts.filter(p => p.category === cat) : blogPosts
      return paginate(filtered, skip, limit)
    }
    if (method === 'POST') {
      const post: BlogPost = { id: nextId.blog++, ...body, published_at: body.published ? now() : null, created_at: now(), updated_at: now() }
      blogPosts.unshift(post)
      addAudit('CREATE', 'BlogPost', post.id, undefined, body)
      return post
    }
  }
  const blogMatch = pathname.match(/^\/blog\/(\d+)$/)
  if (blogMatch) {
    const id = Number(blogMatch[1])
    const idx = blogPosts.findIndex(p => p.id === id)
    if (method === 'GET') return blogPosts[idx]
    if (method === 'PUT' && idx !== -1) {
      const old = { ...blogPosts[idx] }
      blogPosts[idx] = { ...blogPosts[idx], ...body, updated_at: now() }
      addAudit('UPDATE', 'BlogPost', id, old, body)
      return blogPosts[idx]
    }
    if (method === 'DELETE' && idx !== -1) {
      const old = blogPosts.splice(idx, 1)[0]
      addAudit('DELETE', 'BlogPost', id, old)
      return {}
    }
  }

  // ── Reviews ───────────────────────────────────────────────────────────────
  if (pathname === '/reviews') {
    if (method === 'GET') {
      const svc = params.get('service')
      const filtered = svc ? reviews.filter(r => r.service === svc) : reviews
      return paginate(filtered, skip, limit)
    }
    if (method === 'POST') {
      const review: Review = { id: nextId.reviews++, ...body, date: now().slice(0, 10), created_at: now() }
      reviews.unshift(review)
      addAudit('CREATE', 'Review', review.id, undefined, body)
      return review
    }
  }
  const reviewMatch = pathname.match(/^\/reviews\/(\d+)$/)
  if (reviewMatch) {
    const id = Number(reviewMatch[1])
    const idx = reviews.findIndex(r => r.id === id)
    if (method === 'GET') return reviews[idx]
    if (method === 'PUT' && idx !== -1) {
      const old = { ...reviews[idx] }
      reviews[idx] = { ...reviews[idx], ...body }
      addAudit('UPDATE', 'Review', id, old, body)
      return reviews[idx]
    }
    if (method === 'DELETE' && idx !== -1) {
      const old = reviews.splice(idx, 1)[0]
      addAudit('DELETE', 'Review', id, old)
      return {}
    }
  }

  // ── Team ──────────────────────────────────────────────────────────────────
  if (pathname === '/team') {
    if (method === 'GET') {
      const dept = params.get('department')
      const filtered = dept ? teamMembers.filter(t => t.department === dept) : teamMembers
      return paginate(filtered, skip, limit)
    }
    if (method === 'POST') {
      const member: TeamMember = { id: nextId.team++, ...body, created_at: now() }
      teamMembers.push(member)
      addAudit('CREATE', 'TeamMember', member.id, undefined, body)
      return member
    }
  }
  const teamMatch = pathname.match(/^\/team\/(\d+)$/)
  if (teamMatch) {
    const id = Number(teamMatch[1])
    const idx = teamMembers.findIndex(t => t.id === id)
    if (method === 'GET') return teamMembers[idx]
    if (method === 'PUT' && idx !== -1) {
      const old = { ...teamMembers[idx] }
      teamMembers[idx] = { ...teamMembers[idx], ...body }
      addAudit('UPDATE', 'TeamMember', id, old, body)
      return teamMembers[idx]
    }
    if (method === 'DELETE' && idx !== -1) {
      const old = teamMembers.splice(idx, 1)[0]
      addAudit('DELETE', 'TeamMember', id, old)
      return {}
    }
  }

  // ── Services ──────────────────────────────────────────────────────────────
  if (pathname === '/services') {
    if (method === 'GET') {
      const cat = params.get('category')
      const filtered = cat ? services.filter(s => s.category === cat) : services
      return paginate(filtered, skip, limit)
    }
    if (method === 'POST') {
      const service: Service = { id: nextId.services++, ...body, created_at: now() }
      services.push(service)
      addAudit('CREATE', 'Service', service.id, undefined, body)
      return service
    }
  }
  const serviceMatch = pathname.match(/^\/services\/(\d+)$/)
  if (serviceMatch) {
    const id = Number(serviceMatch[1])
    const idx = services.findIndex(s => s.id === id)
    if (method === 'GET') return services[idx]
    if (method === 'PUT' && idx !== -1) {
      const old = { ...services[idx] }
      services[idx] = { ...services[idx], ...body }
      addAudit('UPDATE', 'Service', id, old, body)
      return services[idx]
    }
    if (method === 'DELETE' && idx !== -1) {
      const old = services.splice(idx, 1)[0]
      addAudit('DELETE', 'Service', id, old)
      return {}
    }
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  if (pathname === '/users') {
    if (method === 'GET') {
      const role = params.get('role')
      const isActive = params.get('is_active')
      let filtered = [...users]
      if (role) filtered = filtered.filter(u => u.role === role)
      if (isActive !== null) filtered = filtered.filter(u => String(u.is_active) === isActive)
      return paginate(filtered, skip, limit)
    }
    if (method === 'POST') {
      const user: User = {
        id: nextId.users++, username: body.username, email: body.email,
        role: body.role, mfa_enabled: false, is_active: true, created_at: now(), updated_at: now(),
      }
      users.push(user)
      addAudit('CREATE', 'User', user.id, undefined, { username: body.username, role: body.role })
      return user
    }
  }
  const userRoleMatch = pathname.match(/^\/users\/(\d+)\/role$/)
  if (userRoleMatch) {
    const id = Number(userRoleMatch[1])
    const idx = users.findIndex(u => u.id === id)
    if (method === 'PUT' && idx !== -1) {
      const old = { role: users[idx].role }
      users[idx] = { ...users[idx], role: body.new_role, updated_at: now() }
      addAudit('UPDATE', 'User', id, old, { role: body.new_role })
      return users[idx]
    }
  }
  const userActivateMatch = pathname.match(/^\/users\/(\d+)\/(activate|deactivate)$/)
  if (userActivateMatch) {
    const id = Number(userActivateMatch[1])
    const action = userActivateMatch[2]
    const idx = users.findIndex(u => u.id === id)
    if (method === 'PUT' && idx !== -1) {
      users[idx] = { ...users[idx], is_active: action === 'activate', updated_at: now() }
      addAudit('UPDATE', 'User', id, undefined, { is_active: action === 'activate' })
      return users[idx]
    }
  }
  const userMatch = pathname.match(/^\/users\/(\d+)$/)
  if (userMatch) {
    const id = Number(userMatch[1])
    const idx = users.findIndex(u => u.id === id)
    if (method === 'GET') return users[idx]
    if (method === 'PUT' && idx !== -1) {
      const old = { ...users[idx] }
      users[idx] = { ...users[idx], ...body, updated_at: now() }
      addAudit('UPDATE', 'User', id, old, body)
      return users[idx]
    }
  }

  // ── Audit ─────────────────────────────────────────────────────────────────
  if (pathname === '/audit' && method === 'GET') {
    return paginate(auditLogs, skip, limit)
  }

  // ── Auth (no-ops in mock mode) ────────────────────────────────────────────
  if (pathname === '/auth/logout') return {}
  if (pathname === '/auth/mfa/setup') return { qr_code: '', secret: '' }
  if (pathname === '/auth/mfa/verify') return { access_token: 'mock-token', refresh_token: 'mock-refresh', token_type: 'bearer' }

  throw new Error(`Mock: unhandled ${method} ${path}`)
}
