"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/client/lib/store/useAuthStore";

interface PaginatedComponentProps<T> {
  itemsPerPage: number;
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  queryKey: string;
  queryFn: (page: number, limit: number) => Promise<any>;
  setInvalidationKey: (key: any) => void;
}

export function PaginatedComponent<T>({
  itemsPerPage,
  renderItem,
  keyExtractor,
  queryKey,
  queryFn,
  setInvalidationKey,
}: PaginatedComponentProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const { loggedInUser } = useAuthStore();
  const {
    data: response,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [queryKey, currentPage, itemsPerPage],
    queryFn: () => queryFn(currentPage, itemsPerPage),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!loggedInUser,
  });

  const meta = response?.data;
  const items = response?.data?.data || [];
  const totalPages = meta?.totalPages;
  const startIndex = (meta?.currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items?.slice(startIndex, endIndex) ?? [];

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    setInvalidationKey([queryKey, currentPage, itemsPerPage]);
  }, [currentPage, queryKey, itemsPerPage, setInvalidationKey]);
  return (
    <div className="space-y-4">
      {isLoading && <div className="text-center">Loading...</div>}
      {isError && (
        <div className="text-center text-red-500">{(error as any).message}</div>
      )}

      {!isLoading && !isError && currentItems.length === 0 && (
        <div className="text-center">No items found</div>
      )}

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
        {currentItems.map((item: any) => (
          <Card key={keyExtractor(item)}>
            <CardContent className="p-4">{renderItem(item)}</CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && !isError && currentItems?.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, response?.length ?? 0)}{" "}
            of {response?.length}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded-md bg-muted hover:bg-muted/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="font-semibold">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded-md bg-muted hover:bg-muted/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
