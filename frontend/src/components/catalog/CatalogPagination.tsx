'use client';

import type { ReactNode } from 'react';
import { LuArrowLeft, LuArrowRight, LuEllipsis } from 'react-icons/lu';

function pageWindow(currentPage: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return sorted.reduce<(number | 'gap')[]>((acc, page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) acc.push('gap');
    acc.push(page);
    return acc;
  }, []);
}

export default function CatalogPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);

  return (
    <nav
      className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between"
      aria-label="Pagination"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Page <span className="text-foreground">{page}</span> of{' '}
        <span className="text-foreground">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-[#0a0a0a]/85 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <PageButton
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          ariaLabel="Previous page"
        >
          <LuArrowLeft className="h-4 w-4" />
        </PageButton>

        {pages.map((item, index) =>
          item === 'gap' ? (
            <span
              key={`gap-${index}`}
              className="grid h-10 w-9 place-items-center text-muted-foreground"
              aria-hidden
            >
              <LuEllipsis className="h-4 w-4" />
            </span>
          ) : (
            <PageButton
              key={item}
              active={item === page}
              onClick={() => onPageChange(item)}
              ariaLabel={`Page ${item}`}
            >
              {item}
            </PageButton>
          ),
        )}

        <PageButton
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          ariaLabel="Next page"
        >
          <LuArrowRight className="h-4 w-4" />
        </PageButton>
      </div>
    </nav>
  );
}

function PageButton({
  children,
  onClick,
  active,
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`grid h-10 min-w-10 place-items-center rounded-md border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_24px_rgba(34,211,238,0.28)]'
          : 'border-transparent text-foreground/80 hover:border-primary/50 hover:bg-primary/10 hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}
