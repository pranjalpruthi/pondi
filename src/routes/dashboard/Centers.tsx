import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCenters } from '@/integrations/nocodb-api'
import { useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'

export const Route = createFileRoute('/dashboard/Centers')({
  component: CentersPage,
})

function CentersPage() {
  const {
    data: centersData,
    isLoading: centersLoading,
    error: centersError,
    fetchNextPage: fetchNextCenters,
    hasNextPage: hasNextCenters
  } = useInfiniteQuery({
    queryKey: ['centers'],
    queryFn: ({ pageParam }) => getCenters(undefined, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => {
      const pageInfo = lastPage.pageInfo || {};
      return pageInfo.isLastPage ? undefined : (pageInfo.page || 0) * (pageInfo.pageSize || 25) + 25;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const centers = centersData?.pages.flatMap(page => page.list) || []
  const centersTableRef = useRef<HTMLTableSectionElement>(null)

  const handleScroll = () => {
    if (!centersTableRef.current || !hasNextCenters) return
    const { scrollTop, scrollHeight, clientHeight } = centersTableRef.current
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      fetchNextCenters()
    }
  }

  useEffect(() => {
    const element = centersTableRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [hasNextCenters, fetchNextCenters])

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
        ISKM Global Centers
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            Centers Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {centersError ? (
            <p className="text-red-500 text-sm">Error loading centers: {centersError.message}</p>
          ) : centersLoading ? (
            <p className="text-muted-foreground">Loading centers data...</p>
          ) : centers && centers.length > 0 ? (
            <div className="overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Temple Name</TableHead>
                    <TableHead>Temple President</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody ref={centersTableRef}>
                  {centers.map((center: any) => (
                    <TableRow key={center.Id}>
                      <TableCell>{center.Id}</TableCell>
                      <TableCell>{center['Temple Name'] || 'N/A'}</TableCell>
                      <TableCell>{center['Temple President'] || 'N/A'}</TableCell>
                      <TableCell>{center.Address || 'N/A'}</TableCell>
                      <TableCell>{center.Phone || 'N/A'}</TableCell>
                      <TableCell>{center.Email || 'N/A'}</TableCell>
                      <TableCell>{center.country || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No centers data found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
