'use client';

import Button from '@/components/atoms/Button';
import { usePathname, useRouter } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  buttonColor: string;
  subUrl: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  buttonColor,
  subUrl,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const router = useRouter();
  const pathname = usePathname();

  const maxButtons = 5;
  const halfMaxButtons = Math.floor(maxButtons / 2);

  let startPage = Math.max(0, currentPage - halfMaxButtons);
  let endPage = Math.min(totalPages - 1, currentPage + halfMaxButtons);

  if (currentPage - halfMaxButtons < 0) {
    endPage = Math.min(maxButtons - 1, totalPages - 1);
  } else if (currentPage + halfMaxButtons > totalPages - 1) {
    startPage = Math.max(totalPages - maxButtons, 0);
  }

  const queryParams = new URLSearchParams(subUrl?.split('?')[1]);

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    queryParams.set('page', page.toString());
    const newUrl = `${pathname}?${queryParams.toString()}`;
    router.push(newUrl);
  };

  return (
    <div className="flex justify-center mt-4">
      <Button
        text="<"
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0} // Disable on the first page
        className="border border-gray-300 text-gray-700 font-extrabold rounded-full px-4 mr-2"
      />

      {/* Page Buttons */}
      {startPage > 0 && (
        <Button
          type="button"
          onClick={() => handlePageChange(0)}
          className="mx-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700"
        >
          1
        </Button>
      )}
      {startPage > 1 && <span className="mx-1 text-gray-700">...</span>}

      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const page = startPage + index;
        return (
          <Button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-4 py-2 rounded-full ${
              currentPage === page
                ? `${buttonColor} text-white`
                : 'border border-gray-300 text-gray-700'
            }`}
          >
            {page + 1}
          </Button>
        );
      })}

      {endPage < totalPages - 2 && (
        <span className="mx-1 text-gray-700">...</span>
      )}

      {endPage < totalPages - 1 && (
        <Button
          type="button"
          onClick={() => handlePageChange(totalPages - 1)}
          className="mx-1 px-4 py-2 rounded-full border border-gray-300 text-gray-700"
        >
          {totalPages}
        </Button>
      )}

      <Button
        text=">"
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="border border-gray-300 text-gray-700 font-extrabold rounded-full px-4 ml-2"
      />
    </div>
  );
}
