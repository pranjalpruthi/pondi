import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useAuth } from '@clerk/tanstack-react-start'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Users, ShoppingBag, BarChart as BarChartIcon } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import React from 'react'
import { format } from 'date-fns'

import { getDevotees, getBooks, getProducts, getDistributionLog, submitDistributionLog, updateBookInventory } from '@/integrations/nocodb-api';

// --- Mock Data for Quotes ---
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

// API methods are now handled by the integration file



// Interface for book entry in the form
interface BookEntry {
  id: string; // unique id for React key
  book: string;
  quantity: number;
}

// Interface for devotee data from NocoDB
interface Devotee {
  Name: string;
  Id?: string;
}

 // Interface for product data from NocoDB
interface Product {
  Id: string;
  Book?: string;
  Name?: string;
  Language?: string;
  'Stock Quantity'?: number;
}

// Interface for distribution log entry from NocoDB
interface DistributionLogEntry {
  Id: string;
  devotee: string;
  product: string;
  quantity: number;
  distribution_date?: string;
}

const getAvailableBooks = (products: Product[]) => {
  return products.map(product => {
    const bookName = product.Book || product.Name || 'Unknown Book';
    const language = product.Language || 'N/A';
    return {
      value: `${bookName} (${language})`,
      label: `${bookName} (${language})`
    };
  });
};

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [randomQuote] = React.useState(() => prabhupadaQuotes[Math.floor(Math.random() * prabhupadaQuotes.length)]);
  const [devoteeName, setDevoteeName] = React.useState('');
  const [distributionDate, setDistributionDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
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
    if (!devoteeName) {
      alert("Please select a devotee name.");
      return;
    }
    if (!distributionDate) {
      alert("Please select a distribution date.");
      return;
    }
    const invalidEntry = bookEntries.find(entry => !entry.book || entry.quantity < 1);
    if (invalidEntry) {
      alert("Please ensure all book entries are complete and quantities are valid.");
      return;
    }

    // Submit data
    distributionMutation.mutate({ devoteeName, bookEntries });
  };

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.navigate({ to: '/' })
    }
  }, [isLoaded, isSignedIn, router])

  // Fetch data from NocoDB
  const { data: devotees, isLoading: devoteesLoading, error: devoteesError } = useQuery({
    queryKey: ['devotees'],
    queryFn: getDevotees,
    enabled: isLoaded && isSignedIn,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
    enabled: isLoaded && isSignedIn,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    enabled: isLoaded && isSignedIn,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: distributionLog, isLoading: distributionLoading, error: distributionError } = useQuery({
    queryKey: ['distributionLog'],
    queryFn: getDistributionLog,
    enabled: isLoaded && isSignedIn,
    staleTime: 1000 * 60 * 1, // Cache for 1 minute
  });

  const distributionMutation = useMutation({
    mutationFn: async (data: { devoteeName: string, bookEntries: Array<{ book: string, quantity: number }> }) => {
      const submitResult = await submitDistributionLog(data);
      if (!submitResult) throw new Error("Failed to submit distribution records");
      for (const entry of data.bookEntries) {
        await updateBookInventory(entry.book, entry.quantity);
      }
      return { success: true };
    },
    onSuccess: () => {
      alert("Distribution submitted and inventory updated successfully!");
      setDevoteeName('');
      setDistributionDate(format(new Date(), 'yyyy-MM-dd'));
      setBookEntries([{ id: crypto.randomUUID(), book: '', quantity: 1 }]);
    },
    onError: (error) => {
      alert("Failed to submit distribution. Please try again.");
      console.error(error);
    }
  });

  // Calculate dashboard statistics from distribution log, books, products, and devotees
  const calculateStats = () => {
    if (!distributionLog || !books || !products || !devotees) return {
      totalBooks: '0',
      totalDistributed: '0',
      totalDevotees: '0',
      totalProducts: '0',
    };

    // Total number of books from books table
    const totalBooksCount = books.length;
    // Total books distributed from distribution log
    const totalBooksDistributed = distributionLog.reduce((sum: number, entry: DistributionLogEntry) => sum + entry.quantity, 0);
    // Total number of devotees from the devotees table
    const totalDevoteesCount = devotees.length;
    // Total unique products from products table
    const totalProductsCount = new Set(products.map((product: Product) => product.Book || product.Name)).size;

    return {
      totalBooks: totalBooksCount.toLocaleString(),
      totalDistributed: totalBooksDistributed.toLocaleString(),
      totalDevotees: totalDevoteesCount.toLocaleString(),
      totalProducts: totalProductsCount.toLocaleString(),
    };
  };

  const stats = calculateStats();
  const availableBooks = products ? getAvailableBooks(products) : [];

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
              An overview of ISKM Pondicherry's devotional activities.
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
            <CardTitle className="text-sm font-medium text-blue-600">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">books listed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Total Books Distributed</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.totalDistributed}</div>
            <p className="text-xs text-muted-foreground mt-1">books distributed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Total of Devotees</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.totalDevotees}</div>
            <p className="text-xs text-muted-foreground mt-1">engaged in distribution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">unique books available</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Distribution Form --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Book Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="devoteeName" className="text-sm font-medium">Devotee Name</label>
              {devoteesError ? (
                <p className="text-red-500 text-sm">Error loading devotees: {devoteesError.message}</p>
              ) : (
                <Select value={devoteeName} onValueChange={setDevoteeName} disabled={devoteesLoading}>
                  <SelectTrigger id="devoteeName">
                    <SelectValue placeholder="Select a devotee" />
                  </SelectTrigger>
                  <SelectContent>
                    {devotees && devotees.map((devotee: Devotee) => (
                      <SelectItem key={devotee.Name} value={devotee.Name}>{devotee.Name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="distributionDate" className="text-sm font-medium">Distribution Date</label>
              <Input 
                id="distributionDate" 
                type="date"
                value={distributionDate}
                onChange={(e) => setDistributionDate(e.target.value)}
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
            <Button onClick={handleSubmitDistribution} className="w-full" disabled={distributionMutation.isPending}>
              {distributionMutation.isPending ? 'Submitting...' : 'Submit All Entries'}
            </Button>
          </CardContent>
        </Card>

        {/* --- Recent Distribution Log --- */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Distribution Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {distributionError ? (
              <p className="text-red-500 text-sm">Error loading distribution log: {distributionError.message}</p>
            ) : distributionLoading ? (
              <p className="text-muted-foreground">Loading distribution log...</p>
            ) : distributionLog && distributionLog.length > 0 ? (
              <div className="overflow-auto max-h-96">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Devotee</th>
                      <th className="px-3 py-2">Product</th>
                      <th className="px-3 py-2">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributionLog.slice(0, 10).map((entry: DistributionLogEntry) => (
                      <tr key={entry.Id} className="border-b">
                        <td className="px-3 py-2">{entry.distribution_date || 'N/A'}</td>
                        <td className="px-3 py-2">{entry.devotee}</td>
                        <td className="px-3 py-2">{entry.product}</td>
                        <td className="px-3 py-2">{entry.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No distribution log entries found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Prabhupada Quote --- */}
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-amber-800 dark:text-amber-200">Wisdom from Srila Prabhupada</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-muted-foreground italic">
              "{randomQuote.quote}"
            </blockquote>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">- {randomQuote.citation}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
