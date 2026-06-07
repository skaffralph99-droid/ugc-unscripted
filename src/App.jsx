import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { supabase } from './supabase'
import {
  Plus, Search, Users, Phone, MessageCircle, CheckCircle, XCircle,
  Edit3, Trash2, X, Instagram, ExternalLink, ChevronDown, ChevronUp,
  Zap, TrendingUp, Filter, Download, CalendarDays, Clock, UserPlus,
  Handshake, Loader2, RefreshCw
} from 'lucide-react'

const STATUSES = [
  { value: 'new', label: 'New', color: 'status-new' },
  { value: 'contacted', label: 'Contacted', color: 'status-contacted' },
  { value: 'negotiating', label: 'Negotiating', color: 'status-negotiating' },
  { value: 'booked', label: 'Booked', color: 'status-booked' },
  { value: 'declined', label: 'Declined', color: 'status-declined' },
  { value: 'completed', label: 'Completed', color: 'status-completed' },
]

const NICHES = [
  'Fashion', 'Beauty', 'Fitness', 'Food', 'Travel', 'Tech', 'Lifestyle',
  'Gaming', 'Education', 'Comedy', 'Music', 'Health', 'Finance', 'Automotive', 'Other'
]

const emptyCreator = {
  name: '',
  phone: '',
  instagram: '',
  tiktok: '',
  niche: '',
  followers: '',
  status: 'new',
  notes: '',
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <div
      className="bg-surface-900 border border-surface-800 rounded-xl p-5 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
      <p className="text-sm text-surface-400 mt-1">{label}</p>
    </div>
  )
}

// ─── Status Select (native, always works) ───────────────
function StatusSelect({ value, onChange }) {
  const current = STATUSES.find(s => s.value === value) || STATUSES[0]

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer border-0 outline-none appearance-none ${current.color}`}
      style={{ backgroundImage: 'none', paddingRight: '10px' }}
    >
      {STATUSES.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}

// ─── Creator Modal ────────────────────────────────────────
function CreatorModal({ creator, onSave, onClose, isEdit, saving }) {
  const [form, setForm] = useState(creator)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div
        className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800">
          <h2 className="text-lg font-semibold">
            {isEdit ? 'Edit Creator' : 'Add Creator'}
          </h2>
          <button onClick={onClose} className="text-surface-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Creator name"
              className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+961 ..."
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Niche</label>
              <select
                value={form.niche}
                onChange={e => handleChange('niche', e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3.5 py-2.5 text-sm text-white transition-all appearance-none cursor-pointer"
              >
                <option value="">Select niche</option>
                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Instagram</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 text-sm">@</span>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={e => handleChange('instagram', e.target.value)}
                  placeholder="handle"
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-7 pr-3.5 py-2.5 text-sm text-white placeholder-surface-600 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">TikTok</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 text-sm">@</span>
                <input
                  type="text"
                  value={form.tiktok}
                  onChange={e => handleChange('tiktok', e.target.value)}
                  placeholder="handle"
                  className="w-full bg-surface-950 border border-surface-700 rounded-lg pl-7 pr-3.5 py-2.5 text-sm text-white placeholder-surface-600 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Followers</label>
              <input
                type="text"
                value={form.followers}
                onChange={e => handleChange('followers', e.target.value)}
                placeholder="e.g. 12.5K"
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3.5 py-2.5 text-sm text-white transition-all appearance-none cursor-pointer"
              >
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="Rates, availability, content style..."
              rows={3}
              className="w-full bg-surface-950 border border-surface-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-surface-600 transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-800">
          <button onClick={onClose} className="px-4 py-2 text-sm text-surface-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || saving}
            className="px-5 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Save Changes' : 'Add Creator'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" onClick={onCancel}>
      <div className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-2">Delete Creator</h3>
        <p className="text-sm text-surface-400 mb-5">
          Remove <span className="text-white font-medium">{name}</span> from your tracker? This can't be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-surface-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Export CSV ────────────────────────────────────────────
function exportCSV(creators) {
  const headers = ['Name', 'Phone', 'Instagram', 'TikTok', 'Niche', 'Followers', 'Status', 'Notes', 'Added']
  const rows = creators.map(c => [
    c.name, c.phone, c.instagram, c.tiktok, c.niche, c.followers,
    c.status, (c.notes || '').replace(/,/g, ';'), new Date(c.created_at).toLocaleDateString()
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ugc-creators-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCreator, setEditCreator] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')

  // ─── Fetch creators from Supabase ──────────────────────
  const fetchCreators = useCallback(async () => {
    const { data, error } = await supabase
      .from('ugc_creators')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCreators(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCreators()

    // Real-time subscription so all devices stay in sync
    const channel = supabase
      .channel('ugc_creators_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ugc_creators' }, () => {
        fetchCreators()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchCreators])

  // ─── Stats ─────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = creators.length
    const contacted = creators.filter(c => c.status === 'contacted').length
    const negotiating = creators.filter(c => c.status === 'negotiating').length
    const booked = creators.filter(c => c.status === 'booked').length
    const completed = creators.filter(c => c.status === 'completed').length
    const declined = creators.filter(c => c.status === 'declined').length
    const newCount = creators.filter(c => c.status === 'new').length
    const conversionRate = total > 0 ? Math.round(((booked + completed) / total) * 100) : 0

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString()

    const contactedToday = creators.filter(c =>
      c.status !== 'new' && (c.status_updated_at || c.created_at) >= todayStart
    ).length

    const addedToday = creators.filter(c => c.created_at >= todayStart).length
    const addedThisWeek = creators.filter(c => c.created_at >= weekStart).length

    const bookedThisWeek = creators.filter(c =>
      (c.status === 'booked' || c.status === 'completed') && (c.status_updated_at || c.created_at) >= weekStart
    ).length

    const responseRate = (contacted + negotiating + booked + completed + declined) > 0 && total > 0
      ? Math.round(((negotiating + booked + completed) / (contacted + negotiating + booked + completed + declined)) * 100)
      : 0

    return {
      total, contacted, negotiating, booked, completed, declined, newCount,
      conversionRate, contactedToday, addedToday, addedThisWeek, bookedThisWeek, responseRate
    }
  }, [creators])

  // ─── Filtered & sorted ─────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...creators]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.instagram || '').toLowerCase().includes(q) ||
        (c.tiktok || '').toLowerCase().includes(q) ||
        (c.niche || '').toLowerCase().includes(q) ||
        (c.notes || '').toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      list = list.filter(c => c.status === statusFilter)
    }

    list.sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [creators, search, statusFilter, sortField, sortDir])

  // ─── CRUD operations ──────────────────────────────────
  const handleSave = async (formData) => {
    setSaving(true)
    if (editCreator) {
      // Update
      const { error } = await supabase
        .from('ugc_creators')
        .update({
          name: formData.name,
          phone: formData.phone,
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          niche: formData.niche,
          followers: formData.followers,
          status: formData.status,
          notes: formData.notes,
          status_updated_at: formData.status !== editCreator.status ? new Date().toISOString() : editCreator.status_updated_at,
        })
        .eq('id', editCreator.id)

      if (!error) {
        await fetchCreators()
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('ugc_creators')
        .insert({
          name: formData.name,
          phone: formData.phone,
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          niche: formData.niche,
          followers: formData.followers,
          status: formData.status,
          notes: formData.notes,
          status_updated_at: new Date().toISOString(),
        })

      if (!error) {
        await fetchCreators()
      }
    }
    setSaving(false)
    setModalOpen(false)
    setEditCreator(null)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase
      .from('ugc_creators')
      .delete()
      .eq('id', deleteTarget.id)

    if (!error) {
      await fetchCreators()
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  const handleStatusChange = async (id, newStatus) => {
    await supabase
      .from('ugc_creators')
      .update({ status: newStatus, status_updated_at: new Date().toISOString() })
      .eq('id', id)

    // Optimistic update
    setCreators(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, status_updated_at: new Date().toISOString() } : c))
  }

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-surface-600" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-accent" /> : <ChevronDown size={12} className="text-accent" />
  }

  // ─── Loading state ─────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-surface-400">
          <Loader2 size={24} className="animate-spin text-accent" />
          <span className="text-sm">Loading creators...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* ─── Header ─────────────────────────────────── */}
      <header className="border-b border-surface-800 bg-surface-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">UGC Unscripted</h1>
              <p className="text-xs text-surface-500">Creator Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchCreators}
              className="p-2.5 text-surface-500 hover:text-accent hover:bg-surface-800 rounded-lg transition-all"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => { setEditCreator(null); setModalOpen(true) }}
              className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Creator</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ─── Stats Row 1 — Overview ─────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total Creators" value={stats.total} color="bg-surface-800 text-surface-300" delay={0} />
          <StatCard icon={MessageCircle} label="Contacted" value={stats.contacted + stats.negotiating} color="bg-blue-950 text-blue-400" delay={50} />
          <StatCard icon={CheckCircle} label="Booked" value={stats.booked} color="bg-green-950 text-green-400" delay={100} />
          <StatCard icon={TrendingUp} label="Conversion" value={`${stats.conversionRate}%`} color="bg-orange-950 text-orange-400" delay={150} />
        </div>

        {/* ─── Stats Row 2 — Today / This Week ────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Clock} label="Contacted Today" value={stats.contactedToday} color="bg-cyan-950 text-cyan-400" delay={200} />
          <StatCard icon={UserPlus} label="Added Today" value={stats.addedToday} color="bg-violet-950 text-violet-400" delay={250} />
          <StatCard icon={CalendarDays} label="Added This Week" value={stats.addedThisWeek} color="bg-indigo-950 text-indigo-400" delay={300} />
          <StatCard icon={Handshake} label="Response Rate" value={`${stats.responseRate}%`} color="bg-emerald-950 text-emerald-400" delay={350} />
        </div>

        {/* ─── Pipeline mini-bar ──────────────────── */}
        {stats.total > 0 && (
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Pipeline</p>
              <button
                onClick={() => exportCSV(creators)}
                className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-accent transition-colors"
              >
                <Download size={12} />
                Export CSV
              </button>
            </div>
            <div className="flex rounded-full overflow-hidden h-2.5 bg-surface-800">
              {stats.contacted > 0 && <div className="bg-blue-500 transition-all" style={{ width: `${(stats.contacted / stats.total) * 100}%` }} />}
              {stats.negotiating > 0 && <div className="bg-orange-500 transition-all" style={{ width: `${(stats.negotiating / stats.total) * 100}%` }} />}
              {stats.booked > 0 && <div className="bg-green-500 transition-all" style={{ width: `${(stats.booked / stats.total) * 100}%` }} />}
              {stats.completed > 0 && <div className="bg-fuchsia-500 transition-all" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />}
              {stats.declined > 0 && <div className="bg-stone-600 transition-all" style={{ width: `${(stats.declined / stats.total) * 100}%` }} />}
            </div>
            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              {[
                { label: 'New', count: stats.newCount, dot: 'bg-surface-500' },
                { label: 'Contacted', count: stats.contacted, dot: 'bg-blue-500' },
                { label: 'Negotiating', count: stats.negotiating, dot: 'bg-orange-500' },
                { label: 'Booked', count: stats.booked, dot: 'bg-green-500' },
                { label: 'Completed', count: stats.completed, dot: 'bg-fuchsia-500' },
                { label: 'Declined', count: stats.declined, dot: 'bg-stone-600' },
              ].filter(s => s.count > 0).map(s => (
                <div key={s.label} className="flex items-center gap-1.5 text-xs text-surface-400">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  {s.label} ({s.count})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Search + Filter ────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, handle, niche..."
              className="w-full bg-surface-900 border border-surface-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-surface-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-surface-900 border border-surface-800 rounded-lg pl-8 pr-8 py-2.5 text-sm text-white appearance-none cursor-pointer transition-all"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* ─── Table ──────────────────────────────── */}
        <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-800 text-surface-400">
                  <th className="text-left px-4 py-3 font-medium cursor-pointer select-none hover:text-surface-200 transition-colors" onClick={() => toggleSort('name')}>
                    <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Socials</th>
                  <th className="text-left px-4 py-3 font-medium cursor-pointer select-none hover:text-surface-200 transition-colors" onClick={() => toggleSort('niche')}>
                    <span className="flex items-center gap-1">Niche <SortIcon field="niche" /></span>
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Followers</th>
                  <th className="text-left px-4 py-3 font-medium cursor-pointer select-none hover:text-surface-200 transition-colors" onClick={() => toggleSort('status')}>
                    <span className="flex items-center gap-1">Status <SortIcon field="status" /></span>
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden xl:table-cell">Notes</th>
                  <th className="text-right px-4 py-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-surface-500">
                      {creators.length === 0 ? (
                        <div className="space-y-3">
                          <Users size={40} className="mx-auto text-surface-700" />
                          <p className="font-medium text-surface-400">No creators yet</p>
                          <p className="text-xs">Click "Add Creator" to start tracking</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-medium text-surface-400">No results found</p>
                          <p className="text-xs">Try a different search or filter</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((creator, i) => (
                    <tr
                      key={creator.id}
                      className="table-row border-b border-surface-800/50 last:border-0 animate-fade-in"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">{creator.name}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {creator.phone ? (
                          <a href={`tel:${creator.phone}`} className="text-surface-400 hover:text-accent transition-colors font-mono text-xs">
                            {creator.phone}
                          </a>
                        ) : (
                          <span className="text-surface-700">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          {creator.instagram && (
                            <a
                              href={`https://instagram.com/${creator.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-surface-400 hover:text-pink-400 transition-colors"
                            >
                              <Instagram size={13} />
                              <span className="max-w-[80px] truncate">@{creator.instagram}</span>
                            </a>
                          )}
                          {creator.tiktok && (
                            <a
                              href={`https://tiktok.com/@${creator.tiktok}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-surface-400 hover:text-cyan-400 transition-colors"
                            >
                              <ExternalLink size={13} />
                              <span className="max-w-[80px] truncate">@{creator.tiktok}</span>
                            </a>
                          )}
                          {!creator.instagram && !creator.tiktok && <span className="text-surface-700">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {creator.niche ? (
                          <span className="text-xs text-surface-300 bg-surface-800 px-2 py-0.5 rounded-md">{creator.niche}</span>
                        ) : (
                          <span className="text-surface-700">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-surface-300 font-mono text-xs">{creator.followers || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect
                          value={creator.status}
                          onChange={(newStatus) => handleStatusChange(creator.id, newStatus)}
                        />
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-xs text-surface-500 max-w-[200px] truncate block">{creator.notes || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {creator.phone && (
                            <a
                              href={(() => {
                                const firstName = creator.name.trim().split(/\s+/)[0]
                                const msg = `Hey ${firstName}! We're building a network of Arabic-speaking creators who get paid $50-150 per video to review products for brands. No followers needed, just a phone and good camera presence.\nYou'd be perfect for this. Interested?\nI'll send you the signup form.`
                                const phone = creator.phone.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '')
                                return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
                              })()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-surface-500 hover:text-green-400 hover:bg-surface-800 rounded-md transition-all"
                              title="Send WhatsApp"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </a>
                          )}
                          <button
                            onClick={() => { setEditCreator(creator); setModalOpen(true) }}
                            className="p-1.5 text-surface-500 hover:text-accent hover:bg-surface-800 rounded-md transition-all"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(creator)}
                            className="p-1.5 text-surface-500 hover:text-red-400 hover:bg-surface-800 rounded-md transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-surface-800 flex items-center justify-between text-xs text-surface-500">
              <span>{filtered.length} creator{filtered.length !== 1 ? 's' : ''}</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Synced across all devices
              </span>
            </div>
          )}
        </div>
      </main>

      {/* ─── Modals ───────────────────────────────── */}
      {modalOpen && (
        <CreatorModal
          creator={editCreator || emptyCreator}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditCreator(null) }}
          isEdit={!!editCreator}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}
