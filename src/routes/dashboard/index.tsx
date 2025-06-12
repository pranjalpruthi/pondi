import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useAuth } from '@clerk/tanstack-react-start'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Users, Heart, ShoppingBag, BarChart as BarChartIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { QuoteCard } from '@/components/ui/quote-card'

// --- Mock Data and API ---
const prabhupadaQuotes = [
  {
    quote: "A devotee should have qualities of tolerance, mercy, and friendship to all living entities. He should not have any enemy. He should be peaceful, and he should possess all good qualities.",
    citation: "Srimad Bhagavatam 3.25.21"
  },
  {
    quote: "Religion without philosophy is sentiment, or sometimes fanaticism, while philosophy without religion is mental speculation.",
    citation: "Bhagavad-gita As It Is, Introduction"
  },
  {
    quote: "One who is engaged in devotional service has no problems in this material world. He is always joyful.",
    citation: "Lecture, Los Angeles, July 12, 1969"
  }
];

const api = {
  getIskmDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      booksDistributed: '1,250',
      devoteesEngaged: '350',
      fundsRaised: '₹5,50,000',
      dairySubscribers: '108',
      distributionGrowth: '+15% this month',
      fundingGrowth: '+22% this month',
    }
  },
  getIskmChartData: async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      bookDistributionData: [
        { name: 'Jan', BG: 120, SB: 80, CC: 40 },
        { name: 'Feb', BG: 150, SB: 90, CC: 50 },
        { name: 'Mar', BG: 200, SB: 110, CC: 60 },
        { name: 'Apr', BG: 180, SB: 130, CC: 70 },
      ],
      templeShopData: [
        { name: 'Japa Beads', value: 400 },
        { name: 'Japa Bags', value: 300 },
        { name: 'Books', value: 500 },
        { name: 'Other Items', value: 150 }
      ]
    }
  }
}

// --- Color Palette ---
const COLORS = {
  bg: 'hsl(34, 78%, 91%)', // Saffron
  sb: 'hsl(221, 83%, 53%)', // Blue
  cc: 'hsl(0, 72%, 51%)', // Red
  shop1: 'hsl(262, 80%, 58%)', // Purple
  shop2: 'hsl(35, 92%, 61%)', // Orange
  shop3: 'hsl(120, 57%, 40%)', // Green
  shop4: 'hsl(349, 89%, 60%)', // Pink
};

interface BookEntry {
  id: string; // unique id for React key
  book: string;
  quantity: number;
}

const availableBooks = [
  { value: "bg", label: "Bhagavad-gita As It Is" },
  { value: "sb", label: "Srimad Bhagavatam (Canto)" },
  { value: "cc", label: "Caitanya Caritamrta (Volume)" },
  { value: "noi", label: "Nectar of Instruction" },
  { value: "iso", label: "Sri Isopanisad" },
  { value: "kb", label: "Krsna Book" },
  { value: "other", label: "Other Small Book" },
];

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [randomQuote] = React.useState(() => prabhupadaQuotes[Math.floor(Math.random() * prabhupadaQuotes.length)]);
  const [devoteeName, setDevoteeName] = React.useState('');
  const [bookEntries, setBookEntries] = React.useState<BookEntry[]>([
    { id: crypto.randomUUID(), book: '', quantity: 1 }
  ]);

  const handleAddBookEntry = () => {
    setBookEntries([...bookEntries, { id: crypto.randomUUID(), book: '', quantity: 1 }]);
  };

  const handleRemoveBookEntry = (id: string) => {
    setBookEntries(bookEntries.filter(entry => entry.id !== id));
  };

  const handleBookChange = (id: string, bookValue: string) => {
    setBookEntries(bookEntries.map(entry => entry.id === id ? { ...entry, book: bookValue } : entry));
  };

  const handleQuantityChange = (id: string, quantityValue: string) => {
    const quantity = parseInt(quantityValue, 10);
    setBookEntries(bookEntries.map(entry => entry.id === id ? { ...entry, quantity: isNaN(quantity) || quantity < 1 ? 1 : quantity } : entry));
  };

  const handleSubmitDistribution = () => {
    // Basic validation
    if (!devoteeName.trim()) {
      alert("Please enter devotee name.");
      return;
    }
    const invalidEntry = bookEntries.find(entry => !entry.book || entry.quantity < 1);
    if (invalidEntry) {
      alert("Please ensure all book entries are complete and quantities are valid.");
      return;
    }
    console.log("Submitting:", { devoteeName, entries: bookEntries });
    // Reset form (optional)
    // setDevoteeName('');
    // setBookEntries([{ id: crypto.randomUUID(), book: '', quantity: 1 }]);
    alert("Distribution submitted successfully (mock)!");
  };


  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.navigate({ to: '/' })
    }
  }, [isLoaded, isSignedIn, router])

  const { data: stats } = useQuery({
    queryKey: ['iskm-dashboard-stats'],
    queryFn: api.getIskmDashboardStats,
    enabled: isLoaded && isSignedIn,
  })

  const { data: chartData } = useQuery({
    queryKey: ['iskm-dashboard-charts'],
    queryFn: api.getIskmChartData,
    enabled: isLoaded && isSignedIn,
  })

  if (!isLoaded || !isSignedIn) {
    return <div>Loading Devotional Service...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Seva Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              An overview of ISKCON Pondicherry's devotional activities.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 flex items-center justify-center">
              <BarChartIcon className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Books Distributed</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats?.booksDistributed}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats?.distributionGrowth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Devotees Engaged</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats?.devoteesEngaged}</div>
            <p className="text-xs text-muted-foreground mt-1">in various services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Funds Raised</CardTitle>
            <Heart className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{stats?.fundsRaised}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats?.fundingGrowth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-600">Dairy Subscribers</CardTitle>
            <ShoppingBag className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">{stats?.dairySubscribers}</div>
            <p className="text-xs text-muted-foreground mt-1">for cruelty-free milk</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Main Content: Charts and Form --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Charts */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Book Distribution Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData?.bookDistributionData}>
                  <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false}/>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="BG" stackId="a" fill={COLORS.bg} name="Bhagavad-gita" />
                  <Bar dataKey="SB" stackId="a" fill={COLORS.sb} name="Srimad Bhagavatam" />
                  <Bar dataKey="CC" stackId="a" fill={COLORS.cc} name="Caitanya Caritamrta" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Temple Shop
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData?.templeShopData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                      {chartData?.templeShopData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index + 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <QuoteCard quote={randomQuote.quote} citation={randomQuote.citation} />
          </div>
        </div>

        {/* Right Side: Distribution Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add Book Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="devoteeName" className="text-sm font-medium">Devotee Name</label>
                <Input 
                  id="devoteeName" 
                  placeholder="e.g. Bhakta John" 
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                />
              </div>

              {bookEntries.map((entry, index) => (
                <div key={entry.id} className="space-y-3 p-3 border rounded-md bg-muted/20">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Book Entry #{index + 1}</label>
                    {bookEntries.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveBookEntry(entry.id)}>Remove</Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`book-${entry.id}`} className="text-xs font-medium">Book Title</label>
                    <Select value={entry.book} onValueChange={(value) => handleBookChange(entry.id, value)}>
                      <SelectTrigger id={`book-${entry.id}`}>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBooks.map(book => (
                          <SelectItem key={book.value} value={book.value}>{book.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`quantity-${entry.id}`} className="text-xs font-medium">Quantity</label>
                    <Input 
                      id={`quantity-${entry.id}`} 
                      type="number" 
                      placeholder="1" 
                      value={entry.quantity}
                      onChange={(e) => handleQuantityChange(entry.id, e.target.value)}
                      min="1"
                    />
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={handleAddBookEntry} className="w-full">
                Add Another Book
              </Button>
              <Button onClick={handleSubmitDistribution} className="w-full">Submit All Entries</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
